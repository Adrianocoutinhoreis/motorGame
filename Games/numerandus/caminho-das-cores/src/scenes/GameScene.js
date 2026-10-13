import {
  Scene, Node, TextNode, ScoreSystem, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, rand, cores,
} from '../../engine/index.js';

/**
 * Caminho das Cores — copiar o CARTÃO nas 5 trilhas, como no brinquedo do
 * vídeo de referência (`assets/`, fora do pacote): uma prancha de MDF com as
 * peças soltas num monte em cima, uma ripa com UMA abertura à esquerda, um
 * corredor e 5 trilhas embaixo. A peça sai do monte pela abertura, corre o
 * corredor e desce a trilha até o fundo — esse é o "caminho" do nome.
 *
 * As peças são as do brinquedo: 5 cores × 4 formas, cada combinação uma vez
 * só, SEM peça sobrando. Cada peça do monte tem exatamente um lugar certo no
 * tabuleiro — a criança pode chegar lá por eliminação.
 *
 * Gesto (pensado pra 4-7 anos, sem exigir precisão): TOCAR na peça (ela
 * fica escolhida) e depois TOCAR na trilha — é o que o tutorial ensina. Só
 * nos níveis com `arrastar: true` (o Fácil) também dá pra ARRASTAR a peça e
 * soltar em qualquer ponto de uma trilha; nos outros, um arrasto não move a
 * peça, só a escolhe, como um toque (quem tenta arrastar nunca fica sem
 * resposta). Nos dois casos a peça percorre o caminho sozinha, animada. Tocar na peça
 * do TOPO de uma trilha devolve ela ao monte pelo mesmo caminho.
 *
 * Nada é validado no encaixe. CONFIRMAR só acende com as 5 trilhas cheias e
 * compara o tabuleiro inteiro com o cartão. Errar nunca desconta (RE-02) e a
 * ajuda cresce em degraus, contados só NESTE cartão:
 *   1º erro — as peças fora do lugar ganham um anel e balançam;
 *   2º erro — também acende a coluna do cartão de cada trilha com erro;
 *   3º erro em diante — o tabuleiro se monta sozinho (holofote + cascata) e
 *                       volta pro que a criança tinha.
 *
 * O cartão tem a mesma largura da prancha e cada coluna dele o mesmo x da
 * trilha correspondente: no celular fica em cima, com a coluna N exatamente
 * sobre a trilha N; no computador fica ao lado, embaixo dos botões e das
 * estrelas, com o CONFIRMAR logo abaixo. Os números 1-5 embaixo dos dois
 * reforçam a ligação.
 */

const FORMAS = ['quadrado', 'triangulo', 'circulo', 'pentagono'];
// As 5 cores do brinquedo, na ordem do cartão do vídeo.
const CORES = [
  cores.ludica.vermelho, cores.ludica.laranja, cores.ludica.verde, cores.ludica.amarelo, cores.ludica.azul,
];

const ERROS_PARA_DEMONSTRACAO = 3;
// Demonstração (3º erro): mesmos tempos do Material Dourado.
const ATRASO_ENTRE_PECAS = 190;
const DURACAO_POP = 360;
const DURACAO_SAIDA = 320;
const ESPERA_MONTADA = 1100;
const ESPERA_AVANCO = 1300;

/** Velocidade da peça percorrendo o caminho, em px/s. */
const VELOCIDADE_CAMINHO = 1100;
/** Quanto o dedo precisa andar pra um toque virar arrasto. */
const LIMIAR_ARRASTO = 12;

const COR_MDF = '#C8A27A';
const COR_MDF_ESCURO = '#B48C63';
const COR_RIPA = '#F4EFE6';
const COR_DOURADO = '#E0AB1B';

/**
 * Sorteia um cartão. `monocor`: cada trilha tem UMA cor (as 5 cores, em
 * ordem embaralhada) e as formas variam de ordem — o cartão usado no vídeo.
 * `misturada`: as combinações cor+forma espalhadas pelas colunas — os outros
 * cartões que aparecem no começo do vídeo.
 */
function gerarCartela(nivel) {
  if (nivel.cartela === 'misturada') {
    const todas = [];
    for (const cor of CORES) for (const forma of FORMAS) todas.push({ forma, cor });
    const embaralhadas = rand.embaralhar(todas);
    return Array.from({ length: nivel.trilhas }, (_, t) => (
      embaralhadas.slice(t * nivel.profundidade, (t + 1) * nivel.profundidade)
    ));
  }
  const coresTrilhas = rand.embaralhar([...CORES]).slice(0, nivel.trilhas);
  return coresTrilhas.map((cor) => (
    rand.embaralhar([...FORMAS]).slice(0, nivel.profundidade).map((forma) => ({ forma, cor }))
  ));
}

// ------------------------------------------------------------------ formas

