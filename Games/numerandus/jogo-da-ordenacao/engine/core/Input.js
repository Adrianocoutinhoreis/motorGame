import { Emitter } from './Emitter.js';

/**
 * Input — entrada unificada de ponteiro (mouse, toque e caneta).
 *
 * Este arquivo é a razão pela qual os jogos refeitos funcionam em tablet e os
 * originais não: eles ouviam `mousedown`/`mousemove` do CreateJS e jQuery, que
 * em toque não disparam de forma confiável. Aqui usamos **Pointer Events**, que
 * trata os três dispositivos num caminho só.
 *
 * Emite, sempre em coordenada LÓGICA do Stage:
 *   'apertar'  (ponto, no)   — dedo/botão desceu
 *   'mover'    (ponto, no)   — moveu (com ou sem pressionar)
 *   'soltar'   (ponto, no)   — subiu
 *   'toque'    (ponto, no)   — apertou e soltou sobre o MESMO nó (o "click")
 *   'arrastar' (ponto, no)   — moveu com o ponteiro pressionado
 */
export class Input extends Emitter {
  /**
   * @param {import('./Stage.js').Stage} stage
   */
  constructor(stage) {
    super();
    this.stage = stage;
    this.pressionado = false;
    /** Último ponto lógico conhecido. */
    this.ponto = { x: 0, y: 0 };
    /** Nó onde o toque começou — usado para decidir o "click". */
    this.noPressionado = null;
    /** Nó sob o ponteiro no último movimento (para hover). */
    this.noSobrevoado = null;
    this.habilitado = true;

    const alvo = stage.canvas;
    // `touch-action: none` impede o navegador de rolar/dar zoom quando o aluno
    // arrasta dentro do jogo — sem isso, arrastar no tablet rola a página do AVA.
    alvo.style.touchAction = 'none';

    this._aoApertar = (e) => this._tratar(e, 'apertar');
    this._aoMover = (e) => this._tratar(e, 'mover');
    this._aoSoltar = (e) => this._tratar(e, 'soltar');
    this._aoCancelar = (e) => this._tratar(e, 'cancelar');

    alvo.addEventListener('pointerdown', this._aoApertar);
    // Ouvir move/up na JANELA (e não no canvas) garante que soltar o dedo fora
    // da área do jogo ainda encerre o arrasto — o jogo original travava nisso.
    window.addEventListener('pointermove', this._aoMover, { passive: true });
    window.addEventListener('pointerup', this._aoSoltar);
    window.addEventListener('pointercancel', this._aoCancelar);
  }

  _tratar(evento, tipo) {
    if (!this.habilitado) return;

    const p = this.stage.telaParaLogico(evento.clientX, evento.clientY);
    this.ponto = p;
    const no = this.stage.raiz.noSobPonto(p.x, p.y);

    if (tipo === 'apertar') {
      // Só captura se o toque caiu na área do jogo (não nas barras do letterbox).
      if (!this.stage.dentroDaArea(p.x, p.y)) return;
      this.pressionado = true;
      this.noPressionado = no;
      evento.target.setPointerCapture?.(evento.pointerId);
      no?.emit('apertar', p, no);
      this.emit('apertar', p, no);
      return;
    }

    if (tipo === 'mover') {
      if (no !== this.noSobrevoado) {
        this.noSobrevoado?.emit('sair', p, this.noSobrevoado);
        no?.emit('entrar', p, no);
        this.noSobrevoado = no;
      }
      this.emit('mover', p, no);
      if (this.pressionado) {
        this.noPressionado?.emit('arrastar', p, no);
        this.emit('arrastar', p, no);
      }
      return;
    }

    // 'soltar' e 'cancelar'
    const eraPressionado = this.pressionado;
    const noInicial = this.noPressionado;
    this.pressionado = false;
    this.noPressionado = null;

    if (tipo === 'cancelar') {
      this.emit('cancelar', p, no);
      return;
    }

    no?.emit('soltar', p, no);
    this.emit('soltar', p, no);

    // "Toque" = apertou e soltou no mesmo nó. É o clique acessível: nunca
    // dispara se o aluno começou a apertar num botão e arrastou para fora.
    if (eraPressionado && noInicial && noInicial === no) {
      noInicial.emit('toque', p, noInicial);
      this.emit('toque', p, noInicial);
    }
  }

  destruir() {
    const alvo = this.stage.canvas;
    alvo.removeEventListener('pointerdown', this._aoApertar);
    window.removeEventListener('pointermove', this._aoMover);
    window.removeEventListener('pointerup', this._aoSoltar);
    window.removeEventListener('pointercancel', this._aoCancelar);
    this.offAll();
  }
}
