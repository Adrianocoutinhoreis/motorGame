import {
  Scene, Node, ScoreSystem, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, rand, cores, espaco, tipografia, TextNode, Icone,
} from '../../engine/index.js';

/**
 * Elenco temático fixo, 1 emoji por número — a MESMA figura sempre representa
 * o mesmo número (2 é sempre maçã), pra criança "reconhecer" o número pela
 * figura, não só contar.
 *
 * Maioria frutinha/objeto redondo (silhueta simples, fácil de contar de
 * relance) e só UM bichinho — era 5 bichos (sapo, galinha, gato, cachorro,
 * urso) pra 3 frutas; rostos de animais têm silhueta mais irregular que uma
 * fruta ou bola, mais difícil de diferenciar rápido numa peça pequena.
 */
const ROSTER_EMOJI = ['🍓', '🍎', '🍊', '🍋', '🍇', '🍒', '⚽', '🐱', '⭐'];
const FONTE_EMOJI = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";

/** Paleta lúdica do motor (`engine/theme/tokens.js`), uma cor fixa por número. */
const CORES_NUMERO = [
  cores.ludica.vermelho, cores.ludica.laranja, cores.ludica.amarelo, cores.ludica.verde,
  cores.ludica.turquesa, cores.ludica.azul, cores.ludica.roxo, cores.ludica.rosa, cores.ludica.marrom,
];

function emojiDoValor(v) { return ROSTER_EMOJI[(v - 1 + 9) % 9]; }
function corDoValor(v) { return CORES_NUMERO[(v - 1 + 9) % 9]; }

function faixa(min, max) {
  const lista = [];
  for (let v = min; v <= max; v++) lista.push(v);
  return lista;
}

/**
 * Divide `lista` em ondas de no máximo `tamanho` itens, DISTRIBUÍDAS por
 * igual — nunca só cortando em fatias de `tamanho` e deixando o resto sobrar
 * numa onda final pequena.
 *
 * Cortar em fatias fixas (`3,3,1` para 7 com tamanho 3) deixava a ÚLTIMA
 * onda do nível Difícil com um par SÓ — didaticamente inútil: com um par só
 * na tela, só existe UM soquete e UMA ficha, então não há como errar nem
 * aprender a escolher entre opções (é sempre o par certo, sem alternativa
 * para comparar). Calculando quantas ondas cabem e espalhando o total por
 * elas (`7 -> 3,2,2`, nunca `3,3,1`), toda onda de qualquer nível sempre tem
 * pelo menos 2 pares — uma escolha de verdade.
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

/**
 * O nó de encaixe — MESMA curva usada tanto no entalhe (peça-quantidade)
 * quanto no nó saliente (peça-número), só percorrida em sentidos opostos
 * (`noParaCima`/`noParaBaixo`).
 */
function noParaBaixo(ctx, edgeX, cy, r, nk) {
  ctx.bezierCurveTo(edgeX - r * 0.72, cy - nk, edgeX - r, cy - r * 0.72, edgeX - r, cy);
  ctx.bezierCurveTo(edgeX - r, cy + r * 0.72, edgeX - r * 0.72, cy + nk, edgeX, cy + nk);
}
function noParaCima(ctx, edgeX, cy, r, nk) {
  ctx.bezierCurveTo(edgeX - r * 0.72, cy + nk, edgeX - r, cy + r * 0.72, edgeX - r, cy);
  ctx.bezierCurveTo(edgeX - r, cy - r * 0.72, edgeX - r * 0.72, cy - nk, edgeX, cy - nk);
}

