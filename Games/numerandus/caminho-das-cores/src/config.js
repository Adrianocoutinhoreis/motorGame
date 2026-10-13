/**
 * config.js — o "formulário" do jogo Caminho das Cores.
 *
 * Baseado no vídeo do brinquedo físico (`assets/`, material de referência,
 * fora do pacote): uma prancha com as peças soltas num monte em cima, uma
 * ripa com uma abertura à esquerda, um corredor e 5 trilhas; um cartão de
 * papel mostra o que vai em cada trilha, de baixo pra cima. As peças são
 * 5 cores × 4 formas, cada combinação uma vez só, sem peça sobrando.
 *
 * A criança toca na peça e depois na trilha (no Fácil, também pode
 * arrastar) e a peça percorre o caminho sozinha: sai pela abertura, corre o
 * corredor e desce até o fundo. Nada é validado no encaixe; CONFIRMAR acende
 * com as 5 trilhas cheias e compara tudo com o cartão. Ver a doc da classe
 * em `scenes/GameScene.js` pra ajuda em degraus depois de um erro.
 *
 * Sem mascote (decisão do humano para este jogo).
 *
 * Leia junto: docs/METODO-JOGOS-NUMERANDUS.md, docs/CONTRATO-AVA.md e
 * docs/REGRAS-EDUCACIONAIS.md
 */
