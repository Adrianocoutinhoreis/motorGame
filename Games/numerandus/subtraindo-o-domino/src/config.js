/**
 * config.js — o "formulário" do Subtraindo o Dominó.
 *
 * Baseado no vídeo do 2º ano (`numerandus/finalizados/2ano/Subtraindo_o_domino`,
 * 2min58, vertical, narrado — transcrição em docs/REGRAS-SUBTRAINDO-O-DOMINO.md):
 * um dominó comum sem as pedras de 0, dois dados e a soma deles. Quem joga
 * procura uma pedra cujos pontos somem o total dos dados (para 9 serve 6+3 ou
 * 5+4) e a leva; no fim das rodadas vence quem juntou MAIS pedras, o contrário
 * do dominó tradicional. O nome vem de a mesa ir se esvaziando: cada pedra
 * levada é uma a menos (um contorno apagado marca o lugar dela).
 *
 * A criança toca nos dados, toca na pedra e em PRONTO; depois o computador joga os
 * dados dele e leva a pedra dele, em TODA rodada. As bandejas SÃO o placar: vence quem
 * juntar mais pedras. A vez da criança passa no limite de erros do nível (e ela fica sem
 * pedra); o computador leva a dele em toda rodada normal e só pode ficar sem pedra nas rodadas
 * extras (o desempate), que são iguais às normais e vão até um levar a pedra e o outro não, como no vídeo.
 *
 * Especificação: docs/REGRAS-SUBTRAINDO-O-DOMINO.md. Layout e regras conferidos
 * antes num protótipo jogável (artifact "Subtraindo o Dominó", 26/10/2026), com
 * as decisões recomendadas adotadas.
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
import {
  CORES, escrever, desenharPeca, desenharDado, desenharSinalPeca, desenharMarcadorRodada,
  desenharIconeQuem, desenharIconeCerto, desenharDedo, desenharOndaToque,
} from './desenho.js';

export default {
  // ------------------------------------------------------------- identidade
  /** Slug ESTÁVEL. Vai no campo `jogo` da mensagem do AVA — não mude depois de publicar. */
  slug: 'subtraindo-o-domino',
  titulo: 'Subtraindo o Dominó',
  subtitulo: 'Ache a pedra que soma o total!',

  objetivo: 'Decompor um total em duas parcelas: a partir da soma de dois dados (2 a 12), '
    + 'achar a pedra de dominó cujos pontos somam o mesmo valor, reconhecendo que vários '
    + 'pares dão o mesmo resultado (6+3 e 5+4).',
  faixaEtaria: '7 a 8 anos (2º ano)',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#12322B',

  /**
   * Tema próprio ('feltro', ver `engine/ui/Background.js`): feltro verde-azulado
   * escuro e dessaturado, para as pedras claras destacarem e o fundo não brigar
   * com elas (o mesmo princípio da 'mesa' do Pratinho CDU). Pedras apagadas só
   * nas telas de vitrine; a partida desliga.
   */
  tema: 'feltro',

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  /**
   * O resultado mostra só as estrelas, sem a linha "N RODADAS": na derrota a nota
   * vale só o que foi ganho (as pedras da criança), então "3 RODADAS" mentiria
   * para quem jogou as 5 (mesma decisão do Pratinho CDU).
   */
  mostrarPlacarTexto: false,

  // ----------------------------------------------------------------- níveis
  /**
   * `faces`  as pedras são as de faces 1 a N (sem as de 0): 4 → 10 pedras, 6 → 21
   * `alg`    algarismos nas pedras no lugar dos pontos (os dados continuam com pontos)
   * `ajuda`  no N-ésimo PRONTO errado da rodada, uma pedra certa acende (0 = sem ajuda)
   * `passaNoErro`  no N-ésimo PRONTO errado da rodada a VEZ DA CRIANÇA PASSA: o jogo revela a conta, a
   *               vaga dela na bandeja fica vazia e o computador joga (a gravidade cresce com o nível)
   * `nomes`  escreve VOCÊ / COMPUTADOR nas bandejas (pedido do humano para o Fácil, como no Pratinho)
   * `meta`   as rodadas combinadas; empatando, as rodadas extras desempatam (como no vídeo)
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Pedras de 1 a 4', amostra: 'Totais até 8', cor: '#16A34A',
      meta: 3, vidas: 0, faces: 4, alg: false, ajuda: 2, passaNoErro: 4, nomes: true,
    },
    {
      id: 2, nome: 'Médio', descricao: 'Pedras de 1 a 6', amostra: 'Totais até 12', cor: '#F59E0B',
      meta: 3, vidas: 0, faces: 6, alg: false, ajuda: 0, passaNoErro: 3,
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Só algarismos', amostra: 'Sem pontinhos', cor: '#DC2626',
      meta: 5, vidas: 0, faces: 6, alg: true, ajuda: 0, passaNoErro: 2,
    },
  ],

  /**
   * Regras ajustáveis, todas conferidas no protótipo.
   *   rolarMs        quanto os dados rolam antes de parar (os da criança e os do computador)
   *   acertoMs       quanto o ✓ fica na pedra antes de ela ir para a bandeja
   *   cpuEsperaMs    a pausa antes de o computador jogar
   *   cpuPensaMs     quanto o computador "pensa" antes de marcar a pedra dele
   *   revelaMs       quanto a conta (6 + 3 = 9) fica na tela quando a vez da criança passa
   *   pausaRodadaMs  a pausa depois da pedra do computador pousar (ou de ele ficar sem), antes da rodada seguinte
   *   maxExtras      o TETO de rodadas extras: empatado nele, a criança leva (a mesma regra da mesa vazia empatada)
   */
  regras: { rolarMs: 900, acertoMs: 650, cpuEsperaMs: 700, cpuPensaMs: 800, revelaMs: 1900, pausaRodadaMs: 1100, maxExtras: 5 },

  // --------------------------------------------------------------- tutorial
  /**
   * 3 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05). O motor fala `titulo + '. ' + texto` de cada passo pelo id
   * `tutorialTela1..3` (narração ainda não gravada: o jogo fica mudo e avisa no
   * console; ver o README). Se o texto de um passo mudar, a gravação muda junto.
   */
  tutorial: [
    {
      titulo: 'Toque nos dados',
      fala: 'tutorialTela1',
      texto: 'Eles mostram um total. Some os pontos: 6 e 3 dão 9.',
      desenho: (ctx, l, a, t) => desenharPasso1(ctx, l, a, t),
    },
    {
      titulo: 'Ache a pedra',
      fala: 'tutorialTela2',
      texto: 'Toque numa pedra que soma o mesmo total, como 5 e 4, e em PRONTO.',
      desenho: (ctx, l, a, t) => desenharPasso2(ctx, l, a, t),
    },
    {
      titulo: 'Junte pedras',
      fala: 'tutorialTela3',
      texto: 'Depois o computador joga. Quem juntar mais pedras ganha!',
      desenho: (ctx, l, a, t) => desenharPasso3(ctx, l, a, t),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Efeitos reaproveitados da coleção (mesmo SHA-256 dos outros jogos Numerandus,
   * ver as fichas em assets/audio-transcricao/). Os números "dois" a "nove" falam
   * o TOTAL dos dados quando eles param (do "dez" ao "doze" ainda não há
   * gravação), e quatro falas curtas vêm da pasta de áudio do Jogo dos Blocos
   * (gravação de 2026). A narração do tutorial e a das demais falas ainda não
   * foram gravadas: a cena já pede cada id definitivo (lista no README).
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'erroSOS', src: './assets/audio/erroSOS.wav' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
    { id: 'somProgresso', src: './assets/audio/progresso.mp3' },
    { id: 'somConta', src: './assets/audio/soltar_peca.mp3' },
    { id: 'numero2', src: './assets/audio/numeros/dois.mp3' },
    { id: 'numero3', src: './assets/audio/numeros/tres.mp3' },
    { id: 'numero4', src: './assets/audio/numeros/quatro.mp3' },
    { id: 'numero5', src: './assets/audio/numeros/cinco.mp3' },
    { id: 'numero6', src: './assets/audio/numeros/seis.mp3' },
    { id: 'numero7', src: './assets/audio/numeros/sete.mp3' },
    { id: 'numero8', src: './assets/audio/numeros/oito.mp3' },
    { id: 'numero9', src: './assets/audio/numeros/nove.mp3' },
    { id: 'suaVez', src: './assets/audio/falas/suaVez.wav' },
    { id: 'vezDoComputador', src: './assets/audio/falas/vezDoComputador.wav' },
    { id: 'muitoBem', src: './assets/audio/falas/muitoBem.wav' },
    { id: 'tenteDeNovo', src: './assets/audio/falas/tenteDeNovo.wav' },
  ],

  /** Sem mascote: as pedras e os dados já são os personagens (mesma decisão do Pratinho CDU). */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'somProgresso',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    /** O mesmo efeito de derrota do Jogo dos Blocos, da Velha e da Corrida (não ouvido). */
    derrota: 'erroSOS',
    /** Os dados parando e a pedra pousando na bandeja. */
    pouso: 'somConta',
    conta: 'somConta',
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /**
   * Mais pedras que o computador vence; menos é derrota (tela "QUASE LÁ!", registrada). Os
   * dados da criança sempre caem num total com pedra, então a vitória depende do que ela
   * sabe, não da sorte. Ver docs/REGRAS-SUBTRAINDO-O-DOMINO.md §6.
   */
  registrarDerrota: true,
};

