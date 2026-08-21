/**
 * Tween — animação de propriedades por tempo, encadeável.
 *
 * Sucede o `createjs.Tween` que os três jogos originais usavam para a queda dos
 * blocos, a subida das linhas e o fade dos combos. Duas diferenças importantes:
 *
 * 1. Avança por **delta de tempo** (segundos), não por quadro. Se o navegador
 *    engasgar ou a aba perder o foco, a animação não desanda.
 * 2. É gerenciado por uma lista central estática — `Tween.atualizarTodos(dt)` é
 *    chamado uma vez pelo `Game`, e nada mais precisa saber que tweens existem.
 */

/** Curvas de aceleração. `t` vai de 0 a 1 e a saída também. */
export const Easing = {
  linear: (t) => t,
  suaveEntrada: (t) => t * t,
  suaveSaida: (t) => t * (2 - t),
  suave: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  cubicaEntrada: (t) => t * t * t,
  cubicaSaida: (t) => --t * t * t + 1,
  cubica: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  /** Passa do alvo e volta — dá "peso" a botões e cartões. */
  costasSaida: (t) => {
    const c = 1.70158;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  },
  /** Quica ao chegar — usado quando um bloco assenta na torre. */
  quicarSaida: (t) => {
    const n = 7.5625, d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  },
  elasticaSaida: (t) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
};

export class Tween {
  /** @type {Set<Tween>} */
  static _ativos = new Set();
  /** Multiplicador global de velocidade (1 = normal). Útil para depurar. */
  static escalaTempo = 1;

  constructor(alvo) {
    this.alvo = alvo;
    /** @type {Array<object>} */
    this._passos = [];
    this._indice = 0;
    this._decorrido = 0;
    this._inicioCapturado = false;
    this.pausado = false;
    this.concluido = false;
    this.laco = false;
  }

  /** Cria e inicia um tween para o alvo. */
  static para(alvo, propriedades, duracaoMs, easing) {
    const t = new Tween(alvo);
    Tween._ativos.add(t);
    return t.entao(propriedades, duracaoMs, easing);
  }

  /** Cria um tween vazio (para começar com `esperar`). */
  static de(alvo) {
    const t = new Tween(alvo);
    Tween._ativos.add(t);
    return t;
  }

  /** Encadeia mais uma etapa de animação. */
  entao(propriedades, duracaoMs = 0, easing = Easing.suave) {
    this._passos.push({ tipo: 'animar', propriedades, duracao: duracaoMs / 1000, easing, de: null });
    return this;
  }

  /** Pausa por N milissegundos antes da próxima etapa. */
  esperar(ms) {
    this._passos.push({ tipo: 'esperar', duracao: ms / 1000 });
    return this;
  }

  /** Executa uma função quando chegar nesta etapa. */
  chamar(fn) {
    this._passos.push({ tipo: 'chamar', fn });
    return this;
  }

  /** Define propriedades instantaneamente nesta etapa. */
  definir(propriedades) {
    this._passos.push({ tipo: 'definir', propriedades });
    return this;
  }

  /** Repete a sequência indefinidamente. */
  emLaco(ativo = true) {
    this.laco = ativo;
    return this;
  }

  pausar(v = true) {
    this.pausado = v;
    return this;
  }

  /** Interrompe e descarta este tween (não roda os `chamar` restantes). */
  parar() {
    this.concluido = true;
    Tween._ativos.delete(this);
    return this;
  }

  /** Avança o tween. `dt` em segundos. */
  atualizar(dt) {
    if (this.pausado || this.concluido) return;

    let restante = dt * Tween.escalaTempo;
    let guarda = 0;

    while (restante > 0 && !this.concluido) {
      if (++guarda > 1000) {
        console.warn('[motor] Tween: laço muito longo em um quadro, interrompendo');
        break;
      }
      const passo = this._passos[this._indice];
      if (!passo) {
        if (this.laco && this._passos.length > 0) {
          this._indice = 0;
          this._decorrido = 0;
          this._inicioCapturado = false;
          for (const p of this._passos) p.de = null;
          continue;
        }
        this.concluido = true;
        Tween._ativos.delete(this);
        break;
      }

      if (passo.tipo === 'chamar') {
        this._proximoPasso();
        try {
          passo.fn(this.alvo);
        } catch (err) {
          console.error('[motor] Tween.chamar falhou:', err);
        }
        continue;
      }

      if (passo.tipo === 'definir') {
        Object.assign(this.alvo, passo.propriedades);
        this._proximoPasso();
        continue;
      }

      // 'animar' e 'esperar' consomem tempo.
      if (passo.tipo === 'animar' && !this._inicioCapturado) {
        passo.de = {};
        for (const chave of Object.keys(passo.propriedades)) {
          const valor = Number(this.alvo[chave]);
          passo.de[chave] = Number.isFinite(valor) ? valor : 0;
        }
        this._inicioCapturado = true;
      }

      this._decorrido += restante;
      const sobra = this._decorrido - passo.duracao;
      const t = passo.duracao > 0 ? Math.min(1, this._decorrido / passo.duracao) : 1;

      if (passo.tipo === 'animar') {
        const k = passo.easing(t);
        for (const chave of Object.keys(passo.propriedades)) {
          const inicio = passo.de[chave];
          const fim = Number(passo.propriedades[chave]);
          this.alvo[chave] = inicio + (fim - inicio) * k;
        }
      }

      if (t >= 1) {
        this._proximoPasso();
        restante = sobra > 0 ? sobra : 0;
      } else {
        restante = 0;
      }
    }
  }

  _proximoPasso() {
    this._indice++;
    this._decorrido = 0;
    this._inicioCapturado = false;
  }

  // ------------------------------------------------------------------ estáticos

  /** Chamado uma vez por quadro pelo Game. */
  static atualizarTodos(dt) {
    for (const t of [...Tween._ativos]) t.atualizar(dt);
  }

  /** Cancela todos os tweens de um alvo (ex.: bloco removido do tabuleiro). */
  static removerDe(alvo) {
    for (const t of [...Tween._ativos]) if (t.alvo === alvo) t.parar();
  }

  /** Cancela tudo — usado ao trocar de cena. */
  static removerTodos() {
    for (const t of [...Tween._ativos]) t.parar();
    Tween._ativos.clear();
  }

  static get quantidadeAtiva() {
    return Tween._ativos.size;
  }
}
