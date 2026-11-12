/**
 * desenho.js — o desenho do Cubra Nove, compartilhado pela partida e pelo tutorial.
 *
 * Funções puras de canvas (recebem `ctx` e coordenadas, não guardam estado), para que o tutorial — que
 * também é a AJUDA dentro da partida (regra RE-05) — mostre exatamente a mesma prancha, as mesmas casas,
 * o mesmo cubinho e os mesmos dados que a criança vê na partida.
 *
 * Nada aqui pisca: os anéis de destaque são estáveis; o anel verde do acerto e o coral do erro são
 * animados pela cena, uma vez só.
 */

/**
 * As cores da prancha do vídeo: uma casa de cada cor, de 1 a 9 (amarelo, verde-escuro, lilás, laranja,
 * rosa, vermelho, amarelo, verde e azul), números escuros (branco só no verde-escuro, para ler).
 */
export const CORES_CASA = ['', '#F4C430', '#1F6B45', '#A99AD6', '#F08A3C', '#E46FB0', '#E0503F', '#F2D02B', '#3FAE5A', '#6CB6E6'];
export const TINTA_CASA = ['', '#1A1A1A', '#FFFFFF', '#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A', '#1A1A1A'];

export const CORES = {
  prancha: '#FBF7F1',
  pranchaBorda: '#E2D6CA',
  divisoria: '#E3D3C8',
  tinta: '#2A1A1C',
  tintaSuave: '#6C5658',
  madeiraClara: '#E8CBA3',
  madeira: '#C99A62',
  madeiraLado: '#4B2F1B',
  madeiraTexto: 'rgba(80, 48, 20, 0.6)',
  dado: '#FFFFFF',
  dadoBorda: '#2A1A1C',
  /** A vez de quem joga: o contorno da fileira e o convite dos dados. */
  vez: '#2D6CB5',
  ok: '#2F8F5B',
  okFundo: '#DCEFE3',
  okTexto: '#1E6B42',
  erro: '#C8403F',
  erroFundo: '#FBE1DF',
  erroTexto: '#A02C25',
  dica: '#D98C00',
  dicaFundo: '#FFF3D6',
  dicaTexto: '#8A5A00',
  contaFundo: '#F4EFE9',
  contaBorda: '#D9CFC4',
  apagado: '#8C7A7B',
  chita: '#C8403F',
  ouro: '#B06F00',
};

export const FONTE = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

export function escrever(ctx, texto, x, y, tamanho, cor, alinhamento = 'center', peso = 800) {
  ctx.font = `${peso} ${tamanho}px ${FONTE}`;
  ctx.fillStyle = cor;
  ctx.textAlign = alinhamento;
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, x, y);
}

