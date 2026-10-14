/**
 * desenho.js — o desenho da Corrida Espacial, compartilhado pela partida e
 * pelo tutorial.
 *
 * Funções puras de canvas (recebem `ctx` e coordenadas, não guardam estado),
 * para que o tutorial — que também é a AJUDA dentro da partida (regra RE-05) —
 * mostre exatamente o mesmo foguete, o mesmo dado e a mesma pista que a
 * criança vai tocar, sem importar a cena.
 *
 * Nada aqui pisca: brilho é halo estável, e a chama do foguete é parada.
 */

/** As cores do brinquedo: pista azul-clara da criança, laranja do computador. */
export const CORES = {
  azulPista: '#7DD3FC',
  azulNumero: '#0C2D48',
  azulForte: '#0284C7',
  laranjaPista: '#FB923C',
  laranjaNumero: '#431407',
  laranjaForte: '#EA580C',
  ajuda: 'rgba(250, 204, 21, 0.85)',
  ajudaAnel: '#FACC15',
  tinta: '#1E1B4B',
};

const FONTE = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

export function escrever(ctx, texto, x, y, tamanho, cor, alinhamento = 'center', peso = 800) {
  ctx.font = `${peso} ${tamanho}px ${FONTE}`;
  ctx.fillStyle = cor;
  ctx.textAlign = alinhamento;
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, x, y);
}

/**
 * A arte do foguete (`assets/img/foguete.png`, 269 × 440, em pé, bico para
 * cima), medida nos pixels: a janelinha é um FURO transparente, como o do
 * brinquedo, com centro em (134,5; 135) e aro externo de raio 48.
 * Recortada de `fontes/corrida-espacial/foguete-original.png` (988 × 1591).
 */
const ARTE = { largura: 269, altura: 440, janelaX: 134.5, janelaY: 135, aro: 48 };

/** Comprimento do foguete deitado, em px, na escala 1 (do fogo ao bico). */
export const FOGUETE_COMPRIMENTO = 137;

/**
 * O foguete, deitado e apontando para a direita. (cx, cy) é o centro da
 * JANELINHA — é ela que fica sobre a casa, mostrando o número.
 *
 * Com `imagem` (a arte do PNG), desenha a arte girada; sem ela (arquivo que
 * não carregou), cai no foguete vetorial abaixo, para o jogo nunca ficar sem
 * foguete. Nos dois casos a janelinha ganha um disco branco com o número e o
 * aro na cor do time — é o aro que distingue a criança (azul) do computador
 * (laranja), já que a arte é a mesma.
 *
 * @param {number} time 0 = criança (azul), 1 = computador (laranja)
 * @param {number} numero casa mostrada na janelinha (0 = vazia, >20 = estrela da chegada)
 * @param {boolean} brilho halo estável de "sua vez"
 * @param {HTMLImageElement|null} imagem a arte carregada (`loader.imagem('foguete')`)
 */
