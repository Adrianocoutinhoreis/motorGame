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
    /** @type {Array<Function>} chamadas de cada quadro — ver `emCadaQuadro`. */
    this._porQuadro = [];
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

  /**
   * Executa `fn` UMA VEZ POR QUADRO enquanto este tween estiver vivo.
   *
   * É a irmã de `chamar`: aquela dispara uma vez, ao chegar numa etapa; esta
   * dispara a cada quadro. Serve para o que não se expressa como interpolação de
   * propriedade — um valor DERIVADO. O caso que a trouxe: a estrela voadora do
   * `FX.js` percorre uma curva de Bézier, e `x` e `y` não são interpolações
   * lineares de nada; o que se interpola é um `t` de 0 a 1, e a posição sai dele
   * a cada quadro. Sem isto, cada efeito assim teria de manter o próprio relógio.
   *
   * Não é uma etapa: é uma propriedade do tween inteiro. Por isso pode ser
   * encadeada em qualquer ponto — antes ou depois dos `entao` — e vale para
   * todos eles. `fn` recebe `(alvo, dt)`, com `dt` em segundos já multiplicado
   * por `Tween.escalaTempo`.
   *
   * Dois detalhes que a implementação garante e de que quem usa depende:
   *
   *  - **Dispara também no quadro em que o tween termina**, depois dos `chamar`
   *     desse quadro. Uma callback que mexe num nó que o `chamar` final removeu
   *     precisa tolerar isso — mexer num nó solto é inofensivo, mas contar com
   *     ele estar na cena não é.
   *  - **Uma exceção aqui não derruba o quadro.** Vai para o console e o tween
   *     segue, como em `chamar`. Antes disto existir, um erro de API dentro de um
   *     efeito de partida bastava para congelar o jogo: a jogada morria no meio,
   *     a fase nunca voltava a 'livre' e a garra ficava travada.
   */
  emCadaQuadro(fn) {
    if (typeof fn === 'function') this._porQuadro.push(fn);
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

    const dtEscalado = dt * Tween.escalaTempo;
    let restante = dtEscalado;
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

    // Depois das etapas, com os valores já deste quadro. Ver `emCadaQuadro`.
    for (const fn of this._porQuadro) {
      try {
        fn(this.alvo, dtEscalado);
      } catch (err) {
        console.error('[motor] Tween.emCadaQuadro falhou:', err);
      }
    }
  }

  _proximoPasso() {
    this._indice++;
    this._decorrido = 0;
    this._inicioCapturado = false;
  }

  // ------------------------------------------------------------------ estáticos

  /**
   * Chamado uma vez por quadro pelo Game.
   *
   * **Cada tween é isolado.** Sem o `try`, uma exceção num tween abortava o
   * `for` e todos os que vinham depois na lista PERDIAM o quadro — e como a
   * ordem é a de criação, sempre os mesmos. Um erro numa animação decorativa
   * congelava as animações que carregam a jogada. O tween que falha é descartado
   * em vez de repetir o erro sessenta vezes por segundo; quem depende de um
   * `chamar` que agora não vai acontecer é o `Watchdog` da cena que descobre.
   */
  static atualizarTodos(dt) {
    for (const t of [...Tween._ativos]) {
      try {
        t.atualizar(dt);
      } catch (err) {
        console.error('[motor] Tween: um tween falhou e foi descartado:', err);
        t.parar();
      }
    }
  }

  /**
   * Existe algum tween vivo para este alvo?
   *
   * Serve para uma cena checar a própria INVARIANTE: em `jogo-das-formas`, por
   * exemplo, enquanto a jogada está em curso existe sempre um tween na garra ou
   * na cena, porque é o `chamar` do fim da cadeia que libera o toque de novo. Se
   * a fase está ocupada e não há tween em nenhum dos dois, a cadeia se perdeu —
   * e isso é detectável em meio segundo, sem precisar cronometrar quanto tempo
   * uma jogada "deveria" levar. Ver `Watchdog`.
   */
  static temAtivo(alvo) {
    if (!alvo) return false;
    for (const t of Tween._ativos) if (t.alvo === alvo && !t.concluido) return true;
    return false;
  }

  /**
   * Pausa todos os tweens ativos, sem descartá-los — o par de `removerTodos`.
   *
   * Existe para a PAUSA e a AJUDA: sem isto, uma animação em curso quando a
   * criança abre a pausa (a mistura de peças do Jogo das Cores é o caso real)
   * continua rodando ATRÁS do véu — as peças chegam ao lugar em silêncio, e ao
   * fechar a pausa o jogo já mudou sem a criança ter visto. `retomarTodos`
   * desfaz.
   */
  static pausarTodos() {
    for (const t of Tween._ativos) t.pausar(true);
  }

  /** Retoma todos os tweens pausados por `pausarTodos`. */
  static retomarTodos() {
    for (const t of Tween._ativos) t.pausar(false);
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