// ---------------------------------------------------------------------------
// Desenho do tutorial — as mesmas pedras e os mesmos dados da partida, sobre
// uma mesa de feltro em miniatura (o painel do tutorial é claro e as pedras
// são de marfim: sem a mesa elas somem). A área é larga e baixa (~980 × 270).
// Não importa a cena: o tutorial também é a AJUDA durante a partida.
// ---------------------------------------------------------------------------

const limitar = (x) => Math.max(0, Math.min(1, x));
const trecho = (t, ini, fim) => limitar((t - ini) / (fim - ini));
const suave = (k) => k * k * (3 - 2 * k);
const FELTRO = '#163A31';

/** A mesa de fundo. Devolve o alfa do conteúdo: ele some no fim do ciclo, para o laço não dar um salto. */
function mesa(ctx, l, a, tc, ciclo) {
  ctx.save();
  ctx.fillStyle = FELTRO;
  ctx.beginPath();
  ctx.roundRect(0, 0, l, a, 22);
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha *= 1 - trecho(tc, ciclo - 0.35, ciclo);
}

/** Um botão PRONTO em miniatura (verde, texto escuro, como o da partida). */
function botaoPronto(ctx, x, y, l, a, apertado) {
  ctx.save();
  ctx.translate(0, apertado ? 4 : 0);
  ctx.fillStyle = CORES.okEscuro;
  ctx.beginPath();
  ctx.roundRect(x, y + 6, l, a, a * 0.22);
  ctx.fill();
  ctx.fillStyle = CORES.ok;
  ctx.beginPath();
  ctx.roundRect(x, y, l, a, a * 0.22);
  ctx.fill();
  desenharIconeCerto(ctx, x + l / 2, y + a * 0.38, a * 0.32);
  escrever(ctx, 'PRONTO', x + l / 2, y + a * 0.77, Math.round(a * 0.17), CORES.sobreOk);
  ctx.restore();
}

