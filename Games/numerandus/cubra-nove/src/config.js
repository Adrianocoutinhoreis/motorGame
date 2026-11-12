/**
 * config.js — o "formulário" do Cubra Nove.
 *
 * Baseado no vídeo do 2º ano (`numerandus\finalizados\2ano\Cubra_Nove\Cubra_Nove.mp4`, 2min57, vertical,
 * narrado — transcrição em docs/REGRAS-CUBRA-NOVE.md): cada jogador tem uma fileira de casas de 1 a 9.
 * Jogam-se dois dados e cobre-se, com cubinhos de madeira, tudo o que estiver livre entre os dois
 * números, a soma (até 9) e a diferença (não 0). Em três rodadas, vence quem cobrir mais.
 *
 * A criança joga contra o computador, que esquece um número de propósito 1 vez em 4 e fica sem ele; a
 * criança confere (COBRIU TUDO / FALTOU UM), o "a dupla vai se ajudando" do vídeo.
 *
 * Especificação: docs/REGRAS-CUBRA-NOVE.md. Regras, layout e retorno conferidos antes num protótipo
 * jogável (artifact "Plano Cubra Nove", 12/11/2026).
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e docs/REGRAS-EDUCACIONAIS.md
 */
import { CORES, APONTA, escrever, desenharCasa, desenharCubo, desenharDado, desenharConta, desenharDedo, desenharOndaToque } from './desenho.js';

