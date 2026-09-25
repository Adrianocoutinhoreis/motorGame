import {
  Scene, Node, ScoreSystem, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, rand, cores, espaco,
} from '../../engine/index.js';

/**
 * Quantidade Certa — reaproveita o SISTEMA de encaixe já testado do Encaixe
 * Certo (peça com entalhe recebendo uma peça com nó saliente, mesmas curvas
 * de `Path2D`), com os dois papéis TROCADOS:
 *
 *   - Encaixe Certo: a peça de QUANTIDADE fica fixa (com o ícone já pronto:
 *     estrelas, morango...) e a criança arrasta o NÚMERO até ela.
 *   - Quantidade Certa: o NÚMERO fica fixo, e a criança arrasta a peça de
 *     QUANTIDADE (com furos VAZIOS, não com ícone pronto) até ele.
 *
 * Depois que TODAS as peças da rodada (a "onda" — mesmo conceito de fatiar
 * o nível do Encaixe Certo) já estão combinadas, uma "chuva" de continhas
 * coloridas aparece na trilha — a etapa nova que não existe no jogo irmão: a
 * criança conta e encaixa uma continha por furo, até a peça ficar cheia.
 *
 * Decisões registradas no artefato de planejamento, antes desta implementação
 * começar:
 *   - Fundo LISO (sem gradiente, sem decoração) — ao contrário do resto da
 *     coleção, escolha explícita do humano.
 *   - As duas etapas ficam SEPARADAS: nenhuma continha aparece até a ÚLTIMA
 *     peça da onda encaixar no número certo.
 *   - Sem vidas, sem cronômetro regressivo — mesma decisão do Encaixe Certo.
 */

const CORES_NUMERO = [
  cores.ludica.vermelho, cores.ludica.laranja, cores.ludica.amarelo, cores.ludica.verde,
  cores.ludica.turquesa, cores.ludica.azul, cores.ludica.roxo, cores.ludica.rosa, cores.ludica.marrom,
];
/** Paleta das CONTINHAS — deliberadamente maior/mais variada que a dos números: a cor da
 * continha nunca precisa ser diferenciável da cor do número (nenhuma combinação existe). */
const CORES_CONTINHA = [
  '#DC2626', '#EA580C', '#D97706', '#65A30D', '#16A34A', '#0D9488',
  '#0891B2', '#2563EB', '#4F46E5', '#7C3AED', '#C026D3', '#DB2777',
];

function corDoValor(v) { return CORES_NUMERO[(v - 1 + CORES_NUMERO.length) % CORES_NUMERO.length]; }

function faixa(min, max) {
  const lista = [];
  for (let v = min; v <= max; v++) lista.push(v);
  return lista;
}

/**
 * Divide `lista` em ondas de no máximo `tamanho` itens, distribuídas por
 * igual — mesmo motivo do Encaixe Certo: nunca deixar uma onda final com um
 * par só (não há "escolha" nenhuma com um alvo e uma peça só).
 */
function dividirEmOndas(lista, tamanho) {
  const total = lista.length;
  if (total === 0) return [];
  const numOndas = Math.ceil(total / tamanho);
  const base = Math.floor(total / numOndas);
  const extra = total % numOndas;
  const ondas = [];
  let cursor = 0;
  for (let i = 0; i < numOndas; i++) {
    const tamanhoOnda = base + (i < extra ? 1 : 0);
    ondas.push(lista.slice(cursor, cursor + tamanhoOnda));
    cursor += tamanhoOnda;
  }
  return ondas;
}

// ------------------------------------------------------------- geometria do encaixe

/**
 * O nó de encaixe — mesma curva do Encaixe Certo, só percorrida em sentidos
 * opostos (`noParaCima`/`noParaBaixo`) conforme o lado do corte.
 */
function noParaBaixo(ctx, edgeX, cy, r, nk) {
  ctx.bezierCurveTo(edgeX - r * 0.72, cy - nk, edgeX - r, cy - r * 0.72, edgeX - r, cy);
  ctx.bezierCurveTo(edgeX - r, cy + r * 0.72, edgeX - r * 0.72, cy + nk, edgeX, cy + nk);
}
function noParaCima(ctx, edgeX, cy, r, nk) {
  ctx.bezierCurveTo(edgeX - r * 0.72, cy + nk, edgeX - r, cy + r * 0.72, edgeX - r, cy);
  ctx.bezierCurveTo(edgeX - r, cy - r * 0.72, edgeX - r * 0.72, cy - nk, edgeX, cy - nk);
}

/** Corpo com ENTALHE na borda direita — aqui é o NÚMERO (a metade FIXA). */
function tracarCorpoEntalhe(ctx, w, h, r, nk) {
  const cy = h / 2;
  const rc = Math.min(16, h / 6);
  ctx.beginPath();
  ctx.moveTo(rc, 0);
  ctx.quadraticCurveTo(0, 0, 0, rc);
  ctx.lineTo(0, h - rc);
  ctx.quadraticCurveTo(0, h, rc, h);
  ctx.lineTo(w, h);
  ctx.lineTo(w, cy + nk);
  noParaCima(ctx, w, cy, r, nk);
  ctx.lineTo(w, 0);
  ctx.closePath();
}