/** Traça uma forma geométrica centrada na origem, cabendo num quadrado de lado `tam`. */
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
    default: { // 'pentagono'
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

function desenharFormaCheia(ctx, forma, cor, tam) {
  tracarForma(ctx, forma, tam);
  ctx.fillStyle = cor;
  ctx.fill();
  ctx.lineWidth = Math.max(1.5, tam * 0.025);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.stroke();
}

// ------------------------------------------------------------------- peças

/**
 * Uma peça. Vive no monte (`slot` ≥ 0), em voo pelo caminho (`emVoo`) ou
 * numa trilha (`trilha` + `indiceTrilha`). `realce` é o retorno visual do
 * CONFIRMAR: `'revisar'` (anel tracejado pulsando até ela sair da trilha)
 * ou `'ok'` (brilho verde que some sozinho).
 */
class Peca extends Node {
  constructor(forma, cor, tam) {
    super({ largura: tam, altura: tam, regX: tam / 2, regY: tam / 2, interativo: true });
    this.forma = forma;
    this.cor = cor;
    this.tam = tam;
    this.slot = -1;
    this.trilha = null;
    this.indiceTrilha = -1;
    this.emVoo = false;
    this.arrastando = false;
    this.selecionada = false;
    this.realce = null;
    this.brilhoOk = 0;
    this._t = Math.random() * 10;
  }

  atualizar(dt) {
    super.atualizar(dt);
    this._t += dt;
  }

  desenhar(ctx) {
    const m = this.tam / 2;
    ctx.save();
    ctx.translate(m, m);
    // Peça escolhida fica pulando de leve: a criança não esquece o que escolheu.
    if (this.selecionada) ctx.translate(0, -Math.abs(Math.sin(this._t * 5)) * this.tam * 0.1);

    if (this.selecionada) {
      const pulso = 0.5 + 0.5 * Math.sin(this._t * 5);
      ctx.beginPath();
      ctx.arc(0, 0, m * 1.18, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253, 224, 71, ${0.35 + pulso * 0.25})`;
      ctx.fill();
    }

    const elevada = this.arrastando || this.selecionada || this.emVoo;
    ctx.shadowColor = elevada ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = elevada ? 14 : 5;
    ctx.shadowOffsetY = elevada ? 7 : 3;
    desenharFormaCheia(ctx, this.forma, this.cor, this.tam);
    ctx.shadowColor = 'transparent';

    if (this.brilhoOk > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, m * 1.12, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = `rgba(34, 197, 94, ${this.brilhoOk})`;
      ctx.stroke();
    }

    if (this.realce === 'revisar') {
      const pulso = 0.5 + 0.5 * Math.sin(this._t * 4);
      ctx.beginPath();
      ctx.arc(0, 0, m * 1.14, 0, Math.PI * 2);
      ctx.setLineDash([7, 5]);
      ctx.lineDashOffset = -this._t * 20;
      ctx.lineWidth = 4;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.65 + pulso * 0.35})`;
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }
}

/**
 * Uma trilha — só geometria e realce; as peças são nós próprios (filhos da
 * mesma mesa). `pecas[0]` é o fundo. `destaque` acende enquanto uma peça
 * arrastada está por cima; `alvo` marca as trilhas livres enquanto há uma
 * peça escolhida por toque.
 */
class Trilha extends Node {
  constructor({ indice, x, y, largura, altura }) {
    super({ x, y, largura, altura });
    this.indice = indice;
    this.sequencia = [];
    this.pecas = [];
    this.destaque = false;
    this.alvo = false;
    this._t = 0;
  }

  completa() { return this.pecas.length > 0 && this.pecas.every((p) => p !== null); }

  /** Posição vazia mais baixa, ou -1 se cheia. */
  indiceVazio() { return this.pecas.indexOf(null); }

  /** A peça do topo da pilha (a única que sai), ou -1 se vazia. */
  indiceTopo() {
    for (let i = this.pecas.length - 1; i >= 0; i--) if (this.pecas[i]) return i;
    return -1;
  }

  atualizar(dt) {
    super.atualizar(dt);
    this._t += dt;
  }

  desenhar(ctx) {
    if (!this.destaque && !this.alvo) return;
    ctx.save();
    if (this.destaque) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.roundRect(0, 0, this.largura, this.altura, 8);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = COR_DOURADO;
      ctx.stroke();
    } else {
      const pulso = 0.5 + 0.5 * Math.sin(this._t * 4);
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = `rgba(224, 171, 27, ${0.55 + pulso * 0.45})`;
      ctx.beginPath();
      ctx.roundRect(2, 2, this.largura - 4, this.altura - 4, 8);
      ctx.stroke();
      ctx.setLineDash([]);
      // Dedinho branco no alto da trilha, apontando pra baixo: "toque aqui".
      const h = Math.min(50, this.largura * 0.55);
      desenharDedo(ctx, this.largura / 2, 8 + h + pulso * 6, h);
    }
    ctx.restore();
  }
}

/**
 * Mão branca com o indicador apontando pra BAIXO; a ponta do dedo fica em
 * (`cx`, `yPonta`) e a mão inteira tem altura `h`. Contorno escuro limpo:
 * primeiro todas as partes com traço grosso, depois todas preenchidas por
 * cima (assim não sobra linha interna entre dedo, palma e punho).
 */
function desenharDedo(ctx, cx, yPonta, h) {
  const u = h;
  const partes = [
    // [x, y, largura, altura, raio] em unidades de `h`, origem na ponta do dedo
    [-0.12, -0.6, 0.24, 0.6, 0.12], // indicador
    [-0.16, -0.94, 0.62, 0.42, 0.13], // palma (dedos dobrados)
    [-0.3, -0.86, 0.22, 0.3, 0.1], // polegar
    [-0.06, -1.12, 0.46, 0.2, 0.05], // punho
  ];
  const tracar = () => {
    ctx.beginPath();
    for (const [x, y, l, a, r] of partes) ctx.roundRect(cx + x * u, yPonta + y * u, l * u, a * u, r * u);
  };
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  tracar();
  ctx.lineWidth = Math.max(4, u * 0.1);
  ctx.strokeStyle = 'rgba(31, 41, 55, 0.9)';
  ctx.stroke();
  ctx.shadowColor = 'transparent';
  tracar();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  // Dobras dos dedos fechados, na base da palma.
  ctx.strokeStyle = 'rgba(31, 41, 55, 0.45)';
  ctx.lineWidth = Math.max(1.5, u * 0.035);
  ctx.beginPath();
  for (const fx of [0.16, 0.31]) {
    ctx.moveTo(cx + fx * u, yPonta - 0.7 * u);
    ctx.lineTo(cx + fx * u, yPonta - 0.55 * u);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * A prancha, como no vídeo: MDF claro, moldura e ripas brancas. Uma ripa
 * horizontal separa o monte do corredor e tem UMA abertura, à esquerda,
 * sobre a trilha 1 (marcada com borda dourada e seta — é por ali que toda
 * peça passa). Embaixo, 5 trilhas separadas por ripas, numeradas de 1 a 5.
 */
class Prancha extends Node {
  constructor(geo) {
    super({ largura: geo.boardW, altura: geo.boardH });
    this.geo = geo;
  }

  desenhar(ctx) {
    const g = this.geo;
    const L = this.largura;
    const A = this.altura;
    ctx.save();

    // Fundo de MDF + moldura branca.
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = COR_RIPA;
    ctx.beginPath();
    ctx.roundRect(0, 0, L, A, 10);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const interno = { x: g.moldura, y: g.moldura, l: L - g.moldura * 2, a: A - g.moldura * 2 };
    const grad = ctx.createLinearGradient(0, interno.y, 0, interno.y + interno.a);
    grad.addColorStop(0, COR_MDF);
    grad.addColorStop(1, COR_MDF_ESCURO);
    ctx.fillStyle = grad;
    ctx.fillRect(interno.x, interno.y, interno.l, interno.a);

    // Ripa horizontal, da borda direita da abertura até a moldura direita.
    const ripa = (x, y, l, a) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = COR_RIPA;
      ctx.fillRect(x, y, l, a);
      ctx.restore();
    };
    const xFimAbertura = g.aberturaX + g.aberturaL;
    ripa(xFimAbertura, g.ripaY, L - g.moldura - xFimAbertura, g.ripaH);

    // A abertura: borda dourada tracejada + seta pra baixo.
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = COR_DOURADO;
    ctx.beginPath();
    ctx.moveTo(g.aberturaX + 3, g.ripaY + g.ripaH / 2);
    ctx.lineTo(xFimAbertura - 3, g.ripaY + g.ripaH / 2);
    ctx.stroke();
    ctx.setLineDash([]);
    const cx = g.aberturaX + g.aberturaL / 2;
    const cy = g.corredorY + g.corredorH * 0.45;
    const s = Math.min(18, g.corredorH * 0.3);
    ctx.fillStyle = 'rgba(224, 171, 27, 0.85)';
    ctx.beginPath();
    ctx.moveTo(cx - s, cy - s * 0.6);
    ctx.lineTo(cx + s, cy - s * 0.6);
    ctx.lineTo(cx, cy + s * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Ripas verticais entre as trilhas (do topo das trilhas até a base).
    for (let i = 1; i < g.numTrilhas; i++) {
      const x = g.trilhaX(i) - g.gapTrilha;
      ripa(x, g.trilhasY, g.gapTrilha, g.trilhasH);
    }

    // Números 1-5 embaixo de cada trilha.
    ctx.fillStyle = 'rgba(70, 45, 20, 0.75)';
    ctx.font = `800 ${Math.round(g.numeroH * 0.62)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < g.numTrilhas; i++) {
      ctx.fillText(String(i + 1), g.trilhaCx(i), g.numeroY + g.numeroH / 2);
    }

    ctx.restore();
  }
}

/**
 * O cartão de referência: uma coluna por trilha, com o MESMO centro x de
 * cada trilha (e, no computador, o mesmo centro y de cada posição). Cada
 * coluna é uma faixa emoldurada, como no cartão de papel do vídeo.
 * `destaqueColuna` acende a coluna da trilha sob a peça arrastada;
 * `colunasRevisar` pisca as colunas das trilhas com erro (2º erro).
 */
class Cartao extends Node {
  constructor({ largura, altura, colCx, linhaCy, larguraColuna, tamIcone, numeroY, numeroH }) {
    super({ largura, altura });
    this.colCx = colCx;
    this.linhaCy = linhaCy;
    this.larguraColuna = larguraColuna;
    this.tamIcone = tamIcone;
    this.numeroY = numeroY;
    this.numeroH = numeroH;
    this.colunas = [];
    this.destaqueColuna = -1;
    this.colunasRevisar = new Set();
    this._t = 0;
  }

  atualizar(dt) {
    super.atualizar(dt);
    this._t += dt;
  }

  desenhar(ctx) {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(0, 0, this.largura, this.altura, 14);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const topoColuna = 8;
    const altColuna = this.numeroY - topoColuna - 4;
    this.colunas.forEach((coluna, c) => {
      const x0 = this.colCx[c] - this.larguraColuna / 2;
      const revisar = this.colunasRevisar.has(c);
      const pulso = 0.5 + 0.5 * Math.sin(this._t * 4);
      ctx.beginPath();
      ctx.roundRect(x0, topoColuna, this.larguraColuna, altColuna, 8);
      if (this.destaqueColuna === c) {
        ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
        ctx.fill();
      } else if (revisar) {
        ctx.fillStyle = `rgba(253, 224, 71, ${0.15 + pulso * 0.35})`;
        ctx.fill();
      }
      ctx.lineWidth = this.destaqueColuna === c || revisar ? 3.5 : 2;
      ctx.strokeStyle = this.destaqueColuna === c || revisar ? COR_DOURADO : 'rgba(0,0,0,0.35)';
      ctx.stroke();

      coluna.forEach((cel, i) => {
        ctx.save();
        ctx.translate(this.colCx[c], this.linhaCy[i]);
        desenharFormaCheia(ctx, cel.forma, cel.cor, this.tamIcone);
        ctx.restore();
      });

      ctx.fillStyle = 'rgba(31, 41, 55, 0.7)';
      ctx.font = `800 ${Math.round(this.numeroH * 0.62)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(c + 1), this.colCx[c], this.numeroY + this.numeroH / 2);
    });
    ctx.restore();
  }
}

/** Desenha uma estrela de 5 pontas — mesmo path do Material Dourado. */
function desenharEstrela(ctx, cx, cy, raioExterno, raioInterno, preenchida) {
  const pontos = 5;
  const passo = Math.PI / pontos;
  ctx.beginPath();
  for (let i = 0; i < pontos * 2; i++) {
    const r = i % 2 === 0 ? raioExterno : raioInterno;
    const ang = i * passo - Math.PI / 2;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = preenchida ? '#FBBF24' : 'rgba(255, 255, 255, 0.18)';
  ctx.strokeStyle = preenchida ? '#B8860B' : 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.6;
  ctx.fill();
  ctx.stroke();
}

/** Uma estrela por CARTÃO da meta do nível. */
class PainelEstrelas extends Node {
  constructor({ x, y, meta }) {
    super({ x, y });
    this.meta = meta;
    this.atual = 0;
  }

  desenhar(ctx) {
    const raioExterno = 18;
    for (let i = 0; i < this.meta; i++) {
      desenharEstrela(ctx, raioExterno + i * 44, 0, raioExterno, raioExterno * 0.42, i < this.atual);
    }
  }
}

/**
 * Véu com buraco — o holofote da demonstração: escurece a tela toda menos
 * um recorte em volta do tabuleiro (regra `evenodd`).
 */
class VeuComBuraco extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.cor = opcoes.cor ?? 'rgba(4, 7, 13, 0.74)';
    this.buraco = { x: 0, y: 0, largura: 0, altura: 0, raio: 0 };
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const b = this.buraco;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, l, a);
    if (b.largura > 0 && b.altura > 0) ctx.roundRect(b.x, b.y, b.largura, b.altura, b.raio);
    ctx.fillStyle = this.cor;
    ctx.fill('evenodd');
    ctx.restore();
  }
}

