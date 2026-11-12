import {
  Scene, Node, ScoreSystem, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, Watchdog,
} from '../../engine/index.js';
import {
  CASAS, rolarDados, contasDaJogada, alvosDaJogada, avaliarCasa, contaDaDica, contarCobertas,
  fileiraVazia, esquecimentoDoComputador, situacaoDaRodada, cobriuTudo, notaDaPartida,
} from '../regras.js';
import {
  CORES, FONTE, escrever, quebrarLinhas, desenharPrancha, desenharDivisoria, desenharCasa, desenharCubo,
  desenharAnel, desenharDado, desenharConta, desenharMonte, desenharDedo, desenharOndaToque, APONTA,
} from '../desenho.js';

// ---------------------------------------------------------------------------
// Layout (1280 × 720). A prancha branca do vídeo ocupa a tela: a fileira do
// computador em cima, a da criança embaixo, e no meio só três coisas — os dados
// à esquerda, as contas e um botão no centro, o monte de cubinhos à direita
// (decisões do plano, artifact "Plano Cubra Nove", 12/11/2026).
// ---------------------------------------------------------------------------
const PRANCHA = { x: 128, y: 104, l: 1024, a: 604 };
const CASA = { lado: 100, gap: 8 };
/** O x da primeira casa: as 9 casas (964 px) centradas na tela. */
const FX0 = 640 - (CASAS * CASA.lado + (CASAS - 1) * CASA.gap) / 2;
const FILEIRA_Y = { p: 124, c: 586 };
const CENTRO = { y1: 244, y2: 566, cy: 405 };
const DIVISORIAS = [338, 942];
const DADOS = { cx: 238, lado: 104, gap: 36 };
const MONTE = { cx: 1047, cy: 405, lado: 150 };
/** O lado do cubinho: 46% da casa, como no vídeo (a cor da casa continua à vista em volta). */
const LADO_CUBO = Math.round(CASA.lado * 0.46);
/** Folga vertical para soltar o cubinho perto da fileira e ainda valer a casa logo acima ou abaixo. */
const FOLGA_SOLTAR = 30;

/** O x (canto esquerdo) da casa `v` (1..9). */
const xDaCasa = (v) => FX0 + (v - 1) * (CASA.lado + CASA.gap);

/** Um contexto só para medir texto (o layout do centro precisa da altura do aviso antes de desenhar). */
let _medidor = null;
function medidor() {
  if (!_medidor && typeof document !== 'undefined') _medidor = document.createElement('canvas').getContext('2d');
  return _medidor;
}

// ---------------------------------------------------------------------------
// Nós de desenho
// ---------------------------------------------------------------------------

/** A prancha branca e as divisórias tracejadas do centro. */
class Prancha extends Node {
  desenhar(ctx) {
    desenharPrancha(ctx, PRANCHA.x, PRANCHA.y, PRANCHA.l, PRANCHA.a);
    for (const x of DIVISORIAS) desenharDivisoria(ctx, x, CENTRO.y1 + 20, CENTRO.y2 - 20);
  }
}

/**
 * Uma casa da fileira. Sabe se está coberta e se tem o cubinho fantasma, e anima o próprio retorno uma
 * vez: 'certo' (anel verde que se abre e apaga), 'errado' (balança com anel coral) ou 'treme' (só balança).
 */
class Casa extends Node {
  constructor(n, opcoes = {}) {
    super({ ...opcoes, largura: CASA.lado, altura: CASA.lado });
    this.n = n;
    this.coberta = false;
    /** 3º degrau da ajuda: o jogo mostrou que esta casa falta; contorno âmbar estável até ela ser coberta. */
    this.indicada = false;
    this.fantasma = false;
    this.anim = null;
  }

  animar(tipo) {
    this.anim = { tipo, t: 0 };
  }

  atualizar(dt) {
    super.atualizar(dt);
    if (this.anim) {
      this.anim.t += dt;
      if (this.anim.t > 1) this.anim = null;
    }
  }

  desenhar(ctx) {
    const a = this.anim;
    ctx.save();
    if (a && (a.tipo === 'errado' || a.tipo === 'treme') && a.t < 0.4) {
      ctx.translate(Math.sin((a.t / 0.4) * Math.PI * 4) * 6, 0);
    }
    desenharCasa(ctx, CASA.lado, this.n, { coberta: this.coberta, fantasma: this.fantasma });
    if (this.indicada && !this.coberta) desenharAnel(ctx, CASA.lado, CORES.dica, 0.95, 7, 3);
    if (a?.tipo === 'certo') {
      const k = Math.min(1, a.t / 0.8);
      desenharAnel(ctx, CASA.lado, CORES.ok, k < 0.3 ? 0.9 : 0.9 * (1 - (k - 0.3) / 0.7), 6, k * 10);
    } else if (a?.tipo === 'errado') {
      desenharAnel(ctx, CASA.lado, CORES.erro, a.t < 0.4 ? 0.9 : Math.max(0, 0.9 * (1 - (a.t - 0.4) / 0.5)), 6, 2);
    }
    ctx.restore();
  }
}

/** Uma fileira de 1 a 9. A de quem joga ganha um contorno azul estável (a vez, sem nenhum rótulo). */
class Fileira extends Node {
  constructor(quem, interativa) {
    super({ x: 0, y: 0 });
    this.quem = quem;
    this.ativa = false;
    this.casas = [];
    for (let v = 1; v <= CASAS; v++) {
      const c = new Casa(v, { x: xDaCasa(v), y: FILEIRA_Y[quem], interativo: interativa });
      this.casas[v] = c;
      this.adicionar(c);
    }
  }

  desenhar(ctx) {
    if (!this.ativa) return;
    const y = FILEIRA_Y[this.quem];
    const l = CASAS * CASA.lado + (CASAS - 1) * CASA.gap;
    ctx.save();
    ctx.strokeStyle = CORES.vez;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(FX0 - 9, y - 9, l + 18, CASA.lado + 18, 18);
    ctx.stroke();
    ctx.restore();
  }
}