export default {
  // ------------------------------------------------------------- identidade
  slug: 'caminho-das-cores',
  titulo: 'Caminho das Cores',
  subtitulo: 'Copie o cartão nas trilhas',

  objetivo: 'Comparar formato e cor com um cartão de referência e reproduzir a mesma '
    + 'sequência de peças em cada trilha, respeitando a ordem.',
  faixaEtaria: '4 a 7 anos',

  // -------------------------------------------------------------- exibição
  // Decidido UMA VEZ, no carregamento (o motor só lê `largura`/`altura` ao
  // criar o `Stage`). Tela deitada (computador): paisagem, cartão AO LADO do
  // tabuleiro. Tela em pé (celular): retrato, cartão EM CIMA. O tabuleiro é
  // sempre vertical, como o brinquedo.
  ...(typeof window !== 'undefined' && window.innerWidth > window.innerHeight * 1.05
    ? { largura: 1280, altura: 800 }
    : { largura: 720, altura: 1280 }),
  corLetterbox: '#241A33',

  // Tema próprio ('trilhas', ver `engine/ui/Background.js`): peças subindo
  // pelas margens e a beirada da prancha no rodapé. Vale pras telas de
  // vitrine (menu, níveis, tutorial, resultado); a PARTIDA desliga as duas
  // coisas por conta própria (ver `scenes/GameScene.js`), porque ali as
  // peças são o exercício e o fundo precisa ficar liso.
  tema: 'trilhas',
  corCeuTopo: '#2E2150',
  corCeuBase: '#2E2150',
  mostrarDecoracoes: true,
  mostrarChao: true,

  /** Regra RE-01: todo texto exibido em CAIXA ALTA. */
  textoEmCaixaAlta: true,

  // ----------------------------------------------------------------- níveis
  /**
   * `trilhas` é sempre 5 (a prancha física). A dificuldade segue os cartões
   * do brinquedo:
   *   - `cartela: 'monocor'` — uma cor por trilha; o desafio é a ORDEM das
   *     formas (o cartão usado no vídeo);
   *   - `cartela: 'misturada'` — cores espalhadas pelas colunas; é preciso
   *     olhar cor e forma ao mesmo tempo (os outros cartões do vídeo).
   * `profundidade` é quantas peças cada trilha recebe (2 = 10 peças no
   * monte, 4 = as 20 do brinquedo). `meta` é quantos cartões o nível pede.
 * `arrastar: true` libera, além do toque, arrastar a peça até a trilha — só
 * no Fácil; nos outros níveis um arrasto só escolhe a peça.
   */
  niveis: [
    {
      id: 1, nome: 'Fácil', descricao: 'Uma cor', amostra: '2 peças', cor: '#16A34A',
      meta: 3, trilhas: 5, profundidade: 2, cartela: 'monocor', arrastar: true,
    },
    {
      id: 2, nome: 'Médio', descricao: 'Uma cor', amostra: '4 peças', cor: '#F59E0B',
      meta: 3, trilhas: 5, profundidade: 4, cartela: 'monocor',
    },
    {
      id: 3, nome: 'Difícil', descricao: 'Misturadas', amostra: '4 peças', cor: '#DC2626',
      meta: 3, trilhas: 5, profundidade: 4, cartela: 'misturada',
    },
  ],

  // --------------------------------------------------------------- tutorial
  /**
   * 4 passos, servindo ao "COMO JOGAR" do menu e à AJUDA dentro da partida
   * (regra RE-05). Cada passo tem a própria narração (`fala` aponta pro `id` do asset).
   */
  tutorial: [
    {
      titulo: 'Olhe o cartão',
      fala: 'tutorialTela1',
      texto: 'Cada coluna do cartão é uma trilha. Ela mostra a cor e a forma de cada peça, de baixo para cima.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 1, t }),
    },
    {
      titulo: 'Toque na peça e na trilha',
      fala: 'tutorialTela2',
      texto: 'Toque na peça que você quer e depois na trilha. A peça passa pela abertura e desce sozinha.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 2, t }),
    },
    {
      titulo: 'Quer trocar? Toque na peça',
      fala: 'tutorialTela3',
      texto: 'Escolheu a peça errada? Toque nela, na trilha, e ela volta para o monte. Só a peça de cima pode sair.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 3, t }),
    },
    {
      titulo: 'Toque em CONFIRMAR',
      fala: 'tutorialTela4',
      texto: 'Com as trilhas cheias, toque em CONFIRMAR. Se uma peça estiver fora do lugar, ela pisca para você trocar.',
      desenho: (ctx, l, a, t) => desenharCenaTutorial(ctx, l, a, { passo: 4, t }),
    },
  ],

  // ------------------------------------------------------------------ áudio
  /**
   * `soltarPeca` toca quando a peça chega ao fundo da trilha; `somErro` no
   * CONFIRMAR errado; `somProgresso` (o brilho da estrela, o mesmo do
   * Material Dourado) a cada cartão certo; `acertoSOS` só na tela final.
   */
  assets: [
    { id: 'acertoSOS', src: './assets/audio/acertoSOS.wav' },
    { id: 'soltarPeca', src: './assets/audio/soltar_peca.mp3' },
    { id: 'somErro', src: './assets/audio/error.MP3' },
    { id: 'somProgresso', src: './assets/audio/progresso.mp3' },
    // Narração do tutorial: o id bate com o `fala` de cada passo.
    { id: 'tutorialTela1', src: './assets/audio/tutorial/Tela001.wav' },
    { id: 'tutorialTela2', src: './assets/audio/tutorial/tela02.wav' },
    { id: 'tutorialTela3', src: './assets/audio/tutorial/tela03.wav' },
    { id: 'tutorialTela4', src: './assets/audio/tutorial/tela04.wav' },
  ],

  mascote: { telas: [] },

  audio: {
    musica: null,
    clique: null,
    acerto: 'soltarPeca',
    erro: 'somErro',
    vitoria: 'acertoSOS',
    progresso: 'somProgresso',
    derrota: null,
    abertura: null,
  },

  // -------------------------------------------------------------------- AVA
  /** Sem vidas, sem derrota — errar ao confirmar só demora mais. */
  registrarDerrota: false,

  /** RE-03: o placar conta CARTÕES completos. */
  unidadePlacar: { singular: 'cartão', plural: 'cartões' },
  /** Tela final só com as estrelas, sem a linha "3 CARTÕES" (pedido do humano). */
  mostrarPlacarTexto: false,

  mostrarTempo: true,
  /** Cronômetro CRESCENTE no HUD, como o do celular no vídeo. Só informativo. */
  mostrarCronometro: true,
};

// ---------------------------------------------------------------------------
// Desenho do tutorial — cópia pequena e independente do visual da partida
// (prancha de MDF com moldura e ripas brancas, abertura dourada, cartão com
// colunas numeradas, dedinho branco). Não importa a cena: o tutorial também
// é a AJUDA durante a partida e precisa funcionar sozinho.
// ---------------------------------------------------------------------------

