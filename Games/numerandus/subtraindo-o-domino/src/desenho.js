/**
 * desenho.js — o desenho do Subtraindo o Dominó, compartilhado pela partida e
 * pelo tutorial.
 *
 * Funções puras de canvas (recebem `ctx` e coordenadas, não guardam estado),
 * para que o tutorial — que também é a AJUDA dentro da partida (regra RE-05) —
 * mostre exatamente as mesmas pedras e os mesmos dados que a criança vai tocar,
 * sem importar a cena.
 *
 * Nada aqui pisca: o contorno de uma pedra marcada é estável, e a onda que se
 * abre no toque acontece uma vez só.
 */

/**
 * As cores: pedras de marfim com pontos de tinta escura sobre o feltro; a
 * criança é dourada e o computador é azul-acinzentado (o anel e o selo de cada
 * um; a bandeja de cada um tem o ícone de quem é).
 */
export const CORES = {
  peca: '#F4F1E8',
  pecaBorda: '#C9C3B1',
  pip: '#1B212B',
  ouro: '#F5B83D',
  ouroEscuro: '#B8860B',
  ok: '#22C55E',
  okEscuro: '#15803D',
  /** Texto sobre o verde do PRONTO e do ✓: 6,5:1 (o branco dava 2,3:1). */
  sobreOk: '#052E16',
  erro: '#EF4444',
  crianca: '#F5B83D',
  computador: '#7C93B8',
  /**
   * Os dados são AZUIS com bolinhas brancas (5,5:1), para se destacarem das pedras de marfim. O azul é vivo e
   * saturado, bem longe do azul-acinzentado do computador (1,8:1 entre os dois); contra o feltro escuro ele dá
   * só 2,3:1, por isso o dado leva um contorno claro.
   */
  dado: '#2F5BEA',
  dadoBase: '#1E3FB0',
  dadoContorno: '#BFD0FF',
  dadoPip: '#FFFFFF',
  tinta: '#E7EBF2',
  tintaSuave: '#9AA8BA',
  bandeja: 'rgba(255, 255, 255, 0.06)',
  bandejaBorda: 'rgba(255, 255, 255, 0.14)',
  vaga: 'rgba(255, 255, 255, 0.2)',
};

const FONTE = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

export function escrever(ctx, texto, x, y, tamanho, cor, alinhamento = 'center', peso = 800) {
  ctx.font = `${peso} ${tamanho}px ${FONTE}`;
  ctx.fillStyle = cor;
  ctx.textAlign = alinhamento;
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, x, y);
}

/** Posição dos pontos de uma face na grade 3×3 (coluna, linha em -1, 0, 1). */
const PONTOS = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};

/** Os pontos de uma face num quadrado de lado `lado` com canto em (x, y). */
function pontosDaFace(ctx, n, x, y, lado, raio, cor = CORES.pip) {
  const pad = lado * 0.17;
  const passo = (lado - pad * 2) / 2;
  ctx.fillStyle = cor;
  for (const [c, l] of PONTOS[n] ?? []) {
    ctx.beginPath();
    ctx.arc(x + lado / 2 + c * passo, y + lado / 2 + l * passo, raio, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Uma pedra de dominó deitada, com o canto de cima-esquerdo em (0, 0).
 * `op.alg` escreve os algarismos no lugar dos pontos (nível Difícil).
 */
export function desenharPeca(ctx, a, b, op = {}) {
  const w = op.w ?? 128;
  const h = op.h ?? 64;
  const r = h * 0.2;
  ctx.save();
  if (!op.semSombra) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.32)';
    ctx.shadowBlur = h * 0.2;
    ctx.shadowOffsetY = h * 0.08;
  }
  ctx.fillStyle = CORES.pecaBorda;
  ctx.beginPath();
  ctx.roundRect(0, h * 0.06, w, h, r);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = CORES.peca;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, r);
  ctx.fill();
  ctx.strokeStyle = CORES.pecaBorda;
  ctx.lineWidth = Math.max(1.5, h * 0.03);
  ctx.stroke();
  ctx.fillStyle = CORES.pecaBorda;
  ctx.beginPath();
  ctx.roundRect(w / 2 - h * 0.02, h * 0.16, h * 0.04, h * 0.68, h * 0.02);
  ctx.fill();
  const meia = w / 2;
  [[a, 0], [b, meia]].forEach(([n, x0]) => {
    if (op.alg) escrever(ctx, String(n), x0 + meia / 2, h * 0.53, h * 0.56, CORES.pip);
    else pontosDaFace(ctx, n, x0 + (meia - h) / 2, 0, h, h * 0.085);
  });
  ctx.restore();
}

/**
 * Um dado, com o canto de cima-esquerdo em (0, 0): azul com bolinhas brancas e um contorno claro, para
 * não se confundir com as pedras de marfim. `face` 0 desenha o "?" de antes de jogar.
 */
export function desenharDado(ctx, lado, face) {
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = lado * 0.14;
  ctx.shadowOffsetY = lado * 0.06;
  ctx.fillStyle = CORES.dadoBase;
  ctx.beginPath();
  ctx.roundRect(0, lado * 0.05, lado, lado, lado * 0.2);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = CORES.dado;
  ctx.beginPath();
  ctx.roundRect(0, 0, lado, lado, lado * 0.2);
  ctx.fill();
  ctx.strokeStyle = CORES.dadoContorno;
  ctx.lineWidth = Math.max(2, lado * 0.035);
  ctx.stroke();
  if (face > 0) pontosDaFace(ctx, face, 0, 0, lado, lado * 0.078, CORES.dadoPip);
  else escrever(ctx, '?', lado / 2, lado * 0.54, lado * 0.52, 'rgba(255, 255, 255, 0.82)');
  ctx.restore();
}

