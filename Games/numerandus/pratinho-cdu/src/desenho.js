/**
 * desenho.js — o desenho do Pratinho CDU, compartilhado pela partida e pelo
 * tutorial.
 *
 * Funções puras de canvas (recebem `ctx` e coordenadas, não guardam estado),
 * para que o tutorial — que também é a AJUDA dentro da partida (regra RE-05) —
 * mostre exatamente o mesmo prato, os mesmos grãos e os mesmos rolinhos que a
 * criança vai tocar, sem importar a cena.
 *
 * Nada aqui pisca: o halo do grão contado é estável, e a onda que se abre no
 * toque acontece uma vez só.
 */
import { SETOR, RAIO_LETRA, CASAS } from './regras.js';

/**
 * As cores do brinquedo do vídeo: C verde, D vermelho, U laranja. A criança é
 * azul e o computador é âmbar (não laranja: o laranja já é a unidade).
 */
export const CORES = {
  c: '#2E9E4F',
  d: '#D93A35',
  u: '#EE8420',
  cEscuro: '#1F7A3B',
  dEscuro: '#A82A26',
  uEscuro: '#B8620F',
  grao: '#3A2414',
  graoBrilho: 'rgba(255, 255, 255, 0.35)',
  borda: '#F5EFE4',
  bordaSombra: '#C9BBA5',
  crianca: '#7DA2FF',
  criancaForte: '#3B6FE0',
  computador: '#F5B50B',
  computadorForte: '#B7860B',
  ambar: '#F5B50B',
  ok: '#22C55E',
  okEscuro: '#15803D',
  cartao: '#2B3341',
  cartaoBorda: '#3C4656',
  tinta: '#E7EBF2',
  tintaSuave: '#9DA8B8',
  estrela: '#FBBF24',
  estrelaBorda: '#B8860B',
};

const FONTE = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

export function escrever(ctx, texto, x, y, tamanho, cor, alinhamento = 'center', peso = 800) {
  ctx.font = `${peso} ${tamanho}px ${FONTE}`;
  ctx.fillStyle = cor;
  ctx.textAlign = alinhamento;
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, x, y);
}

const rad = (graus) => (graus * Math.PI) / 180;

/** Centro da letra de uma fatia, em px. */
export function centroDaLetra(casa, cx, cy, R) {
  const [ini, fim] = SETOR[casa];
  const meio = rad((ini + fim) / 2);
  return { x: cx + RAIO_LETRA * R * Math.cos(meio), y: cy + RAIO_LETRA * R * Math.sin(meio) };
}

/** Em que fatia está o ponto (px)? null fora do prato. */
export function fatiaNoPonto(px, py, cx, cy, R) {
  const dx = px - cx;
  const dy = py - cy;
  if (Math.hypot(dx, dy) > R * 1.04) return null;
  const ang = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
  for (const casa of CASAS) {
    const [ini, fim] = SETOR[casa];
    const d = (((ang - ini) % 360) + 360) % 360;
    if (d < fim - ini) return casa;
  }
  return null;
}

/**
 * O prato: borda clara e as três fatias, cada uma com a sua letra.
 *
 * @param {object} op
 *   ativas   casas que o nível usa (as outras ficam apagadas: no Fácil, a C)
 *   acesas   casas com o contorno âmbar de "confira aqui" (ajuda)
 *   piscando casa que acabou de receber um toque sem efeito (fica mais clara)
 */
