import { Node } from './Node.js';

/**
 * Stage — a ponte entre o `<canvas>` e o scene-graph.
 *
 * Responsável pelo problema que os jogos originais simplesmente não resolviam:
 * eles tinham `<canvas width="800" height="600">` fixo, então em tablet ou num
 * iframe de tamanho diferente o jogo era cortado ou ficava minúsculo.
 *
 * Aqui o jogo é desenhado sempre em coordenadas LÓGICAS (padrão 1280×720) e o
 * Stage escala para o espaço disponível preservando a proporção (letterbox).
 * Isso é o que permite publicar um jogo sozinho no AVA sem saber de antemão o
 * tamanho do `<iframe>` que vai recebê-lo.
 */
export class Stage {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{larguraLogica?: number, alturaLogica?: number, corFundo?: string}} opcoes
   */
  constructor(canvas, opcoes = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });

    this.larguraLogica = opcoes.larguraLogica ?? 1280;
    this.alturaLogica = opcoes.alturaLogica ?? 720;
    this.corFundo = opcoes.corFundo ?? '#000000';

    /** Raiz do scene-graph. Cenas entram e saem daqui. */
    this.raiz = new Node({ nome: 'raiz', filhosInterativos: true });

    /** Escala aplicada (lógico → CSS) e deslocamento do letterbox, em px CSS. */
    this.escala = 1;
    this.deslocX = 0;
    this.deslocY = 0;

    this._aoRedimensionar = () => this.redimensionar();
    window.addEventListener('resize', this._aoRedimensionar);
    window.addEventListener('orientationchange', this._aoRedimensionar);

    // Quando o iframe do AVA muda de tamanho sem que a janela mude (layout do
    // AVA, painel lateral abrindo), o evento `resize` não dispara. O
    // ResizeObserver no elemento pai cobre esse caso.
    if (typeof ResizeObserver !== 'undefined') {
      this._observador = new ResizeObserver(() => this.redimensionar());
      this._observador.observe(canvas.parentElement ?? canvas);
    }

    this.redimensionar();
  }

  /** Recalcula escala e tamanho do buffer. Chamado no resize e no boot. */
  redimensionar() {
    const alvo = this.canvas.parentElement ?? document.body;
    const larguraDisp = Math.max(1, alvo.clientWidth || window.innerWidth);
    const alturaDisp = Math.max(1, alvo.clientHeight || window.innerHeight);

    // "fit": cabe inteiro, sem cortar, mantendo proporção.
    this.escala = Math.min(larguraDisp / this.larguraLogica, alturaDisp / this.alturaLogica);
    const larguraDesenho = this.larguraLogica * this.escala;
    const alturaDesenho = this.alturaLogica * this.escala;
    this.deslocX = (larguraDisp - larguraDesenho) / 2;
    this.deslocY = (alturaDisp - alturaDesenho) / 2;

    // Limitar o DPR a 2 evita buffers gigantes (e queda de FPS) em celulares 3x
    // sem diferença visível para arte plana.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const larguraBuffer = Math.round(larguraDisp * dpr);
    const alturaBuffer = Math.round(alturaDisp * dpr);

    if (this.canvas.width !== larguraBuffer || this.canvas.height !== alturaBuffer) {
      this.canvas.width = larguraBuffer;
      this.canvas.height = alturaBuffer;
    }
    this.canvas.style.width = `${larguraDisp}px`;
    this.canvas.style.height = `${alturaDisp}px`;
    this._dpr = dpr;

    this.raiz.emit('redimensionado', this);
  }

  /** Converte um ponto de tela (clientX/clientY) para coordenada lógica. */
  telaParaLogico(clientX, clientY) {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - r.left - this.deslocX) / this.escala,
      y: (clientY - r.top - this.deslocY) / this.escala,
    };
  }

  /** O ponto lógico está dentro da área do jogo (fora do letterbox)? */
  dentroDaArea(x, y) {
    return x >= 0 && y >= 0 && x <= this.larguraLogica && y <= this.alturaLogica;
  }

  atualizar(dt) {
    this.raiz.atualizar(dt);
  }

  renderizar() {
    const { ctx } = this;
    const dpr = this._dpr;

    // Pinta as barras do letterbox e limpa o buffer inteiro.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = this.corFundo;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.setTransform(
      this.escala * dpr, 0, 0, this.escala * dpr,
      this.deslocX * dpr, this.deslocY * dpr,
    );

    // Recorta na área lógica para nada vazar sobre as barras laterais.
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, this.larguraLogica, this.alturaLogica);
    ctx.clip();
    this.raiz.renderizar(ctx);
    ctx.restore();
  }

  destruir() {
    window.removeEventListener('resize', this._aoRedimensionar);
    window.removeEventListener('orientationchange', this._aoRedimensionar);
    this._observador?.disconnect();
    this.raiz.destruir();
  }
}