export default {
  // ------------------------------------------------------------- identidade
  /** Slug ESTÁVEL. Vai no campo `jogo` da mensagem do AVA — não mude depois de publicar. */
  slug: 'cubra-nove',
  titulo: 'Cubra Nove',
  /** Sem subtítulo: o título ocupa a placa toda, como no Cabo de Guerra. */
  subtitulo: '',

  objetivo: 'Adição e subtração: a partir de dois dados, achar e cobrir o número de cada dado, a soma '
    + '(quando cabe até 9) e a diferença (o maior menos o menor, quando não dá 0).',
  faixaEtaria: '7 a 8 anos (2º ano)',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#C9A070',

  /**
   * Tema próprio ('madeira', ver `engine/ui/Background.js`): o tampo de uma mesa de madeira clara, em
   * tábuas com veios suaves, combinando com os cubinhos; dados e cubinhos apagados só nas telas de
   * vitrine. Substituiu a chita vinho (pedido do humano, 12/11/2026: "o background está horrível").
   */
  tema: 'madeira',

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  /** A tela final diz "N NÚMEROS" (RE-03): a nota são as casas cobertas. */
  unidadePlacar: { singular: 'número', plural: 'números' },

  // ----------------------------------------------------------------- níveis
  /**
   * Os três níveis têm as mesmas três rodadas e o mesmo dado; muda o apoio na tela e a diferença.
   *   `diferenca`  cobre também a diferença (o maior menos o menor). O Fácil fica só com dados e soma.
   *   `contas`     'prontas' (as contas com o resultado e o que já está coberto), 'escondidas' ("5 + 4 = ?",
   *                o resultado aparece quando a criança cobre) ou 'nenhuma' (só os dados, como na mesa).
   * `amostra` cabe numa linha da faixa colorida do cartão: ~14 letras no máximo.
   */
  niveis: [
    { id: 1, nome: 'Fácil', descricao: 'Dados e soma', amostra: 'Contas prontas', cor: '#16A34A', meta: 9, vidas: 0, diferenca: false, contas: 'prontas' },
    { id: 2, nome: 'Médio', descricao: 'Soma e diferença', amostra: '5 + 4 = ?', cor: '#F59E0B', meta: 9, vidas: 0, diferenca: true, contas: 'escondidas' },
    { id: 3, nome: 'Difícil', descricao: 'Só os dados', amostra: 'Como na mesa', cor: '#DC2626', meta: 9, vidas: 0, diferenca: true, contas: 'nenhuma' },
  ],

  /**
   * Regras ajustáveis, conferidas no protótipo e medidas em simulação (docs/REGRAS-CUBRA-NOVE.md).
   *   rodadas            as rodadas combinadas (a regra curta do vídeo)
   *   maxExtras          o teto de rodadas extras no empate; empatado no teto, a criança leva
   *   computadorEsquece  a chance de o computador esquecer um número (e ficar sem ele)
   *   rolarMs            quanto os dados rolam antes de parar
   *   cpuEsperaMs        a pausa antes de o computador jogar
   *   vooMs              quanto o cubinho leva do monte até a casa
   *   demonstraMs        2º degrau da ajuda: quanto o cubinho fica na casa certa antes de voltar ao monte
   *   errosParaPassar    erros na mesma vez (casa errada ou PRONTO cedo) que fazem a vez passar, sem os números que faltavam
   */
  regras: { rodadas: 3, maxExtras: 5, computadorEsquece: 0.25, rolarMs: 900, cpuEsperaMs: 900, vooMs: 550, demonstraMs: 800, errosParaPassar: 3 },

  // --------------------------------------------------------------- tutorial
  /**
   * 5 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida (regra RE-05). É o ÚNICO lugar
   * com instrução de como jogar: a partida não escreve "toque nos dados" nem "cubra os números". O motor
   * fala `titulo + '. ' + texto` de cada passo pelo id `tutorialTela1..5` (ainda não gravados: sem o
   * arquivo, o passo fica em silêncio e o console avisa).
   */
  tutorial: [
    {
      titulo: 'Jogue os dados',
      fala: 'tutorialTela1',
      texto: 'Toque nos dados para jogar.',
      desenho: (ctx, l, a, t) => desenharPasso1(ctx, l, a, t),
    },
    {
      titulo: 'Cubra os números',
      fala: 'tutorialTela2',
      texto: 'Arraste um cubinho até o número de cada dado, da soma e da diferença.',
      desenho: (ctx, l, a, t) => desenharPasso2(ctx, l, a, t),
    },
    {
      titulo: 'Toque em pronto',
      fala: 'tutorialTela3',
      texto: 'Cobriu tudo o que dava? Toque em PRONTO.',
      desenho: (ctx, l, a, t) => desenharPasso3(ctx, l, a, t),
    },
    {
      titulo: 'Confira o computador',
      fala: 'tutorialTela4',
      texto: 'Ele cobriu tudo? Toque em COBRIU TUDO ou em FALTOU UM.',
      desenho: (ctx, l, a, t) => desenharPasso4(ctx, l, a, t),
    },
    {
      titulo: 'Quem cobrir mais vence',
      fala: 'tutorialTela5',
      texto: 'Em três rodadas, quem cobrir mais números ganha!',
      desenho: (ctx, l, a, t) => desenharPasso5(ctx, l, a, t),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Reaproveitados da coleção (mesmos arquivos do Cabo de Guerra, fichas em assets/audio-transcricao/): os
   * efeitos e as falas "muito bem", "sua vez" e "vez do computador". Tudo o mais (o anúncio da rodada, os outros
   * elogios, as dicas, a conferência e o tutorial) ainda não foi gravado: a cena já pede cada id
   * definitivo (lista no README) e, sem o arquivo, fica muda nesse ponto.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'erroSOS', src: './assets/audio/erroSOS.wav' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
    { id: 'somProgresso', src: './assets/audio/progresso.mp3' },
    { id: 'somConta', src: './assets/audio/soltar_peca.mp3' },
    { id: 'muitoBem', src: './assets/audio/falas/muitoBem.wav' },
    { id: 'suaVez', src: './assets/audio/falas/suaVez.wav' },
    { id: 'vezDoComputador', src: './assets/audio/falas/vezDoComputador.wav' },
  ],

  /** Sem mascote: os dados, as casas e os cubinhos já são os personagens (como no Cabo de Guerra). */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'somProgresso',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    derrota: 'erroSOS',
    /** Os dados parando e o cubinho do computador pousando. */
    pouso: 'somConta',
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Cobrir mais que o computador vence; cobrir menos é derrota (registrada). */
  registrarDerrota: true,
};

// ---------------------------------------------------------------------------
// Desenho do tutorial — as mesmas casas, cubinhos, dados e contas da partida,
// em miniatura. A área é larga e baixa (~980 × 270). Não importa a cena: o
// tutorial também é a AJUDA durante a partida.
// ---------------------------------------------------------------------------

const limitar = (x) => Math.max(0, Math.min(1, x));
const trecho = (t, ini, fim) => limitar((t - ini) / (fim - ini));
const suave = (k) => k * k * (3 - 2 * k);
const ciclo = (t, c) => ((t % c) + c) % c;

/** O fundo do passo: a prancha clara; o conteúdo some no fim do ciclo. */
function mesa(ctx, l, a, tc, duracao) {
  ctx.save();
  ctx.fillStyle = CORES.prancha;
  ctx.strokeStyle = CORES.pranchaBorda;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(4, 4, l - 8, a - 8, 20);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha *= 1 - trecho(tc, duracao - 0.35, duracao);
}

/**
 * Uma fileira em miniatura de 1 a 9 com o canto esquerdo em `x0` e topo em `y`; `cobertas` e
 * `fantasmas` são listas de números. Devolve o x do centro de cada casa (índice = número).
 */
function miniFileira(ctx, x0, y, lado, cobertas = [], fantasmas = []) {
  const gap = lado * 0.08;
  const xs = [];
  for (let v = 1; v <= 9; v++) {
    const x = x0 + (v - 1) * (lado + gap);
    xs[v] = x + lado / 2;
    ctx.save();
    ctx.translate(x, y);
    desenharCasa(ctx, lado, v, { coberta: cobertas.includes(v), fantasma: fantasmas.includes(v) });
    ctx.restore();
  }
  return xs;
}

function dado(ctx, x, y, lado, face, estado = null, girando = 0) {
  ctx.save();
  ctx.translate(x + lado / 2, y + lado / 2);
  if (girando) ctx.rotate(girando);
  ctx.translate(-lado / 2, -lado / 2);
  desenharDado(ctx, lado, face, estado);
  ctx.restore();
}

/** Passo 1 — o dedinho toca nos dados; eles rolam e param no 5 e no 4 (ciclo de 4 s). */
function desenharPasso1(ctx, l, a, t) {
  const d = 4;
  const tc = ciclo(t, d);
  mesa(ctx, l, a, tc, d);
  const lado = Math.min(a * 0.36, 92);
  const x = l / 2 - lado / 2;
  const y1 = a / 2 - lado - 8;
  const y2 = a / 2 + 8;
  const rolando = tc > 0.8 && tc < 1.7;
  const f1 = tc < 0.8 ? 3 : rolando ? 1 + (Math.floor(tc * 9) % 6) : 5;
  const f2 = tc < 0.8 ? 4 : rolando ? 1 + (Math.floor(tc * 11) % 6) : 4;
  const convida = tc < 0.8 ? 'convida' : null;
  dado(ctx, x, y1, lado, f1, convida, rolando ? Math.sin(tc * 24) * 0.16 : 0);
  dado(ctx, x, y2, lado, f2, convida, rolando ? Math.sin(tc * 24 + 2) * 0.16 : 0);
  const alfa = Math.min(trecho(tc, 0, 0.2), 1 - trecho(tc, 0.9, 1.1));
  const batendo = tc > 0.55 && tc < 0.75;
  // O dedinho vem da DIREITA e toca a borda do dado de baixo: a mão fica no espaço livre ao lado (por
  // baixo dos dados ela sairia da área do desenho e ficaria atrás do título do passo).
  const px = x + lado + 6;
  const py = y2 + lado * 0.5;
  if (alfa > 0) desenharDedo(ctx, px - (batendo ? 6 : 0), py, lado * 0.6, alfa, APONTA.esquerda);
  desenharOndaToque(ctx, px - lado * 0.1, py, lado * 0.4, trecho(tc, 0.6, 1.2));
}

/** Passo 2 — dados 5 e 4: os cubinhos vão para o 5, o 4, o 9 (5 + 4) e o 1 (5 − 4) (ciclo de 5,6 s). */
function desenharPasso2(ctx, l, a, t) {
  const d = 5.6;
  const tc = ciclo(t, d);
  mesa(ctx, l, a, tc, d);
  const lado = Math.min(l * 0.064, 60);
  const larguraFileira = 9 * lado + 8 * lado * 0.08;
  const x0 = (l - larguraFileira) / 2 + l * 0.06;
  const yF = a - lado - 22;
  const ordem = [5, 4, 9, 1];
  const chegou = ordem.map((_, i) => tc > 0.9 + i * 0.8);
  const xs = miniFileira(ctx, x0, yF, lado, ordem.filter((_, i) => chegou[i]));
  // Os dados à esquerda e as contas no meio, como na partida.
  const ld = lado * 0.95;
  dado(ctx, 26, 22, ld, 5, chegou[0] ? 'feito' : null);
  dado(ctx, 26, 44 + ld, ld, 4, chegou[1] ? 'feito' : null);
  const cy = (22 + yF) / 2 - 6;
  desenharConta(ctx, '5 + 4 = 9', l * 0.42, cy, chegou[2] ? 'feito' : null, Math.round(lado * 0.5));
  desenharConta(ctx, '5 − 4 = 1', l * 0.68, cy, chegou[3] ? 'feito' : null, Math.round(lado * 0.5));
  // O cubinho voando do canto (o monte) até a casa da vez.
  ordem.forEach((v, i) => {
    const k = trecho(tc, 0.3 + i * 0.8, 0.9 + i * 0.8);
    if (k <= 0 || k >= 1) return;
    const sx = l - 40;
    const sy = 40;
    const ex = xs[v];
    const ey = yF + lado * 0.46;
    const s = suave(k);
    desenharCubo(ctx, sx + (ex - sx) * s, sy + (ey - sy) * s - Math.sin(s * Math.PI) * 30, lado * 0.46, null, true);
  });
}

/** Um botão em miniatura (PRONTO, COBRIU TUDO, FALTOU UM). */
function botaoMini(ctx, x, y, w, h, texto, cor, corTexto, apertado = false) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.beginPath();
  ctx.roundRect(x, y + 5, w, h, 16);
  ctx.fill();
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.roundRect(x, y + (apertado ? 4 : 0), w, h, 16);
  ctx.fill();
  escrever(ctx, texto, x + w / 2, y + h / 2 + (apertado ? 4 : 0) + 1, Math.round(h * 0.42), corTexto);
  ctx.restore();
}

