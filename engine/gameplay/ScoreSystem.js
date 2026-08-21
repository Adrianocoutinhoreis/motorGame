import { Emitter } from '../core/Emitter.js';

/**
 * ScoreSystem — o placar da partida e a ÚNICA fonte dos números do AVA.
 *
 * Concentrar isso numa classe é o que impede o erro mais comum da
 * instrumentação: o jogo mostrar um número na tela e mandar outro para o
 * relatório. Aqui a barra de progresso, a tela de resultado e o `AvaBridge`
 * leem exatamente o mesmo objeto.
 *
 * Mapeamento semântico adotado no projeto (decisão registrada no plano e em
 * `docs/CONTRATO-AVA.md`), para jogos de habilidade que não têm "perguntas":
 *
 *   totalPerguntas = a META da partida (blocos a empilhar, pontos a atingir)
 *   acertos        = o PROGRESSO alcançado
 *   erros          = as FALHAS cometidas
 *
 * Assim `score_percent` (acertos ÷ totalPerguntas) calculado pelo servidor
 * significa "quanto da meta o aluno cumpriu" — que é uma leitura honesta.
 *
 * Eventos: 'acerto', 'erro', 'mudou', 'vitoria', 'derrota'.
 */
export class ScoreSystem extends Emitter {
  /**
   * @param {object} opcoes
   *   total {number}  meta da partida → vira `totalPerguntas`
   *   nivel {number}  nível jogado (1 se o jogo tem um só)
   *   vidas {number}  0 ou ausente = jogo sem vidas
   *   pontosPorAcerto {number} quanto cada acerto soma em `acertos` (padrão 1)
   */
  constructor(opcoes = {}) {
    super();
    this.total = Number(opcoes.total) || 0;
    this.nivel = Number(opcoes.nivel) || 1;
    this.vidasIniciais = Number(opcoes.vidas) || 0;
    this.pontosPorAcerto = Number(opcoes.pontosPorAcerto) || 1;
    this.zerar();
  }

  zerar() {
    this.acertos = 0;
    this.erros = 0;
    this.vidas = this.vidasIniciais;
    this._encerrado = false;
    this.emit('mudou', this);
    return this;
  }

  /** Registra acerto. `quantidade` permite acertos que valem mais de 1 ponto. */
  acertar(quantidade = this.pontosPorAcerto) {
    if (this._encerrado) return this;
    this.acertos += quantidade;
    this.emit('acerto', quantidade, this);
    this.emit('mudou', this);
    if (this.venceu) this._encerrar('vitoria');
    return this;
  }

  /** Registra erro. Consome uma vida se o jogo usa vidas. */
  errar(quantidade = 1) {
    if (this._encerrado) return this;
    this.erros += quantidade;
    if (this.vidasIniciais > 0) this.vidas = Math.max(0, this.vidas - quantidade);
    this.emit('erro', quantidade, this);
    this.emit('mudou', this);
    if (this.perdeu) this._encerrar('derrota');
    return this;
  }

  _encerrar(tipo) {
    this._encerrado = true;
    this.emit(tipo, this);
  }

  /** A partida já terminou (por vitória ou derrota)? */
  get encerrado() {
    return this._encerrado;
  }

  /** Encerra por fora (ex.: o tempo acabou). */
  encerrarPorTempo() {
    if (this._encerrado) return this;
    this._encerrar(this.venceu ? 'vitoria' : 'derrota');
    return this;
  }

  get venceu() {
    return this.total > 0 && this.acertos >= this.total;
  }

  get perdeu() {
    return this.vidasIniciais > 0 && this.vidas <= 0;
  }

  /** 0..1 — alimenta a barra de progresso. */
  get progresso() {
    if (this.total <= 0) return 0;
    return Math.max(0, Math.min(1, this.acertos / this.total));
  }

  /** 0..100 — o mesmo cálculo que o servidor do AVA faz. */
  get aproveitamento() {
    return Math.round(this.progresso * 100);
  }

  /**
   * Nota de 0 a 3 estrelas para a tela de resultado.
   * Só é exibida — não vai para o AVA (quanto vale a partida é do servidor).
   */
  get estrelas() {
    if (!this.venceu) return 0;
    if (this.erros === 0) return 3;
    if (this.erros <= Math.max(1, Math.floor(this.total * 0.25))) return 2;
    return 1;
  }

  /**
   * Objeto no formato que o `AvaBridge.concluir()` espera.
   * @param {boolean} vitoria
   * @param {object} extras campos livres que viajam no payload
   */
  paraAva(vitoria = this.venceu, extras = undefined) {
    return {
      acertos: this.acertos,
      erros: this.erros,
      totalPerguntas: this.total,
      nivel: this.nivel,
      vitoria: !!vitoria,
      ...(extras ? { extras } : {}),
    };
  }
}