/** Corpo com NÓ saliente na borda esquerda — aqui é a peça de QUANTIDADE (a metade ARRASTÁVEL). */
function tracarCorpoNo(ctx, w, h, r, nk) {
  const cy = h / 2;
  const rc = Math.min(16, h / 6);
  const tw = w + r;
  ctx.beginPath();
  ctx.moveTo(r, cy - nk);
  noParaBaixo(ctx, r, cy, r, nk);
  ctx.lineTo(r, h - rc);
  ctx.quadraticCurveTo(r, h, r + rc, h);
  ctx.lineTo(tw - rc, h);
  ctx.quadraticCurveTo(tw, h, tw, h - rc);
  ctx.lineTo(tw, rc);
  ctx.quadraticCurveTo(tw, 0, tw - rc, 0);
  ctx.lineTo(r + rc, 0);
  ctx.quadraticCurveTo(r, 0, r, rc);
  ctx.closePath();
}

/**
 * Fantasma pontilhado do lado direito do número — silhueta em forma de NÓ
 * (é uma peça-de-quantidade que vai chegar ali), mesmo idioma visual do
 * Encaixe Certo (`desenharFantasmaNumero`), só que a forma esperada é a
 * outra metade do par.
 */
function desenharFantasmaQuantidade(ctx, w, h, r, nk, destacada) {
  ctx.save();
  ctx.translate(w - r, 0);
  tracarCorpoNo(ctx, w, h, r, nk);

  if (destacada) {
    ctx.fillStyle = 'rgba(245, 158, 11, 0.28)';
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3.8;
    ctx.setLineDash([8, 4]);
    ctx.stroke();
    ctx.fillStyle = '#B45309';
    ctx.font = `800 ${Math.round(h * 0.44)}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', r + w / 2, h / 2);
  } else {
    ctx.fillStyle = 'rgba(130, 85, 35, 0.09)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(150, 100, 45, 0.45)';
    ctx.lineWidth = 2.2;
    ctx.setLineDash([7, 5]);
    ctx.stroke();
    ctx.fillStyle = 'rgba(150, 100, 45, 0.40)';
    ctx.font = `700 ${Math.round(h * 0.38)}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', r + w / 2, h / 2);
  }
  ctx.restore();
}

/**
 * Layouts canônicos (dado/dominó/grade) para posicionar os FUROS dentro da
 * peça de quantidade — mesmos números e mesma matemática do
 * `obterLayoutMarcadores` do Encaixe Certo (portado por inteiro, já corrigido
 * lá contra sobreposição), com um padrão A MAIS: 10 (quadro de dez, 2
 * fileiras de 5) — o Encaixe Certo nunca precisou dele (`numeroMax` não passa
 * de 9 lá).
 */
function obterLayoutFuros(n, safeW, safeH) {
  const posicoes = [];
  let tamanho = 32;

  if (n === 1) {
    posicoes.push({ cx: safeW * 0.50, cy: safeH * 0.50 });
    tamanho = Math.min(safeW, safeH) * 0.65;
  } else if (n === 2) {
    posicoes.push({ cx: safeW * 0.28, cy: safeH * 0.50 }, { cx: safeW * 0.72, cy: safeH * 0.50 });
    tamanho = Math.min(safeW * 0.40, safeH * 0.54);
  } else if (n === 3) {
    posicoes.push(
      { cx: safeW * 0.50, cy: safeH * 0.28 },
      { cx: safeW * 0.26, cy: safeH * 0.74 },
      { cx: safeW * 0.74, cy: safeH * 0.74 },
    );
    tamanho = Math.min(safeW * 0.42, safeH * 0.42);
  } else if (n === 4) {
    posicoes.push(
      { cx: safeW * 0.27, cy: safeH * 0.27 }, { cx: safeW * 0.73, cy: safeH * 0.27 },
      { cx: safeW * 0.27, cy: safeH * 0.73 }, { cx: safeW * 0.73, cy: safeH * 0.73 },
    );
    tamanho = Math.min(safeW * 0.38, safeH * 0.38);
  } else if (n === 5) {
    posicoes.push(
      { cx: safeW * 0.24, cy: safeH * 0.24 }, { cx: safeW * 0.76, cy: safeH * 0.24 },
      { cx: safeW * 0.50, cy: safeH * 0.50 },
      { cx: safeW * 0.24, cy: safeH * 0.76 }, { cx: safeW * 0.76, cy: safeH * 0.76 },
    );
    tamanho = Math.min(safeW * 0.30, safeH * 0.30);
  } else if (n === 6) {
    posicoes.push(
      { cx: safeW * 0.28, cy: safeH * 0.2 }, { cx: safeW * 0.72, cy: safeH * 0.2 },
      { cx: safeW * 0.28, cy: safeH * 0.5 }, { cx: safeW * 0.72, cy: safeH * 0.5 },
      { cx: safeW * 0.28, cy: safeH * 0.8 }, { cx: safeW * 0.72, cy: safeH * 0.8 },
    );
    tamanho = Math.min(safeW * 0.36, safeH * 0.27);
  } else if (n === 7) {
    posicoes.push(
      { cx: safeW * 0.3, cy: safeH * 0.2 }, { cx: safeW * 0.7, cy: safeH * 0.2 },
      { cx: safeW * 0.18, cy: safeH * 0.5 }, { cx: safeW * 0.5, cy: safeH * 0.5 }, { cx: safeW * 0.82, cy: safeH * 0.5 },
      { cx: safeW * 0.3, cy: safeH * 0.8 }, { cx: safeW * 0.7, cy: safeH * 0.8 },
    );
    tamanho = Math.min(safeW * 0.28, safeH * 0.25);
  } else if (n === 8) {
    posicoes.push(
      { cx: safeW * 0.28, cy: safeH * 0.16 }, { cx: safeW * 0.72, cy: safeH * 0.16 },
      { cx: safeW * 0.28, cy: safeH * 0.38 }, { cx: safeW * 0.72, cy: safeH * 0.38 },
      { cx: safeW * 0.28, cy: safeH * 0.62 }, { cx: safeW * 0.72, cy: safeH * 0.62 },
      { cx: safeW * 0.28, cy: safeH * 0.84 }, { cx: safeW * 0.72, cy: safeH * 0.84 },
    );
    tamanho = Math.min(safeW * 0.36, safeH * 0.21);
  } else if (n === 9) {
    posicoes.push(
      { cx: safeW * 0.2, cy: safeH * 0.2 }, { cx: safeW * 0.5, cy: safeH * 0.2 }, { cx: safeW * 0.8, cy: safeH * 0.2 },
      { cx: safeW * 0.2, cy: safeH * 0.5 }, { cx: safeW * 0.5, cy: safeH * 0.5 }, { cx: safeW * 0.8, cy: safeH * 0.5 },
      { cx: safeW * 0.2, cy: safeH * 0.8 }, { cx: safeW * 0.5, cy: safeH * 0.8 }, { cx: safeW * 0.8, cy: safeH * 0.8 },
    );
    tamanho = Math.min(safeW * 0.27, safeH * 0.25);
  } else {
    // 10 — quadro de dez: 2 fileiras de 5, o único padrão que o Encaixe Certo nunca desenhou.
    const xs = [0.12, 0.31, 0.5, 0.69, 0.88];
    for (const x of xs) posicoes.push({ cx: safeW * x, cy: safeH * 0.28 });
    for (const x of xs) posicoes.push({ cx: safeW * x, cy: safeH * 0.74 });
    tamanho = Math.min(safeW * 0.16, safeH * 0.32);
  }

  return { posicoes, tamanho };
}