/** Passo 3 — tudo coberto, o dedinho toca em PRONTO: "MUITO BEM!" (ciclo de 4,4 s). */
function desenharPasso3(ctx, l, a, t) {
  const d = 4.4;
  const tc = ciclo(t, d);
  mesa(ctx, l, a, tc, d);
  const lado = Math.min(l * 0.06, 56);
  const larguraFileira = 9 * lado + 8 * lado * 0.08;
  miniFileira(ctx, (l - larguraFileira) / 2, a - lado - 20, lado, [1, 4, 5, 9]);
  const bw = 220;
  const bh = 64;
  const bx = l / 2 - bw / 2;
  const by = 40;
  const tocou = tc > 1.2;
  if (tc < 1.6) botaoMini(ctx, bx, by, bw, bh, 'PRONTO', '#22C55E', '#052E16', tc > 1.0 && tc < 1.25);
  const alfa = Math.min(trecho(tc, 0.2, 0.5), 1 - trecho(tc, 1.3, 1.6));
  const batendo = tc > 1.0 && tc < 1.25;
  // Da direita do botão, com a mão no espaço livre (nada embaixo dela).
  if (alfa > 0) desenharDedo(ctx, bx + bw + 6 - (batendo ? 6 : 0), by + bh / 2, 56, alfa, APONTA.esquerda);
  if (tocou && tc > 1.6) {
    ctx.save();
    const k = suave(trecho(tc, 1.6, 2.0));
    ctx.globalAlpha *= k;
    ctx.translate(l / 2, by + bh / 2);
    ctx.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k);
    ctx.fillStyle = CORES.okFundo;
    ctx.beginPath();
    ctx.roundRect(-170, -34, 340, 68, 18);
    ctx.fill();
    escrever(ctx, 'MUITO BEM!', 0, 2, 40, CORES.okTexto);
    ctx.restore();
  }
}