/** Corpo da peça-quantidade: retângulo `w×h` com um ENTALHE na borda direita. */
function tracarCorpoQuantidade(ctx, w, h, r, nk) {
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

/** Corpo da peça-número: retângulo `w×h` com um NÓ saliente na borda esquerda. */
function tracarCorpoNumero(ctx, w, h, r, nk) {
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
 * Padrões de subitização estruturados e canônicos (estilo dado / dominó / triângulo)
 * com cálculo de proporção ampliada e respiro matemático garantido contra sobreposição.
 */
function obterLayoutMarcadores(n, safeW, safeH) {
  const posicoes = [];
  let tamanho = 32;

  if (n === 1) {
    // 1 ícone grande centralizado
    posicoes.push({ cx: safeW * 0.50, cy: safeH * 0.50 });
    tamanho = Math.min(safeW, safeH) * 0.65;
  } else if (n === 2) {
    // 2 colunas amplas com espaçamento confortável
    posicoes.push(
      { cx: safeW * 0.28, cy: safeH * 0.50 },
      { cx: safeW * 0.72, cy: safeH * 0.50 },
    );
    tamanho = Math.min(safeW * 0.40, safeH * 0.54);
  } else if (n === 3) {
    // Layout Triangular canônico (1 no topo central, 2 na base) — preenche largura e altura
    posicoes.push(
      { cx: safeW * 0.50, cy: safeH * 0.28 },
      { cx: safeW * 0.26, cy: safeH * 0.74 },
      { cx: safeW * 0.74, cy: safeH * 0.74 },
    );
    tamanho = Math.min(safeW * 0.42, safeH * 0.42);
  } else if (n === 4) {
    // Matriz 2x2 quadrada expandida
    posicoes.push(
      { cx: safeW * 0.27, cy: safeH * 0.27 },
      { cx: safeW * 0.73, cy: safeH * 0.27 },
      { cx: safeW * 0.27, cy: safeH * 0.73 },
      { cx: safeW * 0.73, cy: safeH * 0.73 },
    );
    tamanho = Math.min(safeW * 0.38, safeH * 0.38);
  } else if (n === 5) {
    // Padrão canônico de dado 5 (4 vértices + 1 centro isolado)
    posicoes.push(
      { cx: safeW * 0.24, cy: safeH * 0.24 },
      { cx: safeW * 0.76, cy: safeH * 0.24 },
      { cx: safeW * 0.50, cy: safeH * 0.50 },
      { cx: safeW * 0.24, cy: safeH * 0.76 },
      { cx: safeW * 0.76, cy: safeH * 0.76 },
    );
    tamanho = Math.min(safeW * 0.30, safeH * 0.30);
  } else if (n === 6) {
    // Matriz 2x3 proporcional (2 colunas x 3 linhas)
    posicoes.push(
      { cx: safeW * 0.28, cy: safeH * 0.20 },
      { cx: safeW * 0.72, cy: safeH * 0.20 },
      { cx: safeW * 0.28, cy: safeH * 0.50 },
      { cx: safeW * 0.72, cy: safeH * 0.50 },
      { cx: safeW * 0.28, cy: safeH * 0.80 },
      { cx: safeW * 0.72, cy: safeH * 0.80 },
    );
    tamanho = Math.min(safeW * 0.36, safeH * 0.27);
  } else if (n === 7) {
    // Disposição balanceada 2 - 3 - 2
    posicoes.push(
      { cx: safeW * 0.30, cy: safeH * 0.20 },
      { cx: safeW * 0.70, cy: safeH * 0.20 },
      { cx: safeW * 0.18, cy: safeH * 0.50 },
      { cx: safeW * 0.50, cy: safeH * 0.50 },
      { cx: safeW * 0.82, cy: safeH * 0.50 },
      { cx: safeW * 0.30, cy: safeH * 0.80 },
      { cx: safeW * 0.70, cy: safeH * 0.80 },
    );
    tamanho = Math.min(safeW * 0.28, safeH * 0.25);
  } else if (n === 8) {
    // Matriz 2x4 (2 colunas x 4 linhas)
    posicoes.push(
      { cx: safeW * 0.28, cy: safeH * 0.16 },
      { cx: safeW * 0.72, cy: safeH * 0.16 },
      { cx: safeW * 0.28, cy: safeH * 0.38 },
      { cx: safeW * 0.72, cy: safeH * 0.38 },
      { cx: safeW * 0.28, cy: safeH * 0.62 },
      { cx: safeW * 0.72, cy: safeH * 0.62 },
      { cx: safeW * 0.28, cy: safeH * 0.84 },
      { cx: safeW * 0.72, cy: safeH * 0.84 },
    );
    tamanho = Math.min(safeW * 0.36, safeH * 0.21);
  } else if (n === 9) {
    // Matriz 3x3 regular e preenchida
    posicoes.push(
      { cx: safeW * 0.20, cy: safeH * 0.20 },
      { cx: safeW * 0.50, cy: safeH * 0.20 },
      { cx: safeW * 0.80, cy: safeH * 0.20 },
      { cx: safeW * 0.20, cy: safeH * 0.50 },
      { cx: safeW * 0.50, cy: safeH * 0.50 },
      { cx: safeW * 0.80, cy: safeH * 0.50 },
      { cx: safeW * 0.20, cy: safeH * 0.80 },
      { cx: safeW * 0.50, cy: safeH * 0.80 },
      { cx: safeW * 0.80, cy: safeH * 0.80 },
    );
    tamanho = Math.min(safeW * 0.27, safeH * 0.25);
  }

  return { posicoes, tamanho };
}

/**
 * Desenha o receptáculo fantasma pontilhado à direita da peça-quantidade,
 * com alto contraste e destaque âmbar/dourado ao aproximar.
 */
function desenharFantasmaNumero(ctx, w, h, r, nk, destacada) {
  ctx.save();
  ctx.translate(w - r, 0);
  tracarCorpoNumero(ctx, w, h, r, nk);

  if (destacada) {
    // Destaque dourado/âmbar ativo ao aproximar a peça
    ctx.fillStyle = 'rgba(245, 158, 11, 0.28)';
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3.8;
    ctx.setLineDash([8, 4]);
    ctx.stroke();

    // Ícone de interrogação em destaque dourado
    ctx.fillStyle = '#B45309';
    ctx.font = `800 ${Math.round(h * 0.44)}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', r + w / 2, h / 2);
  } else {
    // Rebaixo entalhado sutil na base de madeira clara
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
 * PecaQuantidade — a metade FIXA do par: mostra `valor` marcadores do mesmo
 * emoji e o contorno fantasma do soquete esperando a peça-número correspondente.
 */
class PecaQuantidade extends Node {
  constructor(valor, w, h, r, nk) {
    super({ largura: w * 2, altura: h });
    this.valor = valor;
    this.w = w;
    this.h = h;
    this.r = r;
    this.nk = nk;
    this.preenchida = false;
    this.destacada = false;
  }

  desenhar(ctx) {
    const { w, h, r, nk } = this;

    // Soquete fantasma à direita (quando ainda não encaixou a peça)
    if (!this.preenchida) {
      desenharFantasmaNumero(ctx, w, h, r, nk, this.destacada);
    }

    // Peça de quantidade (metade esquerda)
    ctx.save();
    tracarCorpoQuantidade(ctx, w, h, r, nk);
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

    this._desenharMarcadores(ctx);

    if (this.destacada && !this.preenchida) {
      ctx.save();
      tracarCorpoQuantidade(ctx, w, h, r, nk);
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();
    }
  }

  _desenharMarcadores(ctx) {
    const n = this.valor;
    const { w, h, r } = this;
    
    // ÁREA SEGURA AMPLIADA:
    // O entalhe do encaixe corta a borda direita em r pixels (de w-r até w).
    // Deixamos margem limpa à esquerda e ao topo/base para máximo aproveitamento.
    const margemEsquerda = 10;
    const margemDireita = r + 6;
    const safeW = w - margemEsquerda - margemDireita;
    const safeH = h * 0.88;
    const marginTop = (h - safeH) / 2;
    const emoji = emojiDoValor(n);

    const { posicoes, tamanho } = obterLayoutMarcadores(n, safeW, safeH);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${tamanho.toFixed(1)}px ${FONTE_EMOJI}`;

    for (let i = 0; i < n; i++) {
      const p = posicoes[i] ?? { cx: safeW / 2, cy: safeH / 2 };
      const cx = margemEsquerda + p.cx;
      const cy = marginTop + p.cy;
      ctx.fillText(emoji, cx, cy);
    }
    ctx.restore();
  }
}

/**
 * FichaNumero — a metade ARRASTÁVEL do par: o algarismo grande, na cor
 * do número. `regX=r, regY=h/2` garante o alinhamento no ponto de encaixe.
 */
class FichaNumero extends Node {
  constructor(valor, w, h, r, nk) {
    super({
      largura: w + r, altura: h, interativo: true, regX: r, regY: h / 2,
    });
    this.valor = valor;
    this.w = w;
    this.h = h;
    this.r = r;
    this.nk = nk;
    this.trancada = false;
    this.arrastando = false;
    this.trayX = 0;
    this.trayY = 0;
  }

  desenhar(ctx) {
    const { w, h, r, nk } = this;

    ctx.save();
    tracarCorpoNumero(ctx, w, h, r, nk);
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
    ctx.fillStyle = corDoValor(this.valor);
    ctx.font = `800 ${Math.round(h * 0.65)}px Outfit, system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(this.valor), r + w / 2, h / 2 + h * 0.02);
    ctx.restore();
  }
}

/**
 * PainelZona — o "cartão" de fundo acolhedor de cada área (tabuleiro e bandeja).
 */
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

/**
 * Badge do Cronômetro / HUD ampliado e destacado.
 */
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

    // Mede a largura do texto para centralizar perfeitamente o conjunto (Ícone + Espaço + Texto)
    ctx.font = '800 24px Outfit, system-ui, sans-serif';
    const textWidth = ctx.measureText(this.texto).width;
    const raio = 12;
    const espacoIconeTexto = 10;
    const larguraConjunto = raio * 2 + espacoIconeTexto + textWidth;
    const inicioX = (this.largura - larguraConjunto) / 2;

    const cx = inicioX + raio;
    const cy = this.altura / 2;

    // Ícone de Relógio Vetorial
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, raio, 0, Math.PI * 2);
    ctx.stroke();

    // Ponteiros
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 6);
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 5, cy);
    ctx.stroke();

    // Texto do Cronômetro
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.texto, cx + raio + espacoIconeTexto, cy + 1);
    ctx.restore();
  }
}

/**
 * GameScene — a partida do Encaixe Certo.
 */
export class GameScene extends Scene {
  static MAX_PARES_POR_ONDA = 3;

  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = new ScoreSystem({ total: this.nivel.meta, nivel: this.nivel.id ?? 1 });

    // Fundo limpo sem números flutuantes de giz para foco total, com tom azul suave
    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'quarto',
      corCeuTopo: config.corCeuTopo ?? '#0E243D',
      corCeuBase: config.corCeuBase ?? '#18426B',
      mostrarDecoracoes: false,
    }));

    // -------------------------------------------------------------- sorteio
    const valores = rand.embaralhar(faixa(1, this.nivel.numeroMax)).slice(0, this.nivel.meta);
    this._ondas = dividirEmOndas(valores, GameScene.MAX_PARES_POR_ONDA);
    this._ondaIndex = 0;

    // ------------------------------------------------------------- geometria
    // HUD fica no topo (0 a 96px) e a prateleira fica na base (648px).
    // Centralizamos o conjunto perfeitamente no vão vertical de 552px.
    this._topo = 110;
    const margemLateral = 44;
    this._areaLargura = L - margemLateral * 2;
    this.area = new Node({ x: margemLateral, y: this._topo });
    this.adicionar(this.area);

    this._padPainelX = 26;
    this._padPainelY = 26;
    this._espacoEntreZonas = 28;
    this._margemInferior = 16;

    this.aoDesmontar(this.input.on('arrastar', (ponto) => this._moverArrasto(ponto)));
    this.aoDesmontar(this.input.on('soltar', (ponto) => this._soltarArrasto(ponto)));
    this.aoDesmontar(this.input.on('cancelar', (ponto) => this._soltarArrasto(ponto)));

    // ------------------------------------------------------------------ HUD
    this.adicionar(new IconButton({
      icone: 'pausa',
      x: espaco.md,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._pausar(),
    }));

    this.adicionar(new IconButton({
      icone: 'tutorial',
      x: espaco.md + 72 + espaco.md,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._pedirAjuda(),
    }));

    this.adicionar(new SoundToggle({
      audio: this.audio,
      x: L - 96,
      y: espaco.md,
      somToque: config.audio?.clique,
    }));

    // Cronômetro Ampliado e Centralizado no HUD — opcional
    // (`config.mostrarCronometro`, padrão `true`). `_relogioBadge` fica
    // `null` quando desligado, e todo método que o toca já checa isso antes
    // (`_atualizarRelogio`/`_atualizarTextoHud`) — mais barato e mais direto
    // que criar o nó escondido e filtrar `atualizar()` toda hora.
    this._relogioBadge = config.mostrarCronometro === false ? null : new RelogioBadge({
      x: L / 2,
      y: espaco.md + 26,
      largura: 170,
      altura: 50,
    });
    if (this._relogioBadge) this.adicionar(this._relogioBadge);
    this._relogioSegundoMostrado = 0;
    this.placar.on('mudou', () => this._atualizarTextoHud());

    // ---------------------------------------------------------------- pausa
    this.pausa = new PauseScreen({
      largura: L,
      altura: A,
      audio: this.audio,
      config,
      mostrarSom: false,
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

    this._construirOnda(this._ondas[this._ondaIndex]);
  }

  /**
   * Constrói a onda atual perfeitamente centralizada verticalmente entre o HUD e a prateleira.
   */
  _construirOnda(valoresOnda) {
    this._painelTabuleiro?.removerDoPai();
    this._painelBandeja?.removerDoPai();
    for (const peca of this.pecasQuantidade ?? []) peca.removerDoPai();
    for (const ficha of this.fichasNumero ?? []) ficha.removerDoPai();

    const areaLargura = this._areaLargura;
    const numPares = valoresOnda.length;

    const ordemTabuleiro = rand.embaralhar([...valoresOnda]);
    const ordemBandeja = rand.embaralhar([...valoresOnda]);

    const padX = this._padPainelX;
    const padY = this._padPainelY;
    const gapTabuleiro = 28;
    const gapBandeja = 40;
    const espacoEntreZonas = this._espacoEntreZonas;

    // Peças mais altas e volumosas na vertical (h = 168px)
    const larguraUtilTabuleiro = areaLargura - padX * 2;
    const wMaxPorLargura = (larguraUtilTabuleiro - gapTabuleiro * (numPares - 1)) / (2 * numPares);
    const w = Math.min(182, Math.max(135, Math.floor(wMaxPorLargura)));
    const h = Math.round(w * 0.94); // Tabuleiro e peças com altura generosa
    const r = Math.round(w * 0.24);
    const nk = Math.round(r * 0.25);

    // --------------------------------------------------------- Tabuleiro (Topo)
    const larguraGradeTabuleiro = numPares * (2 * w) + (numPares - 1) * gapTabuleiro;
    const alturaGradeTabuleiro = h;
    const larguraPainelTabuleiro = Math.min(areaLargura, larguraGradeTabuleiro + padX * 2);
    const alturaPainelTabuleiro = alturaGradeTabuleiro + padY * 2;

    // --------------------------------------------------------- Bandeja (Base)
    const padBandejaY = 20;
    const larguraFicha = w + r;
    const larguraGradeBandeja = numPares * larguraFicha + (numPares - 1) * gapBandeja;
    const alturaGradeBandeja = h;
    const larguraPainelBandeja = Math.min(areaLargura, larguraGradeBandeja + padX * 2);
    const alturaPainelBandeja = alturaGradeBandeja + padBandejaY * 2;

    // Posição vertical centralizada no espaço da tela (bem abaixo dos botões e do cronômetro)
    const yPainelTabuleiro = 34;
    const xPainelTabuleiro = (areaLargura - larguraPainelTabuleiro) / 2;

    this._painelTabuleiro = new PainelZona({
      largura: larguraPainelTabuleiro,
      altura: alturaPainelTabuleiro,
      cor: '#F5ECD7',
      bordaCor: 'rgba(180, 130, 60, 0.45)',
    });
    this._painelTabuleiro.x = xPainelTabuleiro;
    this._painelTabuleiro.y = yPainelTabuleiro;
    this.area.adicionar(this._painelTabuleiro);

    // Posicionamento das peças-quantidade no Tabuleiro
    const inicioXPecas = xPainelTabuleiro + (larguraPainelTabuleiro - larguraGradeTabuleiro) / 2;
    const yPecas = yPainelTabuleiro + padY;

    this.pecasQuantidade = [];
    ordemTabuleiro.forEach((valor, i) => {
      const peca = new PecaQuantidade(valor, w, h, r, nk, this.nivel.disposicao === 'espalhada');
      peca.x = inicioXPecas + i * (2 * w + gapTabuleiro);
      peca.y = yPecas;
      this.area.adicionar(peca);
      this.pecasQuantidade.push(peca);
    });

    // Posicionamento do painel da Bandeja
    const yPainelBandeja = yPainelTabuleiro + alturaPainelTabuleiro + espacoEntreZonas;
    const xPainelBandeja = (areaLargura - larguraPainelBandeja) / 2;

    this._painelBandeja = new PainelZona({
      largura: larguraPainelBandeja,
      altura: alturaPainelBandeja,
      cor: '#FEF3C7',
      bordaCor: '#F59E0B',
    });
    this._painelBandeja.x = xPainelBandeja;
    this._painelBandeja.y = yPainelBandeja;
    this.area.adicionar(this._painelBandeja);

    // Posicionamento das fichas numéricas na Bandeja
    const inicioXFichas = xPainelBandeja + (larguraPainelBandeja - larguraGradeBandeja) / 2;
    const yFichas = yPainelBandeja + padBandejaY + h / 2;

    this.fichasNumero = [];
    this.fichaDoValor = new Map();
    ordemBandeja.forEach((valor, i) => {
      const ficha = new FichaNumero(valor, w, h, r, nk);
      const px = inicioXFichas + i * (larguraFicha + gapBandeja) + r;
      const py = yFichas;
      ficha.trayX = px;
      ficha.trayY = py;
      ficha.x = px;
      ficha.y = py;

      this.area.adicionar(ficha);
      this.fichasNumero.push(ficha);
      this.fichaDoValor.set(valor, ficha);
      this._ligarArraste(ficha);
    });

    this._atualizarTextoHud();
  }

  /** Soquete VAZIO mais próximo de um ponto (coordenadas de `this.area`). */
  _soqueteVazioMaisProximo(x, y) {
    let melhor = null;
    let menor = Infinity;
    for (const peca of this.pecasQuantidade) {
      if (peca.preenchida) continue;
      const alvoX = peca.x + peca.w;
      const alvoY = peca.y + peca.h / 2;
      const d = (x - alvoX) ** 2 + (y - alvoY) ** 2;
      if (d < menor) { menor = d; melhor = peca; }
    }
    return melhor;
  }

  /**
   * Raio de aceite do soquete — mesmo raio usado pra VALIDAR o encaixe
   * (`_dentroDaTolerancia`) e pro ÍMÃ que puxa a ficha durante o arrasto
   * (`_moverArrasto`), um só lugar pra não desalinhar os dois.
   *
   * Era `1.1×` (depois `1.35×`) a altura da peça — bem maior que a própria
   * peça (~80-90% da LARGURA dela), então soltar longe do soquete, quase
   * fora do cartão, ainda contava como acerto. `0.45×` (primeira correção)
   * resolvia isso, mas media ~39% da LARGURA na prática — apertado demais
   * pro dedo de uma criança de 4-7 anos, que erra a mira por imprecisão
   * motora, não por não saber o que fazer. `0.7×` (~65% da largura) foi o
   * meio-termo — mas o raio sozinho não bastava: motricidade fina (mão que
   * treme, dedo maior que a tela) pode deixar a SOLTA fora do raio mesmo
   * mirando certo, e a criança nunca vê o "quase". O ímã (`_moverArrasto`)
   * resolve essa parte: perto o bastante, mesmo sem soltar em cima do pixel
   * exato, a peça já escorrega sozinha pro lugar antes do dedo sair da tela.
   */
  _raioTolerancia(peca) {
    return peca.h * 0.7;
  }

  _dentroDaTolerancia(peca, x, y) {
    const alvoX = peca.x + peca.w;
    const alvoY = peca.y + peca.h / 2;
    const raio = this._raioTolerancia(peca);
    const d = (x - alvoX) ** 2 + (y - alvoY) ** 2;
    return d <= raio ** 2;
  }

  _ligarArraste(ficha) {
    ficha.on('apertar', (ponto) => {
      if (this.pausada || this.placar.encerrado || this._arrastando || ficha.trancada) return;
      const local = this.area.globalParaLocal(ponto.x, ponto.y);
      this._deslocX = ficha.x - local.x;
      this._deslocY = ficha.y - local.y;
      ficha.arrastando = true;
      ficha.paraFrente();
      Tween.removerDe(ficha);
      Tween.para(ficha, { scaleX: 1.08, scaleY: 1.08 }, 100, Easing.suaveSaida);
      this._arrastando = ficha;
    });
  }

  _moverArrasto(ponto) {
    const ficha = this._arrastando;
    if (!ficha) return;
    const local = this.area.globalParaLocal(ponto.x, ponto.y);
    ficha.x = local.x + this._deslocX;
    ficha.y = local.y + this._deslocY;

    const alvo = this._soqueteVazioMaisProximo(ficha.x, ficha.y);
    const perto = alvo && this._dentroDaTolerancia(alvo, ficha.x, ficha.y);
    for (const peca of this.pecasQuantidade) peca.destacada = perto && peca === alvo;

    // Ímã: perto o bastante de QUALQUER soquete vazio (certo ou errado — não
    // é o valor que decide, é só posição, igual o anel de destaque acima),
    // a ficha é puxada suavemente pro centro do soquete a cada quadro. Ajuda
    // quem não consegue soltar com precisão de pixel (mão que treme, dedo
    // maior que a área alvo) sem entregar de graça se o número bate: uma
    // ficha errada também é atraída, e só não trava ao soltar
    // (`_tentarEncaixar` continua exigindo `alvo.valor === ficha.valor`).
    if (perto) {
      const alvoX = alvo.x + alvo.w;
      const alvoY = alvo.y + alvo.h / 2;
      const dx = alvoX - ficha.x;
      const dy = alvoY - ficha.y;
      const raio = this._raioTolerancia(alvo);
      const forca = 1 - Math.sqrt(dx * dx + dy * dy) / raio; // 0 na borda, 1 no centro
      const FATOR_IMA = 0.3; // fração do caminho restante puxada a cada quadro
      ficha.x += dx * forca * FATOR_IMA;
      ficha.y += dy * forca * FATOR_IMA;
    }
  }

  /** `soltar`/`cancelar` não precisam mais do ponto — ver o comentário abaixo. */
  _soltarArrasto() {
    const ficha = this._arrastando;
    if (!ficha) return;
    this._arrastando = null;
    ficha.arrastando = false;
    for (const peca of this.pecasQuantidade) peca.destacada = false;
    Tween.removerDe(ficha);
    Tween.para(ficha, { scaleX: 1, scaleY: 1 }, 120, Easing.suaveSaida);

    // Valida na posição ATUAL da ficha (`ficha.x/y`), não no ponto cru do
    // dedo/mouse: o ímã de `_moverArrasto` já pode ter puxado a ficha mais
    // perto do soquete do que o dedo estava exatamente — o que a criança VÊ
    // na tela (a ficha já quase encostada) é o que precisa valer, senão o
    // ímã vira uma promessa vazia (parece que vai encaixar e não encaixa).
    this._tentarEncaixar(ficha, { x: ficha.x, y: ficha.y });
  }

  _tentarEncaixar(ficha, ponto) {
    const alvo = this._soqueteVazioMaisProximo(ponto.x, ponto.y);
    if (alvo) {
      const alvoX = alvo.x + alvo.w;
      const alvoY = alvo.y + alvo.h / 2;
      if (this._dentroDaTolerancia(alvo, ponto.x, ponto.y) && alvo.valor === ficha.valor) {
        alvo.preenchida = true;
        ficha.trancada = true;
        ficha.interativo = false;
        Tween.removerDe(ficha);
        Tween.para(ficha, { x: alvoX, y: alvoY }, 180, Easing.suaveSaida);
        if (this.config.audio?.soltar) this.audio.efeito(this.config.audio.soltar);
        this.placar.acertar(1);

        if (!this.placar.encerrado && this.pecasQuantidade.every((p) => p.preenchida)) {
          this._avancarOnda();
        }
        return;
      }
    }
    Tween.removerDe(ficha);
    Tween.para(ficha, { x: ficha.trayX, y: ficha.trayY }, 220, Easing.suaveSaida);
  }

  /**
   * Salta cada par (comemoração de onda/vitória) — mas ANTES disso, assenta
   * cada ficha exatamente no encaixe, sem depender de nenhum tween anterior
   * ter tido tempo de terminar.
   *
   * Bug real: quando o par que acabava de chamar esta função era o ÚLTIMO da
   * onda (o mais comum — é o par que COMPLETA a onda que dispara a
   * comemoração), `_tentarEncaixar` tinha acabado de iniciar
   * `Tween.para(ficha, {x:alvoX,y:alvoY}, 180, ...)` no MESMO instante
   * síncrono — o tween nem tinha rodado um quadro ainda. Esta função então
   * lia `baseYFicha = ficha.y` (a posição de ANTES de soltar, não a de
   * encaixe) e fazia a ficha saltar em torno do lugar ERRADO, e o tween de
   * encaixe (ainda vivo, sem cancelar) brigava pelo mesmo `y` — resultado:
   * a peça ficava visivelmente fora do lugar bem no instante em que a tela
   * trocava (onda seguinte, ou resultado). Sempre no ÚLTIMO encaixe de uma
   * onda, nunca nos outros — porque só o último corre essa corrida.
   *
   * Consertado assentando a ficha na hora (`Tween.removerDe` cancela
   * qualquer tween pendente, `ficha.x`/`baseYFicha` vêm da GEOMETRIA do
   * soquete, nunca de `ficha.x/y` correntes) — não importa se um tween de
   * encaixe estava ou não em andamento, o resultado é sempre o mesmo lugar
   * certo.
   */
  _saltarParesDaOnda(aoFinalizar) {
    this.pecasQuantidade.forEach((peca, i) => {
      const ficha = this.fichaDoValor.get(peca.valor);
      const baseYPeca = peca.y;
      const alvoXFicha = peca.x + peca.w;
      const baseYFicha = peca.y + peca.h / 2;
      Tween.removerDe(ficha);
      ficha.x = alvoXFicha;
      ficha.y = baseYFicha;

      const atraso = i * 60;
      Tween.de(peca).esperar(atraso)
        .entao({ y: baseYPeca - 14 }, 140, Easing.suaveSaida)
        .entao({ y: baseYPeca }, 220, Easing.costasSaida);
      Tween.de(ficha).esperar(atraso)
        .entao({ y: baseYFicha - 14 }, 140, Easing.suaveSaida)
        .entao({ y: baseYFicha }, 220, Easing.costasSaida);
    });
    Tween.de(this).esperar(this.pecasQuantidade.length * 60 + 500).chamar(aoFinalizar);
  }

  _avancarOnda() {
    this._saltarParesDaOnda(() => {
      this._ondaIndex += 1;
      this._construirOnda(this._ondas[this._ondaIndex]);
    });
  }

  _celebrarCompleto() {
    if (this._celebracaoIniciada) return;
    this._celebracaoIniciada = true;
    this._saltarParesDaOnda(() => this._terminar(true));
  }

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
    const ficha = this._arrastando;
    this._arrastando = null;
    ficha.arrastando = false;
    ficha.scaleX = 1;
    ficha.scaleY = 1;
    for (const peca of this.pecasQuantidade) peca.destacada = false;
    ficha.x = ficha.trayX;
    ficha.y = ficha.trayY;
  }

  _terminar(venceu) {
    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: this.placar.paraAva(venceu),
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
