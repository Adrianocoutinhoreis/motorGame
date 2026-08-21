#!/usr/bin/env node
/**
 * audio-info.mjs — o inventário de áudio de um jogo, medido e não suposto.
 *
 * Existe por causa de um episódio concreto: `abertura.mp3` foi regravada em
 * algum momento e a ficha de transcrição continuou descrevendo o arquivo
 * antigo — outra duração, outro formato, outro hash. Ninguém percebeu porque
 * conferir isso à mão significa abrir 26 arquivos e comparar cabeçalhos.
 *
 * O que ele mede (lendo os cabeçalhos, sem tocar o áudio e sem dependência):
 *   · codec, bitrate, taxa de amostragem, canais e duração real;
 *   · SHA-256, para detectar troca de arquivo;
 *   · a que LOTE cada arquivo pertence — locução de 2013 e gravação nova soam
 *     diferentes, e misturar sem saber é como o jogo fica desigual.
 *
 * E o que ele confere:
 *   · declarado no config e ausente do disco (o jogo abriria sem o som);
 *   · presente no disco e não declarado (peso morto no pacote, ou esquecido);
 *   · áudio sem ficha de transcrição (a regra do projeto: toda locução tem uma);
 *   · ficha cujo SHA-256 não bate com o arquivo — o arquivo mudou, a ficha não.
 *
 * Uso:
 *   node tools/audio-info.mjs                    # todos os jogos
 *   node tools/audio-info.mjs jogo-dos-blocos    # um jogo
 *   node tools/audio-info.mjs a.mp3 b.wav        # arquivos soltos
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ------------------------------------------------------------------- medição

const TAXAS = {
  1: {
    1: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
    2: [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
    3: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  },
  2: {
    1: [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
    2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
    3: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
  },
};
const AMOSTRAGEM = { 1: [44100, 48000, 32000], 2: [22050, 24000, 16000], 2.5: [11025, 12000, 8000] };
const CANAIS = ['stereo', 'joint stereo', 'dual channel', 'mono'];

/** Percorre a cadeia de frames MP3. A duração vem da soma dos frames, não de estimativa. */
function medirMp3(b) {
  let i = 0;
  let id3 = 0;
  if (b.length > 10 && b.toString('latin1', 0, 3) === 'ID3') {
    // Tamanho sincsafe: 7 bits úteis por byte.
    id3 = 10 + ((b[6] << 21) | (b[7] << 14) | (b[8] << 7) | b[9]);
    i = id3;
  }
  const frames = [];
  while (i + 4 <= b.length) {
    if (b[i] !== 0xff || (b[i + 1] & 0xe0) !== 0xe0) { i++; continue; }
    const vb = (b[i + 1] >> 3) & 0x03;
    const versao = vb === 3 ? 1 : vb === 2 ? 2 : vb === 0 ? 2.5 : null;
    const layer = 4 - ((b[i + 1] >> 1) & 0x03);
    const kbps = TAXAS[versao === 1 ? 1 : 2]?.[layer]?.[(b[i + 2] >> 4) & 0x0f];
    const hz = AMOSTRAGEM[versao]?.[(b[i + 2] >> 2) & 0x03];
    if (!versao || layer < 1 || layer > 3 || !kbps || !hz) { i++; continue; }
    const amostras = layer === 1 ? 384 : (versao === 1 ? 1152 : 576);
    const pad = (b[i + 2] >> 1) & 0x01;
    const tam = layer === 1
      ? Math.floor((12 * kbps * 1000 / hz + pad) * 4)
      : Math.floor(amostras / 8 * kbps * 1000 / hz + pad);
    if (tam < 4) { i++; continue; }
    frames.push({ versao, layer, kbps, hz, canal: (b[i + 3] >> 6) & 0x03, amostras });
    i += tam;
  }
  if (!frames.length) return { erro: 'nenhum frame MP3 reconhecido' };
  const p = frames[0];
  const taxas = [...new Set(frames.map((f) => f.kbps))];
  return {
    codec: `MPEG${p.versao === 2.5 ? '2.5' : p.versao} Layer ${'I'.repeat(p.layer)}`,
    kbps: p.kbps,
    bitrate: taxas.length === 1 ? `${p.kbps} kbps CBR` : `VBR ${Math.min(...taxas)}-${Math.max(...taxas)} kbps`,
    hz: p.hz,
    canais: CANAIS[p.canal],
    frames: frames.length,
    segundos: frames.reduce((s, f) => s + f.amostras / f.hz, 0),
    id3,
  };
}

