/**
 * config.js — o "formulário" do Pratinho CDU.
 *
 * Baseado no brinquedo do vídeo do 2º ano (`numerandus/finalizados/2ano/
 * Pratinho_CDU`) e na animação Remotion `jogos/2ano/CDU_video`: um prato
 * redondo dividido em três fatias — C (centena), D (dezena) e U (unidade) —,
 * um punhado de grãos jogado nele, e a contagem de cada fatia anotada como um
 * número no caderno. Refaz o "Jogo do Pratinho CDU" antigo
 * (`Aulas para Refazer/Jogo_CDU_1ano`) no formato da série.
 *
 * A criança toca em JOGAR, conta os grãos de cada fatia (o grão tocado fica
 * marcado) e forma o número nos rolinhos C/D/U — no Fácil, escolhe entre
 * três números. O computador faz o mesmo, e a criança diz qual dos dois números
 * é o maior: quem formou o maior ganha a estrela da rodada. São 5 rodadas.
 *
 * Especificação: docs/REGRAS-PRATINHO-CDU.md. Layout e regras conferidos antes
 * num protótipo jogável (artifact "Pratinho CDU", 19 e 20/10/2026).
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
import { posicionarGraos } from './regras.js';
import {
  CORES, desenharPrato, desenharGrao, GRAO_RX, desenharRolinho, alturaRolinho, desenharDedo,
  desenharOndaToque, desenharIconeJogar, desenharIconeCerto, desenharVisto, desenharIconeQuem,
  desenharEstrelaRodada, escrever,
} from './desenho.js';

export default {
  // ------------------------------------------------------------- identidade
  /** Slug ESTÁVEL. Vai no campo `jogo` da mensagem do AVA — não mude depois de publicar. */
  slug: 'pratinho-cdu',
  titulo: 'Pratinho CDU',
  subtitulo: 'Conte os grãos e forme o número!',

  objetivo: 'Ler números de até três algarismos pelo valor posicional: contar as quantidades '
    + 'de centenas, dezenas e unidades, formar o número (inclusive com zero numa casa) e '
    + 'comparar dois números.',
  faixaEtaria: '6 a 8 anos (1º e 2º ano)',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#1B212B',

  /**
   * Tema próprio ('mesa', ver `engine/ui/Background.js`): ardósia escura NEUTRA,
   * para o fundo não brigar com o prato colorido (pedido do humano, 19/10/2026).
   * Pratinhos e grãos apagados só nas telas de vitrine; a partida desliga.
   */
  tema: 'mesa',

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  /**
   * O resultado mostra só as cinco estrelas, sem a linha "N RODADAS": a nota
   * desconta os erros (RE-02), então "3 RODADAS" mentiria para quem jogou as 5.
   */
  mostrarPlacarTexto: false,

  // ----------------------------------------------------------------- níveis
  /**
   * `casas`     as fatias que valem (no Fácil a C fica apagada: números até 99)
   * `faixa`     quantos grãos podem cair em cada casa, [mínimo, máximo]
   * `chanceZero` fração das jogadas em que a D ou a U fica VAZIA (305, 340)
   * `fora`      quantos grãos caem fora do prato ("caiu fora não conta")
   * `resposta`  'opcoes' (escolher entre 3 números) ou 'rolinhos' (formar C/D/U)
   * `nomes`     escreve VOCÊ / COMPUTADOR ao lado do ícone de quem joga (pedido do humano para o Fácil)
   * `perguntas` o que a comparação pergunta: ['maior'] (padrão) ou ['maior', 'menor'] (sorteado
   *             por rodada, cada um pelo menos 2 vezes). A estrela vai para o número PEDIDO.
   * `meta`      as 5 rodadas da partida
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Dezena e unidade', amostra: 'Até 99', cor: '#16A34A',
      meta: 5, vidas: 0,
      casas: ['d', 'u'], faixa: { d: [1, 9], u: [0, 9] }, chanceZero: 0, fora: [0, 0], resposta: 'opcoes',
      nomes: true, perguntas: ['maior', 'menor'],
    },
    {
      id: 2, nome: 'Médio', descricao: 'Com centena', amostra: 'Até 555', cor: '#F59E0B',
      meta: 5, vidas: 0,
      casas: ['c', 'd', 'u'], faixa: { c: [1, 5], d: [1, 5], u: [1, 5] }, chanceZero: 0, fora: [0, 0], resposta: 'rolinhos',
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Com zero', amostra: 'Até 999', cor: '#DC2626',
      meta: 5, vidas: 0,
      casas: ['c', 'd', 'u'], faixa: { c: [1, 9], d: [0, 9], u: [0, 9] }, chanceZero: 0.5, fora: [1, 3], resposta: 'rolinhos',
    },
  ],

  /**
   * Regras ajustáveis, todas conferidas no protótipo.
   *   errosParaAcender      no N-ésimo PRONTO errado da rodada, a fatia e o rolinho errados acendem
   *                         (no Fácil, que não tem rolinho, este já conta junto)
   *   errosParaContarJunto  no N-ésimo, o jogo conta essas fatias junto com a criança
   *   passoAjudaMs          tempo de cada grão na contagem junto
   *   passoCpuMs            tempo de cada grão na contagem do computador
   *   pausaRodadaMs         quanto o acerto e a estrela ficam na tela antes de seguir
   */
  regras: {
    errosParaAcender: 2,
    errosParaContarJunto: 4,
    passoAjudaMs: 420,
    passoCpuMs: 260,
    pausaRodadaMs: 1700,
  },

  // --------------------------------------------------------------- tutorial
  /**
   * 4 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05). A narração (`tutorialTela1..4`) ainda não foi gravada: o
   * motor fica em silêncio e avisa no console.
   */
  tutorial: [
    {
      titulo: 'Toque em JOGAR',
      fala: 'tutorialTela1',
      texto: 'Os grãos caem no prato. Cada fatia é uma casa: C de centena, D de dezena, U de unidade.',
      desenho: (ctx, l, a, t) => desenharPasso1(ctx, l, a, t),
    },
    {
      titulo: 'Conte cada fatia',
      fala: 'tutorialTela2',
      texto: 'Toque em cada grão para contar: ele fica marcado. Fatia sem grão vale zero.',
      desenho: (ctx, l, a, t) => desenharPasso2(ctx, l, a, t),
    },
    {
      titulo: 'Forme o número',
      fala: 'tutorialTela3',
      texto: 'Suba cada rolinho até a quantidade da fatia e toque em PRONTO. No fácil, escolha o número certo.',
      desenho: (ctx, l, a, t) => desenharPasso3(ctx, l, a, t),
    },
    {
      titulo: 'Maior ou menor?',
      fala: 'tutorialTela4',
      texto: 'O computador também joga. Toque no número que a pergunta pede e em PRONTO: a estrela vai para ele.',
      desenho: (ctx, l, a, t) => desenharPasso4(ctx, l, a, t),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Efeitos reaproveitados da coleção (mesmo SHA-256 dos outros jogos
   * Numerandus — ver as fichas em assets/audio-transcricao/). A narração ainda
   * não foi gravada: a cena já pede cada fala pelo id definitivo (lista no
   * README.md); quando os arquivos chegarem, basta declará-los aqui.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
    { id: 'somProgresso', src: './assets/audio/progresso.mp3' },
    { id: 'somConta', src: './assets/audio/soltar_peca.mp3' },
  ],

  /** Sem mascote: o prato já é o personagem (mesma decisão da Corrida Espacial). */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'somProgresso',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    derrota: null,
    /** Os grãos caindo no prato e cada grão acendendo na contagem. */
    pouso: 'somConta',
    conta: 'somConta',
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /**
   * Terminar as 5 rodadas é a vitória do contrato: a nota é a leitura, não a
   * sorte do punhado. Nunca há derrota (ver docs/REGRAS-PRATINHO-CDU.md §6).
   */
  registrarDerrota: true,
};

