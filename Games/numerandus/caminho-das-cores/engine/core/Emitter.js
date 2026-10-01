/**
 * Emitter — publicador/assinante mínimo.
 *
 * Base de quase tudo no motor: Node, Scene, Game e AvaBridge herdam daqui.
 * Substitui o `addEventListener`/`dispatchEvent` do CreateJS usado nos jogos
 * originais, sem depender do DOM (o scene-graph vive no canvas, não no DOM).
 */
export class Emitter {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this._ouvintes = new Map();
  }

  /** Registra um ouvinte. Retorna uma função que o remove. */
  on(evento, fn) {
    if (typeof fn !== 'function') throw new TypeError('on(evento, fn): fn precisa ser função');
    if (!this._ouvintes.has(evento)) this._ouvintes.set(evento, new Set());
    this._ouvintes.get(evento).add(fn);
    return () => this.off(evento, fn);
  }

  /** Registra um ouvinte que roda uma vez só. */
  once(evento, fn) {
    const remover = this.on(evento, (...args) => {
      remover();
      fn(...args);
    });
    return remover;
  }

  /** Remove um ouvinte específico, ou todos do evento se `fn` for omitido. */
  off(evento, fn) {
    if (!fn) {
      this._ouvintes.delete(evento);
      return;
    }
    const set = this._ouvintes.get(evento);
    if (set) {
      set.delete(fn);
      if (set.size === 0) this._ouvintes.delete(evento);
    }
  }

  /** Remove todos os ouvintes de todos os eventos. */
  offAll() {
    this._ouvintes.clear();
  }

  /**
   * Dispara um evento. Um ouvinte que lança erro é registrado no console e NÃO
   * impede os demais de rodar — um bug numa tela nunca derruba o jogo inteiro.
   */
  emit(evento, ...args) {
    const set = this._ouvintes.get(evento);
    if (!set || set.size === 0) return false;
    for (const fn of [...set]) {
      try {
        fn(...args);
      } catch (err) {
        console.error(`[motor] ouvinte de "${evento}" falhou:`, err);
      }
    }
    return true;
  }

  /** Quantos ouvintes existem para um evento (útil em teste). */
  contarOuvintes(evento) {
    return this._ouvintes.get(evento)?.size ?? 0;
  }
}