const VERM = '#EF4444';
const LARA = '#F97316';
const VERD = '#22C55E';
const AMAR = '#FACC15';
const AZUL = '#3B82F6';
const DOURADO = '#E0AB1B';
const RIPA = '#F4EFE6';

const suave = (x) => x * x * (3 - 2 * x);
const limitar = (x) => Math.max(0, Math.min(1, x));
/** Progresso de 0 a 1 do tempo t dentro do intervalo [ini, fim]. */
const trecho = (t, ini, fim) => limitar((t - ini) / (fim - ini));

function tracarForma(ctx, forma, tam) {
  const m = tam / 2;
  ctx.beginPath();
  switch (forma) {
    case 'circulo':
      ctx.arc(0, 0, m * 0.92, 0, Math.PI * 2);
      break;
    case 'quadrado':
      ctx.roundRect(-m * 0.88, -m * 0.88, m * 1.76, m * 1.76, tam * 0.1);
      break;
    case 'triangulo':
      ctx.moveTo(0, -m * 0.92);
      ctx.lineTo(m * 0.94, m * 0.84);
      ctx.lineTo(-m * 0.94, m * 0.84);
      ctx.closePath();
      break;
    default: {
      const raio = m * 0.96;
      for (let i = 0; i < 5; i++) {
        const ang = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
        const x = raio * Math.cos(ang);
        const y = m * 0.08 + raio * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
  }
}

/** Peça centrada em (x, y). op: rotacao (graus), escala, alfa, elevada (sombra maior), brilho (halo amarelo). */
function peca(ctx, forma, cor, tam, x, y, op = {}) {
  const { rotacao = 0, escala = 1, alfa = 1, elevada = false, brilho = 0 } = op;
  ctx.save();
  ctx.globalAlpha = alfa;
  ctx.translate(x, y);
  ctx.rotate((rotacao * Math.PI) / 180);
  ctx.scale(escala, escala);
  if (brilho > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, tam * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(253, 224, 71, ' + (0.3 + brilho * 0.3) + ')';
    ctx.fill();
  }
  ctx.shadowColor = 'rgba(0,0,0,' + (elevada ? 0.45 : 0.3) + ')';
  ctx.shadowBlur = elevada ? tam * 0.25 : tam * 0.1;
  ctx.shadowOffsetY = elevada ? tam * 0.12 : tam * 0.05;
  tracarForma(ctx, forma, tam);
  ctx.fillStyle = cor;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.lineWidth = Math.max(1.2, tam * 0.025);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.stroke();
  ctx.restore();
}

/** Anel de retorno em volta de uma peça: verde (acerto) ou tracejado branco (fora do lugar). */
function anel(ctx, x, y, raio, tipo, t) {
  ctx.save();
  ctx.lineWidth = Math.max(2.5, raio * 0.12);
  ctx.beginPath();
  ctx.arc(x, y, raio, 0, Math.PI * 2);
  if (tipo === 'ok') {
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.95)';
  } else {
    ctx.setLineDash([raio * 0.35, raio * 0.25]);
    ctx.lineDashOffset = -t * 20;
    ctx.strokeStyle = 'rgba(255, 255, 255, ' + (0.7 + 0.3 * Math.sin(t * 4)) + ')';
  }
  ctx.stroke();
  ctx.restore();
}

/** O dedinho branco da partida: indicador apontando pra BAIXO, ponta em (cx, yPonta), mão de altura h. */
function dedo(ctx, cx, yPonta, h, alfa = 1) {
  const partes = [
    [-0.12, -0.6, 0.24, 0.6, 0.12],
    [-0.16, -0.94, 0.62, 0.42, 0.13],
    [-0.3, -0.86, 0.22, 0.3, 0.1],
    [-0.06, -1.12, 0.46, 0.2, 0.05],
  ];
  const tracar = () => {
    ctx.beginPath();
    for (const [x, y, l, a, r] of partes) ctx.roundRect(cx + x * h, yPonta + y * h, l * h, a * h, r * h);
  };
  ctx.save();
  ctx.globalAlpha = alfa;
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  tracar();
  ctx.lineWidth = Math.max(3, h * 0.1);
  ctx.strokeStyle = 'rgba(31, 41, 55, 0.9)';
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  tracar();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.restore();
}

/** Onda de toque saindo de (x, y); d vai de 0 a 1. */
function ondaToque(ctx, x, y, raio, d) {
  if (d <= 0 || d >= 1) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, ' + (1 - d) + ')';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, raio * (0.4 + d * 0.9), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * A prancha: moldura branca, MDF, ripa horizontal com a abertura dourada à
 * esquerda, corredor e 3 trilhas numeradas. Devolve as medidas pra cena
 * posicionar as peças (tudo em coordenadas do canvas).
 */
function prancha(ctx, bx, by, bw, bh, destaqueTrilha = -1) {
  const mold = bh * 0.035;
  const x0 = bx + mold;
  const w0 = bw - mold * 2;
  const y0 = by + mold;
  const gap = bw * 0.035;
  const laneW = (w0 - gap * 2) / 3;
  const ripaH = bh * 0.035;
  const ripaY = by + bh * 0.4;
  const corredorY = ripaY + ripaH;
  const corredorH = bh * 0.12;
  const lanesTop = corredorY + corredorH;
  const numH = bh * 0.08;
  const lanesBottom = by + bh - mold - numH;
  const tam = Math.min(laneW * 0.78, (lanesBottom - lanesTop) / 2.4);
  const g = {
    bx, by, bw, bh, x0, w0, y0, laneW, gap, ripaY, ripaH, corredorY, corredorH, lanesTop, lanesBottom, numH, tam,
    laneX: (i) => x0 + i * (laneW + gap),
    laneCx: (i) => x0 + i * (laneW + gap) + laneW / 2,
    slotCy: (i) => lanesBottom - tam * 0.12 - tam / 2 - i * (tam * 1.1),
    corredorCy: corredorY + corredorH / 2,
    aberturaCx: x0 + laneW / 2,
  };

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = bh * 0.05;
  ctx.shadowOffsetY = bh * 0.02;
  ctx.fillStyle = RIPA;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 8);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  const grad = ctx.createLinearGradient(0, y0, 0, by + bh - mold);
  grad.addColorStop(0, '#C8A27A');
  grad.addColorStop(1, '#B48C63');
  ctx.fillStyle = grad;
  ctx.fillRect(x0, y0, w0, bh - mold * 2);

  // Ripa horizontal (da borda da abertura até a moldura direita).
  ctx.fillStyle = RIPA;
  ctx.fillRect(x0 + laneW, ripaY, w0 - laneW, ripaH);
  // Abertura: borda dourada tracejada.
  ctx.setLineDash([5, 4]);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = DOURADO;
  ctx.beginPath();
  ctx.moveTo(x0 + 2, ripaY + ripaH / 2);
  ctx.lineTo(x0 + laneW - 2, ripaY + ripaH / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  if (destaqueTrilha >= 0) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.roundRect(g.laneX(destaqueTrilha), lanesTop, laneW, lanesBottom - lanesTop, 6);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = DOURADO;
    ctx.stroke();
  }
  // Ripas verticais entre as trilhas.
  ctx.fillStyle = RIPA;
  for (let i = 1; i < 3; i++) ctx.fillRect(g.laneX(i) - gap, lanesTop, gap, lanesBottom - lanesTop);

  ctx.fillStyle = 'rgba(70, 45, 20, 0.75)';
  ctx.font = '800 ' + Math.round(numH * 0.7) + 'px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < 3; i++) ctx.fillText(String(i + 1), g.laneCx(i), lanesBottom + numH * 0.55);
  ctx.restore();
  return g;
}