// ---------------------------------------------------------------------------
// Desenho do tutorial — o mesmo prato, os mesmos grãos e rolinhos da partida,
// e o dedinho branco da coleção. Não importa a cena: o tutorial também é a
// AJUDA durante a partida. A área é larga e baixa (~980 × 270), sobre painel
// claro.
// ---------------------------------------------------------------------------

const limitar = (x) => Math.max(0, Math.min(1, x));
const trecho = (t, ini, fim) => limitar((t - ini) / (fim - ini));
const TINTA = '#1E293B';

/** Sorteio com semente, para o tutorial mostrar sempre o MESMO prato. */
function semente(s) {
  let x = s >>> 0;
  return () => {
    x = (x + 0x6D2B79F5) >>> 0;
    let z = x;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

/** O prato do tutorial: 2 centenas, 3 dezenas, 1 unidade → 231. */
const QT_TUTORIAL = { c: 2, d: 3, u: 1 };
const GRAOS_TUTORIAL = posicionarGraos(QT_TUTORIAL, semente(7));

function geometriaPrato(l, a) {
  const R = Math.min(a * 0.4, l * 0.15);
  return { cx: l * 0.05 + R * 1.15, cy: a / 2, R };
}

/** Desenha os grãos do tutorial; `halo(g)` diz quanto do halo de cada um já acendeu. */
function graosTutorial(ctx, cx, cy, R, op = {}) {
  for (const g of GRAOS_TUTORIAL) {
    const queda = op.queda ? op.queda(g) : 1;
    if (queda <= 0) continue;
    ctx.save();
    ctx.globalAlpha *= Math.min(1, queda * 2);
    desenharGrao(ctx, cx + g.x * R, cy + g.y * R - (1 - queda) * a0(R), GRAO_RX * R, g.giro, {
      halo: op.halo ? op.halo(g) : 0,
      onda: op.onda ? op.onda(g) : 0,
    });
    ctx.restore();
  }
}
const a0 = (R) => R * 1.4;

function botao(ctx, x, y, l, a, cor, base, rotulo, icone, apertado) {
  ctx.save();
  ctx.translate(0, apertado ? 4 : 0);
  ctx.beginPath();
  ctx.roundRect(x, y + 6, l, a, a * 0.2);
  ctx.fillStyle = base;
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x, y, l, a, a * 0.2);
  ctx.fillStyle = cor;
  ctx.fill();
  if (icone === 'jogar') desenharIconeJogar(ctx, x + l / 2, y + a * 0.38, a * 0.36);
  else desenharIconeCerto(ctx, x + l / 2, y + a * 0.38, a * 0.32);
  escrever(ctx, rotulo, x + l / 2, y + a * 0.77, Math.round(a * 0.17), '#FFFFFF');
  ctx.restore();
}

/** Passo 1 — JOGAR, e os grãos caem no prato (ciclo de 4,4 s). */
function desenharPasso1(ctx, l, a, t) {
  const ciclo = 4.4;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  const { cx, cy, R } = geometriaPrato(l, a);
  const sumir = 1 - trecho(tc, ciclo - 0.4, ciclo);
  desenharPrato(ctx, cx, cy, R);
  ctx.save();
  ctx.globalAlpha = sumir;
  graosTutorial(ctx, cx, cy, R, {
    queda: (g) => trecho(tc, 0.9 + (g.k * 3 + 'cdu'.indexOf(g.casa)) * 0.07, 1.35 + (g.k * 3 + 'cdu'.indexOf(g.casa)) * 0.07),
  });
  ctx.restore();

  // Letras-legenda ao lado do prato: C = centena, D = dezena, U = unidade.
  const xl = cx + R * 1.45;
  ['c', 'd', 'u'].forEach((casa, i) => {
    const y = cy - a * 0.26 + i * a * 0.26;
    ctx.fillStyle = CORES[casa];
    ctx.beginPath();
    ctx.arc(xl, y, a * 0.085, 0, Math.PI * 2);
    ctx.fill();
    escrever(ctx, casa.toUpperCase(), xl, y + 1, Math.round(a * 0.1), '#FFFFFF');
    escrever(ctx, ['100', '10', '1'][i], xl + a * 0.13, y + 1, Math.round(a * 0.11), TINTA, 'left');
  });

  const bA = Math.min(a * 0.48, 128);
  const bL = bA * 1.3;
  const bx = l * 0.8 - bL / 2;
  const by = a / 2 - bA / 2;
  const apertado = tc > 0.35 && tc < 0.6;
  botao(ctx, bx, by, bL, bA, '#3B6FE0', '#22449A', 'JOGAR', 'jogar', apertado);
  const alfa = Math.min(trecho(tc, 0, 0.15), 1 - trecho(tc, 0.85, 1.1));
  if (alfa > 0) desenharDedo(ctx, bx + bL * 0.7, by + bA * 0.55 + (apertado ? 5 : 0), bA * 0.9, alfa);
  desenharOndaToque(ctx, bx + bL * 0.7, by + bA * 0.55, bA * 0.6, trecho(tc, 0.35, 1.0));
}

/**
 * Passo 2 — o dedo toca em cada grão da fatia D, um de cada vez, e o grão
 * tocado fica marcado com o halo (ciclo de 4,8 s).
 */
function desenharPasso2(ctx, l, a, t) {
  const ciclo = 4.8;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  // O prato vai para o meio e cresce: neste passo ele é o único elemento.
  const R2 = a * 0.38;
  const cx2 = l * 0.5;
  const cy = a / 2;
  const toques = [0.9, 1.8, 2.7];
  const sumir = 1 - trecho(tc, ciclo - 0.4, ciclo);
  desenharPrato(ctx, cx2, cy, R2);
  ctx.save();
  ctx.globalAlpha = sumir;
  graosTutorial(ctx, cx2, cy, R2, {
    halo: (g) => (g.casa === 'd' ? trecho(tc, toques[g.k], toques[g.k] + 0.3) : 0),
    onda: (g) => (g.casa === 'd' ? trecho(tc, toques[g.k], toques[g.k] + 0.6) : 0),
  });
  ctx.restore();

  // O dedo vai de grão em grão: chega ao próximo um pouco antes de tocar.
  const alvos = GRAOS_TUTORIAL.filter((g) => g.casa === 'd').map((g) => ({ x: cx2 + g.x * R2, y: cy + g.y * R2 }));
  let i = toques.findIndex((m) => tc < m + 0.15);
  if (i < 0) i = toques.length - 1;
  const de = alvos[Math.max(0, i - 1)];
  const ate = alvos[i];
  const ida = i === 0 ? 1 : trecho(tc, toques[i - 1] + 0.2, toques[i] - 0.25);
  const k = ida * ida * (3 - 2 * ida);
  const px = de.x + (ate.x - de.x) * k;
  const py = de.y + (ate.y - de.y) * k;
  const alfa = Math.min(trecho(tc, 0.2, 0.5), 1 - trecho(tc, 3.2, 3.6));
  const batendo = toques.some((m) => tc > m - 0.15 && tc < m + 0.05);
  if (alfa > 0) desenharDedo(ctx, px, py + (batendo ? 5 : 0), R2 * 0.5, alfa);
  toques.forEach((m, j) => desenharOndaToque(ctx, alvos[j].x, alvos[j].y, R2 * 0.18, trecho(tc, m, m + 0.6)));
}

/** Passo 3 — os rolinhos sobem até 2, 3 e 1; PRONTO; o visto (ciclo de 6,6 s). */
function desenharPasso3(ctx, l, a, t) {
  const ciclo = 6.6;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  const { cx, cy, R } = geometriaPrato(l, a);
  desenharPrato(ctx, cx, cy, R);
  graosTutorial(ctx, cx, cy, R, { halo: () => 1 });

  // Cada toque numa seta ▲, em ordem: C, C, D, D, D, U.
  const toques = [['c', 0.6], ['c', 1.1], ['d', 1.7], ['d', 2.2], ['d', 2.7], ['u', 3.3]];
  const valor = { c: 0, d: 0, u: 0 };
  let ativo = null;
  for (const [casa, m] of toques) {
    if (tc >= m) valor[casa] += 1;
    if (tc > m - 0.2 && tc < m + 0.05) ativo = casa;
  }
  const largura = Math.min(a / (alturaRolinho(1) + 0.1), 80);
  const gap = largura * 0.28;
  const x0 = l * 0.42;
  const y0 = (a - alturaRolinho(largura)) / 2;
  ['c', 'd', 'u'].forEach((casa, i) => {
    desenharRolinho(ctx, x0 + i * (largura + gap), y0, largura, casa, valor[casa], { apertada: ativo === casa ? 'sobe' : null });
  });

  const bA = Math.min(a * 0.5, 130);
  const bL = bA * 0.95;
  const bx = l * 0.86 - bL / 2;
  const by = a / 2 - bA / 2;
  const apertado = tc > 4.0 && tc < 4.25;
  botao(ctx, bx, by, bL, bA, '#22C55E', '#15803D', 'PRONTO', 'pronto', apertado);
  if (tc > 4.3) desenharVisto(ctx, bx + bL / 2, by - bA * 0.05, bA * 0.22, limitar((tc - 4.3) / 0.3));

  // O dedo: em cada seta na hora do toque, depois no PRONTO.
  let alvo = null;
  if (tc < 3.6) {
    const proximo = toques.find(([, m]) => tc < m + 0.3) ?? toques[toques.length - 1];
    const i = 'cdu'.indexOf(proximo[0]);
    alvo = { x: x0 + i * (largura + gap) + largura * 0.65, y: y0 + largura * 0.42, h: largura * 0.9, apertado: ativo != null };
  } else if (tc < 4.6) {
    alvo = { x: bx + bL * 0.7, y: by + bA * 0.55, h: bA * 0.8, apertado };
  }
  const alfa = Math.min(trecho(tc, 0.1, 0.4), 1 - trecho(tc, 4.6, 4.9));
  if (alvo && alfa > 0) desenharDedo(ctx, alvo.x, alvo.y + (alvo.apertado ? 5 : 0), alvo.h, alfa);
}

/** Passo 4 — 231 ? 145: o dedo marca o 231, PRONTO, o ">" e a estrela pousa no 231 (ciclo de 5,6 s). */
function desenharPasso4(ctx, l, a, t) {
  const ciclo = 5.6;
  const tc = ((t % ciclo) + ciclo) % ciclo;
  const bA = Math.min(a * 0.56, 140);
  const bL = bA * 1.15;
  const cy = a / 2;
  const xs = [l * 0.12, l * 0.42];
  const sinalX = (xs[0] + bL + xs[1]) / 2;
  const marcado = tc > 1.0;
  const certo = tc > 2.4;
  [['v', '231'], ['c', '145']].forEach(([quem, numero], i) => {
    const x = xs[i];
    const y = cy - bA / 2;
    const cor = quem === 'c' ? CORES.computador : CORES.crianca;
    // Marcado (azul cheio) até o PRONTO; depois, o vencedor ganha contorno e estrela e o outro apaga.
    const cheio = quem === 'v' && marcado && !certo;
    ctx.save();
    if (certo && quem === 'c') ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.roundRect(x, y, bL, bA, 22);
    ctx.fillStyle = cheio ? cor : '#1B212B';
    ctx.fill();
    ctx.lineWidth = certo && quem === 'v' ? 7 : 4;
    ctx.strokeStyle = certo && quem === 'v' ? CORES.estrela : cor;
    ctx.stroke();
    escrever(ctx, numero, x + bL / 2, y + bA * 0.42, Math.round(bA * 0.32), cheio ? '#1B212B' : '#E7EBF2');
    desenharIconeQuem(ctx, quem, x + bL / 2, y + bA * 0.8, bA * 0.22, cheio ? '#1B212B' : cor);
    if (certo && quem === 'v') {
      const e = Math.min(1, (tc - 2.4) / 0.3);
      ctx.translate(x + bL - 6, y + 4);
      ctx.scale(0.3 + 0.7 * e, 0.3 + 0.7 * e);
      desenharEstrelaRodada(ctx, 0, 0, bA * 0.22, 'v');
    }
    ctx.restore();
  });
  // O sinal: "?" tracejado, depois ">" num círculo verde.
  const r = bA * 0.3;
  ctx.save();
  ctx.beginPath();
  ctx.arc(sinalX, cy, r, 0, Math.PI * 2);
  if (certo) {
    ctx.fillStyle = CORES.ok;
    ctx.fill();
  } else {
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#64748B';
    ctx.stroke();
  }
  ctx.restore();
  escrever(ctx, certo ? '>' : '?', sinalX, cy + 2, Math.round(r * 1.15), certo ? '#FFFFFF' : '#64748B');

  const pA = Math.min(a * 0.5, 130);
  const pL = pA * 0.95;
  const px = l * 0.7 - pL / 2;
  const py = cy - pA / 2;
  const apertado = tc > 2.0 && tc < 2.25;
  botao(ctx, px, py, pL, pA, '#22C55E', '#15803D', 'PRONTO', 'pronto', apertado);

  let alvo = null;
  if (tc < 1.5) alvo = { x: xs[0] + bL * 0.65, y: cy + bA * 0.1, h: bA * 0.75, apertado: tc > 0.85 && tc < 1.05 };
  else if (tc < 2.6) alvo = { x: px + pL * 0.7, y: py + pA * 0.55, h: pA * 0.8, apertado };
  const alfa = Math.min(trecho(tc, 0.2, 0.5), 1 - trecho(tc, 2.6, 2.9));
  if (alvo && alfa > 0) desenharDedo(ctx, alvo.x, alvo.y + (alvo.apertado ? 5 : 0), alvo.h, alfa);
}