/** Lê os chunks RIFF do WAV. */
function medirWav(b) {
  if (b.toString('latin1', 0, 4) !== 'RIFF' || b.toString('latin1', 8, 12) !== 'WAVE') {
    return { erro: 'não é um WAV RIFF' };
  }
  let i = 12;
  let fmt = null;
  let bytesDados = 0;
  while (i + 8 <= b.length) {
    const tipo = b.toString('latin1', i, i + 4);
    const tam = b.readUInt32LE(i + 4);
    if (tipo === 'fmt ') {
      fmt = { canais: b.readUInt16LE(i + 10), hz: b.readUInt32LE(i + 12), bits: b.readUInt16LE(i + 22) };
    } else if (tipo === 'data') {
      bytesDados = tam;
    }
    i += 8 + tam + (tam % 2); // chunks têm padding para tamanho par
  }
  if (!fmt) return { erro: 'WAV sem chunk fmt' };
  const bytesPorSegundo = fmt.hz * fmt.canais * (fmt.bits / 8);
  const kbps = Math.round(bytesPorSegundo * 8 / 1000);
  return {
    codec: `WAV PCM ${fmt.bits} bits`,
    kbps,
    bitrate: `${kbps} kbps (sem compressão)`,
    hz: fmt.hz,
    canais: fmt.canais === 1 ? 'mono' : fmt.canais === 2 ? 'stereo' : `${fmt.canais} canais`,
    frames: null,
    segundos: bytesDados / bytesPorSegundo,
    id3: 0,
  };
}

export function medir(caminho) {
  const b = readFileSync(caminho);
  const ext = path.extname(caminho).toLowerCase();
  const r = ext === '.wav' ? medirWav(b) : medirMp3(b);
  return {
    nome: path.basename(caminho),
    id: path.basename(caminho, ext),
    bytes: b.length,
    sha256: createHash('sha256').update(b).digest('hex'),
    ...r,
  };
}

/** A assinatura que define o lote: quem soa junto tem estes quatro iguais. */
const lote = (m) => (m.erro ? 'ilegível' : `${m.codec} · ${m.kbps} kbps · ${m.hz} Hz · ${m.canais}`);

// ---------------------------------------------------------------- inventário