/** Cartão de referência com 3 colunas, na mesma altura e com as mesmas medidas das trilhas de g. destaque: coluna acesa. */
function cartao(ctx, cx0, cw, g, colunas, destaque = -1) {
  const topo = g.lanesTop - g.tam * 0.12;
  const base = g.lanesBottom + g.numH;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(cx0, topo - g.numH * 0.4, cw, base - topo + g.numH * 0.4, 10);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  colunas.forEach((col, i) => {
    const x = cx0 + (g.laneX(i) - g.x0) + (cw - g.w0) / 2;
    ctx.beginPath();
    ctx.roundRect(x, topo - g.numH * 0.2, g.laneW, g.lanesBottom - topo + g.numH * 0.2 + 2, 6);
    if (destaque === i) { ctx.fillStyle = 'rgba(253, 224, 71, 0.5)'; ctx.fill(); }
    ctx.lineWidth = destaque === i ? 3 : 1.8;
    ctx.strokeStyle = destaque === i ? DOURADO : 'rgba(0,0,0,0.35)';
    ctx.stroke();
    col.forEach((cel, k) => peca(ctx, cel.forma, cel.cor, g.tam * 0.85, x + g.laneW / 2, g.slotCy(k)));
    ctx.fillStyle = 'rgba(31, 41, 55, 0.7)';
    ctx.font = '800 ' + Math.round(g.numH * 0.7) + 'px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), x + g.laneW / 2, g.lanesBottom + g.numH * 0.55);
  });
  ctx.restore();
}

