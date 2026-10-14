/**
 * config.js — o "formulário" da Corrida Espacial.
 *
 * Baseado no vídeo do brinquedo físico (`Videos_Numerandus/corrida_espacial`):
 * duas pistas numeradas de 1 a 20, um foguete para cada jogador com uma
 * janelinha que mostra a casa, e três jeitos de brincar — 1 dado, a soma de 2
 * dados e a diferença de 2 dados. Os três jeitos viram os três níveis.
 *
 * A criança rola os dados, leva o PRÓPRIO foguete até a casa certa (tocando
 * nele, casa a casa, ou arrastando direto) e confirma em PRONTO. O foguete
 * laranja do computador rola dados honestos e anda contando. A sorte decide
 * quem chega primeiro; a nota é da conta.
 *
 * Especificação: docs/REGRAS-CORRIDA-ESPACIAL.md. Protótipo de layout e
 * regras validado antes desta implementação (artifact "Protótipo Corrida
 * Espacial", 14/10/2026) — os números de layout da cena vêm de lá.
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
import {
  CORES, FOGUETE_COMPRIMENTO, desenharFoguete, desenharDado, desenharPista, desenharChegada, desenharBalao,
  desenharDedo, desenharOndaToque, desenharIconeDado, desenharIconeCerto, escrever,
} from './desenho.js';

export default {
  // ------------------------------------------------------------- identidade
  /** Slug ESTÁVEL. Vai no campo `jogo` da mensagem do AVA — não mude depois de publicar. */
  slug: 'corrida-espacial',
  titulo: 'Corrida Espacial',
  subtitulo: 'Role os dados e leve seu foguete!',

  objetivo: 'Avançar na reta numérica de 1 a 20: contar de um em um a partir de uma casa, '
    + 'somar a partir de uma casa e calcular a diferença entre dois dados.',
  faixaEtaria: '4 a 7 anos',

  // -------------------------------------------------------------- exibição
  largura: 1280,
  altura: 720,
  corLetterbox: '#0B1030',

  /** Tema próprio ('espaco', ver `engine/ui/Background.js`): céu de noite, estrelas paradas. */
  tema: 'espaco',

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * `modo` é o jeito de brincar do vídeo:
   *   'dado'      — 1 dado, anda o valor (1 a 6)
   *   'soma'      — 2 dados, anda a soma (2 a 12)
   *   'diferenca' — 2 dados, anda o maior menos o menor (0 a 5; zero não anda)
   * `meta` é a casa 20: o progresso da partida é a casa alcançada (seção 6 da
   * especificação), e a própria pista faz o papel de barra de progresso.
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: '1 dado', amostra: '1 a 6 casas', cor: '#16A34A',
      meta: 20, vidas: 0, modo: 'dado',
    },
    {
      id: 2, nome: 'Médio', descricao: 'Soma', amostra: '2 a 12 casas', cor: '#F59E0B',
      meta: 20, vidas: 0, modo: 'soma',
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Diferença', amostra: '0 a 5 casas', cor: '#DC2626',
      meta: 20, vidas: 0, modo: 'diferenca',
    },
  ],

  /**
   * Regras ajustáveis, todas conferidas no protótipo.
   *   chegada         'passar': passar do 20 já vale (o vídeo); 'exata': precisa cair no 20
   *   errosParaAjuda  no N-ésimo erro da MESMA jogada, as casas acendem até a certa (0 = nunca)
   *   passoCpuMs      tempo de cada casa que o foguete laranja anda, contando
   *   mostrarAndou    balão com quantas casas o foguete já andou nesta jogada
   *   algarismoDado   o número escrito embaixo de cada dado
   */
  regras: {
    chegada: 'passar',
    errosParaAjuda: 2,
    passoCpuMs: 540,
    mostrarAndou: true,
    algarismoDado: true,
  },

  // --------------------------------------------------------------- tutorial
  /**
   * 4 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05). Narração gravada (14/10/2026, `assets/audio/tutorial/`):
   * o motor fala `titulo + '. ' + texto` de cada passo pelo id `tutorialTela1..4`.
   */
  tutorial: [
    {
      titulo: 'Toque em ROLAR',
      fala: 'tutorialTela1',
      texto: 'O dado diz quantas casas o foguete anda. No médio, junte os dados. No difícil, tire o menor do maior.',
      desenho: (ctx, l, a, t, loader) => desenharCenaTutorial(ctx, l, a, 1, t, loader?.imagem('foguete')),
    },
    {
      titulo: 'Conte casa por casa',
      fala: 'tutorialTela2',
      texto: 'Cada toque no foguete anda uma casa. Conte junto: um, dois, três!',
      desenho: (ctx, l, a, t, loader) => desenharCenaTutorial(ctx, l, a, 2, t, loader?.imagem('foguete')),
    },
    {
      titulo: 'Ou pule direto',
      fala: 'tutorialTela3',
      texto: 'Já sabe a conta? Arraste o foguete até a casa certa.',
      desenho: (ctx, l, a, t, loader) => desenharCenaTutorial(ctx, l, a, 3, t, loader?.imagem('foguete')),
    },
    {
      titulo: 'Toque em PRONTO',
      fala: 'tutorialTela4',
      texto: 'Errou? O foguete volta e você tenta de novo. Depois, o laranja joga. Quem chegar primeiro ao fim ganha!',
      desenho: (ctx, l, a, t, loader) => desenharCenaTutorial(ctx, l, a, 4, t, loader?.imagem('foguete')),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * Efeitos reaproveitados da coleção (mesmo SHA-256 dos outros jogos
   * Numerandus — ver as fichas em assets/audio-transcricao/).
   *
   * A NARRAÇÃO DO TUTORIAL chegou em 14/10/2026 (`assets/audio/tutorial/`,
   * WAV PCM 16 bits, 24 000 Hz, mono): os quatro passos, que também servem à
   * AJUDA dentro da partida (RE-05). O restante da narração continua pendente —
   * a cena já pede cada fala pelo id definitivo (`numero1` a `numero20`, `mais`,
   * `menos`, `tenteDeNovo`, `zeroFicaNoLugar`, `passouFicaNoLugar`, `chegou`,
   * `suaVez`, `vezDoComputador`); quando os arquivos chegarem, basta
   * declará-los aqui. Lista completa no README.md.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    // Derrota: o mesmo som da tela final do Jogo dos Blocos (copiado de lá, mesmo SHA-256).
    { id: 'erroSOS', src: './assets/audio/erroSOS.wav' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
    { id: 'somProgresso', src: './assets/audio/progresso.mp3' },
    { id: 'pouso', src: './assets/audio/soltar_peca.mp3' },
    // A arte do foguete (recortada de fontes/corrida-espacial/foguete-original.png).
    { id: 'foguete', src: './assets/img/foguete.png' },
    { id: 'tutorialTela1', src: './assets/audio/tutorial/tela01.wav' },
    { id: 'tutorialTela2', src: './assets/audio/tutorial/tela002.wav' },
    { id: 'tutorialTela3', src: './assets/audio/tutorial/tela003.wav' },
    { id: 'tutorialTela4', src: './assets/audio/tutorial/tela04.wav' },
  ],

  /** Sem mascote: o foguete já é o personagem (mesma decisão do Caminho das Cores). */
  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'somProgresso',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    pouso: 'pouso',
    /** O mesmo som da tela final de derrota do Jogo dos Blocos. */
    derrota: 'erroSOS',
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** O foguete laranja pode chegar antes: derrota existe e é registrada. */
  registrarDerrota: true,

  /** RE-03: o placar diz CASAS — a casa alcançada (descontados os erros, na vitória: RE-02). */
  unidadePlacar: { singular: 'casa', plural: 'casas' },
};

// ---------------------------------------------------------------------------
// Desenho do tutorial — uma pista curta (casas 1 a 8) com o mesmo foguete, o
// mesmo dado e os mesmos botões da partida, e o dedinho branco da coleção.
// Não importa a cena: o tutorial também é a AJUDA durante a partida.
// ---------------------------------------------------------------------------

const limitar = (x) => Math.max(0, Math.min(1, x));
const suave = (x) => x * x * (3 - 2 * x);
const trecho = (t, ini, fim) => limitar((t - ini) / (fim - ini));

function botaoTutorial(ctx, x, y, l, a, cor, base, rotulo, icone, apertado) {
  ctx.save();
  ctx.translate(0, apertado ? 4 : 0);
  ctx.beginPath();
  ctx.roundRect(x, y + 6, l, a, a * 0.22);
  ctx.fillStyle = base;
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x, y, l, a, a * 0.22);
  ctx.fillStyle = cor;
  ctx.fill();
  const lado = a * 0.34;
  if (icone === 'dado') desenharIconeDado(ctx, x + l / 2, y + a * 0.36, lado, cor);
  else desenharIconeCerto(ctx, x + l / 2, y + a * 0.36, lado);
  escrever(ctx, rotulo, x + l / 2, y + a * 0.76, Math.round(a * 0.17), '#FFFFFF');
  ctx.restore();
}