async function inventariar(slug) {
  const base = path.join(RAIZ, 'Games', slug);
  const pastaAudio = path.join(base, 'assets', 'audio');
  const pastaFichas = path.join(base, 'assets', 'audio-transcricao');

  if (!existsSync(pastaAudio)) {
    console.log(`\n${slug}: sem pasta assets/audio — nada a inventariar.`);
    return 0;
  }

  const config = (await import(`file://${path.join(base, 'src', 'config.js')}`)).default;
  const declarados = new Map(
    (config.assets ?? [])
      .filter((a) => /\.(mp3|wav|ogg|m4a)$/i.test(a.src))
      .map((a) => [a.id, a.src]),
  );

  const noDisco = readdirSync(pastaAudio).filter((f) => /\.(mp3|wav|ogg|m4a)$/i.test(f));

  console.log(`\n${'='.repeat(78)}`);
  console.log(`${slug} — ${noDisco.length} arquivos no disco, ${declarados.size} declarados no config`);
  console.log('='.repeat(78));

  const medidos = noDisco.map((f) => medir(path.join(pastaAudio, f)));

  const porLote = new Map();
  for (const m of medidos) {
    const k = lote(m);
    if (!porLote.has(k)) porLote.set(k, []);
    porLote.get(k).push(m);
  }

  for (const [assinatura, itens] of [...porLote].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\nLote: ${assinatura}   (${itens.length} arquivo${itens.length > 1 ? 's' : ''})`);
    for (const m of itens.sort((a, b) => a.nome.localeCompare(b.nome))) {
      const dur = m.erro ? '     ?  ' : `${m.segundos.toFixed(2).padStart(6)}s`;
      const kb = `${(m.bytes / 1024).toFixed(0).padStart(4)} KB`;
      const uso = declarados.has(m.id) ? '' : '   <-- NAO declarado';
      console.log(`  ${dur}  ${kb}  ${m.sha256.slice(0, 12)}  ${m.nome}${uso}`);
    }
  }

  // ------------------------------------------------------------- problemas
  const problemas = [];

  for (const [id, src] of declarados) {
    if (!existsSync(path.join(base, src.replace(/^\.\//, '')))) {
      problemas.push(`declarado e AUSENTE do disco: ${id} -> ${src}`);
    }
  }

  for (const m of medidos) {
    if (m.erro) problemas.push(`ilegível: ${m.nome} (${m.erro})`);
    if (!declarados.has(m.id)) problemas.push(`no disco e não declarado no config: ${m.nome}`);

    const ficha = path.join(pastaFichas, m.id, 'transcricao.md');
    if (!existsSync(ficha)) {
      problemas.push(`sem ficha de transcrição: ${m.id}`);
      continue;
    }
    // A ficha guarda os primeiros hexas justamente para flagrar troca de arquivo.
    const casado = readFileSync(ficha, 'utf8').match(/SHA-256[^|]*\|\s*`([0-9a-f]{8,64})`/);
    if (!casado) {
      problemas.push(`ficha sem SHA-256 legível: ${m.id}`);
    } else if (!m.sha256.startsWith(casado[1])) {
      problemas.push(`ARQUIVO TROCADO: ${m.id} — a ficha diz ${casado[1]}, o arquivo é ${m.sha256.slice(0, casado[1].length)}`);
    }
  }

  console.log(`\n${'-'.repeat(78)}`);
  if (!problemas.length) {
    console.log('Nenhum problema: tudo declarado, tudo com ficha, nenhum hash divergente.');
    return 0;
  }
  console.log(`${problemas.length} problema(s):`);
  for (const p of problemas) console.log(`  · ${p}`);
  return problemas.length;
}

// --------------------------------------------------------------------- main

const args = process.argv.slice(2);
const arquivosSoltos = args.filter((a) => /\.(mp3|wav|ogg|m4a)$/i.test(a));

if (arquivosSoltos.length) {
  for (const a of arquivosSoltos) {
    const m = medir(a);
    console.log(`\n--- ${m.nome}`);
    console.log(`  lote      ${lote(m)}`);
    if (!m.erro) console.log(`  duração   ${m.segundos.toFixed(2)} s${m.frames ? ` (${m.frames} frames)` : ''}`);
    console.log(`  bytes     ${m.bytes}${m.id3 ? `  (tag ID3: ${m.id3} bytes)` : ''}`);
    console.log(`  sha256    ${m.sha256}`);
    if (m.erro) console.log(`  ERRO      ${m.erro}`);
  }
  process.exit(0);
}

const slugs = args.length
  ? args
  : readdirSync(path.join(RAIZ, 'Games'))
    .filter((d) => existsSync(path.join(RAIZ, 'Games', d, 'src', 'config.js')));

let totalProblemas = 0;
for (const slug of slugs) totalProblemas += await inventariar(slug);

console.log();
if (totalProblemas > 0) {
  console.log(`REPROVADO — ${totalProblemas} problema(s) de áudio. Cada um é uma linha do CHECKLIST-AUDIO.md.`);
  process.exit(1);
}
console.log('APROVADO — inventário de áudio consistente.');