// O cartão do exemplo: 3 colunas, 2 peças cada (de baixo pra cima).
const CARTAO = [
  [{ forma: 'quadrado', cor: VERM }, { forma: 'circulo', cor: VERM }],
  [{ forma: 'triangulo', cor: AZUL }, { forma: 'pentagono', cor: AZUL }],
  [{ forma: 'circulo', cor: VERD }, { forma: 'quadrado', cor: VERD }],
];

/** Peças soltas do monte (posições relativas à área do monte). */
const MONTE = [
  { forma: 'circulo', cor: AZUL, fx: 0.46, fy: 0.5, giro: -8 },
  { forma: 'triangulo', cor: AMAR, fx: 0.62, fy: 0.42, giro: 10 },
  { forma: 'quadrado', cor: LARA, fx: 0.78, fy: 0.55, giro: -5 },
  { forma: 'pentagono', cor: VERD, fx: 0.9, fy: 0.45, giro: 12 },
  { forma: 'triangulo', cor: VERM, fx: 0.55, fy: 0.72, giro: -12 },
];

function desenharMonte(ctx, g, ignorar = -1) {
  MONTE.forEach((m, i) => {
    if (i === ignorar) return;
    peca(ctx, m.forma, m.cor, g.tam * 0.8, g.x0 + g.w0 * m.fx, g.y0 + (g.ripaY - g.y0) * m.fy, { rotacao: m.giro });
  });
}

/** Posição ao longo de uma lista de pontos, k de 0 a 1, com velocidade uniforme. */
function percurso(pontos, k) {
  let total = 0;
  const seg = [];
  for (let i = 1; i < pontos.length; i++) {
    const d = Math.hypot(pontos[i].x - pontos[i - 1].x, pontos[i].y - pontos[i - 1].y);
    seg.push(d);
    total += d;
  }
  let alvo = k * total;
  for (let i = 0; i < seg.length; i++) {
    if (alvo <= seg[i] || i === seg.length - 1) {
      const f = seg[i] === 0 ? 1 : limitar(alvo / seg[i]);
      return { x: pontos[i].x + (pontos[i + 1].x - pontos[i].x) * f, y: pontos[i].y + (pontos[i + 1].y - pontos[i].y) * f };
    }
    alvo -= seg[i];
  }
  return pontos[pontos.length - 1];
}

