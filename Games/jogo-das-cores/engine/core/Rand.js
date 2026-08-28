/**
 * Rand — sorteio central do motor.
 *
 * Existe por dois motivos: (1) concentrar o sorteio num lugar só, em vez de
 * `Math.random()` espalhado como nos jogos originais; (2) permitir SEMENTE, o
 * que torna uma partida reproduzível — indispensável para reproduzir um bug de
 * jogabilidade que "só acontece às vezes".
 */
export class Rand {
  /**
   * @param {number|null} semente inteiro; `null` usa uma semente aleatória
   */
  constructor(semente = null) {
    this.definirSemente(semente);
  }

  definirSemente(semente) {
    this.semente = semente === null || semente === undefined
      ? Math.floor(Math.random() * 0xffffffff)
      : semente >>> 0;
    this._estado = this.semente || 1;
    return this;
  }

  /** Float em [0, 1). Gerador mulberry32 — rápido e de qualidade suficiente. */
  float() {
    this._estado = (this._estado + 0x6d2b79f5) >>> 0;
    let t = this._estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Float em [min, max). */
  entre(min, max) {
    return min + this.float() * (max - min);
  }

  /** Inteiro em [min, max] — inclusivo nas duas pontas. */
  inteiro(min, max) {
    return Math.floor(this.entre(min, max + 1));
  }

  /** Um item aleatório de um array. */
  item(lista) {
    if (!lista || lista.length === 0) return undefined;
    return lista[this.inteiro(0, lista.length - 1)];
  }

  /** Embaralha uma CÓPIA do array (Fisher-Yates). */
  embaralhar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = this.inteiro(0, i);
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  /** true com a probabilidade dada (0 a 1). */
  chance(probabilidade) {
    return this.float() < probabilidade;
  }
}

/** Instância compartilhada — use esta a menos que precise de semente própria. */
export const rand = new Rand();