/**
 * Passo 1 — "o dado diz quantas casas o foguete anda", nos três níveis.
 *
 * Três rodadas de 3 s, uma por nível, cada uma com a mesma linha do tempo:
 *   0,2–0,45 o dedo toca ROLAR · 0,5–1,1 os dados rolam · 1,1 o resultado
 *   aparece ("3 CASAS") · a partir de 1,25 o foguete anda UMA casa por vez
 *   (0,22 s cada) · 2,55–3,0 some, e a próxima rodada começa da largada.
 * A pista aqui é mais curta (cabe dois dados e o botão à direita).
 */
const RODADAS_PASSO1 = [
  { nivel: 'FÁCIL', dados: [3], op: '', casas: 3 },
  { nivel: 'MÉDIO', dados: [2, 3], op: '+', casas: 5 },
  { nivel: 'DIFÍCIL', dados: [5, 2], op: '−', casas: 3 },
];

function desenharPasso1(ctx, l, a, t, imagem) {
  const CASAS = 8;
  const casaL = Math.min((l * 0.44) / (CASAS + 3.3), (a * 0.84) / 2.4);
  const pistaA = casaL * 1.55;
  const x0 = l * 0.03 + casaL * 3;
  const yPista = (a - pistaA) / 2 + casaL * 0.35;
  const casaX = (k) => (k <= 0 ? x0 - casaL * 1.1 : x0 + (k - 0.5) * casaL);
  const escalaFoguete = (casaL * 2.5) / FOGUETE_COMPRIMENTO;

  const DURACAO = 3;
  const ciclo = DURACAO * RODADAS_PASSO1.length;
  const tg = ((t % ciclo) + ciclo) % ciclo;
  const rodada = RODADAS_PASSO1[Math.floor(tg / DURACAO)];
  const tc = tg % DURACAO;

  // Pista e foguete andando casa por casa.
  desenharPista(ctx, x0, yPista, casaL, pistaA, CASAS, { time: 0, destacar: true });
  desenharChegada(ctx, x0 + CASAS * casaL, yPista - 4, casaL * 0.45, pistaA + 8, Math.max(4, casaL * 0.15));
  let casa = 0;
  for (let k = 0; k < rodada.casas; k++) casa += suave(trecho(tc, 1.25 + k * 0.22, 1.25 + k * 0.22 + 0.18));
  ctx.save();
  ctx.globalAlpha = Math.min(trecho(tc, 0, 0.3), 1 - trecho(tc, DURACAO - 0.45, DURACAO));
  desenharFoguete(ctx, casaX(casa), yPista + pistaA / 2, escalaFoguete, 0, Math.round(casa), false, imagem);
  const andou = Math.round(casa);
  if (andou > 0) desenharBalao(ctx, casaX(casa), yPista - 4, andou, casaL * 0.42);
  ctx.restore();

  // Dados no meio da área da direita, com o nível em cima e o resultado embaixo.
  const tam = Math.min(a * 0.32, 86);
  const cx = l * 0.66;
  const cy = a / 2;
  const rolando = tc >= 0.5 && tc < 1.1;
  const face = (i) => (rolando ? 1 + ((Math.floor(tc * 9) + i * 2) % 6) : rodada.dados[i]);
  const giro = rolando ? Math.sin(tc * 20) * 0.18 : 0;
  escrever(ctx, rodada.nivel, cx, cy - tam / 2 - 20, Math.round(tam * 0.24), CORES.tinta);
  if (tc < 0.5) {
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(30, 27, 75, 0.25)';
    const n = rodada.dados.length;
    const xs = n === 1 ? [cx] : [cx - tam * 0.72, cx + tam * 0.72];
    for (const x of xs) {
      ctx.beginPath();
      ctx.roundRect(x - tam / 2, cy - tam / 2, tam, tam, tam * 0.17);
      ctx.stroke();
    }
    ctx.restore();
  } else if (rodada.dados.length === 1) {
    desenharDado(ctx, cx, cy, tam, face(0), CORES.azulForte, giro);
  } else {
    desenharDado(ctx, cx - tam * 0.72, cy, tam, face(0), CORES.azulForte, giro);
    desenharDado(ctx, cx + tam * 0.72, cy, tam, face(1), CORES.azulForte, -giro);
    escrever(ctx, rodada.op, cx, cy, Math.round(tam * 0.5), CORES.tinta);
  }
  if (tc >= 1.1) {
    ctx.save();
    ctx.globalAlpha = trecho(tc, 1.1, 1.3);
    escrever(ctx, `${rodada.casas} CASAS`, cx, cy + tam / 2 + 22, Math.round(tam * 0.26), CORES.azulForte);
    ctx.restore();
  }

  // Botão ROLAR e o dedo tocando nele no começo de cada rodada.
  const botaoA = Math.min(a * 0.42, 112);
  const botaoL = botaoA * 1.15;
  const botaoX = l * 0.9 - botaoL / 2;
  const botaoY = a / 2 - botaoA / 2;
  const apertado = tc > 0.2 && tc < 0.45;
  botaoTutorial(ctx, botaoX, botaoY, botaoL, botaoA, '#4F46E5', '#312E81', 'ROLAR', 'dado', apertado);
  const alfa = Math.min(trecho(tc, 0, 0.15), 1 - trecho(tc, 0.7, 0.95));
  if (alfa > 0) desenharDedo(ctx, botaoX + botaoL * 0.7, botaoY + botaoA * 0.55 + (apertado ? 5 : 0), botaoA * 0.9, alfa);
  desenharOndaToque(ctx, botaoX + botaoL * 0.7, botaoY + botaoA * 0.55, botaoA * 0.6, trecho(tc, 0.2, 0.9));
}