export function desenharFoguete(ctx, cx, cy, escala, time, numero, brilho = false, imagem = null) {
  if (!imagem) {
    desenharFogueteVetorial(ctx, cx, cy, escala, time, numero, brilho);
    return;
  }
  const forte = time === 0 ? CORES.azulForte : CORES.laranjaForte;
  const u = FOGUETE_COMPRIMENTO / ARTE.altura;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(escala, escala);

  if (brilho) {
    // O halo fica no meio do CORPO, que está atrás da janelinha.
    const meio = -(ARTE.altura / 2 - ARTE.janelaY) * u;
    const halo = ctx.createRadialGradient(meio, 0, 10, meio, 0, 92);
    halo.addColorStop(0, 'rgba(253, 224, 71, 0.55)');
    halo.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.ellipse(meio, 0, 94, 62, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Arte em pé girada 90° no sentido horário: o bico (topo) passa a apontar para a direita.
  ctx.save();
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(imagem, -ARTE.janelaX * u, -ARTE.janelaY * u, ARTE.largura * u, ARTE.altura * u);
  ctx.restore();

  // Janelinha: disco branco cobrindo o furo e o aro da arte, com o aro do time.
  const r = ARTE.aro * u;
  ctx.beginPath();
  ctx.arc(0, 0, r - 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = forte;
  ctx.stroke();
  if (numero > 0 && numero <= 20) escrever(ctx, String(numero), 0, 1, numero > 9 ? 16 : 20, '#0F172A');
  if (numero > 20) estrela(ctx, 0, 0, 10, '#FACC15', '#CA8A04');

  ctx.restore();
}

/** O foguete vetorial original — só a reserva de quando a arte não carregou. */
function desenharFogueteVetorial(ctx, cx, cy, escala, time, numero, brilho = false) {
  const forte = time === 0 ? CORES.azulForte : CORES.laranjaForte;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(escala, escala);

  if (brilho) {
    const halo = ctx.createRadialGradient(0, 0, 10, 0, 0, 84);
    halo.addColorStop(0, 'rgba(253, 224, 71, 0.55)');
    halo.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.ellipse(0, 0, 86, 58, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Chama, parada (sem tremular).
  ctx.fillStyle = '#F97316';
  ctx.beginPath();
  ctx.moveTo(-46, -13);
  ctx.quadraticCurveTo(-86, 0, -46, 13);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.moveTo(-46, -7);
  ctx.quadraticCurveTo(-68, 0, -46, 7);
  ctx.closePath();
  ctx.fill();

  // Aletas vermelhas, como as do brinquedo.
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.moveTo(-40, -18); ctx.lineTo(-14, -18); ctx.lineTo(-46, -38);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-40, 18); ctx.lineTo(-14, 18); ctx.lineTo(-46, 38);
  ctx.closePath();
  ctx.fill();

  // Corpo branco.
  ctx.beginPath();
  ctx.roundRect(-50, -23, 84, 46, 23);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#94A3B8';
  ctx.stroke();

  // Faixa do time: a cor nunca é o único sinal — a pista (de cima / de baixo) também diz.
  ctx.fillStyle = forte;
  ctx.fillRect(-34, -22, 9, 44);

  // Bico.
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.moveTo(28, -21);
  ctx.quadraticCurveTo(62, -6, 60, 0);
  ctx.quadraticCurveTo(62, 6, 28, 21);
  ctx.closePath();
  ctx.fill();

  // Janelinha com o número da casa — o furo do brinquedo, que deixa ver a pista.
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(4, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = forte;
  ctx.stroke();
  if (numero > 0 && numero <= 20) escrever(ctx, String(numero), 4, 1, numero > 9 ? 17 : 21, '#0F172A');
  if (numero > 20) estrela(ctx, 4, 0, 11, '#FACC15', '#CA8A04');

  ctx.restore();
}

/** Estrela de cinco pontas centrada em (cx, cy). */
export function estrela(ctx, cx, cy, r, cor, contorno) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const raio = i % 2 ? r * 0.45 : r;
    ctx.lineTo(cx + Math.cos(ang) * raio, cy + Math.sin(ang) * raio);
  }
  ctx.closePath();
  ctx.fillStyle = cor;
  ctx.fill();
  if (contorno) {
    ctx.lineWidth = Math.max(1.5, r * 0.12);
    ctx.strokeStyle = contorno;
    ctx.stroke();
  }
}

const PINTAS = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};

/** Um dado branco de lado `tam`, centrado em (x, y), com a borda na cor de quem rolou. */
export function desenharDado(ctx, x, y, tam, valor, corBorda, giro = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(giro);
  const r = tam * 0.17;
  ctx.beginPath();
  ctx.roundRect(-tam / 2, -tam / 2 + tam * 0.05, tam, tam, r);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(-tam / 2, -tam / 2, tam, tam, r);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = Math.max(3, tam * 0.055);
  ctx.strokeStyle = corBorda;
  ctx.stroke();
  const o = tam * 0.26;
  ctx.fillStyle = CORES.tinta;
  for (const [a, b] of PINTAS[valor] ?? []) {
    ctx.beginPath();
    ctx.arc(a * o, b * o, tam * 0.085, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Uma pista: faixa arredondada com as casas 1..`casas`, a partir de (x, y).
 *
 * @param {object} op
 *   time        0 (azul, criança) | 1 (laranja, computador)
 *   destacar    realça 5, 10, 15 e 20 (âncoras da contagem de 5 em 5)
 *   acesas      { de, ate }: casas de `de` a `ate` pintadas de amarelo (a ajuda)
 *   anel        casa com o anel amarelo estável (a casa certa, na ajuda)
 */
export function desenharPista(ctx, x, y, casaL, altura, casas, op = {}) {
  const { time = 0, destacar = true, acesas = null, anel = 0 } = op;
  const fundo = time === 0 ? CORES.azulPista : CORES.laranjaPista;
  const corNumero = time === 0 ? CORES.azulNumero : CORES.laranjaNumero;
  const largura = casas * casaL;
  const raio = Math.min(14, altura / 4);
  const tamNum = Math.round(Math.min(casaL * 0.42, altura * 0.3));

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, largura, altura, raio);
  ctx.fillStyle = fundo;
  ctx.fill();
  ctx.clip();
  for (let k = 1; k <= casas; k++) {
    const cx = x + (k - 1) * casaL;
    const forte = destacar && k % 5 === 0;
    if (forte) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.10)';
      ctx.fillRect(cx, y, casaL, altura);
    }
    if (acesas && k >= acesas.de && k <= acesas.ate) {
      ctx.fillStyle = CORES.ajuda;
      ctx.fillRect(cx + 3, y + 3, casaL - 6, altura - 6);
    }
    if (k > 1) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(cx - 1, y + altura * 0.12, 2, altura * 0.76);
    }
    escrever(ctx, String(k), cx + casaL / 2, y + altura / 2, forte ? Math.round(tamNum * 1.2) : tamNum, corNumero);
  }
  ctx.restore();

  if (anel > 0 && anel <= casas) {
    const ax = x + (anel - 1) * casaL;
    ctx.save();
    ctx.lineWidth = 5;
    ctx.strokeStyle = CORES.ajudaAnel;
    ctx.beginPath();
    ctx.roundRect(ax - 3, y - 5, casaL + 6, altura + 10, 12);
    ctx.stroke();
    ctx.restore();
  }
}

/** A faixa quadriculada da chegada, de (x, y) com altura `altura`. */
export function desenharChegada(ctx, x, y, largura, altura, quadrado = 7) {
  ctx.save();
  const colunas = Math.max(1, Math.round(largura / quadrado));
  for (let r = 0; r * quadrado < altura; r++) {
    for (let c = 0; c < colunas; c++) {
      ctx.fillStyle = (r + c) % 2 ? '#111827' : '#F9FAFB';
      ctx.fillRect(x + c * quadrado, y + r * quadrado, quadrado, Math.min(quadrado, altura - r * quadrado));
    }
  }
  ctx.restore();
}

/** O balão amarelo com quantas casas o foguete já andou nesta jogada, com a ponta em (cx, yPonta). */
export function desenharBalao(ctx, cx, yPonta, valor, raio = 22) {
  const cy = yPonta - raio - 8;
  ctx.save();
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.arc(cx, cy, raio, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - raio * 0.32, cy + raio * 0.82);
  ctx.lineTo(cx + raio * 0.32, cy + raio * 0.82);
  ctx.lineTo(cx, yPonta);
  ctx.closePath();
  ctx.fill();
  escrever(ctx, String(valor), cx, cy + 1, Math.round(raio * 1.1), '#422006');
  ctx.restore();
}

/** O dedinho branco da coleção: indicador apontando pra BAIXO, ponta em (cx, yPonta), mão de altura h. */
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

/** Onda de toque saindo de (x, y); d vai de 0 a 1. */
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

/** Ícone de um dado (três pintas) para o botão ROLAR, centrado em (cx, cy). */
export function desenharIconeDado(ctx, cx, cy, lado, corPinta) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cx - lado / 2, cy - lado / 2, lado, lado, lado * 0.2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.fillStyle = corPinta;
  for (const [a, b] of PINTAS[3]) {
    ctx.beginPath();
    ctx.arc(cx + a * lado * 0.25, cy + b * lado * 0.25, lado * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Ícone de "certo" (✓) em traço branco, centrado em (cx, cy). */
export function desenharIconeCerto(ctx, cx, cy, lado, cor = '#FFFFFF') {
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