/**
 * Passo 4 — o computador tirou 6 e 5: cobriu o 6 e o 5, mas esqueceu o 1 (6 − 5). O dedinho toca em
 * FALTOU UM e o cubinho fantasma aparece no 1 (ciclo de 5 s).
 */
function desenharPasso4(ctx, l, a, t) {
  const d = 5;
  const tc = ciclo(t, d);
  mesa(ctx, l, a, tc, d);
  const lado = Math.min(l * 0.058, 54);
  const larguraFileira = 9 * lado + 8 * lado * 0.08;
  const tocou = tc > 1.9;
  miniFileira(ctx, (l - larguraFileira) / 2, 22, lado, [5, 6], tocou ? [1] : []);
  const cy = 22 + lado + 40;
  desenharConta(ctx, '6 + 5 = 11', l * 0.36, cy, 'nao', 26);
  desenharConta(ctx, '6 − 5 = 1', l * 0.64, cy, tocou ? 'dica' : null, 26);
  const bw = 230;
  const bh = 58;
  const by = a - bh - 22;
  const gap = 30;
  const x1 = l / 2 - bw - gap / 2;
  const x2 = l / 2 + gap / 2;
  botaoMini(ctx, x1, by, bw, bh, 'COBRIU TUDO', '#22C55E', '#052E16');
  botaoMini(ctx, x2, by, bw, bh, 'FALTOU UM', '#EF4444', '#FFFFFF', tc > 1.6 && tc < 1.85);
  const alfa = Math.min(trecho(tc, 0.6, 0.9), 1 - trecho(tc, 1.9, 2.2));
  const batendo = tc > 1.6 && tc < 1.85;
  // Da direita do FALTOU UM: por baixo dele a mão sairia da área do desenho (os botões ficam no rodapé).
  if (alfa > 0) desenharDedo(ctx, x2 + bw + 6 - (batendo ? 6 : 0), by + bh / 2, 52, alfa, APONTA.esquerda);
}

/** Passo 5 — as duas fileiras no fim: a de baixo (a criança) cobriu mais: "VOCÊ VENCEU!" (ciclo de 5 s). */
function desenharPasso5(ctx, l, a, t) {
  const d = 5;
  const tc = ciclo(t, d);
  mesa(ctx, l, a, tc, d);
  const lado = Math.min(l * 0.052, 50);
  const larguraFileira = 9 * lado + 8 * lado * 0.08;
  const x0 = (l - larguraFileira) / 2;
  const nP = Math.min(4, Math.floor(trecho(tc, 0.2, 1.4) * 5));
  const nC = Math.min(7, Math.floor(trecho(tc, 0.2, 1.4) * 8));
  miniFileira(ctx, x0, 20, lado, [1, 5, 6, 3].slice(0, nP));
  miniFileira(ctx, x0, a - lado - 20, lado, [1, 2, 3, 4, 5, 7, 9].slice(0, nC));
  if (tc > 1.8) {
    ctx.save();
    ctx.globalAlpha *= suave(trecho(tc, 1.8, 2.2));
    escrever(ctx, 'VOCÊ VENCEU!', l / 2, a / 2, Math.round(a * 0.15), CORES.okTexto);
    ctx.restore();
  }
}