function desenharCenaTutorial(ctx, l, a, passo, t, imagem = null) {
  if (passo === 1) {
    desenharPasso1(ctx, l, a, t, imagem);
    return;
  }
  // A área do tutorial é larga e baixa (980 × 268 na tela de 1280 × 720):
  // pista à esquerda, ocupando a altura; dado e botão à direita, lado a lado.
  const CASAS = 8;
  const duasPistas = passo === 4;
  const alturaUtil = a * 0.84;
  const casaL = Math.min((l * 0.6) / (CASAS + 3.3), alturaUtil / (duasPistas ? 3.6 : 2.4));
  const pistaA = casaL * 1.55;
  // A chama da arte vai ~1,7 casa atrás da janelinha: a largada precisa dessa folga.
  const x0 = l * 0.04 + casaL * 3;
  const bloco = duasPistas ? pistaA * 2 + casaL * 0.5 : pistaA;
  const yAzul = (a - bloco) / 2 + (duasPistas ? 0 : casaL * 0.35);
  const yLaranja = yAzul + pistaA + casaL * 0.5;
  const casaX = (k) => (k <= 0 ? x0 - casaL * 1.1 : x0 + (k - 0.5) * casaL);
  const escalaFoguete = (casaL * 2.5) / FOGUETE_COMPRIMENTO;
  const ciclo = passo === 4 ? 6 : 4.6;
  const tc = ((t % ciclo) + ciclo) % ciclo;

  // À direita: o dado e o botão do passo.
  const dadoTam = Math.min(casaL * 1.9, a * 0.42);
  const dadoX = l * 0.75;
  const dadoY = a / 2;
  const botaoA = Math.min(dadoTam * 1.15, a * 0.5);
  const botaoL = botaoA * 1.15;
  const botaoX = l * 0.9 - botaoL / 2;
  const botaoY = a / 2 - botaoA / 2;

  ctx.save();

  // Pistas.
  desenharPista(ctx, x0, yAzul, casaL, pistaA, CASAS, { time: 0, destacar: true, anel: passo === 4 && tc > 1.1 ? 5 : 0 });
  desenharChegada(ctx, x0 + CASAS * casaL, yAzul - 4, casaL * 0.45, (passo === 4 ? yLaranja + pistaA : yAzul + pistaA) - yAzul + 8, Math.max(4, casaL * 0.15));
  if (passo === 4) desenharPista(ctx, x0, yLaranja, casaL, pistaA, CASAS, { time: 1, destacar: true });

  // Onde está o foguete azul nesta cena.
  let casaAzul = 2;
  let balao = 0;
  let xAzul = casaX(2);
  if (passo === 2) {
    const passos = [0.8, 1.6, 2.4].filter((m) => tc >= m).length;
    const anda = passos === 0 ? 0 : suave(trecho(tc, [0.8, 1.6, 2.4][passos - 1], [0.8, 1.6, 2.4][passos - 1] + 0.25));
    xAzul = casaX(2 + passos - 1 + anda);
    if (passos === 0) xAzul = casaX(2);
    casaAzul = 2 + passos;
    balao = passos;
  } else if (passo === 3) {
    const k = suave(trecho(tc, 0.9, 2.3));
    xAzul = casaX(2) + (casaX(5) - casaX(2)) * k;
    casaAzul = Math.round(2 + 3 * k);
    balao = casaAzul - 2;
  } else if (passo === 4) {
    xAzul = casaX(5);
    casaAzul = 5;
  }
  // A volta do ciclo: o foguete que ANDA nesta cena some devagar no fim e
  // reaparece na casa de partida, em vez de saltar de volta (5 → 2, 5 → 3) num
  // quadro só — era o "foguete pulando" visto no tutorial.
  const alfaVolta = Math.min(trecho(tc, 0, 0.35), 1 - trecho(tc, ciclo - 0.45, ciclo));
  const brilho = passo === 2 || passo === 3;
  ctx.save();
  if (brilho) ctx.globalAlpha = alfaVolta;
  desenharFoguete(ctx, xAzul, yAzul + pistaA / 2, escalaFoguete, 0, casaAzul, brilho, imagem);
  if (balao > 0) desenharBalao(ctx, xAzul, yAzul - 4, balao, casaL * 0.42);
  ctx.restore();

  // Passo 4, uma linha do tempo só (ciclo de 6 s):
  //   0,5–0,8  o dedo aperta PRONTO · 1,0 anel na casa 5 (certo)
  //   1,6–2,3  vez do laranja: o dado fica laranja e rola · sai 2
  //   2,8 e 3,6  dois saltos de UMA casa cada (3 → 4 → 5), 0,4 s cada
  // Cada salto é uma rampa própria somada às anteriores: nada depende de
  // dois relógios andarem juntos (era o defeito da versão anterior).
  const SALTOS = [2.8, 3.6];
  const vezLaranja = passo === 4 && tc >= 1.6;
  if (passo === 4) {
    let casaLaranja = 3;
    for (const s of SALTOS) casaLaranja += suave(trecho(tc, s, s + 0.4));
    ctx.save();
    ctx.globalAlpha = alfaVolta;
    desenharFoguete(ctx, casaX(casaLaranja), yLaranja + pistaA / 2, escalaFoguete, 1, Math.round(casaLaranja), false, imagem);
    ctx.restore();
  }

  // Dados: rolando na vez do laranja (passo 4); parados no 3 nos outros.
  if (vezLaranja) {
    const rolando = tc < 2.3;
    const face = rolando ? 1 + (Math.floor(tc * 9) % 6) : 2;
    desenharDado(ctx, dadoX, dadoY, dadoTam, face, CORES.laranjaForte, rolando ? Math.sin(tc * 20) * 0.18 : 0);
  } else {
    desenharDado(ctx, dadoX, dadoY, dadoTam, 3, CORES.azulForte, 0);
  }

  // Botão e dedo.
  if (passo === 2) {
    const toques = [0.8, 1.6, 2.4];
    const alfa = Math.min(trecho(tc, 0.2, 0.5), 1 - trecho(tc, 3.0, 3.4));
    const batendo = toques.some((m) => tc > m - 0.15 && tc < m + 0.05);
    if (alfa > 0) desenharDedo(ctx, xAzul, yAzul + pistaA * 0.55 + (batendo ? 5 : 0), casaL * 1.6, alfa);
    for (const m of toques) desenharOndaToque(ctx, xAzul, yAzul + pistaA / 2, casaL, trecho(tc, m, m + 0.6));
  } else if (passo === 3) {
    const alfa = Math.min(trecho(tc, 0.2, 0.5), 1 - trecho(tc, 2.6, 3.0));
    if (alfa > 0) desenharDedo(ctx, xAzul, yAzul + pistaA * 0.6, casaL * 1.6, alfa);
  } else {
    const apertado = tc > 0.5 && tc < 0.8;
    // Na vez do laranja o PRONTO apaga, como na partida.
    ctx.save();
    ctx.globalAlpha = vezLaranja ? 0.4 : 1;
    botaoTutorial(ctx, botaoX, botaoY, botaoL, botaoA, '#22C55E', '#15803D', 'PRONTO', 'certo', apertado);
    ctx.restore();
    const alfa = Math.min(trecho(tc, 0, 0.2), 1 - trecho(tc, 1.1, 1.4));
    if (alfa > 0) desenharDedo(ctx, botaoX + botaoL * 0.7, botaoY + botaoA * 0.55 + (apertado ? 5 : 0), botaoA * 0.9, alfa);
    desenharOndaToque(ctx, botaoX + botaoL * 0.7, botaoY + botaoA * 0.55, botaoA * 0.6, trecho(tc, 0.5, 1.2));
  }

  ctx.restore();
}
