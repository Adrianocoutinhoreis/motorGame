#!/usr/bin/env node
/**
 * verificar-independencia.mjs — o portão de entrega.
 *
 * O requisito do projeto é duro: publica-se UM jogo por vez, mandando só a
 * pasta dele para o AVA. Se algum arquivo apontar para fora dessa pasta, para
 * um CDN, para um caminho absoluto ou para um domínio, o jogo quebra depois de
 * publicado — e provavelmente só em produção, dentro do iframe, longe daqui.
 *
 * Este script transforma esse requisito em verificação automática. Ele FALHA
 * (código de saída 1) quando encontra:
 *
 *   1. URL absoluta (http:// ou https://) em código, HTML ou CSS
 *      — foi exatamente o que matou as aulas originais: elas carregavam jQuery
 *        e CreateJS de `http://classes.educandus.com.br`, que hoje é bloqueado
 *        em qualquer página HTTPS.
 *   2. Caminho absoluto (src="/algo", import de "/engine/…")
 *      — impede o jogo de rodar servido de uma subpasta.
 *   3. `import` que escapa da pasta do jogo (../../)
 *   4. `window.close()` ou `window.top` — não funcionam dentro do iframe do AVA.
 *   5. Referência a arquivo local que não existe.
 *   6. Ausência de arquivos obrigatórios (index.html, engine/, config).
 *   7. Cópia do motor DESATUALIZADA em relação a `engine/` na raiz.
 *      — o modelo de entrega inteiro repousa nessa cópia. Se alguém edita o
 *        motor e esquece de rodar a build, o jogo publicado leva em silêncio a
 *        versão velha, e a correção que "já foi feita" nunca chegou ao aluno.
 *        Era o único requisito do projeto sustentado por disciplina em vez de
 *        verificação.
 *
 * Uso:
 *   node tools/verificar-independencia.mjs jogo-dos-blocos
 *   node tools/verificar-independencia.mjs            # verifica todos
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PASTA_JOGOS = path.join(RAIZ, 'Games');
const ORIGEM_MOTOR = path.join(RAIZ, 'engine');

const EXTENSOES_TEXTO = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg', '.md', '.txt']);

/** Domínios/protocolos liberados: nada. A regra é zero rede externa. */
const REGRA_URL_ABSOLUTA = /(?:src|href|from|import|url)\s*[=(]?\s*["'`]?(https?:\/\/[^"'`)\s>]+)/gi;
const REGRA_CAMINHO_ABSOLUTO = /(?:src|href)\s*=\s*["'](\/[^"']*)["']/gi;
const REGRA_IMPORT_ABSOLUTO = /\bfrom\s+["'](\/[^"']+)["']/g;
const REGRA_IMPORT_ESCAPA = /\bfrom\s+["']((?:\.\.\/)+[^"']+)["']/g;
const REGRA_JANELA = /\bwindow\.(close\s*\(|top\b)/g;

/** Referências a arquivos locais que devem existir. */
const REGRA_REFERENCIA = /(?:src|href)\s*=\s*["'](?!https?:|data:|#|mailto:)([^"']+)["']/gi;
const REGRA_IMPORT_RELATIVO = /\bfrom\s+["'](\.[^"']+)["']/g;

class Relatorio {
  constructor(slug) {
    this.slug = slug;
    this.erros = [];
    this.avisos = [];
  }

  erro(arquivo, linha, mensagem) {
    this.erros.push({ arquivo, linha, mensagem });
  }

  aviso(arquivo, linha, mensagem) {
    this.avisos.push({ arquivo, linha, mensagem });
  }

  get ok() {
    return this.erros.length === 0;
  }
}

function numeroDaLinha(conteudo, indice) {
  return conteudo.slice(0, indice).split('\n').length;
}

async function listarArquivos(pasta, base = pasta) {
  const encontrados = [];
  for (const entrada of await readdir(pasta, { withFileTypes: true })) {
    const completo = path.join(pasta, entrada.name);
    if (entrada.isDirectory()) {
      encontrados.push(...await listarArquivos(completo, base));
    } else {
      encontrados.push({ completo, relativo: path.relative(base, completo).replace(/\\/g, '/') });
    }
  }
  return encontrados;
}

/** Remove comentários para não acusar exemplo escrito em documentação. */
function semComentarios(conteudo, ext) {
  if (ext === '.md' || ext === '.txt') return '';
  let limpo = conteudo.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  if (ext !== '.html' && ext !== '.css') {
    limpo = limpo.replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length));
  }
  limpo = limpo.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
  return limpo;
}

/**
 * Compara, arquivo por arquivo e por hash, a cópia do motor dentro do jogo com
 * `engine/` na raiz.
 *
 * O carimbo em `MOTOR-COPIA.txt` diz de qual versão a cópia SAIU — não se ela
 * ainda corresponde ao motor de hoje. Só a comparação diz isso, e é ela que
 * transforma "lembrar de rodar a build" em erro detectado.
 *
 * O próprio carimbo fica fora da comparação: é gerado pela build e não existe
 * na origem.
 */
async function verificarCopiaDoMotor(slug, pasta, rel) {
  const copia = path.join(pasta, 'engine');
  if (!existsSync(ORIGEM_MOTOR) || !existsSync(copia)) return;

  const hashear = async (raiz) => {
    const mapa = new Map();
    for (const arquivo of await listarArquivos(raiz)) {
      if (arquivo.relativo === 'MOTOR-COPIA.txt') continue;
      const bytes = await readFile(arquivo.completo);
      mapa.set(arquivo.relativo, createHash('sha256').update(bytes).digest('hex'));
    }
    return mapa;
  };

  const origem = await hashear(ORIGEM_MOTOR);
  const destino = await hashear(copia);
  const corrigir = `rode: node tools/build.mjs ${slug}`;

  for (const [relativo, hash] of origem) {
    if (!destino.has(relativo)) {
      rel.erro(`engine/${relativo}`, 0, `está no motor da raiz e falta na cópia — ${corrigir}`);
    } else if (destino.get(relativo) !== hash) {
      rel.erro(`engine/${relativo}`, 0, `a cópia divergiu do motor da raiz — ${corrigir}`);
    }
  }

  // Sobra é tão grave quanto falta: um arquivo removido do motor continuaria a
  // ser publicado, e é exatamente o que o `rm` da build existe para evitar.
  for (const relativo of destino.keys()) {
    if (!origem.has(relativo)) {
      rel.erro(`engine/${relativo}`, 0, `sobrou na cópia: não existe mais no motor da raiz — ${corrigir}`);
    }
  }
}

async function verificarJogo(slug) {
  const pasta = path.join(PASTA_JOGOS, slug);
  const rel = new Relatorio(slug);

  if (!existsSync(pasta)) {
    rel.erro(slug, 0, 'a pasta do jogo não existe em Games/');
    return rel;
  }

  // ---------------------------------------------------- estrutura obrigatória
  for (const obrigatorio of ['index.html', 'engine', 'src']) {
    if (!existsSync(path.join(pasta, obrigatorio))) {
      rel.erro(obrigatorio, 0, 'obrigatório e ausente (o jogo não roda sozinho sem isso)');
    }
  }
  if (!existsSync(path.join(pasta, 'engine', 'index.js'))) {
    rel.erro('engine/index.js', 0, 'a cópia do motor não está aqui — rode: node tools/build.mjs ' + slug);
  }

  const arquivos = await listarArquivos(pasta);
  const conjuntoDeArquivos = new Set(arquivos.map((a) => a.relativo.toLowerCase()));

  for (const arquivo of arquivos) {
    const ext = path.extname(arquivo.relativo).toLowerCase();
    if (!EXTENSOES_TEXTO.has(ext)) continue;
    // O carimbo da cópia e a documentação não são código executável.
    if (arquivo.relativo.endsWith('MOTOR-COPIA.txt')) continue;

    const bruto = await readFile(arquivo.completo, 'utf8');
    const conteudo = semComentarios(bruto, ext);
    const ehDoc = ext === '.md';

    // 1 -------------------------------------------------------- URL absoluta
    for (const m of conteudo.matchAll(REGRA_URL_ABSOLUTA)) {
      const alvo = m[1];
      const msg = `depende da rede externa: ${alvo}`;
      if (ehDoc) rel.aviso(arquivo.relativo, numeroDaLinha(conteudo, m.index), msg);
      else rel.erro(arquivo.relativo, numeroDaLinha(conteudo, m.index), msg);
    }

    // 2 ---------------------------------------------------- caminho absoluto
    for (const regra of [REGRA_CAMINHO_ABSOLUTO, REGRA_IMPORT_ABSOLUTO]) {
      for (const m of conteudo.matchAll(regra)) {
        rel.erro(
          arquivo.relativo,
          numeroDaLinha(conteudo, m.index),
          `caminho absoluto "${m[1]}" — quebra se o jogo for servido de uma subpasta`,
        );
      }
    }

    // 3 -------------------------------------------- import fora da pasta
    for (const m of conteudo.matchAll(REGRA_IMPORT_ESCAPA)) {
      const destino = path.resolve(path.dirname(arquivo.completo), m[1]);
      if (!destino.startsWith(pasta)) {
        rel.erro(
          arquivo.relativo,
          numeroDaLinha(conteudo, m.index),
          `import sai da pasta do jogo: "${m[1]}"`,
        );
      }
    }

    // 4 -------------------------------------------------------- window.close
    for (const m of conteudo.matchAll(REGRA_JANELA)) {
      rel.erro(
        arquivo.relativo,
        numeroDaLinha(conteudo, m.index),
        `window.${m[1].replace(/\s*\($/, '()')} não funciona dentro do iframe do AVA`,
      );
    }

    // 5 ---------------------------------------------- referência inexistente
    const referencias = [
      ...[...conteudo.matchAll(REGRA_REFERENCIA)].map((m) => m[1]),
      ...[...conteudo.matchAll(REGRA_IMPORT_RELATIVO)].map((m) => m[1]),
    ];
    for (const referencia of referencias) {
      const limpo = referencia.split('?')[0].split('#')[0];
      if (!limpo || limpo.startsWith('data:')) continue;
      const destino = path.resolve(path.dirname(arquivo.completo), limpo);
      const relativoAoJogo = path.relative(pasta, destino).replace(/\\/g, '/');
      if (!conjuntoDeArquivos.has(relativoAoJogo.toLowerCase()) && !existsSync(destino)) {
        rel.erro(arquivo.relativo, 0, `aponta para arquivo inexistente: "${referencia}"`);
      }
    }
  }

  // 7 ------------------------------------------- cópia do motor desatualizada
  await verificarCopiaDoMotor(slug, pasta, rel);

  return rel;
}

function imprimir(rel) {
  const marca = rel.ok ? 'OK  ' : 'FALHA';
  console.log(`\n[${marca}] ${rel.slug}`);

  for (const item of rel.erros) {
    console.log(`   erro   ${item.arquivo}${item.linha ? `:${item.linha}` : ''} — ${item.mensagem}`);
  }
  for (const item of rel.avisos) {
    console.log(`   aviso  ${item.arquivo}${item.linha ? `:${item.linha}` : ''} — ${item.mensagem}`);
  }
  if (rel.ok && rel.avisos.length === 0) {
    console.log('   nenhuma dependência externa e a cópia do motor está em dia com a raiz;');
    console.log('   a pasta pode ser publicada sozinha.');
  }
}

async function principal() {
  const alvo = process.argv[2];
  let slugs = [];

  if (alvo) {
    slugs = [alvo];
  } else if (existsSync(PASTA_JOGOS)) {
    for (const e of await readdir(PASTA_JOGOS, { withFileTypes: true })) {
      if (e.isDirectory() && existsSync(path.join(PASTA_JOGOS, e.name, 'index.html'))) slugs.push(e.name);
    }
  }

  if (slugs.length === 0) {
    console.log('Nenhum jogo para verificar em Games/.');
    return;
  }

  console.log('Verificação de independência (entrega unitária para o AVA)');
  console.log('='.repeat(58));

  let falhou = false;
  for (const slug of slugs) {
    const rel = await verificarJogo(slug);
    imprimir(rel);
    if (!rel.ok) falhou = true;
  }

  console.log(`\n${'='.repeat(58)}`);
  if (falhou) {
    console.log('REPROVADO — corrija os erros acima antes de enviar para o AVA.');
    process.exit(1);
  }
  console.log('APROVADO — cada pasta verificada roda de forma independente.');
}

principal().catch((err) => {
  console.error('Verificação falhou:', err);
  process.exit(1);
});