export function desenharPrato(ctx, cx, cy, R, op = {}) {
  const ativas = op.ativas ?? CASAS;
  const acesas = op.acesas ?? [];
  ctx.save();
  // Borda do prato, com uma sombra curta embaixo (o prato está sobre a mesa).
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.beginPath();
  ctx.arc(cx, cy + R * 0.035, R * 1.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = CORES.borda;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = Math.max(2, R * 0.02);
  ctx.strokeStyle = CORES.bordaSombra;
  ctx.stroke();

  for (const casa of CASAS) {
    const [ini, fim] = SETOR[casa];
    const ativa = ativas.includes(casa);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, rad(ini), rad(fim));
    ctx.closePath();
    ctx.fillStyle = CORES[casa];
    if (!ativa) ctx.globalAlpha = 0.28;
    ctx.fill();
    if (op.piscando === casa) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fill();
    }
    ctx.restore();
  }
  // As linhas entre as fatias, na cor da borda (o prato do vídeo tem a divisão clara).
  ctx.strokeStyle = CORES.borda;
  ctx.lineWidth = Math.max(3, R * 0.025);
  ctx.lineCap = 'round';
  for (const casa of CASAS) {
    const a = rad(SETOR[casa][0]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
    ctx.stroke();
  }
  // Contorno âmbar das fatias acesas pela ajuda, por cima das linhas.
  for (const casa of acesas) {
    const [ini, fim] = SETOR[casa];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R * 0.985, rad(ini), rad(fim));
    ctx.closePath();
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(5, R * 0.035);
    ctx.strokeStyle = CORES.ambar;
    ctx.stroke();
  }
  // Letras.
  for (const casa of CASAS) {
    const p = centroDaLetra(casa, cx, cy, R);
    ctx.save();
    if (!ativas.includes(casa)) ctx.globalAlpha = 0.45;
    const tam = Math.round(R * 0.3);
    ctx.font = `800 ${tam}px ${FONTE}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(3, tam * 0.1);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.strokeText(casa.toUpperCase(), p.x, p.y + tam * 0.04);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(casa.toUpperCase(), p.x, p.y + tam * 0.04);
    ctx.restore();
  }
  ctx.restore();
}

/** Tamanho do grão e do halo, em raios do prato (cabem no espaçamento das regras). */
export const GRAO_RX = 0.062;
export const HALO_R = 0.088;

/**
 * Um grão (feijão escuro). Contado, ganha um halo branco ATRÁS dele — sem
 * número: a criança vê o que já contou, mas quem conta é ela.
 *
 * @param {number} rx      meia largura do grão, em px
 * @param {object} op
 *   halo   0..1, quanto do halo já apareceu (0 = sem halo)
 *   onda   0..1, a onda que se abre no toque (fora de (0, 1) não desenha)
 *   fora   grão que caiu fora do prato: desbotado
 */
export function desenharGrao(ctx, x, y, rx, giro, op = {}) {
  ctx.save();
  ctx.translate(x, y);
  const halo = op.halo ?? 0;
  if (halo > 0) {
    const r = rx * (HALO_R / GRAO_RX) * (0.4 + 0.6 * Math.min(1, halo * 1.15));
    ctx.globalAlpha = Math.min(1, halo * 1.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = Math.max(2, rx * 0.2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.save();
  ctx.rotate(rad(giro));
  if (op.fora) ctx.globalAlpha = 0.55;
  ctx.fillStyle = CORES.grao;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, rx * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = CORES.graoBrilho;
  ctx.beginPath();
  ctx.ellipse(-rx * 0.3, -rx * 0.2, rx * 0.32, rx * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  const onda = op.onda ?? 0;
  if (onda > 0 && onda < 1) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * (1 - onda)})`;
    ctx.lineWidth = Math.max(2, rx * 0.18);
    ctx.beginPath();
    ctx.arc(0, 0, rx * (HALO_R / GRAO_RX) * (1 + onda * 1.1), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/** O "0" grande que aparece no meio de uma fatia sem grão. `d` de 0 a 1 (some no fim). */
export function desenharZero(ctx, casa, cx, cy, R, d) {
  if (d <= 0 || d >= 1) return;
  const p = centroDaLetra(casa, cx, cy, R);
  const entrada = Math.min(1, d / 0.2);
  const escala = 0.5 + 0.5 * (1 - (1 - entrada) ** 3);
  const alfa = d > 0.75 ? (1 - d) / 0.25 : 1;
  const r = R * 0.2 * escala;
  ctx.save();
  ctx.globalAlpha = alfa;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = Math.max(3, R * 0.03);
  ctx.strokeStyle = CORES[casa];
  ctx.stroke();
  escrever(ctx, '0', p.x, p.y + r * 0.06, Math.round(r * 1.25), CORES[`${casa}Escuro`]);
  ctx.restore();
}

/** Estrela de 5 pontas — o mesmo traçado do Caminho das Cores e do Material Dourado. */
export function tracarEstrela(ctx, cx, cy, rExterno, rInterno = rExterno * 0.42) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rExterno : rInterno;
    const ang = (i * Math.PI) / 5 - Math.PI / 2;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/**
 * Uma estrela da trilha de rodadas.
 * @param {'vazia'|'v'|'c'|'e'} estado  vazia, ganha pela criança (dourada),
 *   pelo computador (âmbar escuro) ou empate (cinza)
 * @param {boolean} atual contorno azul de "rodada de agora"
 */
export function desenharEstrelaRodada(ctx, cx, cy, r, estado, atual = false) {
  ctx.save();
  tracarEstrela(ctx, cx, cy, r);
  ctx.lineJoin = 'round';
  if (estado === 'v') {
    ctx.fillStyle = CORES.estrela;
    ctx.strokeStyle = CORES.estrelaBorda;
  } else if (estado === 'c') {
    ctx.fillStyle = '#9A6B12';
    ctx.strokeStyle = '#6B4A0A';
  } else if (estado === 'e') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
  }
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  if (atual) {
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = CORES.crianca;
    ctx.stroke();
  }
  ctx.restore();
}

/** Ícone da criança: uma pessoa (cabeça e ombros). */
export function desenharIconePessoa(ctx, cx, cy, tam, cor) {
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
export function desenharIconeComputador(ctx, cx, cy, tam, cor) {
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

/** O visto verde de acerto: círculo cheio e o "certo" branco. `escala` anima a entrada. */
export function desenharVisto(ctx, cx, cy, r, escala = 1) {
  if (escala <= 0) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(escala, escala);
  ctx.fillStyle = CORES.ok;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  desenharIconeCerto(ctx, 0, r * 0.04, r * 1.05);
  ctx.restore();
}

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

/** O ícone do JOGAR: um punhado de três grãos caindo. */
export function desenharIconeJogar(ctx, cx, cy, lado) {
  const rx = lado * 0.17;
  desenharGrao(ctx, cx - lado * 0.24, cy + lado * 0.16, rx, 20);
  desenharGrao(ctx, cx + lado * 0.22, cy + lado * 0.2, rx, -30);
  desenharGrao(ctx, cx, cy - lado * 0.22, rx, 60);
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = lado * 0.06;
  ctx.lineCap = 'round';
  for (const [x, y] of [[-0.24, -0.08], [0.22, -0.04]]) {
    ctx.beginPath();
    ctx.moveTo(cx + x * lado, cy + (y - 0.22) * lado);
    ctx.lineTo(cx + x * lado, cy + (y - 0.04) * lado);
    ctx.stroke();
  }
  ctx.restore();
}

/** O ícone do DESFAZER: a seta que volta. */
export function desenharIconeDesfazer(ctx, cx, cy, lado, cor = '#FFFFFF') {
  ctx.save();
  ctx.strokeStyle = cor;
  ctx.fillStyle = cor;
  ctx.lineWidth = lado * 0.14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx + lado * 0.05, cy + lado * 0.08, lado * 0.34, Math.PI * 1.05, Math.PI * 0.35, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - lado * 0.5, cy - lado * 0.12);
  ctx.lineTo(cx - lado * 0.12, cy - lado * 0.2);
  ctx.lineTo(cx - lado * 0.36, cy + lado * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** O ícone de "seguir": uma seta para a direita. */
export function desenharIconeSeguir(ctx, cx, cy, lado, cor = '#FFFFFF') {
  ctx.save();
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.moveTo(cx - lado * 0.4, cy - lado * 0.14);
  ctx.lineTo(cx + lado * 0.05, cy - lado * 0.14);
  ctx.lineTo(cx + lado * 0.05, cy - lado * 0.38);
  ctx.lineTo(cx + lado * 0.48, cy);
  ctx.lineTo(cx + lado * 0.05, cy + lado * 0.38);
  ctx.lineTo(cx + lado * 0.05, cy + lado * 0.14);
  ctx.lineTo(cx - lado * 0.4, cy + lado * 0.14);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Troféu dourado do fim, quando a criança ganhou mais estrelas. */
export function desenharTrofeu(ctx, cx, cy, tam) {
  ctx.save();
  ctx.translate(cx - tam / 2, cy - tam / 2);
  ctx.scale(tam / 64, tam / 64);
  ctx.lineCap = 'round';
  ctx.strokeStyle = CORES.estrelaBorda;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(17, 12); ctx.lineTo(8, 12); ctx.bezierCurveTo(8, 21, 12.5, 26, 19, 27);
  ctx.moveTo(47, 12); ctx.lineTo(56, 12); ctx.bezierCurveTo(56, 21, 51.5, 26, 45, 27);
  ctx.stroke();
  ctx.fillStyle = CORES.estrela;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(17, 7); ctx.lineTo(47, 7); ctx.lineTo(47, 20);
  ctx.bezierCurveTo(47, 29.5, 40.5, 37, 32, 37);
  ctx.bezierCurveTo(23.5, 37, 17, 29.5, 17, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = CORES.estrelaBorda;
  ctx.fillRect(28, 37, 8, 9);
  ctx.beginPath();
  ctx.roundRect(19, 46, 26, 9, 2.5);
  ctx.fill();
  ctx.restore();
}

/**
 * Um rolinho de algarismo (▲, a janela com o número, ▼ e a letra da casa).
 * Usado pelo tutorial; a partida monta o mesmo desenho com botões de verdade.
 */
export function desenharRolinho(ctx, x, y, largura, casa, valor, op = {}) {
  const alturaSeta = largura * 0.62;
  const alturaJanela = largura;
  const gap = largura * 0.08;
  ctx.save();
  for (const [yy, sobe] of [[y, true], [y + alturaSeta + gap * 2 + alturaJanela, false]]) {
    ctx.fillStyle = CORES[`${casa}Escuro`];
    ctx.beginPath();
    ctx.roundRect(x, yy + 5, largura, alturaSeta, largura * 0.18);
    ctx.fill();
    ctx.fillStyle = CORES[casa];
    ctx.beginPath();
    ctx.roundRect(x, yy + (op.apertada === (sobe ? 'sobe' : 'desce') ? 4 : 0), largura, alturaSeta, largura * 0.18);
    ctx.fill();
    const cy = yy + alturaSeta / 2 + (op.apertada === (sobe ? 'sobe' : 'desce') ? 4 : 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    const s = largura * 0.16;
    if (sobe) { ctx.moveTo(x + largura / 2, cy - s); ctx.lineTo(x + largura / 2 + s * 1.15, cy + s * 0.7); ctx.lineTo(x + largura / 2 - s * 1.15, cy + s * 0.7); }
    else { ctx.moveTo(x + largura / 2, cy + s); ctx.lineTo(x + largura / 2 + s * 1.15, cy - s * 0.7); ctx.lineTo(x + largura / 2 - s * 1.15, cy - s * 0.7); }
    ctx.closePath();
    ctx.fill();
  }
  const yJanela = y + alturaSeta + gap;
  ctx.fillStyle = CORES.cartao;
  ctx.beginPath();
  ctx.roundRect(x, yJanela, largura, alturaJanela, largura * 0.18);
  ctx.fill();
  ctx.lineWidth = Math.max(3, largura * 0.05);
  ctx.strokeStyle = op.acesa ? CORES.ambar : CORES[casa];
  ctx.stroke();
  escrever(ctx, String(valor), x + largura / 2, yJanela + alturaJanela / 2 + 2, Math.round(largura * 0.55), CORES.tinta);
  escrever(ctx, casa.toUpperCase(), x + largura / 2, y + alturaSeta * 2 + gap * 3 + alturaJanela + largura * 0.2, Math.round(largura * 0.24), CORES[casa]);
  ctx.restore();
}

/** Altura total de um rolinho de `largura` (para o layout). */
export function alturaRolinho(largura) {
  return largura * 0.62 * 2 + largura * 0.08 * 3 + largura + largura * 0.38;
}

/** O dedinho branco da coleção (o mesmo da Corrida Espacial e do Caminho das Cores). */
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