/** O selo âmbar do total, como na pergunta da partida. */
function selo(ctx, cx, cy, h, numero, escala = 1) {
  if (escala <= 0) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(escala, escala);
  const w = h * 1.5;
  ctx.fillStyle = CORES.ouro;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, h * 0.25);
  ctx.fill();
  escrever(ctx, String(numero), 0, h * 0.04, Math.round(h * 0.66), '#1B212B');
  ctx.restore();
}

/** Passo 1 — o dedo toca nos dados; eles rolam e param em 6 e 3; o total 9 aparece (ciclo de 4,6 s). */
function desenharPasso1(ctx, l, a, t) {
  const ciclo = 4.6;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  const lado = Math.min(a * 0.46, 118);
  const gap = lado * 0.32;
  const x0 = l * 0.5 - lado - gap / 2 - lado * 0.95;
  const y0 = a / 2 - lado / 2;
  const rolando = tc > 0.55 && tc < 1.55;
  const face = (final, salto) => (tc < 0.55 ? 0 : rolando ? 1 + (Math.floor(tc * 9 + salto) % 6) : final);
  [[6, 0], [3, 3]].forEach(([final, salto], i) => {
    ctx.save();
    ctx.translate(x0 + i * (lado + gap), y0);
    if (rolando) { ctx.translate(lado / 2, lado / 2); ctx.rotate(Math.sin(tc * 24 + i) * 0.14); ctx.translate(-lado / 2, -lado / 2); }
    desenharDado(ctx, lado, face(final, salto));
    ctx.restore();
  });
  const xTotal = x0 + 2 * lado + gap + lado * 0.9;
  if (tc > 1.7) {
    escrever(ctx, '=', xTotal - lado * 0.62, a / 2, Math.round(lado * 0.5), CORES.tintaSuave);
    selo(ctx, xTotal + lado * 0.2, a / 2, lado * 0.8, 9, suave(trecho(tc, 1.7, 2.1)));
  }
  const alfa = Math.min(trecho(tc, 0, 0.2), 1 - trecho(tc, 0.95, 1.2));
  const batendo = tc > 0.4 && tc < 0.6;
  if (alfa > 0) desenharDedo(ctx, x0 + lado * 0.55, y0 + lado * 0.6 + (batendo ? 5 : 0), lado * 0.9, alfa);
  desenharOndaToque(ctx, x0 + lado * 0.55, y0 + lado * 0.6, lado * 0.5, trecho(tc, 0.5, 1.1));
}

