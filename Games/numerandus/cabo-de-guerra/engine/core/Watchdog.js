/**
 * Watchdog — percebe que a partida travou, e avisa quem sabe consertar.
 *
 * ## O problema que ele resolve
 *
 * Todo jogo do motor tem uma fase em que o toque é ignorado de propósito: a
 * jogada está em curso, e um segundo toque resolveria duas jogadas ao mesmo
 * tempo (`docs/STATES.md`). Quem devolve o controle à criança é sempre um
 * `chamar` no fim de uma cadeia de `Tween` — `this.fase = 'livre'` no
 * `jogo-das-formas`, `this.travado = false` no `jogo-dos-blocos`.
 *
 * **Se aquele `chamar` não acontecer, o jogo fica vivo e surdo.** Anima, conta o
 * tempo, desenha — e ignora todo toque, para sempre. Foi o que aconteceu de
 * verdade: um efeito visual novo chamou um método inexistente do `Tween` dentro
 * da cascata; `Tween.chamar` engole exceções e loga, então a página não caiu — a
 * cascata abortou pela metade, a fase nunca voltou a 'livre' e a garra travou.
 * Uma criança de cinco anos não lê o console: ela vê um jogo quebrado.
 *
 * ## Por que não é um cronômetro
 *
 * A ideia óbvia é "se ficar ocupado mais de N segundos, destrava". Ela é ruim por
 * dois lados: N é um chute que envelhece (uma cascata longa é legítima e demora),
 * e N segundos de jogo morto é exatamente o que se quer evitar.
 *
 * O caminho melhor é checar a **invariante da própria cena**, e ela existe:
 * enquanto a jogada está em curso há sempre um tween vivo no alvo que vai
 * disparar o `chamar` final. Fase ocupada **e nenhum sinal de vida** não é
 * demora — é cadeia perdida, e se percebe em meio segundo. É o que `vivo` faz,
 * com `Tween.temAtivo`.
 *
 * `limite` continua existindo como segunda rede, para o caso que a invariante
 * não pega: um tween que está vivo mas nunca termina (em laço, ou pausado).
 *
 * ## Quem detecta e quem decide
 *
 * Esta classe **só detecta**. O que é um estado seguro para voltar depende do
 * jogo — só ele sabe se pode devolver a jogada, se precisa refazer a cascata ou
 * se é melhor encerrar a partida com os pontos já feitos. Por isso `aoTravar`
 * recebe a tentativa e a cena decide, tipicamente escalando: a primeira vez
 * tenta devolver o controle; se travar de novo, encerra a partida com dignidade,
 * porque é melhor ver as estrelas do que encarar uma tela morta.
 */
export class Watchdog {
  /**
   * @param {object} opcoes
   *   nome     {string}   aparece no console; diga QUAL ciclo é
   *   ocupado  {Function} `true` enquanto o ciclo que precisa terminar está em
   *                       curso. Inclua aqui o que legitimamente ocupa a cena
   *                       (pausa, partida encerrada) — o cão não adivinha
   *   vivo     {Function} `true` se ainda há sinal de que o ciclo progride.
   *                       Opcional: sem ele, só o `limite` dispara
   *   graca    {number}   segundos que `ocupado && !vivo` precisa persistir
   *                       antes de disparar (padrão 0,5 — cerca de 30 quadros)
   *   limite   {number}   segundos de `ocupado` contínuo que disparam de
   *                       qualquer forma. 0 desliga esta segunda rede
   *   aoTravar {Function} recebe `{ tentativa, motivo, segundos }`
   */
  constructor({ nome = 'ciclo', ocupado, vivo = null, graca = 0.5, limite = 0, aoTravar }) {
    if (typeof ocupado !== 'function') throw new Error('Watchdog: `ocupado` é obrigatório');
    if (typeof aoTravar !== 'function') throw new Error('Watchdog: `aoTravar` é obrigatório');

    this.nome = nome;
    this.ocupado = ocupado;
    this.vivo = vivo;
    this.graca = graca;
    this.limite = limite;
    this.aoTravar = aoTravar;

    this.ligado = true;
    /** Quantas vezes disparou nesta partida. Um teste pode exigir que seja 0. */
    this.disparos = 0;
    /** Disparos do episódio ATUAL de travamento — é o que escala o resgate. */
    this.tentativa = 0;

    this._semSinal = 0;
    this._ocupadoPor = 0;
  }

  /** Chame uma vez por quadro, DEPOIS do desvio da pausa. `dt` em segundos. */
  atualizar(dt) {
    if (!this.ligado) return this;

    if (!this.ocupado()) {
      // Voltou ao normal: o episódio fechou, e o próximo resgate recomeça do
      // primeiro degrau. Sem isto, um travamento cedo na partida faria o
      // travamento seguinte, meia hora depois, já pular direto para o encerrar.
      this._semSinal = 0;
      this._ocupadoPor = 0;
      this.tentativa = 0;
      return this;
    }

    this._ocupadoPor += dt;
    if (this.vivo) this._semSinal = this.vivo() ? 0 : this._semSinal + dt;

    const semSinal = this.vivo && this._semSinal >= this.graca;
    const excedeu = this.limite > 0 && this._ocupadoPor >= this.limite;
    if (!semSinal && !excedeu) return this;

    const motivo = semSinal ? 'sem sinal de vida' : 'tempo excedido';
    const segundos = Number(this._ocupadoPor.toFixed(2));

    this.disparos++;
    this.tentativa++;
    // `console.error`, e não `warn`: isto NUNCA deveria acontecer, e os testes de
    // navegador reprovam a sessão que produzir erro no console. Um travamento em
    // produção precisa chegar como bug, não como curiosidade.
    console.error(
      `[motor] Watchdog: "${this.nome}" travou (${motivo}, ${segundos}s ocupado). `
      + `Tentativa de resgate ${this.tentativa}.`,
    );

    // Zera ANTES do resgate: se `aoTravar` devolver a cena ao normal, o próximo
    // quadro já vai pelo caminho de cima; se não devolver, o cão precisa de outra
    // graça inteira para disparar de novo — e não a cada quadro.
    this._semSinal = 0;
    this._ocupadoPor = 0;

    try {
      this.aoTravar({ tentativa: this.tentativa, motivo, segundos });
    } catch (err) {
      console.error('[motor] Watchdog: o próprio resgate falhou:', err);
    }
    return this;
  }

  /**
   * Desliga em definitivo. Use quando a cena já tomou a decisão final (encerrou
   * a partida, por exemplo): depois disso o estado "ocupado" é esperado, e um
   * disparo a mais só poluiria o console.
   */
  desligar() {
    this.ligado = false;
    return this;
  }

  /** Esquece o episódio em curso sem desligar. */
  zerar() {
    this._semSinal = 0;
    this._ocupadoPor = 0;
    this.tentativa = 0;
    return this;
  }
}