function tracejado(ctx, pontos) {
  ctx.save();
  ctx.strokeStyle = 'rgba(224, 171, 27, 0.7)';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  pontos.forEach((pt, j) => (j === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
  ctx.stroke();
  ctx.restore();
}

function desenharCenaTutorial(ctx, l, a, opcoes = {}) {
  const { passo, t = 0 } = opcoes;
  ctx.save();
  const bh = a * 0.94;
  const by = (a - bh) / 2;

  if (passo === 1) {
    // Cartão à esquerda, prancha à direita; uma coluna de cada vez acende no
    // cartão e na trilha de mesmo número.
    const gapTotal = l * 0.06;
    const bw = Math.min(bh * 0.86, (l * 0.9 - gapTotal) / 2);
    const x0 = (l - (bw * 2 + gapTotal)) / 2;
    const col = Math.floor(t / 1.3) % 3;
    const g = prancha(ctx, x0 + bw + gapTotal, by, bw, bh, col);
    desenharMonte(ctx, g, -1);
    cartao(ctx, x0, bw, g, CARTAO, col);
  } else if (passo === 2) {
    // Toque na peça (ela brilha e pula), toque na trilha 2, e a peça faz o caminho.
    const bw = Math.min(bh * 0.86, l * 0.5);
    const g = prancha(ctx, (l - bw) / 2, by, bw, bh, -1);
    const ciclo = 5.4;
    const tc = ((t % ciclo) + ciclo) % ciclo;
    const idx = 0;
    const trilha = 1;
    const m = MONTE[idx];
    const p0 = { x: g.x0 + g.w0 * m.fx, y: g.y0 + (g.ripaY - g.y0) * m.fy };
    const sel = tc >= 0.7 && tc < 2.6;
    const tamPeca = g.tam * 0.8;

    const caminho = [
      p0,
      { x: g.aberturaCx, y: g.ripaY - g.tam * 0.3 },
      { x: g.aberturaCx, y: g.corredorCy },
      { x: g.laneCx(trilha), y: g.corredorCy },
      { x: g.laneCx(trilha), y: g.slotCy(0) },
    ];
    const k = suave(trecho(tc, 2.6, 4.2));
    const pos = percurso(caminho, k);

    // A trilha escolhida acende entre o 2º toque e a chegada.
    if (tc >= 2.0 && tc < 4.3) {
      ctx.fillStyle = 'rgba(253, 224, 71, 0.3)';
      ctx.beginPath();
      ctx.roundRect(g.laneX(trilha), g.lanesTop, g.laneW, g.lanesBottom - g.lanesTop, 6);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = DOURADO;
      ctx.stroke();
      ctx.fillStyle = RIPA;
      for (let i = 1; i < 3; i++) ctx.fillRect(g.laneX(i) - g.gap, g.lanesTop, g.gap, g.lanesBottom - g.lanesTop);
    }
    desenharMonte(ctx, g, idx);
    if (k > 0) tracejado(ctx, caminho);
    peca(ctx, m.forma, m.cor, tamPeca * (k > 0 ? 1.05 : 1), pos.x, pos.y - (sel && k === 0 ? Math.abs(Math.sin(t * 5)) * tamPeca * 0.1 : 0), {
      rotacao: m.giro * (1 - k), elevada: k > 0 && k < 1, brilho: sel && k === 0 ? 1 : 0, alfa: trecho(tc, 0, 0.25),
    });

    // O dedo: 1º toque na peça, depois vai até a trilha 2 e toca nela.
    const alvoDedo = { x: g.laneCx(trilha), y: g.lanesTop + g.tam * 0.6 };
    const mover = suave(trecho(tc, 1.3, 2.0));
    const dx = p0.x + (alvoDedo.x - p0.x) * mover;
    const dy = p0.y + (alvoDedo.y - p0.y) * mover;
    const alfaDedo = Math.min(trecho(tc, 0.2, 0.5), 1 - trecho(tc, 2.3, 2.7));
    const bate = (tc > 0.5 && tc < 0.9) || (tc > 2.0 && tc < 2.3) ? 5 : 0;
    if (alfaDedo > 0) dedo(ctx, dx, dy - tamPeca * 0.15 + bate, g.tam * 1.1, alfaDedo);
    ondaToque(ctx, p0.x, p0.y, g.tam * 0.5, trecho(tc, 0.5, 1.2));
    ondaToque(ctx, alvoDedo.x, alvoDedo.y, g.tam * 0.5, trecho(tc, 2.0, 2.7));
  } else if (passo === 3) {
    // Trilha 2 com duas peças; tocar na de cima faz ela voltar pro monte.
    const bw = Math.min(bh * 0.86, l * 0.5);
    const g = prancha(ctx, (l - bw) / 2, by, bw, bh, -1);
    const ciclo = 5.4;
    const tc = ((t % ciclo) + ciclo) % ciclo;
    const lane = 1;
    const tamPeca = g.tam * 0.8;
    const base = { forma: 'pentagono', cor: AZUL };
    const topo = { forma: 'circulo', cor: AMAR };
    const destino = { x: g.x0 + g.w0 * 0.62, y: g.y0 + (g.ripaY - g.y0) * 0.5 };

    const caminho = [
      { x: g.laneCx(lane), y: g.slotCy(1) },
      { x: g.laneCx(lane), y: g.corredorCy },
      { x: g.aberturaCx, y: g.corredorCy },
      { x: g.aberturaCx, y: g.ripaY - g.tam * 0.3 },
      destino,
    ];
    const k = suave(trecho(tc, 1.3, 3.1));
    const pos = percurso(caminho, k);

    desenharMonte(ctx, g, -1);
    peca(ctx, base.forma, base.cor, tamPeca, g.laneCx(lane), g.slotCy(0));
    if (k > 0) tracejado(ctx, caminho);
    peca(ctx, topo.forma, topo.cor, tamPeca, pos.x, pos.y, {
      rotacao: k * -10, elevada: k > 0 && k < 1, brilho: tc >= 0.9 && tc < 1.4 ? 1 : 0,
    });
    const alfaDedo = Math.min(trecho(tc, 0.2, 0.5), 1 - trecho(tc, 1.5, 1.9));
    const bate = tc > 0.7 && tc < 1.1 ? 5 : 0;
    if (alfaDedo > 0) dedo(ctx, g.laneCx(lane), g.slotCy(1) - tamPeca * 0.15 + bate, g.tam * 1.1, alfaDedo);
    ondaToque(ctx, g.laneCx(lane), g.slotCy(1), g.tam * 0.5, trecho(tc, 0.9, 1.6));
  } else {
    // Cartão à esquerda, prancha cheia no meio (a trilha 2 com as peças
    // trocadas) e o botão CONFIRMAR à direita; o dedo toca nele e as peças
    // ganham o retorno: anel verde nas certas, tracejado na errada.
    const gapTotal = l * 0.04;
    const botaoL = Math.min(l * 0.24, 200);
    const bw = Math.min(bh * 0.78, (l * 0.92 - botaoL - gapTotal * 2) / 2);
    const x0 = (l - (bw * 2 + botaoL + gapTotal * 2)) / 2;
    const g = prancha(ctx, x0 + bw + gapTotal, by, bw, bh, -1);
    cartao(ctx, x0, bw, g, CARTAO, -1);

    const cheio = [CARTAO[0], [CARTAO[1][1], CARTAO[1][0]], CARTAO[2]]; // a do meio está trocada
    const ciclo = 5;
    const tc = ((t % ciclo) + ciclo) % ciclo;
    const revelar = tc >= 1.3;
    cheio.forEach((col, i) => col.forEach((cel, k) => {
      const x = g.laneCx(i);
      const y = g.slotCy(k);
      peca(ctx, cel.forma, cel.cor, g.tam * 0.8, x, y);
      if (revelar) anel(ctx, x, y, g.tam * 0.52, i === 1 ? 'revisar' : 'ok', t);
    }));

    const bx = x0 + bw * 2 + gapTotal * 2;
    const bhBotao = Math.min(a * 0.2, 56);
    const byBotao = a / 2 - bhBotao / 2;
    const apertado = tc > 0.6 && tc < 1.3;
    ctx.save();
    ctx.translate(0, apertado ? 3 : 0);
    ctx.fillStyle = '#15803D';
    ctx.beginPath();
    ctx.roundRect(bx, byBotao + 4, botaoL, bhBotao, bhBotao / 2);
    ctx.fill();
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.roundRect(bx, byBotao, botaoL, bhBotao, bhBotao / 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 ' + Math.round(bhBotao * 0.38) + 'px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CONFIRMAR', bx + botaoL / 2, byBotao + bhBotao / 2 + 1);
    ctx.restore();

    const alfaDedo = Math.min(trecho(tc, 0.1, 0.4), 1 - trecho(tc, 1.4, 1.8));
    if (alfaDedo > 0) dedo(ctx, bx + botaoL * 0.82, byBotao + bhBotao * 0.7 + (apertado ? 5 : 0), bhBotao * 1.15, alfaDedo);
    ondaToque(ctx, bx + botaoL * 0.82, byBotao + bhBotao * 0.7, bhBotao * 0.8, trecho(tc, 0.6, 1.3));
  }

  ctx.restore();
}