/** Os dois dados, um em cima do outro. Rolam trocando de face; tocar neles joga (na vez da criança). */
class Dados extends Node {
  constructor(opcoes = {}) {
    const alto = 2 * DADOS.lado + DADOS.gap;
    super({ ...opcoes, x: DADOS.cx - DADOS.lado / 2 - 20, y: CENTRO.cy - alto / 2 - 20, largura: DADOS.lado + 40, altura: alto + 40, interativo: true });
    this.faces = [3, 4];
    this.estados = [null, null];
    this.rolando = false;
    this.t = 0;
    this._troca = 0;
  }

  atualizar(dt) {
    super.atualizar(dt);
    this.t += dt;
    if (this.rolando) {
      this._troca += dt;
      if (this._troca >= 0.1) {
        this._troca = 0;
        this.faces = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
      }
    }
  }

  desenhar(ctx) {
    for (let i = 0; i < 2; i++) {
      ctx.save();
      ctx.translate(20 + DADOS.lado / 2, 20 + i * (DADOS.lado + DADOS.gap) + DADOS.lado / 2);
      if (this.rolando) ctx.rotate(Math.sin(this.t * 24 + i * 2) * 0.16);
      ctx.translate(-DADOS.lado / 2, -DADOS.lado / 2);
      desenharDado(ctx, DADOS.lado, this.faces[i], this.estados[i]);
      ctx.restore();
    }
  }
}

/** As contas da jogada em destaque (só a soma e a diferença: os dados são as contas deles). */
class Contas extends Node {
  constructor() {
    super({ x: 640, y: CENTRO.cy });
    /** `[{texto, estado}]`; vazio, nada aparece. */
    this.itens = [];
  }

  desenhar(ctx) {
    if (!this.itens.length) return;
    const tam = 44;
    ctx.font = `800 ${tam}px ${FONTE}`;
    const ws = this.itens.map((i) => ctx.measureText(i.texto).width + tam * 0.9);
    const gap = 28;
    let x = -(ws.reduce((s, w) => s + w, 0) + gap * (ws.length - 1)) / 2;
    this.itens.forEach((it, k) => {
      desenharConta(ctx, it.texto, x + ws[k] / 2, 0, it.estado, tam);
      x += ws[k] + gap;
    });
  }
}

/**
 * O aviso do centro, a frase que a voz também diz. Tipos:
 *   'rodada'  "RODADA 2 DE 3": só letras, o número grande no vermelho da chita (a extra em dourado);
 *   'elogio'  "MUITO BEM!", grande, num fundo verde;
 *   'dica'    âmbar (a ajuda em degraus); 'ok' e 'erro' a conferência do computador, verde e coral.
 * Entra uma vez com um pulinho (rodada, elogio) ou um leve deslize; nada pisca.
 */
class Aviso extends Node {
  constructor() {
    super({ x: 640, y: CENTRO.cy });
    this.tipo = null;
    this.texto = '';
    this.k = 1;
  }

  mostrar(tipo, texto = '') {
    this.tipo = tipo;
    this.texto = texto;
    this.k = 0;
    Tween.removerDe(this);
    Tween.para(this, { k: 1 }, tipo === 'rodada' || tipo === 'elogio' ? 420 : 260, tipo === 'rodada' || tipo === 'elogio' ? Easing.costasSaida : Easing.suaveSaida);
  }

  limpar() {
    this.tipo = null;
    this.texto = '';
  }

  get vazio() {
    return !this.tipo;
  }

  _tamanho() {
    return this.tipo === 'elogio' ? 54 : 32;
  }

  _linhas(ctx) {
    ctx.font = `800 ${this._tamanho()}px ${FONTE}`;
    return quebrarLinhas(ctx, this.texto, 520);
  }

  /** A altura que o aviso ocupa (para o centro se arrumar). */
  alturaOcupada() {
    if (!this.tipo) return 0;
    if (this.tipo === 'rodada') return 100;
    const m = medidor();
    const n = m ? this._linhas(m).length : Math.ceil(this.texto.length / 28);
    const fundo = this.tipo === 'neutro' ? 0 : 28;
    return n * this._tamanho() * 1.2 + fundo;
  }

  desenhar(ctx) {
    if (!this.tipo) return;
    ctx.save();
    const pulo = this.tipo === 'rodada' || this.tipo === 'elogio';
    ctx.globalAlpha *= Math.min(1, this.k * 1.5);
    if (pulo) ctx.scale(0.6 + 0.4 * this.k, 0.6 + 0.4 * this.k);
    else ctx.translate(0, (1 - this.k) * 6);
    if (this.tipo === 'rodada') {
      const extra = this.texto === 'EXTRA';
      const cor = extra ? CORES.ouro : CORES.chita;
      // RODADA [n] DE 3, alinhados pela base: o número é o protagonista.
      ctx.font = `800 30px ${FONTE}`;
      const w1 = ctx.measureText('R O D A D A').width;
      ctx.font = `800 ${extra ? 62 : 88}px ${FONTE}`;
      const w2 = ctx.measureText(this.texto).width;
      ctx.font = `800 28px ${FONTE}`;
      const w3 = extra ? 0 : ctx.measureText('DE 3').width;
      const gap = 18;
      let x = -(w1 + gap + w2 + (extra ? 0 : gap + w3)) / 2;
      const base = 26;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      ctx.fillStyle = cor;
      ctx.font = `800 30px ${FONTE}`;
      ctx.fillText('R O D A D A', x, base - 4);
      x += w1 + gap;
      ctx.font = `800 ${extra ? 62 : 88}px ${FONTE}`;
      ctx.fillText(this.texto, x, base);
      if (!extra) {
        x += w2 + gap;
        ctx.globalAlpha *= 0.7;
        ctx.font = `800 28px ${FONTE}`;
        ctx.fillText('DE 3', x, base - 4);
      }
      ctx.restore();
      return;
    }
    const tam = this._tamanho();
    const linhas = this._linhas(ctx);
    const alto = linhas.length * tam * 1.2;
    if (this.tipo !== 'neutro') {
      const fundo = { elogio: CORES.okFundo, ok: CORES.okFundo, erro: CORES.erroFundo, dica: CORES.dicaFundo }[this.tipo];
      const largura = Math.max(...linhas.map((l) => ctx.measureText(l).width)) + 44;
      ctx.fillStyle = fundo;
      ctx.beginPath();
      ctx.roundRect(-largura / 2, -alto / 2 - 14, largura, alto + 28, 18);
      ctx.fill();
    }
    const cor = { elogio: CORES.okTexto, ok: CORES.okTexto, erro: CORES.erroTexto, dica: CORES.dicaTexto, neutro: CORES.tinta }[this.tipo];
    linhas.forEach((l, i) => escrever(ctx, l, 0, -alto / 2 + tam * 0.6 + i * tam * 1.2, tam, cor));
    ctx.restore();
  }
}