/** Quebra `texto` em linhas que caibam em `largura` com a fonte atual do `ctx`. */
export function quebrarLinhas(ctx, texto, largura) {
  const linhas = [];
  let atual = '';
  for (const palavra of texto.split(' ')) {
    const teste = atual ? `${atual} ${palavra}` : palavra;
    if (atual && ctx.measureText(teste).width > largura) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = teste;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

// ---------------------------------------------------------------------- prancha

/** A prancha branca do vídeo, com o canto de cima-esquerdo em (x, y). */
export function desenharPrancha(ctx, x, y, l, a) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = CORES.prancha;
  ctx.beginPath();
  ctx.roundRect(x, y, l, a, 22);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = CORES.pranchaBorda;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

/** Uma linha tracejada vertical, a divisória discreta entre os dados, as contas e o monte. */
export function desenharDivisoria(ctx, x, y1, y2) {
  ctx.save();
  ctx.strokeStyle = CORES.divisoria;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(x, y1);
  ctx.lineTo(x, y2);
  ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------- casas

/**
 * Uma casa da fileira, com o canto de cima-esquerdo em (0, 0): o quadrado colorido com o número.
 * `coberta` põe o cubinho de madeira por cima (com o número gravado); `fantasma` desenha só o contorno
 * tracejado de um cubinho (onde a peça esquecida do computador poderia estar).
 */
export function desenharCasa(ctx, lado, n, { coberta = false, fantasma = false } = {}) {
  ctx.save();
  ctx.fillStyle = CORES_CASA[n];
  ctx.beginPath();
  ctx.roundRect(0, 0, lado, lado, lado * 0.1);
  ctx.fill();
  escrever(ctx, String(n), lado / 2, lado / 2 + 2, Math.round(lado * 0.5), TINTA_CASA[n]);
  if (coberta) desenharCubo(ctx, lado / 2, lado * 0.46, lado * 0.46, n);
  else if (fantasma) desenharFantasma(ctx, lado / 2, lado * 0.46, lado * 0.46);
  ctx.restore();
}

/**
 * O cubinho de madeira do vídeo, centrado em (cx, cy): topo de madeira clara, laterais escuras (a
 * sombra de baixo e da direita) e, se vier `numero`, o número gravado de leve no topo. `erguido` (no
 * arrasto) dá uma sombra maior, de peça no ar.
 */
export function desenharCubo(ctx, cx, cy, lado, numero = null, erguido = false) {
  const x = cx - lado / 2;
  const y = cy - lado / 2;
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = erguido ? 16 : 6;
  ctx.shadowOffsetY = erguido ? 12 : 4;
  // A lateral escura: o mesmo quadrado, deslocado para baixo e para a direita.
  ctx.fillStyle = CORES.madeiraLado;
  ctx.beginPath();
  ctx.roundRect(x + lado * 0.05, y + lado * 0.12, lado, lado, lado * 0.08);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  const topo = ctx.createLinearGradient(x, y, x + lado, y + lado);
  topo.addColorStop(0, CORES.madeiraClara);
  topo.addColorStop(1, CORES.madeira);
  ctx.fillStyle = topo;
  ctx.beginPath();
  ctx.roundRect(x, y, lado, lado, lado * 0.08);
  ctx.fill();
  ctx.strokeStyle = 'rgba(90, 58, 30, 0.35)';
  ctx.lineWidth = Math.max(1, lado * 0.025);
  ctx.stroke();
  if (numero != null) escrever(ctx, String(numero), cx, cy + 1, Math.round(lado * 0.52), CORES.madeiraTexto);
  ctx.restore();
}

/** O contorno tracejado de um cubinho que não está lá: onde a peça esquecida poderia estar. */
export function desenharFantasma(ctx, cx, cy, lado) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.strokeStyle = 'rgba(42, 26, 28, 0.85)';
  ctx.lineWidth = Math.max(2, lado * 0.07);
  ctx.setLineDash([lado * 0.16, lado * 0.12]);
  ctx.beginPath();
  ctx.roundRect(cx - lado / 2, cy - lado / 2, lado, lado, lado * 0.08);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/**
 * O anel em volta de uma casa (coordenadas da casa): o verde que se abre e apaga no acerto, o coral do
 * erro, o azul estável da fileira de quem joga. `espessura` e `afastamento` em px; `alfa` 0..1.
 */
export function desenharAnel(ctx, lado, cor, alfa, espessura = 6, afastamento = 0) {
  if (alfa <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alfa;
  ctx.strokeStyle = cor;
  ctx.lineWidth = espessura;
  ctx.beginPath();
  const d = afastamento + espessura / 2;
  ctx.roundRect(-d, -d, lado + 2 * d, lado + 2 * d, lado * 0.1 + d);
  ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------- dados

/** Posição dos pontos de uma face na grade 3×3 (coluna, linha em -1, 0, 1). */
const PONTOS = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};

/**
 * Um dado branco de pontos pretos (os do vídeo), com o canto de cima-esquerdo em (0, 0). `estado`:
 *   'convida'  contorno azul estável (a hora de tocar e jogar);
 *   'feito'    contorno verde (o número dele foi coberto);
 *   'ja'       apagado e tracejado (o número dele já estava coberto);
 *   'dica'     contorno âmbar (2º degrau da ajuda: é este o que falta).
 */
export function desenharDado(ctx, lado, face, estado = null) {
  ctx.save();
  if (estado === 'ja') ctx.globalAlpha *= 0.42;
  const anel = { convida: CORES.vez, feito: CORES.ok, dica: CORES.dica }[estado];
  if (anel) {
    ctx.save();
    ctx.strokeStyle = anel;
    ctx.globalAlpha *= 0.5;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.roundRect(-7, -7, lado + 14, lado + 14, lado * 0.24);
    ctx.stroke();
    ctx.restore();
  }
  ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
  ctx.shadowBlur = lado * 0.1;
  ctx.shadowOffsetY = lado * 0.05;
  ctx.fillStyle = CORES.dado;
  ctx.beginPath();
  ctx.roundRect(0, 0, lado, lado, lado * 0.18);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = anel ?? CORES.dadoBorda;
  ctx.lineWidth = Math.max(3, lado * 0.045);
  if (estado === 'ja') ctx.setLineDash([lado * 0.1, lado * 0.08]);
  ctx.stroke();
  ctx.setLineDash([]);
  if (face > 0) {
    const pad = lado * 0.22;
    const passo = (lado - pad * 2) / 2;
    ctx.fillStyle = CORES.dadoBorda;
    for (const [c, l] of PONTOS[face] ?? []) {
      ctx.beginPath();
      ctx.arc(lado / 2 + c * passo, lado / 2 + l * passo, lado * 0.085, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

// ------------------------------------------------------------------------ contas

/**
 * Uma conta em destaque ("5 + 4 = 9", ou "5 − 4 = ?"), centrada em (cx, cy). Mede o texto e desenha a
 * caixa em volta. `estado`: 'feito' (verde: a casa foi coberta), 'ja' (tracejada e apagada: a casa já
 * estava coberta), 'nao' (riscada: não cabe — soma acima de 9 ou diferença 0), 'dica' (âmbar) ou null.
 * Devolve a largura da caixa.
 */
export function desenharConta(ctx, texto, cx, cy, estado = null, tamanho = 44) {
  ctx.save();
  ctx.font = `800 ${tamanho}px ${FONTE}`;
  const w = ctx.measureText(texto).width + tamanho * 0.9;
  const h = tamanho * 1.6;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const fundo = estado === 'feito' ? CORES.okFundo : estado === 'dica' ? CORES.dicaFundo : CORES.contaFundo;
  const borda = estado === 'feito' ? CORES.ok : estado === 'dica' ? CORES.dica : CORES.contaBorda;
  if (estado === 'dica') {
    ctx.shadowColor = 'rgba(217, 140, 0, 0.55)';
    ctx.shadowBlur = 18;
  }
  ctx.fillStyle = fundo;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 16);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = borda;
  ctx.lineWidth = 4;
  if (estado === 'ja') ctx.setLineDash([12, 9]);
  ctx.stroke();
  ctx.setLineDash([]);
  const apagada = estado === 'ja' || estado === 'nao';
  escrever(ctx, texto, cx, cy + 2, tamanho, apagada ? CORES.apagado : CORES.tinta);
  if (estado === 'nao') {
    ctx.strokeStyle = CORES.apagado;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + tamanho * 0.35, cy + 2);
    ctx.lineTo(x + w - tamanho * 0.35, cy + 2);
    ctx.stroke();
  }
  ctx.restore();
  return w;
}

// ------------------------------------------------------------------------- monte

/** As posições (fração do lado) e o giro dos cubinhos do monte: um amontoado, como o do vídeo. */
const MONTE = [[0.06, 0.6, -6], [0.36, 0.66, 4], [0.66, 0.56, -3], [0.16, 0.3, 7], [0.48, 0.34, -5], [0.3, 0.04, 3], [0.66, 0.1, -8]];

/**
 * O monte de cubinhos, com o canto de cima-esquerdo em (0, 0) e lado `lado`. Com `badge` > 0, uma
 * bolinha laranja no canto diz quantas peças ainda faltam pôr (1º degrau da ajuda).
 */
export function desenharMonte(ctx, lado, badge = 0) {
  const c = lado * 0.3;
  for (const [fx, fy, giro] of MONTE) {
    ctx.save();
    ctx.translate(fx * lado + c / 2, fy * lado + c / 2);
    ctx.rotate((giro * Math.PI) / 180);
    desenharCubo(ctx, 0, 0, c);
    ctx.restore();
  }
  if (badge > 0) {
    const r = lado * 0.17;
    const bx = lado - r * 0.4;
    const by = r * 0.2;
    ctx.save();
    ctx.fillStyle = CORES.dica;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    escrever(ctx, String(badge), bx, by + 2, Math.round(r * 1.3), '#FFFFFF');
    ctx.restore();
  }
}

// ------------------------------------------------------------- o gesto do toque

/** Para onde o dedinho aponta (o giro em torno da ponta): a mão fica do lado OPOSTO. */
export const APONTA = { cima: Math.PI, baixo: 0, esquerda: Math.PI / 2, direita: -Math.PI / 2 };

/**
 * O dedinho branco da coleção (o mesmo do Cabo de Guerra, da Corrida Maluca e do Dominó). A ponta fica
 * em (cx, yPonta) e `angulo` (ver `APONTA`) diz para onde ele aponta. Escolha a direção em que a mão cai
 * num espaço LIVRE: a mão nunca pode ficar atrás de outro elemento nem sair da área desenhada.
 */
export function desenharDedo(ctx, cx, yPonta, h, alfa = 1, angulo = APONTA.cima) {
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
  ctx.globalAlpha *= alfa;
  // O desenho original aponta para BAIXO (a mão em cima); gira em torno da ponta para a direção pedida.
  ctx.translate(cx, yPonta);
  ctx.rotate(angulo);
  ctx.translate(-cx, -yPonta);
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3; // o deslocamento da sombra não gira com o desenho: continua para baixo na tela
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

export function desenharOndaToque(ctx, x, y, raio, d, cor = '45, 108, 181') {
  if (d <= 0 || d >= 1) return;
  ctx.save();
  ctx.strokeStyle = `rgba(${cor}, ${1 - d})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, raio * (0.4 + d * 0.9), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