/** As pedras do passo 2 (a certa é 5-4) e o lugar de cada uma. */
const PECAS_P2 = [[3, 3], [5, 4], [6, 1], [2, 5]];

/** Passo 2 — o total 9; o dedo marca a pedra 5|4 (contorno dourado), toca PRONTO e o ✓ aparece (ciclo de 5,2 s). */
function desenharPasso2(ctx, l, a, t) {
  const ciclo = 5.2;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  selo(ctx, l * 0.1, a * 0.5, a * 0.3, 9);
  const w = Math.min(l * 0.13, 128);
  const h = w / 2;
  const xs = [l * 0.22, l * 0.4];
  const ys = [a * 0.3, a * 0.62];
  const marcada = tc > 1.0;
  const feita = tc > 2.4;
  PECAS_P2.forEach(([p, q], i) => {
    const x = xs[i % 2];
    const y = ys[Math.floor(i / 2)];
    const certa = i === 1;
    ctx.save();
    ctx.translate(x, y - (certa && marcada && !feita ? 6 : 0));
    if (certa && marcada) {
      ctx.strokeStyle = CORES.ouro;
      ctx.lineWidth = 5;
      ctx.shadowColor = 'rgba(245, 184, 61, 0.5)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(-4, -4, w + 8, h + 8, h * 0.26);
      ctx.stroke();
      ctx.shadowColor = 'transparent';
    }
    desenharPeca(ctx, p, q, { w, h });
    if (certa && feita) desenharSinalPeca(ctx, 'ok', w / 2, h / 2, h * 0.42, suave(trecho(tc, 2.5, 2.8)));
    ctx.restore();
  });
  const bA = Math.min(a * 0.46, 120);
  const bL = bA * 1.2;
  const bx = l * 0.72;
  const by = a / 2 - bA / 2;
  const apertado = tc > 2.0 && tc < 2.25;
  botaoPronto(ctx, bx, by, bL, bA, apertado);

  let alvo = null;
  if (tc < 1.5) alvo = { x: xs[1] + w * 0.7, y: ys[0] + h * 0.55, h: h * 1.6, apertado: tc > 0.85 && tc < 1.05 };
  else if (tc < 2.6) alvo = { x: bx + bL * 0.7, y: by + bA * 0.55, h: bA * 0.8, apertado };
  const alfa = Math.min(trecho(tc, 0.2, 0.5), 1 - trecho(tc, 2.6, 2.9));
  if (alvo && alfa > 0) {
    desenharDedo(ctx, alvo.x, alvo.y + (alvo.apertado ? 5 : 0), alvo.h, alfa);
  }
}