/** O monte de cubinhos: dele a criança arrasta as peças. A bolinha laranja é o 1º degrau da ajuda. */
class Monte extends Node {
  constructor() {
    super({ x: MONTE.cx - MONTE.lado / 2, y: MONTE.cy - MONTE.lado / 2, largura: MONTE.lado, altura: MONTE.lado, interativo: true });
    this.badge = 0;
  }

  desenhar(ctx) {
    desenharMonte(ctx, MONTE.lado, this.badge);
  }
}

/** Um cubinho solto: o que a criança arrasta e o que voa do monte até a casa. `x`, `y` são o centro. */
class Peca extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.erguido = opcoes.erguido ?? false;
  }

  desenhar(ctx) {
    desenharCubo(ctx, 0, 0, LADO_CUBO, null, this.erguido);
  }
}

/** O dedinho branco da coleção, vindo da DIREITA do dado de baixo (a mão no espaço livre entre os dados e as contas, nunca sobre a fileira), com um toque lento (1,4 s). */
class DicaDedo extends Node {
  constructor() {
    super();
    this.alvo = null;
    this.t = 0;
    this.visible = false;
  }

  mostrar(alvo) {
    this.alvo = alvo;
    this.t = 0;
    this.visible = true;
  }

  esconder() {
    this.visible = false;
    this.alvo = null;
  }

  atualizar(dt) {
    super.atualizar(dt);
    if (this.visible) this.t += dt;
  }

  desenhar(ctx) {
    if (!this.alvo) return;
    const f = (this.t % 1.4) / 1.4;
    const tocando = f > 0.55 && f < 0.72;
    desenharOndaToque(ctx, this.alvo.x - 8, this.alvo.y, 40, (f - 0.55) / 0.4);
    desenharDedo(ctx, this.alvo.x - (tocando ? 6 : 0), this.alvo.y, 62, Math.min(1, this.t / 0.4), APONTA.esquerda);
  }
}

const ELOGIOS = [['MUITO BEM!', 'muitoBem', 'Muito bem!'], ['ISSO AÍ!', 'issoAi', 'Isso aí!'], ['MANDOU BEM!', 'mandouBem', 'Mandou bem!']];