// ------------------------------------------------------------------- peças

/**
 * NumeroFixo — a metade FIXA do par: o numeral grande, na cor do número, e o
 * fantasma pontilhado do soquete esperando a peça de quantidade.
 */
class NumeroFixo extends Node {
  constructor(valor, w, h, r, nk) {
    super({ largura: w * 2, altura: h });
    this.valor = valor;
    this.w = w; this.h = h; this.r = r; this.nk = nk;
    this.preenchida = false;
    this.destacada = false;
  }

  desenhar(ctx) {
    const { w, h, r, nk } = this;

    if (!this.preenchida) desenharFantasmaQuantidade(ctx, w, h, r, nk, this.destacada);

    ctx.save();
    tracarCorpoEntalhe(ctx, w, h, r, nk);
    ctx.shadowColor = 'rgba(80,50,15,0.24)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = cores.superficie;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = this.destacada && !this.preenchida ? '#D97706' : '#D4943A';
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = corDoValor(this.valor);
    ctx.font = `800 ${Math.round(h * 0.62)}px Outfit, system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(this.valor), w / 2, h / 2 + h * 0.02);
    ctx.restore();

    if (this.destacada && !this.preenchida) {
      ctx.save();
      tracarCorpoEntalhe(ctx, w, h, r, nk);
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();
    }
  }
}

/**
 * PecaQuantidade — a metade ARRASTÁVEL do par. Dois modos:
 *   'previa'  — antes de combinar: pontinhos neutros (sem cor), só pra
 *               comparar com o número — decoração, não interativo.
 *   'furos'   — depois de combinada: furos vazios/reais, prontos pra
 *               receber continhas (preenchidos por `this.furos[i]`).
 */
class PecaQuantidade extends Node {
  constructor(valor, w, h, r, nk) {
    super({ largura: w + r, altura: h, interativo: true, regX: r, regY: h / 2 });
    this.valor = valor;
    this.w = w; this.h = h; this.r = r; this.nk = nk;
    this.modo = 'previa';
    this.furos = new Array(valor).fill(null);
    this.trancada = false;
    this.arrastando = false;
    this.trayX = 0; this.trayY = 0;
    this._furoEmDestaque = -1;

    const padIn = 10;
    const safeW = w - padIn * 2;
    const safeH = h * 0.8;
    this._origemX = r + padIn;
    this._origemY = (h - safeH) / 2;
    const layout = obterLayoutFuros(valor, safeW, safeH);
    this._pontosFuro = layout.posicoes;
    this._raioFuro = layout.tamanho * 0.42;
  }

  /** Posição do furo `i`, em coordenadas de `this.area` (mesmo espaço de `this.x/y`). */
  posicaoMundialDoFuro(i) {
    const p = this._pontosFuro[i] ?? { cx: (this.w - this.r * 2) / 2, cy: (this.h * 0.8) / 2 };
    return {
      x: this.x + (this._origemX + p.cx - this.r),
      y: this.y + (this._origemY + p.cy - this.h / 2),
    };
  }

  todosFurosCheios() { return this.furos.every(Boolean); }

  desenhar(ctx) {
    const { w, h, r, nk } = this;

    ctx.save();
    tracarCorpoNo(ctx, w, h, r, nk);
    ctx.shadowColor = this.arrastando ? 'rgba(80,50,15,0.45)' : 'rgba(80,50,15,0.22)';
    ctx.shadowBlur = this.arrastando ? 18 : 8;
    ctx.shadowOffsetY = this.arrastando ? 7 : 3;
    ctx.fillStyle = cores.superficie;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#D4943A';
    ctx.stroke();
    ctx.restore();

    ctx.save();
    for (let i = 0; i < this.valor; i++) {
      const p = this._pontosFuro[i];
      const cx = this._origemX + p.cx;
      const cy = this._origemY + p.cy;
      ctx.beginPath();
      ctx.arc(cx, cy, this._raioFuro, 0, Math.PI * 2);
      if (this.modo === 'previa') {
        ctx.fillStyle = 'rgba(120, 90, 50, 0.28)';
        ctx.fill();
      } else {
        const cor = this.furos[i];
        if (cor) {
          ctx.fillStyle = cor;
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.fill();
          ctx.lineWidth = this._furoEmDestaque === i ? 2.6 : 1.8;
          ctx.strokeStyle = this._furoEmDestaque === i ? '#D97706' : '#D4943A';
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }
}

/** Continha — a bolinha arrastável da chuva. Sem forma nenhuma pra discriminar, só cor de enfeite. */
class Continha extends Node {
  constructor(cor, raio) {
    super({ largura: raio * 2, altura: raio * 2, interativo: true, regX: raio, regY: raio });
    this.cor = cor;
    this.raio = raio;
    this.arrastando = false;
    this.trayX = 0; this.trayY = 0;
  }

  desenhar(ctx) {
    const r = this.raio;
    ctx.save();
    ctx.shadowColor = this.arrastando ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = this.arrastando ? 14 : 6;
    ctx.shadowOffsetY = this.arrastando ? 5 : 2;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fillStyle = this.cor;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.beginPath();
    ctx.arc(r * 0.68, r * 0.62, r * 0.34, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fill();
    ctx.restore();
  }
}

/** PainelZona — o "cartão" de fundo de cada área (tabuleiro e trilha). Mesmo visual do Encaixe Certo. */
class PainelZona extends Node {
  constructor({ largura, altura, cor, bordaCor = 'rgba(212, 148, 58, 0.35)' }) {
    super({ largura, altura });
    this.cor = cor;
    this.bordaCor = bordaCor;
  }

  desenhar(ctx) {
    ctx.save();
    ctx.shadowColor = 'rgba(80,50,15,0.20)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = this.cor;
    ctx.beginPath();
    ctx.roundRect(0, 0, this.largura, this.altura, 26);
    ctx.fill();
    if (this.bordaCor) {
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = this.bordaCor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    ctx.restore();
  }
}

/** Badge do Cronômetro / HUD — mesmo visual do Encaixe Certo. */
class RelogioBadge extends Node {
  constructor({ x, y, largura = 170, altura = 50 }) {
    super({ x, y, largura, altura, regX: largura / 2, regY: altura / 2 });
    this.texto = '0:00';
  }

  desenhar(ctx) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(0, 0, this.largura, this.altura, this.altura / 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.font = '800 24px Outfit, system-ui, sans-serif';
    const textWidth = ctx.measureText(this.texto).width;
    const raio = 12;
    const espacoIconeTexto = 10;
    const larguraConjunto = raio * 2 + espacoIconeTexto + textWidth;
    const inicioX = (this.largura - larguraConjunto) / 2;
    const cx = inicioX + raio;
    const cy = this.altura / 2;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, raio, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 6);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 5, cy);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.texto, cx + raio + espacoIconeTexto, cy + 1);
    ctx.restore();
  }
}

// ------------------------------------------------------------------ a cena

export class GameScene extends Scene {
  static MAX_PARES_POR_ONDA = 3;

  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = new ScoreSystem({ total: this.nivel.meta, nivel: this.nivel.id ?? 1 });

    // Igual ao Encaixe Certo: tentativa errada (número que não bate com a
    // peça) só é registrada pro relatório do AVA — nunca desconta acertos
    // nem estrelas (RE-02). A etapa das continhas não tem "errado" nenhum:
    // qualquer continha cabe em qualquer furo vazio.
    this._tentativasErradas = 0;

    // Fundo LISO — mesma cor no topo e na base do céu (sem gradiente) e sem
    // decoração/chão: decisão do humano no planejamento, ao contrário do
    // resto da coleção.
    this.adicionar(new Background({
      largura: L, altura: A,
      tema: config.tema ?? 'quarto',
      corCeuTopo: config.corCeuTopo ?? '#0F2E24',
      corCeuBase: config.corCeuBase ?? '#0F2E24',
      mostrarDecoracoes: false,
      mostrarChao: false,
    }));

    const valores = rand.embaralhar(faixa(1, this.nivel.numeroMax)).slice(0, this.nivel.meta);
    this._ondas = dividirEmOndas(valores, GameScene.MAX_PARES_POR_ONDA);
    this._ondaIndex = 0;

    this._topo = 110;
    const margemLateral = 44;
    this._areaLargura = L - margemLateral * 2;
    this.area = new Node({ x: margemLateral, y: this._topo });
    this.adicionar(this.area);

    this._padPainelX = 26;
    this._padPainelY = 26;
    this._espacoEntreZonas = 28;

    this.aoDesmontar(this.input.on('arrastar', (ponto) => this._moverArrasto(ponto)));
    this.aoDesmontar(this.input.on('soltar', () => this._soltarArrasto()));
    this.aoDesmontar(this.input.on('cancelar', () => this._soltarArrasto()));

    // ------------------------------------------------------------------ HUD
    this.adicionar(new IconButton({
      icone: 'pausa', x: espaco.md, y: espaco.md,
      audio: this.audio, somToque: config.audio?.clique, aoTocar: () => this._pausar(),
    }));
    this.adicionar(new IconButton({
      icone: 'tutorial', x: espaco.md + 72 + espaco.md, y: espaco.md,
      audio: this.audio, somToque: config.audio?.clique, aoTocar: () => this._pedirAjuda(),
    }));
    this.adicionar(new SoundToggle({
      audio: this.audio, x: L - 96, y: espaco.md, somToque: config.audio?.clique,
    }));

    this._relogioBadge = config.mostrarCronometro === false ? null : new RelogioBadge({
      x: L / 2, y: espaco.md + 26, largura: 170, altura: 50,
    });
    if (this._relogioBadge) this.adicionar(this._relogioBadge);
    this._relogioSegundoMostrado = 0;
    this.placar.on('mudou', () => this._atualizarTextoHud());

    this.pausa = new PauseScreen({
      largura: L, altura: A, audio: this.audio, config, mostrarSom: false,
      aoContinuar: () => { this.pausada = false; Tween.retomarTodos(); },
      aoReiniciar: () => this.irPara('jogando', { nivel: this.nivel }),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.pausa);

    this.ajuda = new HelpScreen({
      cena: this,
      aoFechar: () => { this.pausada = false; Tween.retomarTodos(); },
    });
    this.adicionar(this.ajuda);

    this.placar.on('vitoria', () => this._celebrarCompleto());

    this._faseAtual = 'combinando'; // 'combinando' | 'chovendo' | 'preenchendo'
    this._construirOnda(this._ondas[this._ondaIndex]);
  }

  /** Constrói a onda atual: tabuleiro de números fixos + trilha de peças de quantidade soltas. */
  _construirOnda(valoresOnda) {
    this._painelTabuleiro?.removerDoPai();
    this._painelTrilha?.removerDoPai();
    for (const numero of this._numerosFixos ?? []) numero.removerDoPai();
    for (const peca of this._pecasQuantidade ?? []) peca.removerDoPai();
    for (const continha of this._continhas ?? []) continha.removerDoPai();

    this._faseAtual = 'combinando';
    this._continhas = [];
    this._arrastando = null;

    const areaLargura = this._areaLargura;
    const numPares = valoresOnda.length;
    const ordemTabuleiro = rand.embaralhar([...valoresOnda]);
    const ordemTrilha = rand.embaralhar([...valoresOnda]);

    const padX = this._padPainelX;
    const padY = this._padPainelY;
    const gapTabuleiro = 28;
    const gapTrilha = 40;
    const espacoEntreZonas = this._espacoEntreZonas;

    const larguraUtilTabuleiro = areaLargura - padX * 2;
    const wMaxPorLargura = (larguraUtilTabuleiro - gapTabuleiro * (numPares - 1)) / (2 * numPares);
    const w = Math.min(182, Math.max(135, Math.floor(wMaxPorLargura)));
    const h = Math.round(w * 0.94);
    const r = Math.round(w * 0.24);
    const nk = Math.round(r * 0.25);
    this._pecaW = w; this._pecaH = h; this._pecaR = r; this._pecaNk = nk;

    // --------------------------------------------------------- tabuleiro (topo)
    const larguraGradeTabuleiro = numPares * (2 * w) + (numPares - 1) * gapTabuleiro;
    const larguraPainelTabuleiro = Math.min(areaLargura, larguraGradeTabuleiro + padX * 2);
    const alturaPainelTabuleiro = h + padY * 2;
    const xPainelTabuleiro = (areaLargura - larguraPainelTabuleiro) / 2;
    const yPainelTabuleiro = 34;

    this._painelTabuleiro = new PainelZona({
      largura: larguraPainelTabuleiro, altura: alturaPainelTabuleiro,
      cor: '#F5ECD7', bordaCor: 'rgba(180, 130, 60, 0.45)',
    });
    this._painelTabuleiro.x = xPainelTabuleiro;
    this._painelTabuleiro.y = yPainelTabuleiro;
    this.area.adicionar(this._painelTabuleiro);

    const inicioXNumeros = xPainelTabuleiro + (larguraPainelTabuleiro - larguraGradeTabuleiro) / 2;
    const yNumeros = yPainelTabuleiro + padY;

    this._numerosFixos = ordemTabuleiro.map((valor, i) => {
      const numero = new NumeroFixo(valor, w, h, r, nk);
      numero.x = inicioXNumeros + i * (2 * w + gapTabuleiro);
      numero.y = yNumeros;
      this.area.adicionar(numero);
      return numero;
    });

    // ------------------------------------------------------------ trilha (base)
    const larguraFicha = w + r;
    const larguraGradeTrilha = numPares * larguraFicha + (numPares - 1) * gapTrilha;
    const padTrilhaY = 20;
    const larguraPainelTrilha = Math.min(areaLargura, larguraGradeTrilha + padX * 2);
    const alturaPainelTrilha = h + padTrilhaY * 2;
    const xPainelTrilha = (areaLargura - larguraPainelTrilha) / 2;
    const yPainelTrilha = yPainelTabuleiro + alturaPainelTabuleiro + espacoEntreZonas;

    this._painelTrilha = new PainelZona({
      largura: larguraPainelTrilha, altura: alturaPainelTrilha,
      cor: '#FEF3C7', bordaCor: '#F59E0B',
    });
    this._painelTrilha.x = xPainelTrilha;
    this._painelTrilha.y = yPainelTrilha;
    this.area.adicionar(this._painelTrilha);
    this._trilha = {
      x: xPainelTrilha, y: yPainelTrilha, largura: larguraPainelTrilha, altura: alturaPainelTrilha,
    };

    const inicioXPecas = xPainelTrilha + (larguraPainelTrilha - larguraGradeTrilha) / 2;
    const yPecas = yPainelTrilha + padTrilhaY + h / 2;

    this._pecaDoValor = new Map();
    this._pecasQuantidade = ordemTrilha.map((valor, i) => {
      const peca = new PecaQuantidade(valor, w, h, r, nk);
      const px = inicioXPecas + i * (larguraFicha + gapTrilha) + r;
      const py = yPecas;
      peca.trayX = px; peca.trayY = py;
      peca.x = px; peca.y = py;
      this.area.adicionar(peca);
      this._pecaDoValor.set(valor, peca);
      this._ligarArrastePeca(peca);
      return peca;
    });

    this._atualizarTextoHud();
  }

  // ------------------------------------------------------ etapa 1: combinar

  _soqueteVazioMaisProximo(x, y) {
    let melhor = null;
    let menor = Infinity;
    for (const numero of this._numerosFixos) {
      if (numero.preenchida) continue;
      const alvoX = numero.x + numero.w;
      const alvoY = numero.y + numero.h / 2;
      const d = (x - alvoX) ** 2 + (y - alvoY) ** 2;
      if (d < menor) { menor = d; melhor = numero; }
    }
    return melhor;
  }

  /** Mesmo raio (e mesmo motivo) do Encaixe Certo — ver comentário lá: motricidade fina de 6-7 anos precisa de folga generosa, o ímã cobre o resto. */
  _raioTolerancia(peca) { return peca.h * 0.7; }

  _dentroDaTolerancia(peca, x, y) {
    const alvoX = peca.x + peca.w;
    const alvoY = peca.y + peca.h / 2;
    const raio = this._raioTolerancia(peca);
    const d = (x - alvoX) ** 2 + (y - alvoY) ** 2;
    return d <= raio ** 2;
  }

  _ligarArrastePeca(peca) {
    peca.on('apertar', (ponto) => {
      if (this.pausada || this.placar.encerrado || this._arrastando || peca.trancada) return;
      if (this._faseAtual !== 'combinando') return;
      const local = this.area.globalParaLocal(ponto.x, ponto.y);
      this._deslocX = peca.x - local.x;
      this._deslocY = peca.y - local.y;
      peca.arrastando = true;
      peca.paraFrente();
      Tween.removerDe(peca);
      Tween.para(peca, { scaleX: 1.08, scaleY: 1.08 }, 100, Easing.suaveSaida);
      this._arrastando = peca;
    });
  }

  // ------------------------------------------------------ etapa 2: preencher

  _ligarArrasteContinha(continha) {
    continha.on('apertar', (ponto) => {
      if (this.pausada || this.placar.encerrado || this._arrastando) return;
      if (this._faseAtual !== 'preenchendo') return;
      const local = this.area.globalParaLocal(ponto.x, ponto.y);
      this._deslocX = continha.x - local.x;
      this._deslocY = continha.y - local.y;
      continha.arrastando = true;
      continha.paraFrente();
      Tween.removerDe(continha);
      Tween.para(continha, { scaleX: 1.15, scaleY: 1.15 }, 90, Easing.suaveSaida);
      this._arrastando = continha;
    });
  }

  /** Todo furo VAZIO de toda peça já combinada — qualquer um serve, não é o valor que decide aqui. */
  _furosDisponiveis() {
    const lista = [];
    for (const peca of this._pecasQuantidade) {
      if (peca.modo !== 'furos') continue;
      for (let i = 0; i < peca.valor; i++) {
        if (!peca.furos[i]) {
          const p = peca.posicaoMundialDoFuro(i);
          lista.push({ peca, indice: i, x: p.x, y: p.y });
        }
      }
    }
    return lista;
  }

  _furoMaisProximo(x, y) {
    let melhor = null;
    let menor = Infinity;
    for (const alvo of this._furosDisponiveis()) {
      const d = (x - alvo.x) ** 2 + (y - alvo.y) ** 2;
      if (d < menor) { menor = d; melhor = alvo; }
    }
    return melhor;
  }

  _raioToleranciaFuro() { return this._pecaH * 0.42; }

  // --------------------------------------------------------------- arrasto

  _moverArrasto(ponto) {
    const alvo = this._arrastando;
    if (!alvo) return;
    if (alvo instanceof PecaQuantidade) this._moverArrastoPeca(ponto);
    else this._moverArrastoContinha(ponto);
  }

  _soltarArrasto() {
    const alvo = this._arrastando;
    if (!alvo) return;
    if (alvo instanceof PecaQuantidade) this._soltarArrastoPeca();
    else this._soltarArrastoContinha();
  }

  _moverArrastoPeca(ponto) {
    const peca = this._arrastando;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    peca.x = local.x + this._deslocX;
    peca.y = local.y + this._deslocY;

    const alvo = this._soqueteVazioMaisProximo(peca.x, peca.y);
    const perto = alvo && this._dentroDaTolerancia(alvo, peca.x, peca.y);
    for (const numero of this._numerosFixos) numero.destacada = perto && numero === alvo;

    if (perto) {
      const alvoX = alvo.x + alvo.w;
      const alvoY = alvo.y + alvo.h / 2;
      const dx = alvoX - peca.x;
      const dy = alvoY - peca.y;
      const raio = this._raioTolerancia(alvo);
      const forca = 1 - Math.sqrt(dx * dx + dy * dy) / raio;
      const FATOR_IMA = 0.3;
      peca.x += dx * forca * FATOR_IMA;
      peca.y += dy * forca * FATOR_IMA;
    }
  }

  _soltarArrastoPeca() {
    const peca = this._arrastando;
    this._arrastando = null;
    peca.arrastando = false;
    for (const numero of this._numerosFixos) numero.destacada = false;
    Tween.removerDe(peca);
    Tween.para(peca, { scaleX: 1, scaleY: 1 }, 120, Easing.suaveSaida);

    const alvo = this._soqueteVazioMaisProximo(peca.x, peca.y);
    if (alvo) {
      const alvoX = alvo.x + alvo.w;
      const alvoY = alvo.y + alvo.h / 2;
      const perto = this._dentroDaTolerancia(alvo, peca.x, peca.y);
      if (perto && alvo.valor === peca.valor) {
        alvo.preenchida = true;
        peca.trancada = true;
        peca.interativo = false;
        peca.modo = 'furos';
        Tween.removerDe(peca);
        Tween.para(peca, { x: alvoX, y: alvoY }, 180, Easing.suaveSaida);
        if (this.config.audio?.soltar) this.audio.efeito(this.config.audio.soltar);

        if (this._numerosFixos.every((n) => n.preenchida)) {
          this._iniciarChuvaDeContinhas();
        }
        return;
      }
      if (perto) this._tentativasErradas += 1;
    }
    Tween.removerDe(peca);
    Tween.para(peca, { x: peca.trayX, y: peca.trayY }, 220, Easing.suaveSaida);
  }

  _moverArrastoContinha(ponto) {
    const continha = this._arrastando;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    continha.x = local.x + this._deslocX;
    continha.y = local.y + this._deslocY;

    const alvo = this._furoMaisProximo(continha.x, continha.y);
    const raio = this._raioToleranciaFuro();
    const perto = alvo && ((continha.x - alvo.x) ** 2 + (continha.y - alvo.y) ** 2) <= raio ** 2;

    for (const peca of this._pecasQuantidade) peca._furoEmDestaque = -1;
    if (perto) {
      alvo.peca._furoEmDestaque = alvo.indice;
      const dx = alvo.x - continha.x;
      const dy = alvo.y - continha.y;
      const forca = 1 - Math.sqrt(dx * dx + dy * dy) / raio;
      const FATOR_IMA = 0.35;
      continha.x += dx * forca * FATOR_IMA;
      continha.y += dy * forca * FATOR_IMA;
    }
  }

  _soltarArrastoContinha() {
    const continha = this._arrastando;
    this._arrastando = null;
    continha.arrastando = false;
    for (const peca of this._pecasQuantidade) peca._furoEmDestaque = -1;
    Tween.removerDe(continha);
    Tween.para(continha, { scaleX: 1, scaleY: 1 }, 100, Easing.suaveSaida);

    const alvo = this._furoMaisProximo(continha.x, continha.y);
    const raio = this._raioToleranciaFuro();
    const perto = alvo && ((continha.x - alvo.x) ** 2 + (continha.y - alvo.y) ** 2) <= raio ** 2;

    if (perto) {
      alvo.peca.furos[alvo.indice] = continha.cor;
      continha.removerDoPai();
      this._continhas = this._continhas.filter((c) => c !== continha);
      if (this.config.audio?.soltar) this.audio.efeito(this.config.audio.soltar);

      if (alvo.peca.todosFurosCheios()) {
        this._celebrarPeca(alvo.peca);
        this.placar.acertar(1);
        if (!this.placar.encerrado && this._pecasQuantidade.every((p) => p.todosFurosCheios())) {
          this._avancarOnda();
        }
      }
      return;
    }
    Tween.removerDe(continha);
    Tween.para(continha, { x: continha.trayX, y: continha.trayY }, 220, Easing.suaveSaida);
  }

  /** Pulinho de conquista na própria peça quando o último furo dela é preenchido. */
  _celebrarPeca(peca) {
    const baseY = peca.y;
    Tween.removerDe(peca);
    Tween.de(peca)
      .entao({ y: baseY - 12, scaleX: 1.06, scaleY: 1.06 }, 120, Easing.suaveSaida)
      .entao({ y: baseY, scaleX: 1, scaleY: 1 }, 200, Easing.costasSaida);
  }

  // ------------------------------------------------------- a chuva de continhas

  /**
   * Só dispara quando a ÚLTIMA peça da onda encaixa no número certo — decisão
   * registrada no planejamento (ao contrário do vídeo original, que mistura
   * as duas etapas o tempo todo). Cada continha nasce sozinha, com um
   * pequeno atraso entre uma e outra — "chove" na trilha em vez de aparecer
   * tudo de uma vez.
   */
  _iniciarChuvaDeContinhas() {
    this._faseAtual = 'chovendo';
    const cores = rand.embaralhar([...CORES_CONTINHA, ...CORES_CONTINHA]);
    const pendentes = [];
    for (const peca of this._pecasQuantidade) {
      for (let i = 0; i < peca.valor; i++) pendentes.push(true);
    }

    const raioContinha = Math.min(22, this._pecaH * 0.16);
    const gap = 14;
    const larguraLinha = pendentes.length * (raioContinha * 2) + (pendentes.length - 1) * gap;
    const trilha = this._trilha;
    const inicioX = trilha.x + Math.max(gap, (trilha.largura - larguraLinha) / 2) + raioContinha;
    const y = trilha.y + trilha.altura / 2;

    let i = 0;
    const passo = () => {
      if (this.placar.encerrado) return;
      if (i >= pendentes.length) {
        this._faseAtual = 'preenchendo';
        return;
      }
      const continha = new Continha(cores[i % cores.length], raioContinha);
      const x = inicioX + i * (raioContinha * 2 + gap);
      continha.x = x; continha.y = y;
      continha.trayX = x; continha.trayY = y;
      continha.scaleX = 0; continha.scaleY = 0;
      this.area.adicionar(continha);
      this._continhas.push(continha);
      this._ligarArrasteContinha(continha);
      Tween.para(continha, { scaleX: 1, scaleY: 1 }, 220, Easing.costasSaida);

      i += 1;
      Tween.de(this).esperar(110).chamar(passo);
    };
    passo();
  }

  // ------------------------------------------------------------- progressão

  _avancarOnda() {
    Tween.de(this).esperar(500).chamar(() => {
      this._ondaIndex += 1;
      this._construirOnda(this._ondas[this._ondaIndex]);
    });
  }

  _celebrarCompleto() {
    if (this._celebracaoIniciada) return;
    this._celebracaoIniciada = true;
    Tween.de(this).esperar(600).chamar(() => this._terminar(true));
  }

  // ------------------------------------------------------------------- HUD

  _pausar() {
    if (this.placar.encerrado) return;
    this._cancelarArrastoEmCurso();
    Tween.pausarTodos();
    this.pausada = true;
    this.pausa.abrir();
  }

  _pedirAjuda() {
    if (this.placar.encerrado || this.pausada) return;
    this._cancelarArrastoEmCurso();
    Tween.pausarTodos();
    this.pausada = true;
    this.ajuda.abrir();
  }

  _cancelarArrastoEmCurso() {
    if (!this._arrastando) return;
    const alvo = this._arrastando;
    this._arrastando = null;
    alvo.arrastando = false;
    alvo.scaleX = 1; alvo.scaleY = 1;
    for (const numero of this._numerosFixos ?? []) numero.destacada = false;
    for (const peca of this._pecasQuantidade ?? []) peca._furoEmDestaque = -1;
    alvo.x = alvo.trayX;
    alvo.y = alvo.trayY;
  }

  _terminar(venceu) {
    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: { ...this.placar.paraAva(venceu), erros: this._tentativasErradas },
    });
  }

  atualizar(dt) {
    if (this.pausada) {
      this.pausa.atualizar(dt);
      this.ajuda.atualizar(dt);
      return;
    }
    super.atualizar(dt);
    this._atualizarRelogio();
  }

  _atualizarRelogio() {
    const total = Math.floor(this.game.tempoJogando);
    if (total === this._relogioSegundoMostrado) return;
    this._relogioSegundoMostrado = total;
    this._atualizarTextoHud();
  }

  _atualizarTextoHud() {
    const total = this._relogioSegundoMostrado;
    const min = Math.floor(total / 60);
    const seg = total % 60;
    const tempo = `${min}:${String(seg).padStart(2, '0')}`;
    if (this._relogioBadge) {
      this._relogioBadge.texto = this._ondas.length > 1
        ? `${tempo}  ${this.placar.acertos}/${this.placar.total}`
        : tempo;
    }
  }
}