/**
 * Passo 3 — a cada rodada a pedra da criança vai para a bandeja dela e, logo depois, a do computador
 * para a dele; o marcador da rodada enche. Na última o computador fica sem pedra (✕ na vaga dele) e,
 * no fim, quem juntou MAIS PEDRAS ganha o contorno dourado (ciclo de 8 s).
 */
function desenharPasso3(ctx, l, a, t) {
  const ciclo = 8;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  mesa(ctx, l, a, tc, ciclo);
  // Três rodadas: levam uma pedra cada, até o computador ficar sem na 3ª: a criança fecha em 3 × 2.
  const rodadas = [
    { t: 0.5, c: [3, 6], pc: [2, 5] },
    { t: 2.4, c: [5, 5], pc: [1, 4] },
    { t: 4.3, c: [4, 5], pc: null },
  ];
  const r = Math.min(a * 0.075, 19);
  rodadas.forEach((e, i) => {
    const feito = tc >= e.t + 1.9;
    const k = feito ? Math.min(1, (tc - e.t - 1.9) / 0.3) : 1;
    ctx.save();
    ctx.translate(l * 0.07 + i * r * 2.7, a * 0.15);
    ctx.scale(0.4 + 0.6 * k, 0.4 + 0.6 * k);
    desenharMarcadorRodada(ctx, 0, 0, r * 1.3, feito ? 'feita' : 'vazia', !feito && (i === 0 || tc >= rodadas[i - 1].t + 1.9));
    ctx.restore();
  });

  // As duas bandejas.
  const bl = l * 0.4;
  const bh = a * 0.5;
  const by = a * 0.4;
  const bandejas = { v: l * 0.07, c: l * 0.53 };
  const venceu = tc > 6.5;
  for (const quem of ['v', 'c']) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.strokeStyle = venceu && quem === 'v' ? CORES.ouro : 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = venceu && quem === 'v' ? 5 : 2;
    ctx.beginPath();
    ctx.roundRect(bandejas[quem], by, bl, bh, 18);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    desenharIconeQuem(ctx, quem, bandejas[quem] + 30, by + 28, 34, CORES[quem === 'v' ? 'crianca' : 'computador']);
  }
  const pw = Math.min(bl * 0.3, 96);
  const ph = pw / 2;
  const origem = { x: l / 2 - pw / 2, y: a * 0.07 };
  rodadas.forEach((e, i) => {
    // A pedra da criança, e 0,9 s depois a do computador, cada uma na vaga `i` da própria bandeja.
    for (const [quem, par, atraso] of [['v', e.c, 0], ['c', e.pc, 0.9]]) {
      const inicio = e.t + atraso;
      const alvo = { x: bandejas[quem] + 18 + i * (pw + 14), y: by + bh - ph - 18 };
      if (!par) {
        // Sem pedra: o ✕ vermelho na vaga dele.
        const k = suave(trecho(tc, inicio, inicio + 0.4));
        if (k > 0) {
          ctx.save();
          ctx.globalAlpha *= k;
          ctx.strokeStyle = CORES.erro;
          ctx.lineWidth = 5;
          ctx.lineCap = 'round';
          const cx = alvo.x + pw / 2;
          const cy = alvo.y + ph / 2;
          ctx.beginPath();
          ctx.moveTo(cx - 11, cy - 11);
          ctx.lineTo(cx + 11, cy + 11);
          ctx.moveTo(cx + 11, cy - 11);
          ctx.lineTo(cx - 11, cy + 11);
          ctx.stroke();
          ctx.restore();
        }
        continue;
      }
      const aparece = trecho(tc, inicio - 0.5, inicio - 0.2);
      if (aparece <= 0) continue;
      const k = suave(trecho(tc, inicio, inicio + 0.6));
      ctx.save();
      ctx.globalAlpha *= aparece;
      ctx.translate(origem.x + (alvo.x - origem.x) * k, origem.y + (alvo.y - origem.y) * k);
      desenharPeca(ctx, par[0], par[1], { w: pw, h: ph });
      if (quem === 'v' && k < 0.2 && tc > inicio - 0.2) desenharSinalPeca(ctx, 'ok', pw / 2, ph / 2, ph * 0.42, 1);
      ctx.restore();
    }
  });
}