/**
 * GameScene — a partida do Cubra Nove.
 *
 * Fases (`this.fase`):
 *   'dado'      a vez da criança começou: o anúncio da rodada e o dedinho nos dados, esperando o toque
 *   'rolando'   os dados rolando (de qualquer um)
 *   'cobrir'    a criança cobre (arrastando do monte ou tocando na casa) e toca em PRONTO
 *   'demonstrando'  2º degrau da ajuda: o cubinho vai até as casas que faltam e volta ao monte
 *   'fimVez'    o elogio do fim da vez da criança, antes da vez do computador
 *   'cpu'       o computador joga e cobre, peça por peça
 *   'conferir'  a criança confere: COBRIU TUDO ou FALTOU UM
 *   'retorno'   o retorno da conferência, antes da próxima rodada
 *   'fim'       alguém venceu; vai ao resultado
 *
 * **As regras do vídeo** (docs/REGRAS-CUBRA-NOVE.md): cobre-se tudo o que estiver livre entre os dois
 * dados, a soma (até 9) e a diferença (não 0; só a partir do Médio). Três rodadas, vence quem cobriu
 * mais; cobrir os 9 vence na hora; empate, rodada extra (até `regras.maxExtras`, e no teto a criança
 * leva). O computador esquece um número 1 vez em 4 e fica sem ele.
 *
 * **A nota** (`_terminar`, RE-02): vitória = casas cobertas − erros; derrota = casas cobertas. Erro =
 * cubinho numa casa que os dados não dão, ou PRONTO com número ainda por cobrir (1 por vez).
 *
 * Todo o tempo passa por Tween no `relogio` (nenhum setTimeout): pausa e ajuda congelam tudo.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.regras = { rolarMs: 900, rodadas: 3, maxExtras: 5, computadorEsquece: 0.25, cpuEsperaMs: 900, vooMs: 550, demonstraMs: 800, errosParaPassar: 3, ...config.regras };
    this.comDiferenca = !!this.nivel.diferenca;
    /** 'prontas' (Fácil: as contas com o resultado), 'escondidas' (Médio: "?"), 'nenhuma' (Difícil: só os dados). */
    this.modoContas = this.nivel.contas ?? 'prontas';

    this.placar = new ScoreSystem({ total: CASAS, nivel: this.nivel.id ?? 1, vidas: 0 });
    this.cobertas = { c: fileiraVazia(), p: fileiraVazia() };
    this.rodada = 1;
    this.extras = 0;
    this.erros = 0;
    this.fase = 'dado';
    this.vez = null;
    this.stats = {
      porOrigem: { dado: 0, soma: 0, dif: 0 }, toquesErrados: 0, prontoCedo: 0, demonstracoes: 0, vezesPerdidas: 0, numerosPerdidos: 0,
      dicas2: 0, conferencias: 0, conferenciasCertas: 0, esquecimentosDoComputador: 0, vezesSemNada: 0,
    };
    /** Ganchos de teste: os próximos dados (`[[a, b], …]`, de qualquer um) e o próximo esquecimento do computador (`null` sorteia, `false` não esquece, um número esquece esse). */
    this.dadosDeTeste = [];
    this.esqueceDeTeste = null;
    this._fimResolvido = false;
    this._voando = false;
    this._arrasto = null;
    this._pendente = null;

    this.adicionar(new Background({ largura: L, altura: A, tema: config.tema ?? 'madeira', mostrarDecoracoes: false }));
    this.adicionar(new Prancha());

    this.fileiraP = new Fileira('p', false);
    this.fileiraC = new Fileira('c', true);
    this.adicionar(this.fileiraP, this.fileiraC);
    for (let v = 1; v <= CASAS; v++) this.fileiraC.casas[v].on('toque', () => this._tocarCasa(v));

    this.dados = new Dados();
    this.dados.on('toque', () => this._tocarDados());
    this.monte = new Monte();
    this.monte.on('apertar', (p) => this._pegar(p));
    this.contas = new Contas();
    this.aviso = new Aviso();
    this.adicionar(this.dados, this.monte, this.contas, this.aviso);

    const clique = config.audio?.clique;
    const botao = (rotulo, variante, aoTocar, largura = 300) => {
      const b = new Button({
        rotulo, variante, largura, altura: 84, tamanhoTexto: 32,
        // Texto escuro no verde (6,5:1), como o PRONTO do Subtraindo o Dominó: o branco dá 2,3:1.
        corTexto: variante === 'sucesso' ? '#052E16' : undefined,
        audio: this.audio, somToque: clique, aoTocar,
      });
      b.visible = false;
      b.definirHabilitado(false);
      this.adicionar(b);
      return b;
    };
    this.botaoPronto = botao('PRONTO', 'sucesso', () => this._pronto());
    this.botaoTudo = botao('COBRIU TUDO', 'sucesso', () => this._conferir(false), 270);
    this.botaoFaltou = botao('FALTOU UM', 'perigo', () => this._conferir(true), 270);

    this.dica = new DicaDedo();
    /** As peças soltas (arrasto e voo) ficam numa camada por cima de tudo do tabuleiro. */
    this.camadaPecas = new Node();
    this.adicionar(this.dica, this.camadaPecas);

    // ------------------------------------------------------------------- HUD
    this.adicionar(
      new IconButton({ icone: 'pausa', x: L - 272, y: 20, audio: this.audio, somToque: clique, corContorno: 'transparent', aoTocar: () => this.pausar() }),
      new IconButton({ icone: 'tutorial', x: L - 184, y: 20, audio: this.audio, somToque: clique, corContorno: 'transparent', aoTocar: () => this.pedirAjuda() }),
      new SoundToggle({ audio: this.audio, x: L - 96, y: 20, somToque: clique }),
    );

    // ----------------------------------------------------------- pausa/ajuda
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

    // -------------------------------------------------------------- arrasto
    this.aoDesmontar(this.input.on('arrastar', (p) => this._arrastar(p)));
    this.aoDesmontar(this.input.on('soltar', (p) => this._soltar(p)));
    this.aoDesmontar(this.input.on('cancelar', () => this._devolverArrasto()));

    // --------------------------------------------------------------- guarda
    // Toda espera e todo voo de peça passam pelo `relogio` (`_depois`). Se uma exceção engolida cortar a
    // cadeia, a partida não pode ficar presa: o cão de guarda roda o passo que estava pendente.
    this.relogio = new Node();
    this.adicionar(this.relogio);
    this.guarda = new Watchdog({
      nome: 'jogada do cubra nove',
      ocupado: () => (['rolando', 'demonstrando', 'fimVez', 'cpu', 'retorno'].includes(this.fase) || this._voando) && !this.pausada && !this._fimResolvido,
      vivo: () => Tween.temAtivo(this.relogio),
      graca: 0.6,
      limite: 14,
      aoTravar: () => this._destravar(),
    });

    this._vezCrianca();
  }

  // ----------------------------------------------------------------- narração

  _falar(id, texto, interromper = true) {
    if (interromper) this.audio?.calar();
    this.audio?.falar(id, { texto });
  }

  _efeito(chave) {
    const id = this.config.audio?.[chave];
    if (id) this.audio?.efeito(id);
  }

  // -------------------------------------------------------------------- tempo

  /** Espera `ms` no `relogio` e chama `fn`. Guarda o passo pendente para o cão de guarda. */
  _depois(ms, fn) {
    const passo = () => {
      if (this._pendente !== passo) return;
      this._pendente = null;
      fn();
    };
    this._pendente = passo;
    Tween.de(this.relogio).esperar(ms).chamar(passo);
  }

  _destravar() {
    const p = this._pendente;
    if (p) { Tween.removerDe(this.relogio); p(); }
  }

  // ------------------------------------------------------------------- centro

  /**
   * Arruma o centro: as contas, o aviso e os botões visíveis, empilhados e centrados na vertical entre
   * as fileiras (o que está vazio não ocupa espaço).
   */
  _arrumarCentro() {
    const botoes = [this.botaoPronto, this.botaoTudo, this.botaoFaltou].filter((b) => b.visible);
    const itens = [];
    if (this.contas.itens.length) itens.push(['contas', 72]);
    if (!this.aviso.vazio) itens.push(['aviso', this.aviso.alturaOcupada()]);
    if (botoes.length) itens.push(['botoes', 84]);
    const gap = 26;
    const total = itens.reduce((s, [, h]) => s + h, 0) + gap * Math.max(0, itens.length - 1);
    let y = CENTRO.cy - total / 2;
    for (const [nome, h] of itens) {
      const cy = y + h / 2;
      if (nome === 'contas') this.contas.y = cy;
      if (nome === 'aviso') this.aviso.y = cy;
      if (nome === 'botoes') {
        const ws = botoes.map((b) => b.largura);
        const g = 24;
        let x = 640 - (ws.reduce((s, w) => s + w, 0) + g * (ws.length - 1)) / 2;
        botoes.forEach((b, i) => { b.x = x + ws[i] / 2; b.y = cy; x += ws[i] + g; });
      }
      y += h + gap;
    }
  }

  _mostrarBotoes(...botoes) {
    for (const b of [this.botaoPronto, this.botaoTudo, this.botaoFaltou]) {
      const ligar = botoes.includes(b);
      b.visible = ligar;
      b.definirHabilitado(ligar);
    }
    this._arrumarCentro();
  }

  _avisar(tipo, texto) {
    if (tipo) this.aviso.mostrar(tipo, texto);
    else this.aviso.limpar();
    this._arrumarCentro();
  }

  /**
   * Os dados e as contas, conforme o nível e a vez. `revelado` mostra tudo (o fim da vez). Os dados são
   * as contas deles: contorno verde quando o número foi coberto, apagados se já estava coberto.
   */
  _mostrarContas(revelado = false) {
    const v = this.vez;
    if (!v) { this.contas.itens = []; this.dados.estados = [null, null]; this._arrumarCentro(); return; }
    const prontas = this.modoContas === 'prontas' && v.quem === 'c';
    // Na vez do COMPUTADOR, nada de verde nem tracejado antes da conferência: a criança tem de comparar
    // os dados com a fileira dele para achar o que faltou (com o dado coberto verde e o esquecido sem
    // cor, a resposta viria de bandeja). Os estados aparecem quando ele termina e ela já respondeu.
    const mostra = (c) => revelado || (v.quem === 'c' && (c.feito || prontas));
    const estado = (c) => {
      if (c.dica) return 'dica';
      if (!mostra(c)) return null;
      return !c.cabe ? 'nao' : c.ja ? 'ja' : c.feito ? 'feito' : null;
    };
    this.dados.estados = [estado(v.contas[0]), estado(v.contas[1])];
    this.contas.itens = v.contas.slice(2)
      .filter((c) => this.modoContas !== 'nenhuma' || revelado || c.dica)
      .map((c) => ({
        texto: `${c.texto} = ${mostra(c) || this.modoContas === 'prontas' || c.dica ? c.valor : '?'}`,
        estado: estado(c),
      }));
    this._arrumarCentro();
  }

  // ---------------------------------------------------------------------- vez

  /** A vez da criança: o anúncio da rodada e o dedinho nos dados. */
  _vezCrianca() {
    if (this._fimResolvido) return;
    this.fase = 'dado';
    this.vez = null;
    this.fileiraC.ativa = true;
    this.fileiraP.ativa = false;
    this.monte.badge = 0;
    this._mostrarContas();
    this._mostrarBotoes();
    const extra = this.rodada > this.regras.rodadas;
    this._avisar('rodada', extra ? 'EXTRA' : String(this.rodada));
    this._falar(extra ? 'rodadaExtra' : `rodada${this.rodada}`, extra ? 'Rodada extra!' : `Rodada ${this.rodada}!`);
    // Em fila, depois do anúncio da rodada: "Sua vez!" (já gravado na coleção, como o "Vez do computador").
    this.audio?.falar('suaVez', { texto: 'Sua vez!' });
    this.dados.estados = ['convida', 'convida'];
    // O dedinho: na hora na 1ª rodada; depois, só se a criança demorar 2,5 s.
    Tween.removerDe(this.dica);
    const alvo = { x: DADOS.cx + DADOS.lado / 2 + 8, y: CENTRO.cy + DADOS.gap / 2 + DADOS.lado / 2 };
    if (this.rodada === 1) this.dica.mostrar(alvo);
    else Tween.de(this.dica).esperar(2500).chamar(() => { if (this.fase === 'dado') this.dica.mostrar(alvo); });
  }

  _tocarDados() {
    if (this.pausada || this.fase !== 'dado' || this._fimResolvido) return;
    Tween.removerDe(this.dica);
    this.dica.esconder();
    this._avisar(null);
    for (let v = 1; v <= CASAS; v++) { this.fileiraP.casas[v].fantasma = false; this.fileiraC.casas[v].fantasma = false; }
    this._rolar('c', () => this._comecarCobrir());
  }

  /** Rola os dados de `quem` e, parados, monta a jogada (`this.vez`) e segue em `fn`. */
  _rolar(quem, fn) {
    this.fase = 'rolando';
    this.dados.estados = [null, null];
    this.dados.rolando = true;
    if (quem === 'p') this._falar('vezDoComputador', 'Vez do computador!');
    const [a, b] = this.dadosDeTeste.shift() ?? rolarDados();
    this._depois(this.regras.rolarMs, () => {
      this.dados.rolando = false;
      this.dados.faces = [a, b];
      this._efeito('pouso');
      const contas = contasDaJogada(a, b, this.comDiferenca)
        .map((c) => ({ ...c, ja: c.cabe && this.cobertas[quem][c.valor], feito: false, dica: false }));
      this.vez = { quem, a, b, contas };
      fn();
    });
  }

  /** Os alvos da vez: o que os dados dão e ainda está livre na fileira de quem joga. */
  _alvos() {
    return alvosDaJogada(this.vez.contas, this.cobertas[this.vez.quem]);
  }

  _comecarCobrir() {
    this.fase = 'cobrir';
    this.vez.dicaGrau = 0;
    this.vez.errosVez = 0;
    this.vez.cobertasVez = [];
    this._mostrarContas();
    this._mostrarBotoes(this.botaoPronto);
  }

  // ------------------------------------------------------------- cobrir (criança)

  /** A casa `v` sob o ponto (x, y), com uma folga vertical; 0 se o ponto está fora da fileira da criança. */
  _casaSob(x, y) {
    const l = CASAS * CASA.lado + (CASAS - 1) * CASA.gap;
    const y0 = FILEIRA_Y.c;
    if (x < FX0 - 6 || x > FX0 + l + 6 || y < y0 - FOLGA_SOLTAR || y > y0 + CASA.lado + FOLGA_SOLTAR) return 0;
    return Math.min(CASAS, Math.max(1, 1 + Math.floor((x - FX0) / (CASA.lado + CASA.gap))));
  }

  _podeCobrir() {
    return !this.pausada && this.fase === 'cobrir' && !this._voando && !this._arrasto && !this._fimResolvido;
  }

  /** Tocar na casa: se os dados dão o número, o cubinho sai do monte e vai sozinho até ela. */
  _tocarCasa(v) {
    if (!this._podeCobrir()) return;
    const res = avaliarCasa(v, this._alvos(), this.cobertas.c);
    if (res === 'ok') this._voar('c', v, () => this._aplicar(v, 'ok'));
    else this._aplicar(v, res);
  }

  /** Arrastar: o cubinho sai do monte sob o dedo (um pouco acima dele, para o dedo não o esconder). */
  _pegar(p) {
    if (!this._podeCobrir()) return;
    const peca = new Peca({ x: p.x, y: p.y - 24, erguido: true });
    this.camadaPecas.adicionar(peca);
    this._arrasto = peca;
  }

  _arrastar(p) {
    const peca = this._arrasto;
    if (!peca || this.pausada) return;
    peca.x = p.x;
    peca.y = p.y - 24;
  }

  _soltar() {
    const peca = this._arrasto;
    if (!peca) return;
    this._arrasto = null;
    const v = this._casaSob(peca.x, peca.y);
    if (this.pausada || this.fase !== 'cobrir' || !v) { this._devolver(peca); return; }
    const res = avaliarCasa(v, this._alvos(), this.cobertas.c);
    if (res !== 'ok') {
      this._aplicar(v, res);
      this._devolver(peca);
      return;
    }
    // Encaixa: a peça desliza para o centro da casa e a casa fica coberta.
    peca.erguido = false;
    this._voando = true;
    Tween.para(peca, { x: xDaCasa(v) + CASA.lado / 2, y: FILEIRA_Y.c + CASA.lado * 0.46 }, 140, Easing.suaveSaida);
    this._depois(150, () => {
      peca.removerDoPai();
      this._voando = false;
      this._aplicar(v, 'ok');
    });
  }

  /** A peça que não encaixou volta para o monte e some. */
  _devolver(peca) {
    peca.erguido = false;
    Tween.removerDe(peca);
    Tween.de(peca).entao({ x: MONTE.cx, y: MONTE.cy }, 300, Easing.suaveSaida).chamar(() => peca.removerDoPai());
  }

  _devolverArrasto() {
    const peca = this._arrasto;
    if (!peca) return;
    this._arrasto = null;
    this._devolver(peca);
  }

  /** Um cubinho voa do monte até a casa `v` da fileira de `quem` e só então `fn` roda. */
  _voar(quem, v, fn) {
    const peca = new Peca({ x: MONTE.cx, y: MONTE.cy });
    this.camadaPecas.adicionar(peca);
    this._voando = true;
    Tween.para(peca, { x: xDaCasa(v) + CASA.lado / 2, y: FILEIRA_Y[quem] + CASA.lado * 0.46 }, this.regras.vooMs, Easing.suave);
    this._depois(this.regras.vooMs + 10, () => {
      peca.removerDoPai();
      this._voando = false;
      fn();
    });
  }

  /**
   * O resultado de pôr um cubinho na casa `v` da criança. Sem frase: o retorno é no tabuleiro.
   *   'ok'   a casa fica coberta, anel verde, a conta acende, som de acerto;
   *   'nao'  a casa balança com anel coral, som de erro, 1 erro;
   *   'ja'   a casa só balança (sem erro).
   */
  _aplicar(v, res) {
    const casa = this.fileiraC.casas[v];
    if (res === 'ja') { casa.animar('treme'); return; }
    if (res === 'nao') {
      this.erros += 1;
      this.vez.errosVez += 1;
      this.stats.toquesErrados += 1;
      casa.animar('errado');
      this._efeito('erro');
      if (this.vez.errosVez >= this.regras.errosParaPassar) this._perdeuAVez();
      return;
    }
    this.cobertas.c[v] = true;
    casa.coberta = true;
    casa.animar('certo');
    this._efeito('acerto');
    this.vez.cobertasVez.push(v);
    const daConta = this.vez.contas.filter((c) => c.valor === v && c.cabe);
    for (const c of daConta) { c.feito = true; c.dica = false; }
    this.stats.porOrigem[daConta.find((c) => c.tipo === 'dif') ? 'dif' : daConta.find((c) => c.tipo === 'soma') ? 'soma' : 'dado'] += 1;
    if (this.vez.dicaGrau > 0) this.monte.badge = this._alvos().length;
    this._mostrarContas();
    if (cobriuTudo(this.cobertas.c)) this._terminar('crianca');
  }

  /**
   * PRONTO: confere se não sobrou nada. Sobrou, é ERRO (1 por toque) e a ajuda em degraus, sem texto de
   * instrução — tudo dentro do limite de `regras.errosParaPassar` (3) erros na vez:
   *   1º  a bolinha no monte com quantas peças faltam e a conta (ou o dado) que falta acesa em âmbar;
   *   2º  o jogo MOSTRA: o cubinho vai do monte até cada casa que falta, fica um instante e VOLTA ao
   *       monte; a casa fica marcada (contorno âmbar) e é a criança quem leva a peça até lá (pedido do
   *       humano, 12/11/2026: o gesto tem de ser dela);
   *   3º  erro (o 3º da vez, contando também as casas erradas): **a vez passa** e ela fica sem os números
   *       que faltavam (`_perdeuAVez`). O jogo nunca cobre por ela: ninguém vence sem jogar (pedido do
   *       humano, 12/11/2026, valendo também no Fácil).
   */
  _pronto() {
    if (!this._podeCobrir()) return;
    const resta = this._alvos();
    if (!resta.length) { this._fimVezCrianca(false); return; }
    this.erros += 1;
    this.vez.errosVez += 1;
    this.stats.prontoCedo += 1;
    this._efeito('erro');
    if (this.vez.errosVez >= this.regras.errosParaPassar) { this._perdeuAVez(); return; }
    this.vez.dicaGrau += 1;
    if (this.vez.dicaGrau === 1) {
      this.monte.badge = resta.length;
      const c = contaDaDica(this.vez.contas, this.cobertas.c);
      c.dica = true;
      this.stats.dicas2 += 1;
      this._mostrarContas();
      this._avisar('dica', resta.length > 1 ? `AINDA DÁ PARA COBRIR ${resta.length} NÚMEROS.` : 'AINDA DÁ PARA COBRIR UM NÚMERO.');
      this._falar('aindaDaParaCobrir', 'Ainda dá para cobrir!');
    } else {
      // A demonstração: a peça vai e volta, e a casa fica marcada para a criança levar a dela.
      this.fase = 'demonstrando';
      this._mostrarBotoes();
      // Frase curta: quem mostra é a peça indo e voltando, e as casas que ficam marcadas.
      this._avisar('dica', 'OLHE ONDE VAI.');
      this._falar('olheOndeVai', 'Olhe onde vai.');
      this.stats.demonstracoes += 1;
      const fila = [...resta];
      const proxima = () => {
        if (!fila.length) {
          this.fase = 'cobrir';
          this.monte.badge = this._alvos().length;
          this._mostrarBotoes(this.botaoPronto);
          return;
        }
        this._demonstrar(fila.shift(), proxima);
      };
      proxima();
    }
  }

  /**
   * O 3º erro da vez: **a vez passa** e a criança fica sem os números que faltavam — a mesma regra do
   * computador que esquece. O cubinho fantasma mostra em cada casa onde a peça iria, até ela jogar os
   * dados de novo. Sem elogio; a frase diz o que aconteceu.
   */
  _perdeuAVez() {
    if (this._fimResolvido) return;
    const resta = this._alvos();
    this.fase = 'fimVez';
    this.monte.badge = 0;
    this.stats.vezesPerdidas += 1;
    this.stats.numerosPerdidos += resta.length;
    for (const c of this.vez.contas) c.dica = false;
    for (let v = 1; v <= CASAS; v++) this.fileiraC.casas[v].indicada = false;
    for (const v of resta) {
      this.fileiraC.casas[v].fantasma = true;
      this.fileiraC.casas[v].animar('treme');
    }
    this._mostrarBotoes();
    this._mostrarContas(true);
    this._avisar('erro', 'TRÊS ERROS: A VEZ PASSA.');
    this._falar('aVezPassa', 'Três erros. A vez passa.');
    this._depois(2600, () => this._vezComputador());
  }

  /**
   * O 3º degrau: um cubinho sai do monte, vai até a casa `v`, fica `regras.demonstraMs` ali e VOLTA ao
   * monte. A casa fica marcada (`indicada`, contorno âmbar estável) até a criança cobri-la.
   */
  _demonstrar(v, fn) {
    const peca = new Peca({ x: MONTE.cx, y: MONTE.cy });
    this.camadaPecas.adicionar(peca);
    this._voando = true;
    Tween.para(peca, { x: xDaCasa(v) + CASA.lado / 2, y: FILEIRA_Y.c + CASA.lado * 0.46 }, this.regras.vooMs, Easing.suave);
    this._depois(this.regras.vooMs + 10, () => {
      this.fileiraC.casas[v].indicada = true;
      this._depois(this.regras.demonstraMs, () => {
        Tween.para(peca, { x: MONTE.cx, y: MONTE.cy }, this.regras.vooMs, Easing.suave);
        this._depois(this.regras.vooMs + 10, () => {
          peca.removerDoPai();
          this._voando = false;
          fn();
        });
      });
    });
  }

  /** O fim da vez da criança: as contas reveladas e o elogio (vez limpa: sorteado; com erro ou dica: "CONSEGUIU!"). */
  _fimVezCrianca(ajudou) {
    if (this._fimResolvido) return;
    this.fase = 'fimVez';
    for (let v = 1; v <= CASAS; v++) this.fileiraC.casas[v].indicada = false;
    this.monte.badge = 0;
    for (const c of this.vez.contas) c.dica = false;
    this._mostrarBotoes();
    this._mostrarContas(true);
    if (!this.vez.cobertasVez.length && !ajudou) this.stats.vezesSemNada += 1;
    if (!ajudou) {
      const [texto, id, fala] = this.vez.errosVez || this.vez.dicaGrau
        ? ['CONSEGUIU!', 'conseguiu', 'Conseguiu!']
        : ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)];
      this._avisar('elogio', texto);
      this._falar(id, fala);
    }
    this._depois(1900, () => this._vezComputador());
  }

  // ---------------------------------------------------------------- computador

  _vezComputador() {
    if (this._fimResolvido) return;
    this.fase = 'cpu';
    this.fileiraC.ativa = false;
    this.fileiraP.ativa = true;
    this.vez = null;
    this._mostrarContas();
    this._avisar(null);
    this._depois(this.regras.cpuEsperaMs, () => this._rolar('p', () => this._computadorCobre()));
  }

  /** O computador cobre, peça por peça, tudo o que dava — menos, 1 vez em 4, um número esquecido. */
  _computadorCobre() {
    this.fase = 'cpu';
    const alvos = this._alvos();
    const forcado = this.esqueceDeTeste;
    this.esqueceDeTeste = null;
    const esquecido = forcado === false ? null
      : typeof forcado === 'number' && alvos.includes(forcado) ? forcado
        : esquecimentoDoComputador(alvos, this.regras.computadorEsquece);
    this.vez.esquecido = esquecido;
    if (esquecido != null) this.stats.esquecimentosDoComputador += 1;
    this._mostrarContas();
    const fila = alvos.filter((v) => v !== esquecido);
    const proxima = () => {
      if (!fila.length) { this._perguntarConferencia(); return; }
      const v = fila.shift();
      this._voar('p', v, () => {
        this.cobertas.p[v] = true;
        this.fileiraP.casas[v].coberta = true;
        this.fileiraP.casas[v].animar('certo');
        this._efeito('pouso');
        for (const c of this.vez.contas) if (c.valor === v && c.cabe) c.feito = true;
        this._mostrarContas();
        if (cobriuTudo(this.cobertas.p)) { this._terminar('computador'); return; }
        this._depois(300, proxima);
      });
    };
    this._depois(450, proxima);
  }

  _perguntarConferencia() {
    this.fase = 'conferir';
    this._mostrarBotoes(this.botaoTudo, this.botaoFaltou);
  }

  /**
   * A criança conferiu. Se ele esqueceu, **ficou sem o número** (a vez dele acabou), seja qual for a
   * resposta: a criança não ganha nada calando o erro. O cubinho fantasma mostra onde a peça poderia
   * estar até a criança jogar os dados de novo. Conferir mal não é erro na nota: é treino, no relatório.
   */
  _conferir(disseFaltou) {
    if (this.pausada || this.fase !== 'conferir') return;
    this.fase = 'retorno';
    this._mostrarBotoes();
    const e = this.vez.esquecido;
    const bem = disseFaltou === (e != null);
    this.stats.conferencias += 1;
    if (bem) this.stats.conferenciasCertas += 1;
    this._efeito(bem ? 'acerto' : 'erro');
    let texto = bem ? 'ISSO! ' : 'OLHE DE NOVO: ';
    if (e != null) {
      const daConta = this.vez.contas.filter((c) => c.valor === e && c.cabe);
      const nomes = [...new Set(daConta.map((c) => (c.tipo === 'dado' ? `O DADO ${c.valor}` : `${c.texto} = ${c.valor}`)))];
      texto += `FALTOU O ${e} (${nomes.join(' E ')}). FICOU SEM ELE.`;
      this.fileiraP.casas[e].fantasma = true;
      this.fileiraP.casas[e].animar('treme');
    } else {
      texto += 'ELE COBRIU TUDO O QUE DAVA.';
    }
    this._mostrarContas(true);
    this._avisar(bem ? 'ok' : 'erro', texto);
    this._falar(bem ? 'isso' : 'olheDeNovo', bem ? 'Isso!' : 'Olhe de novo!');
    this._depois(2600, () => this._fimDaRodada());
  }

  // ---------------------------------------------------------------- rodadas

  _fimDaRodada() {
    if (this._fimResolvido) return;
    const sit = situacaoDaRodada({
      c: contarCobertas(this.cobertas.c), p: contarCobertas(this.cobertas.p),
      rodada: this.rodada, rodadas: this.regras.rodadas, extras: this.extras, maxExtras: this.regras.maxExtras,
    });
    if (sit === 'continua' || sit === 'extra') {
      if (sit === 'extra') this.extras += 1;
      this.rodada += 1;
      this._vezCrianca();
      return;
    }
    this._terminar(sit);
  }

  // ---------------------------------------------------------------------- fim

  /**
   * Vai ao resultado. A nota é a da RE-02 (`notaDaPartida`): vitória = cobertas − erros; derrota =
   * cobertas. Vai pronta em `acertos` (o `ScoreSystem` só desconta quando a meta de 9 é atingida, e aqui
   * vence quem cobre mais). Não passa `estrelas`: a tela deriva a fileira (RE-04).
   */
  _terminar(vencedor) {
    if (this._fimResolvido) return;
    this._fimResolvido = true;
    this.fase = 'fim';
    this._mostrarBotoes();
    this.dica.esconder();
    const vitoria = vencedor === 'crianca';
    const c = contarCobertas(this.cobertas.c);
    const p = contarCobertas(this.cobertas.p);
    const empateNoTeto = vitoria && c === p;
    this.placar.acertos = notaDaPartida({ vitoria, cobertas: c, erros: this.erros });
    this.placar.erros = this.erros;
    const resultado = this.placar.paraAva(vitoria, {
      cobertasCrianca: c,
      cobertasComputador: p,
      cobertasPorOrigem: { ...this.stats.porOrigem },
      toquesErrados: this.stats.toquesErrados,
      prontoCedo: this.stats.prontoCedo,
      dicasNaConta: this.stats.dicas2,
      demonstracoes: this.stats.demonstracoes,
      vezesPerdidas: this.stats.vezesPerdidas,
      numerosPerdidos: this.stats.numerosPerdidos,
      vezesSemNada: this.stats.vezesSemNada,
      conferencias: this.stats.conferencias,
      conferenciasCertas: this.stats.conferenciasCertas,
      esquecimentosDoComputador: this.stats.esquecimentosDoComputador,
      rodadas: this.rodada,
      rodadasExtras: this.extras,
      empateNoTeto,
      cobriuOsNove: c === CASAS,
    });
    this.resultadoFinal = resultado;
    Tween.removerDe(this.relogio);
    this._pendente = null;
    Tween.de(this.relogio).esperar(1400).chamar(() => this.irPara('resultado', { nivel: this.nivel, resultado }));
  }

  // ------------------------------------------------------------ pausa e ajuda

  pausar() {
    if (this._fimResolvido || this.pausada) return;
    this._devolverArrasto();
    Tween.pausarTodos();
    this.pausada = true;
    this.pausa.abrir();
  }

  /** Ajuda: o tutorial por cima da partida, sem perdê-la (RE-05). */
  pedirAjuda() {
    if (this._fimResolvido || this.pausada) return;
    this._devolverArrasto();
    Tween.pausarTodos();
    this.pausada = true;
    this.ajuda.abrir();
  }

  atualizar(dt) {
    if (this.pausada) {
      this.pausa.atualizar(dt);
      this.ajuda.atualizar(dt);
      return;
    }
    super.atualizar(dt);
    this.guarda.atualizar(dt);
  }

  aoSair() {
    Tween.removerTodos();
  }
}