/** O visto (✓) ou o xis (✕) sobre uma pedra: círculo de `r` de raio centrado em (cx, cy). */
export function desenharSinalPeca(ctx, tipo, cx, cy, r, escala = 1) {
  if (escala <= 0) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(escala, escala);
  ctx.fillStyle = tipo === 'ok' ? CORES.ok : CORES.erro;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = tipo === 'ok' ? CORES.sobreOk : '#FFFFFF';
  ctx.lineWidth = r * 0.26;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  if (tipo === 'ok') {
    ctx.moveTo(-r * 0.42, r * 0.02);
    ctx.lineTo(-r * 0.1, r * 0.34);
    ctx.lineTo(r * 0.46, -r * 0.34);
  } else {
    ctx.moveTo(-r * 0.36, -r * 0.36);
    ctx.lineTo(r * 0.36, r * 0.36);
    ctx.moveTo(r * 0.36, -r * 0.36);
    ctx.lineTo(-r * 0.36, r * 0.36);
  }
  ctx.stroke();
  ctx.restore();
}

/** O contorno de uma estrela de cinco pontas, centrada em (cx, cy). */
function tracarEstrela(ctx, cx, cy, rExterno, rInterno = rExterno * 0.42) {
  ctx.beginPath();
  for (let k = 0; k < 10; k++) {
    const r = k % 2 === 0 ? rExterno : rInterno;
    const ang = (k * Math.PI) / 5 - Math.PI / 2;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/**
 * O marcador de uma rodada, no alto: sem dono (quem vence é quem tem mais pedras). Vazio, de
 * agora (contorno dourado), feito (cheio, claro) ou decisivo (a estrela dourada do desempate).
 * @param {'vazia'|'feita'|'decisiva'} estado
 */
export function desenharMarcadorRodada(ctx, cx, cy, r, estado, atual = false) {
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2.5;
  if (estado === 'decisiva') {
    tracarEstrela(ctx, cx, cy, r * 1.1);
    ctx.fillStyle = CORES.ouro;
    ctx.strokeStyle = CORES.ouroEscuro;
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
    ctx.fillStyle = estado === 'feita' ? 'rgba(231, 235, 242, 0.85)' : 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = estado === 'feita' ? 'rgba(231, 235, 242, 0.95)' : 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
    ctx.stroke();
    if (atual && estado === 'vazia') {
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = CORES.ouro;
      ctx.stroke();
    }
  }
  ctx.restore();
}

/** Ícone da criança: uma pessoa (cabeça e ombros). */
function desenharIconePessoa(ctx, cx, cy, tam, cor) {
  ctx.save();
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.arc(cx, cy - tam * 0.2, tam * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - tam * 0.37, cy + tam * 0.42);
  ctx.bezierCurveTo(cx - tam * 0.37, cy + tam * 0.08, cx - tam * 0.2, cy + tam * 0.05, cx, cy + tam * 0.05);
  ctx.bezierCurveTo(cx + tam * 0.2, cy + tam * 0.05, cx + tam * 0.37, cy + tam * 0.08, cx + tam * 0.37, cy + tam * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Ícone do computador: um monitor no pé. */
function desenharIconeComputador(ctx, cx, cy, tam, cor) {
  ctx.save();
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.roundRect(cx - tam * 0.42, cy - tam * 0.38, tam * 0.84, tam * 0.56, tam * 0.08);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.roundRect(cx - tam * 0.32, cy - tam * 0.28, tam * 0.64, tam * 0.36, tam * 0.04);
  ctx.fill();
  ctx.strokeStyle = cor;
  ctx.lineWidth = tam * 0.1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy + tam * 0.2);
  ctx.lineTo(cx, cy + tam * 0.38);
  ctx.moveTo(cx - tam * 0.18, cy + tam * 0.4);
  ctx.lineTo(cx + tam * 0.18, cy + tam * 0.4);
  ctx.stroke();
  ctx.restore();
}

/** O ícone de quem: 'v' a criança, 'c' o computador. */
export function desenharIconeQuem(ctx, quem, cx, cy, tam, cor) {
  if (quem === 'c') desenharIconeComputador(ctx, cx, cy, tam, cor ?? CORES.computador);
  else desenharIconePessoa(ctx, cx, cy, tam, cor ?? CORES.crianca);
}

/** O visto do botão PRONTO. */
export function desenharIconeCerto(ctx, cx, cy, lado, cor = CORES.sobreOk) {
  ctx.save();
  ctx.strokeStyle = cor;
  ctx.lineWidth = lado * 0.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - lado * 0.45, cy);
  ctx.lineTo(cx - lado * 0.13, cy + lado * 0.32);
  ctx.lineTo(cx + lado * 0.5, cy - lado * 0.36);
  ctx.stroke();
  ctx.restore();
}

/** O dedinho branco da coleção (o mesmo da Corrida Espacial e do Pratinho CDU). */
export function desenharDedo(ctx, cx, yPonta, h, alfa = 1) {
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

export function desenharOndaToque(ctx, x, y, raio, d) {
  if (d <= 0 || d >= 1) return;
  ctx.save();
  ctx.strokeStyle = `rgba(255, 255, 255, ${1 - d})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, raio * (0.4 + d * 0.9), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
