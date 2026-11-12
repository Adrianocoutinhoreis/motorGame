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
 *   acertos        = a PONTUAÇÃO da partida (ver `pontuacao`)
 *   erros          = as FALHAS cometidas
 *
 * Assim `score_percent` (acertos ÷ totalPerguntas) calculado pelo servidor
 * significa "quão bem o aluno cumpriu a meta" — não apenas se cumpriu.
 *
 * **Cuidado com dois números parecidos e diferentes**, que é o ponto mais fácil
 * de errar nesta classe:
 *
 *   `this.acertos`   progresso BRUTO. É o que a barra mostra durante a partida
 *                    e o que decide a vitória. Nunca desconta.
 *   `this.pontuacao` o que vai para a TELA e para o AVA. Numa vitória, desconta
 *                    as falhas.
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

  /**
   * A PONTUAÇÃO da partida: o progresso alcançado, descontando as falhas numa
   * vitória. É o número que a tela de resultado mostra e o que vai no campo
   * `acertos` da mensagem do AVA.
   *
   * **Por que descontar.** Com a pontuação igual ao acerto bruto, toda vitória
   * dava o máximo: no Jogo dos Blocos a meta é 5 e vencer exige exatamente 5
   * blocos encaixados, então a fileira de estrelas enchia SEMPRE e a nota
   * deixava de existir — dava "5 de 5" com duas quedas pelo caminho.
   *
   * **Por que só na vitória.** Na derrota o erro já cobrou o preço: a partida
   * acabou. Descontar de novo transformaria em zero o progresso de uma criança
   * que encaixou dois blocos, e `docs/DESIGN.md` é explícito: a derrota mostra
   * o quanto o aluno avançou, não o quanto falhou. Então na derrota este número
   * é o progresso puro.
   *
   * **Por que não descontar na barra durante a partida.** A barra acompanha a
   * torre que está de pé, e a torre não encurta quando um bloco cai fora.
   * Descontar ali faria a barra andar para trás enquanto a torre cresce — a
   * tela diria o contrário do que a criança está vendo. Ver `progresso`.
   *
   * Regra RE-02 de `docs/REGRAS-EDUCACIONAIS.md`.
   */
  get pontuacao() {
    if (!this.venceu) return this.acertos;
    return Math.max(0, this.acertos - this.erros);
  }

  /**
   * 0..1 — alimenta a barra de progresso DURANTE a partida.
   *
   * Usa o acerto bruto de propósito: a barra espelha a torre construída, e
   * descontar aqui faria a barra recuar enquanto a torre sobe. Para o número do
   * fim da partida, ver `pontuacao`.
   */
  get progresso() {
    if (this.total <= 0) return 0;
    return Math.max(0, Math.min(1, this.acertos / this.total));
  }

  /**
   * 0..100 — o mesmo cálculo que o servidor do AVA faz, e por isso sobre a
   * `pontuacao`: é ela que viaja no campo `acertos`. Difere de `progresso`
   * numa vitória com falhas, e essa diferença é intencional.
   */
  get aproveitamento() {
    if (this.total <= 0) return 0;
    return Math.round(Math.max(0, Math.min(1, this.pontuacao / this.total)) * 100);
  }

  /**
   * **Não existe mais um `estrelas` aqui, e a ausência é proposital.**
   *
   * Havia: uma nota de 0 a 3 derivada dos ERROS. Ela morreu quando a fileira da
   * `ResultScreen` passou a ter cinco estrelas fixas preenchidas pelo
   * percentual da meta (regra RE-04) — a tela deriva a nota dos três campos que
   * já mostra, e nenhum jogo precisa calcular nota nenhuma.
   *
   * Um getter sem chamador aqui não seria inofensivo: seria uma SEGUNDA
   * definição de "quantas estrelas", divergente da que a tela usa (esta dava
   * zero em qualquer derrota, e a da tela mostra o progresso). O próximo jogo a
   * encontrá-lo passaria a exibir um número que a tela contradiz — e evitar
   * exatamente isso é o motivo desta classe existir.
   *
   * Quem quiser um percentual pronto tem `aproveitamento`, acima.
   */

  /**
   * Objeto no formato que o `AvaBridge.concluir()` espera.
   * @param {boolean} vitoria
   * @param {object} extras campos livres que viajam no payload
   */
  paraAva(vitoria = this.venceu, extras = undefined) {
    return {
      // A pontuação, e não o acerto bruto: é exatamente o número que a tela de
      // resultado mostra. Mostrar um na tela e reportar outro é o defeito que
      // esta classe existe para impedir. Quem quiser o bruto no payload manda em
      // `extras` — o Jogo dos Blocos já manda, como `blocosEmpilhados`.
      acertos: this.pontuacao,
      erros: this.erros,
      totalPerguntas: this.total,
      nivel: this.nivel,
      vitoria: !!vitoria,
      ...(extras ? { extras } : {}),
    };
  }
}