// ------------------------------------------------------------------- cena

export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    // `config.js` escolheu o canvas uma vez, no carregamento: paisagem no
    // computador (cartão AO LADO do tabuleiro), retrato no celular (cartão
    // EM CIMA). O tabuleiro em si é sempre vertical.
    this._desktop = L > A;
    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.placar = new ScoreSystem({ total: this.nivel.meta, nivel: this.nivel.id ?? 1 });

    this._tentativasErradas = 0;
    this._errosRodada = 0;
    this._rodadaIndex = 0;
    this._aguardandoAvanco = false;
    this._emVoo = 0;
    this._gesto = null;
    this._selecionada = null;
    this._pecas = [];

    this.adicionar(new Background({
      largura: L,
      altura: A,
      tema: config.tema ?? 'quarto',
      corCeuTopo: config.corCeuTopo ?? '#2E2150',
      corCeuBase: config.corCeuBase ?? '#2E2150',
      mostrarDecoracoes: false,
      mostrarChao: false,
    }));

    this._montarLayout();

    // --------------------------------------------------------------- mesa
    const geo = this._geo;
    this.mesa = new Node({ x: this._mesaX, y: this._mesaY });
    this.adicionar(this.mesa);
    this.mesa.adicionar(new Prancha(geo));

    this._trilhas = Array.from({ length: this.nivel.trilhas }, (_, i) => {
      const trilha = new Trilha({
        indice: i, x: geo.trilhaX(i), y: geo.trilhasY, largura: geo.colunaL, altura: geo.trilhasH,
      });
      this.mesa.adicionar(trilha);
      return trilha;
    });

    this.cartao = new Cartao(this._geoCartao);
    this.cartao.x = this._cartaoX;
    this.cartao.y = this._cartaoY;
    this.adicionar(this.cartao);

    // ---------------------------------------------------------------- HUD
    const h = this._hud;
    this._btnPausa = new IconButton({
      icone: 'pausa', x: h.botoes[0].x, y: h.botoes[0].y, audio: this.audio, somToque: config.audio?.clique, corContorno: 'transparent', aoTocar: () => this._pausar(),
    });
    this._btnAjuda = new IconButton({
      icone: 'tutorial', x: h.botoes[1].x, y: h.botoes[1].y, audio: this.audio, somToque: config.audio?.clique, corContorno: 'transparent', aoTocar: () => this._pedirAjuda(),
    });
    this._btnSom = new SoundToggle({
      audio: this.audio, x: h.botoes[2].x, y: h.botoes[2].y, somToque: config.audio?.clique,
    });
    this.adicionar(this._btnPausa, this._btnAjuda, this._btnSom);

    this.botaoConfirmar = new Button({
      rotulo: 'CONFIRMAR',
      largura: h.confirmar.largura,
      altura: h.confirmar.altura,
      tamanhoTexto: 28,
      variante: 'sucesso',
      x: h.confirmar.x,
      y: h.confirmar.y,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._confirmar(),
    });
    this.adicionar(this.botaoConfirmar);
    this._xBaseConfirmar = this.botaoConfirmar.x;

    this._estrelas = new PainelEstrelas({ x: h.estrelas.x, y: h.estrelas.y, meta: this.nivel.meta });
    this.adicionar(this._estrelas);

    this._relogioTexto = config.mostrarCronometro === false ? null : new TextNode('0:00', {
      x: h.relogio.x, y: h.relogio.y, tamanho: 30, peso: '800', cor: '#FFFFFF',
    });
    if (this._relogioTexto) this.adicionar(this._relogioTexto);
    this._relogioSegundoMostrado = 0;

    this._veuDica = new VeuComBuraco({ largura: L, altura: A });
    this._veuDica.alpha = 0;
    this.adicionar(this._veuDica);

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

    this.aoDesmontar(this.input.on('apertar', (ponto) => this._aoApertar(ponto)));
    this.aoDesmontar(this.input.on('arrastar', (ponto) => this._aoArrastar(ponto)));
    this.aoDesmontar(this.input.on('soltar', (ponto) => this._aoSoltar(ponto)));
    this.aoDesmontar(this.input.on('cancelar', () => this._cancelarGesto()));

    this._novaCartela(false);
  }

  // ------------------------------------------------------------- layout

  /**
   * Geometria do tabuleiro pra um tamanho de peça `t` e uma largura interna
   * máxima. Tudo em coordenadas da MESA (origem no canto da prancha).
   */
  _geometria(t, larguraInternaMax, totalPecas) {
    const nivel = this.nivel;
    const g = {
      t,
      numTrilhas: nivel.trilhas,
      moldura: 12,
      gapTrilha: 12,
      gapSlot: 8,
      padTrilhaY: 10,
      ripaH: 12,
      numeroH: 30,
    };
    // A trilha é um pouco mais larga que a peça; no celular estica um pouco
    // mais pra usar a largura (fica mais fácil de acertar com o dedo).
    const colunaMax = (larguraInternaMax - (g.numTrilhas - 1) * g.gapTrilha) / g.numTrilhas;
    g.colunaL = Math.min(colunaMax, t * 1.45);
    g.internoL = g.numTrilhas * g.colunaL + (g.numTrilhas - 1) * g.gapTrilha;
    g.boardW = g.internoL + g.moldura * 2;
    // A peça precisa de folga dentro da trilha, senão encosta nas ripas.
    g.cabe = g.colunaL >= t * 1.12;

    // Monte: posições numa grade invisível com folga, sorteadas com um
    // tremido e uma rotação leves — parece um monte solto, sem sobrepor.
    g.monteColunas = Math.max(1, Math.floor(g.internoL / (t * 1.14)));
    g.monteLinhas = Math.ceil(totalPecas / g.monteColunas);
    g.montePassoX = g.internoL / g.monteColunas;
    g.montePassoY = t * 1.12;
    g.monteY = g.moldura + 6;
    g.monteH = g.monteLinhas * g.montePassoY + 6;

    g.ripaY = g.monteY + g.monteH;
    g.corredorY = g.ripaY + g.ripaH;
    g.corredorH = Math.round(t * 0.85);
    g.trilhasY = g.corredorY + g.corredorH;
    g.trilhasH = nivel.profundidade * t + (nivel.profundidade - 1) * g.gapSlot + g.padTrilhaY * 2;
    g.numeroY = g.trilhasY + g.trilhasH;
    g.boardH = g.numeroY + g.numeroH + g.moldura;

    g.aberturaX = g.moldura;
    g.aberturaL = g.colunaL;
    g.trilhaX = (i) => g.moldura + i * (g.colunaL + g.gapTrilha);
    g.trilhaCx = (i) => g.trilhaX(i) + g.colunaL / 2;
    // Centro da posição `i` (0 = fundo) da trilha.
    g.slotCy = (i) => g.trilhasY + g.trilhasH - g.padTrilhaY - t / 2 - i * (t + g.gapSlot);
    g.corredorCy = g.corredorY + g.corredorH / 2;
    g.aberturaCx = g.aberturaX + g.aberturaL / 2;
    return g;
  }

  _montarLayout() {
    const { largura: L, altura: A } = this;
    const nivel = this.nivel;
    const total = nivel.trilhas * nivel.profundidade;
    const margem = 40;

    // Cartão compacto: ícones um pouco menores que a peça, de baixo pra cima,
    // numa coluna por trilha com o MESMO centro x da trilha.
    const cartaoMedidas = (g, gapIcone) => {
      const tamIcone = Math.round(g.t * 0.72);
      const numeroY = 10 + nivel.profundidade * tamIcone + (nivel.profundidade - 1) * gapIcone + 10;
      return { tamIcone, gapIcone, numeroY, altura: numeroY + g.numeroH + 4 };
    };
    const geoCartao = (g, cm) => ({
      largura: g.boardW,
      altura: cm.altura,
      colCx: Array.from({ length: nivel.trilhas }, (_, i) => g.trilhaCx(i)),
      linhaCy: Array.from({ length: nivel.profundidade }, (_, i) => (
        cm.numeroY - 10 - cm.tamIcone / 2 - i * (cm.tamIcone + cm.gapIcone)
      )),
      larguraColuna: g.colunaL,
      tamIcone: cm.tamIcone,
      numeroY: cm.numeroY,
      numeroH: g.numeroH,
    });

    if (this._desktop) {
      // Cartão (mesma largura da prancha) à esquerda, prancha à direita. Na
      // coluna da esquerda, de cima pra baixo: botões, estrelas+relógio, o
      // cartão e o CONFIRMAR logo embaixo dele.
      // Botões e estrelas ficam FIXOS no topo da tela (não descem junto com
      // a prancha quando ela é baixa e fica centralizada, como no Fácil); o
      // cartão começa pelo menos `alturaHud` abaixo do topo da prancha.
      const yHud = 20;
      const alturaHud = 72 + 14 + 44 + 30;
      const alturaConfirmar = 84;
      const gapConfirmar = 36;
      const gapIconeCartao = 16;
      const gapCartao = 40;
      const alturaUtil = A - 2 * 24;
      const larguraInternaMax = Math.min(560, (L - 2 * margem - gapCartao) / 2 - 24);
      let geo = null;
      for (let t = 150; t >= 40; t -= 2) {
        const g = this._geometria(t, larguraInternaMax, total);
        const colunaEsquerda = alturaHud + cartaoMedidas(g, gapIconeCartao).altura + gapConfirmar + alturaConfirmar;
        if (g.cabe && g.boardH <= alturaUtil && colunaEsquerda <= g.boardH) { geo = g; break; }
      }
      geo ??= this._geometria(40, larguraInternaMax, total);
      this._geo = geo;

      const larguraConjunto = geo.boardW * 2 + gapCartao;
      const x0 = (L - larguraConjunto) / 2;
      this._mesaX = x0 + geo.boardW + gapCartao;
      this._mesaY = (A - geo.boardH) / 2;

      const cm = cartaoMedidas(geo, gapIconeCartao);
      const cartaoY = Math.max(this._mesaY, yHud) + alturaHud;
      this._cartaoX = x0;
      this._cartaoY = cartaoY;
      this._geoCartao = geoCartao(geo, cm);

      this._hud = {
        botoes: [0, 1, 2].map((i) => ({ x: x0 + i * 88, y: yHud })),
        estrelas: { x: x0 + 4, y: yHud + 72 + 14 + 22 },
        relogio: { x: x0 + 4 + this.nivel.meta * 44 + 18, y: yHud + 72 + 14 + 6 },
        confirmar: {
          largura: Math.min(geo.boardW, 300), altura: alturaConfirmar, x: x0 + (geo.boardW - Math.min(geo.boardW, 300)) / 2, y: cartaoY + cm.altura + gapConfirmar,
        },
      };
      return;
    }

    // Celular: HUD numa fileira no topo, cartão, prancha, CONFIRMAR embaixo.
    const topo = 20 + 72 + 18;
    const alturaConfirmar = 88;
    const base = A - 24 - alturaConfirmar - 18;
    const alturaUtil = base - topo;
    const larguraInternaMax = L - 2 * margem - 24;
    const gapCartao = 16;


    let geo = null;
    for (let t = 150; t >= 40; t -= 2) {
      const g = this._geometria(t, larguraInternaMax, total);
      if (g.cabe && cartaoMedidas(g, 8).altura + gapCartao + g.boardH <= alturaUtil) { geo = g; break; }
    }
    geo ??= this._geometria(40, larguraInternaMax, total);
    this._geo = geo;

    const cm = cartaoMedidas(geo, 8);
    const alturaConjunto = cm.altura + gapCartao + geo.boardH;
    const y0 = topo + (alturaUtil - alturaConjunto) / 2;
    const x0 = (L - geo.boardW) / 2;
    this._cartaoX = x0;
    this._cartaoY = y0;
    this._mesaX = x0;
    this._mesaY = y0 + cm.altura + gapCartao;
    this._geoCartao = geoCartao(geo, cm);

    const larguraConfirmar = Math.min(360, L - 2 * margem);
    this._hud = {
      botoes: [0, 1, 2].map((i) => ({ x: L - margem - 72 - (2 - i) * 88, y: 20 })),
      estrelas: { x: margem, y: 20 + 22 },
      relogio: { x: margem, y: 20 + 46 },
      confirmar: {
        largura: larguraConfirmar, altura: alturaConfirmar, x: (L - larguraConfirmar) / 2, y: A - 24 - alturaConfirmar,
      },
    };
  }

  // ------------------------------------------------------------- rodadas

  /** Sorteia um cartão novo e põe as peças dele no monte. */
  _novaCartela(animar = true) {
    for (const peca of this._pecas) peca.removerDoPai();
    this._pecas = [];
    this._selecionada = null;
    this._gesto = null;

    const colunas = gerarCartela(this.nivel);
    this.cartao.colunas = colunas;
    this.cartao.colunasRevisar.clear();
    this.cartao.destaqueColuna = -1;
    for (const [i, trilha] of this._trilhas.entries()) {
      trilha.sequencia = colunas[i];
      trilha.pecas = new Array(colunas[i].length).fill(null);
      trilha.alvo = false;
      trilha.destaque = false;
    }

    const geo = this._geo;
    this._slotsMonte = this._sortearSlotsMonte(colunas.flat().length);
    this._ocupacaoMonte = new Array(this._slotsMonte.length).fill(null);
    rand.embaralhar(colunas.flat()).forEach((dado, k) => {
      const peca = new Peca(dado.forma, dado.cor, geo.t);
      this._pecas.push(peca);
      this.mesa.adicionar(peca);
      this._colocarNoMonte(peca, k, false);
      if (animar) {
        peca.scaleX = 0; peca.scaleY = 0;
        Tween.de(peca).esperar(k * 25).entao({ scaleX: 1, scaleY: 1 }, 280, Easing.costasSaida);
      }
    });

    this._errosRodada = 0;
    this._atualizarConfirmar();
  }

  /** Uma posição por peça na grade invisível do monte, com tremido e giro. */
  _sortearSlotsMonte(quantidade) {
    const g = this._geo;
    const folgaX = Math.max(0, (g.montePassoX - g.t) / 2) * 0.7;
    const folgaY = Math.max(0, (g.montePassoY - g.t) / 2) * 0.7;
    const slots = [];
    for (let k = 0; k < quantidade; k++) {
      const coluna = k % g.monteColunas;
      const linha = Math.floor(k / g.monteColunas);
      slots.push({
        x: g.moldura + g.montePassoX * (coluna + 0.5) + rand.entre(-folgaX, folgaX),
        y: g.monteY + g.montePassoY * (linha + 0.5) + rand.entre(-folgaY, folgaY),
        rotacao: rand.entre(-14, 14),
      });
    }
    return slots;
  }

  _colocarNoMonte(peca, slot, animar) {
    const s = this._slotsMonte[slot];
    this._ocupacaoMonte[slot] = peca;
    peca.slot = slot;
    if (!animar) {
      peca.x = s.x; peca.y = s.y; peca.rotation = s.rotacao;
    }
    return s;
  }

  _slotLivreMonte() {
    const livres = [];
    this._ocupacaoMonte.forEach((p, i) => { if (!p) livres.push(i); });
    return livres.length ? rand.item(livres) : -1;
  }

  // --------------------------------------------------------------- gestos

  _podeMexer() {
    return !this.pausada && !this.placar.encerrado && !this._aguardandoAvanco;
  }

  /** Peça sob o ponto (só as que não estão voando), a de cima primeiro. */
  _pecaSobPonto(local) {
    for (let i = this.mesa.filhos.length - 1; i >= 0; i--) {
      const no = this.mesa.filhos[i];
      if (!(no instanceof Peca) || no.emVoo || !no.visible) continue;
      if (Math.abs(local.x - no.x) <= no.tam / 2 && Math.abs(local.y - no.y) <= no.tam / 2) return no;
    }
    return null;
  }

  /** Trilha cuja coluna (do corredor pra baixo) contém o ponto local. */
  _trilhaSobPonto(local) {
    const g = this._geo;
    if (local.y < g.corredorY || local.y > g.numeroY + g.numeroH) return null;
    return this._trilhas.find((tr) => (
      local.x >= tr.x - g.gapTrilha / 2 && local.x <= tr.x + tr.largura + g.gapTrilha / 2
    )) ?? null;
  }

  _aoApertar(ponto) {
    if (!this._podeMexer() || this._gesto) return;
    const local = this.mesa.globalParaLocal(ponto.x, ponto.y);
    const peca = this._pecaSobPonto(local);
    this._gesto = {
      peca,
      tipo: !peca ? 'vazio' : (peca.trilha ? 'trilha' : 'monte'),
      inicio: local,
      moveu: false,
    };
  }

  _aoArrastar(ponto) {
    const gesto = this._gesto;
    if (!gesto || gesto.tipo !== 'monte' || this.pausada) return;
    // Sem arrasto neste nível: `moveu` fica falso e o soltar vira um toque.
    if (!this.nivel.arrastar) return;
    const local = this.mesa.globalParaLocal(ponto.x, ponto.y);
    const peca = gesto.peca;
    if (!gesto.moveu) {
      if (Math.hypot(local.x - gesto.inicio.x, local.y - gesto.inicio.y) < LIMIAR_ARRASTO) return;
      gesto.moveu = true;
      gesto.deslocX = peca.x - gesto.inicio.x;
      gesto.deslocY = peca.y - gesto.inicio.y;
      this._desselecionar();
      peca.arrastando = true;
      peca.paraFrente();
      Tween.removerDe(peca);
      Tween.para(peca, { scaleX: 1.12, scaleY: 1.12, rotation: 0 }, 120, Easing.suaveSaida);
    }
    peca.x = local.x + gesto.deslocX;
    peca.y = local.y + gesto.deslocY;
    this._realcarTrilha(this._trilhaSobPonto({ x: peca.x, y: peca.y }));
  }

  _aoSoltar(ponto) {
    const gesto = this._gesto;
    this._gesto = null;
    if (!gesto || this.pausada) return;
    const local = this.mesa.globalParaLocal(ponto.x, ponto.y);
    this._realcarTrilha(null);

    if (gesto.tipo === 'monte' && gesto.moveu) {
      const peca = gesto.peca;
      peca.arrastando = false;
      const trilha = this._trilhaSobPonto({ x: peca.x, y: peca.y });
      if (trilha && !trilha.completa()) this._enviarParaTrilha(peca, trilha);
      else this._voltarAoSlot(peca);
      return;
    }
    if (gesto.moveu) return;

    // Toques.
    if (gesto.tipo === 'monte') {
      if (this._selecionada === gesto.peca) this._desselecionar();
      else this._selecionar(gesto.peca);
      return;
    }
    const trilhaTocada = gesto.tipo === 'trilha' ? gesto.peca.trilha : this._trilhaSobPonto(local);
    if (this._selecionada && trilhaTocada) {
      if (trilhaTocada.completa()) { this._sacudir(trilhaTocada.pecas[trilhaTocada.indiceTopo()]); return; }
      const peca = this._selecionada;
      this._desselecionar();
      this._enviarParaTrilha(peca, trilhaTocada);
      return;
    }
    if (gesto.tipo === 'trilha') {
      const peca = gesto.peca;
      if (peca.trilha.indiceTopo() === peca.indiceTrilha) this._retirarDaTrilha(peca);
      else this._sacudir(peca);
      return;
    }
    this._desselecionar();
  }

  _cancelarGesto() {
    const gesto = this._gesto;
    this._gesto = null;
    this._realcarTrilha(null);
    if (gesto?.tipo === 'monte' && gesto.moveu) {
      gesto.peca.arrastando = false;
      this._voltarAoSlot(gesto.peca);
    }
  }

  _selecionar(peca) {
    this._desselecionar();
    this._selecionada = peca;
    peca.selecionada = true;
    peca.paraFrente();
    Tween.removerDe(peca);
    Tween.para(peca, { scaleX: 1.15, scaleY: 1.15 }, 160, Easing.costasSaida);
    for (const trilha of this._trilhas) trilha.alvo = !trilha.completa();
  }

  _desselecionar() {
    const peca = this._selecionada;
    this._selecionada = null;
    for (const trilha of this._trilhas) trilha.alvo = false;
    if (!peca) return;
    peca.selecionada = false;
    if (!peca.emVoo) Tween.para(peca, { scaleX: 1, scaleY: 1 }, 140, Easing.suaveSaida);
  }

  _realcarTrilha(trilha) {
    for (const tr of this._trilhas) tr.destaque = tr === trilha && !tr.completa();
    this.cartao.destaqueColuna = trilha && !trilha.completa() ? trilha.indice : -1;
  }

  _voltarAoSlot(peca) {
    const s = this._slotsMonte[peca.slot];
    Tween.removerDe(peca);
    Tween.para(peca, {
      x: s.x, y: s.y, rotation: s.rotacao, scaleX: 1, scaleY: 1,
    }, 220, Easing.suaveSaida);
  }

  // --------------------------------------------------------------- caminho

  /** Anima `peca` por uma lista de pontos com velocidade constante. */
  _percorrer(peca, pontos, aoChegar) {
    peca.emVoo = true;
    this._emVoo += 1;
    this._atualizarConfirmar();
    peca.paraFrente();
    Tween.removerDe(peca);
    const tween = Tween.de(peca);
    let anterior = { x: peca.x, y: peca.y };
    pontos.forEach((p, i) => {
      const ms = Math.max(60, (Math.hypot(p.x - anterior.x, p.y - anterior.y) / VELOCIDADE_CAMINHO) * 1000);
      const props = { x: p.x, y: p.y };
      if (p.rotacao !== undefined) props.rotation = p.rotacao;
      if (i === 0) { props.scaleX = 1; props.scaleY = 1; }
      tween.entao(props, ms, p.easing ?? Easing.linear);
      anterior = p;
    });
    tween.chamar(() => {
      peca.emVoo = false;
      this._emVoo -= 1;
      aoChegar?.();
      this._atualizarConfirmar();
    });
  }

  /**
   * A peça sai do monte pela abertura, corre o corredor e desce a trilha até
   * a posição vazia mais baixa. Se já foi arrastada pra baixo da ripa, só
   * se alinha à trilha e cai.
   */
  _enviarParaTrilha(peca, trilha) {
    const g = this._geo;
    const indice = trilha.indiceVazio();
    if (indice < 0) { this._voltarAoSlot(peca); return; }
    trilha.pecas[indice] = peca;
    this._ocupacaoMonte[peca.slot] = null;
    peca.slot = -1;
    peca.trilha = trilha;
    peca.indiceTrilha = indice;
    peca.realce = null;

    const cx = g.trilhaCx(trilha.indice);
    const destino = { x: cx, y: g.slotCy(indice), easing: Easing.suaveEntrada };
    let pontos;
    if (peca.y < g.ripaY) {
      pontos = [
        { x: g.aberturaCx, y: g.ripaY - g.t * 0.1, rotacao: 0, easing: Easing.suaveSaida },
        { x: g.aberturaCx, y: g.corredorCy },
        { x: cx, y: g.corredorCy },
        destino,
      ];
    } else {
      pontos = [{ x: cx, y: Math.min(peca.y, destino.y), rotacao: 0, easing: Easing.suaveSaida }, destino];
    }
    this._percorrer(peca, pontos, () => {
      if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto);
      Tween.de(peca)
        .entao({ scaleX: 1.12, scaleY: 0.88 }, 70, Easing.suaveSaida)
        .entao({ scaleX: 1, scaleY: 1 }, 140, Easing.costasSaida);
    });
  }

  /** O caminho de volta: sobe a trilha, corre o corredor, sobe pela abertura e cai num lugar livre do monte. */
  _retirarDaTrilha(peca) {
    const g = this._geo;
    const trilha = peca.trilha;
    trilha.pecas[peca.indiceTrilha] = null;
    peca.trilha = null;
    peca.indiceTrilha = -1;
    peca.realce = null;
    this._atualizarRevisaoCartao();

    const slot = this._slotLivreMonte();
    const s = this._colocarNoMonte(peca, slot, true);
    const cx = g.trilhaCx(trilha.indice);
    this._percorrer(peca, [
      { x: cx, y: g.corredorCy, easing: Easing.suaveSaida },
      { x: g.aberturaCx, y: g.corredorCy },
      { x: g.aberturaCx, y: g.ripaY - g.t * 0.1 },
      {
        x: s.x, y: s.y, rotacao: s.rotacao, easing: Easing.suaveSaida,
      },
    ]);
  }

  _sacudir(peca) {
    if (!peca || peca.emVoo) return;
    const xBase = peca.trilha ? this._geo.trilhaCx(peca.trilha.indice) : peca.x;
    Tween.removerDe(peca);
    Tween.de(peca)
      .entao({ x: xBase - 7 }, 50, Easing.suaveSaida)
      .entao({ x: xBase + 7 }, 70, Easing.suave)
      .entao({ x: xBase - 4 }, 60, Easing.suave)
      .entao({ x: xBase }, 50, Easing.suaveSaida);
  }

  // ------------------------------------------------------------ confirmar

  _tabuleiroCheio() {
    return this._trilhas.every((trilha) => trilha.completa());
  }

  _atualizarConfirmar() {
    if (!this.botaoConfirmar) return;
    const pronto = this._tabuleiroCheio() && this._emVoo === 0 && !this._aguardandoAvanco && !this.placar.encerrado;
    if (this.botaoConfirmar.habilitado !== pronto) this.botaoConfirmar.definirHabilitado(pronto);
    this.botaoConfirmar.pulse = pronto;
  }

  /**
   * Compara o tabuleiro inteiro com o cartão. Certo: estrela e, depois de
   * uma comemoração curta, cartão novo (ou fim do nível). Errado: ajuda em
   * degraus (ver doc da classe), sem nunca descontar.
   */
  _confirmar() {
    if (!this._podeMexer() || this._emVoo > 0 || !this._tabuleiroCheio()) return;
    this._desselecionar();

    const erradas = [];
    for (const trilha of this._trilhas) {
      trilha.pecas.forEach((peca, i) => {
        const esperado = trilha.sequencia[i];
        if (peca.forma !== esperado.forma || peca.cor !== esperado.cor) erradas.push(peca);
      });
    }

    if (erradas.length === 0) {
      this._acertouCartao();
      return;
    }

    this._tentativasErradas += 1;
    this._errosRodada += 1;
    if (this.config.audio?.erro) this.audio.efeito(this.config.audio.erro);

    const marcar = () => {
      for (const trilha of this._trilhas) {
        for (const peca of trilha.pecas) {
          const errada = erradas.includes(peca);
          peca.realce = errada ? 'revisar' : null;
          if (errada) {
            this._sacudir(peca);
          } else {
            peca.brilhoOk = 1;
            Tween.de(peca).esperar(500).entao({ brilhoOk: 0 }, 700, Easing.suave);
          }
        }
      }
      if (this._errosRodada >= 2) this._atualizarRevisaoCartao();
    };

    if (this._errosRodada >= ERROS_PARA_DEMONSTRACAO) this._mostrarDemonstracao(marcar);
    else marcar();
    this._atualizarConfirmar();
  }

  /** Colunas do cartão que piscam (2º erro em diante): as das trilhas que ainda têm peça marcada. */
  _atualizarRevisaoCartao() {
    this.cartao.colunasRevisar.clear();
    if (this._errosRodada < 2) return;
    for (const trilha of this._trilhas) {
      if (trilha.pecas.some((p) => p?.realce === 'revisar')) this.cartao.colunasRevisar.add(trilha.indice);
    }
  }

  _acertouCartao() {
    this._aguardandoAvanco = true;
    this._atualizarConfirmar();
    // O brilho da estrela (mesmo som do Material Dourado); o `vitoria` fica
    // só pra tela final, tocado pelo motor.
    if (this.config.audio?.progresso) this.audio.efeito(this.config.audio.progresso);

    // Comemoração: cada peça pula, trilha por trilha, de baixo pra cima.
    for (const trilha of this._trilhas) {
      trilha.pecas.forEach((peca, i) => {
        peca.realce = null;
        Tween.de(peca)
          .esperar(trilha.indice * 90 + i * 70)
          .entao({ scaleX: 1.25, scaleY: 1.25, brilhoOk: 1 }, 160, Easing.suaveSaida)
          .entao({ scaleX: 1, scaleY: 1 }, 220, Easing.costasSaida);
      });
    }
    this.cartao.colunasRevisar.clear();

    this.placar.acertar(1);
    this._rodadaIndex += 1;
    this._estrelas.atual = this._rodadaIndex;
    if (this.placar.encerrado) return;

    Tween.de(this).esperar(ESPERA_AVANCO).chamar(() => {
      for (const peca of this._pecas) Tween.para(peca, { alpha: 0, scaleX: 0.6, scaleY: 0.6 }, 260, Easing.suaveEntrada);
    }).esperar(300).chamar(() => {
      this._aguardandoAvanco = false;
      this._novaCartela(true);
    });
  }

  // ------------------------------------------------------- demonstração

  /**
   * 3º erro em diante: holofote no tabuleiro, as peças da criança somem, o
   * tabuleiro certo se monta em cascata e desmonta, e as peças dela voltam
   * exatamente como estavam. Nunca confirma sozinha. `aoTerminar` marca as
   * peças fora do lugar depois.
   */
  _mostrarDemonstracao(aoTerminar) {
    this._aguardandoAvanco = true;
    this._mostrarVeu(true);
    const g = this._geo;
    const profundidade = this.nivel.profundidade;
    const ocultas = [];
    const fantasmas = [];

    for (const trilha of this._trilhas) {
      for (const peca of trilha.pecas) { peca.visible = false; ocultas.push(peca); }
      trilha.sequencia.forEach((cel, i) => {
        const fantasma = new Peca(cel.forma, cel.cor, g.t);
        fantasma.interativo = false;
        fantasma.x = g.trilhaCx(trilha.indice);
        fantasma.y = g.slotCy(i);
        fantasma.scaleX = 0;
        fantasma.scaleY = 0;
        this.mesa.adicionar(fantasma);
        fantasmas.push(fantasma);
        Tween.de(fantasma)
          .esperar(i * ATRASO_ENTRE_PECAS)
          .chamar(() => { if (this.config.audio?.acerto) this.audio.efeito(this.config.audio.acerto); })
          .entao({ scaleX: 1, scaleY: 1 }, DURACAO_POP, Easing.costasSaida);
      });
    }

    const entrada = (profundidade - 1) * ATRASO_ENTRE_PECAS + DURACAO_POP;
    const saida = (profundidade - 1) * ATRASO_ENTRE_PECAS + DURACAO_SAIDA;
    Tween.de(this)
      .esperar(entrada + ESPERA_MONTADA)
      .chamar(() => {
        fantasmas.forEach((fantasma, k) => {
          Tween.de(fantasma)
            .esperar((k % profundidade) * ATRASO_ENTRE_PECAS)
            .entao({ scaleX: 0, scaleY: 0 }, DURACAO_SAIDA, Easing.suaveEntrada);
        });
      })
      .esperar(saida)
      .chamar(() => {
        for (const fantasma of fantasmas) fantasma.removerDoPai();
        for (const peca of ocultas) peca.visible = true;
        this._mostrarVeu(false);
        this._aguardandoAvanco = false;
        aoTerminar();
        this._atualizarConfirmar();
      });
  }

  _mostrarVeu(mostrar) {
    Tween.removerDe(this._veuDica);
    if (mostrar) {
      const pad = 16;
      this._veuDica.buraco = {
        x: this.mesa.x - pad, y: this.mesa.y - pad, largura: this._geo.boardW + pad * 2, altura: this._geo.boardH + pad * 2, raio: 20,
      };
      this._veuDica.paraFrente();
    }
    Tween.para(this._veuDica, { alpha: mostrar ? 1 : 0 }, 260, Easing.suave);
  }

  _celebrarCompleto() {
    if (this._celebracaoIniciada) return;
    this._celebracaoIniciada = true;
    Tween.de(this).esperar(1100).chamar(() => this._terminar(true));
  }

  // ------------------------------------------------------------------- HUD

  _pausar() {
    if (this.placar.encerrado) return;
    this._cancelarGesto();
    Tween.pausarTodos();
    this.pausada = true;
    this.pausa.abrir();
  }

  _pedirAjuda() {
    if (this.placar.encerrado || this.pausada) return;
    this._cancelarGesto();
    Tween.pausarTodos();
    this.pausada = true;
    this.ajuda.abrir();
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
    if (!this._relogioTexto) return;
    const total = Math.floor(this.game.tempoJogando);
    if (total === this._relogioSegundoMostrado) return;
    this._relogioSegundoMostrado = total;
    this._relogioTexto.texto = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  }
}
