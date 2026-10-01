import { Emitter } from '../core/Emitter.js';

/**
 * PathSelector — o caminho que a criança desenha por peças vizinhas iguais.
 *
 * É a mecânica central do **Jogo das Cores**: aperta numa peça, arrasta pelas
 * vizinhas da mesma cor, e ao soltar o caminho vale se tiver 3 ou mais.
 *
 * ## Por que não é `GridBoard.grupoConectado`
 *
 * Aquele é flood-fill: devolve TODAS as peças iguais que se toquem. Aqui o
 * caminho é **escolha da criança** — duas peças da mesma cor podem se tocar e
 * ficar de fora, porque ela não passou por elas. A diferença não é técnica, é
 * pedagógica: para o caminho crescer, é preciso comparar cada vizinha com a cor
 * que se está seguindo, e é essa comparação que é o conteúdo da atividade.
 *
 * ## As duas regras, as duas do original de 2013
 *
 *  1. a peça nova tem de ser **vizinha da última** do caminho (vizinhança de 8);
 *  2. a peça nova tem de ser da **mesma cor** que a primeira.
 *
 * E a terceira, que é o que faz o gesto tolerar exploração: **voltar sobre uma
 * peça do caminho descarta tudo o que veio depois dela.** Desfazer sem soltar o
 * dedo. A criança tenta um caminho, vê que não vai dar, e recua.
 *
 * ## Não é possível montar um caminho inválido
 *
 * A checagem é na SELEÇÃO, não na confirmação: uma peça de outra cor não entra.
 * Por isso o Jogo das Cores reporta `erros: 0` sempre — não há resposta errada
 * possível, só tentativa cancelada (ver REGRAS-JOGO-DAS-CORES, seção 7).
 *
 * ## Como a cena usa
 *
 * ```js
 * const caminho = new PathSelector({
 *   grade: this.grade,
 *   minimo: 3,
 *   corDe: (peca) => peca.cor,
 * });
 *
 * // arrasto: 'apertar' começa, 'arrastar' oferece, 'soltar' confirma
 * caminho.comecar(pecaSobODedo);
 * caminho.oferecer(pecaSobODedo);   // ignora o que não pode entrar
 * const pecas = caminho.confirmar(); // [] se não chegou ao mínimo
 *
 * // toque: 'alternar' faz as duas coisas, e é o que a criança espera
 * caminho.alternar(pecaTocada);
 * ```
 *
 * Eventos: 'mudou' (peças, this) a cada crescimento ou corte · 'cancelado'.
 */
export class PathSelector extends Emitter {
  /**
   * @param {object} opcoes
   *   grade  {GridBoard} de onde saem os vizinhos
   *   minimo {number}    tamanho mínimo para o caminho valer (padrão 3)
   *   corDe  {Function}  extrai a "cor" de uma peça (padrão `peca.cor`).
   *                      É função, e não o nome do campo, para o motor não
   *                      supor como o jogo guarda o atributo que compara
   */
  constructor({ grade, minimo = 3, corDe = (p) => p?.cor } = {}) {
    super();
    if (!grade) throw new Error('PathSelector: `grade` é obrigatória');
    this.grade = grade;
    this.minimo = minimo;
    this.corDe = corDe;
    /** @type {Array<object>} o caminho, em ordem de seleção. */
    this.pecas = [];
  }

  get tamanho() {
    return this.pecas.length;
  }

  /** O caminho já vale? */
  get valido() {
    return this.pecas.length >= this.minimo;
  }

  /** A cor que este caminho está seguindo, ou null se está vazio. */
  get cor() {
    return this.pecas.length > 0 ? this.corDe(this.pecas[0]) : null;
  }

  /** A última peça — é dela que a vizinhança é medida. */
  get ultima() {
    return this.pecas[this.pecas.length - 1] ?? null;
  }

  /** Esta peça está no caminho? */
  contem(peca) {
    return this.pecas.includes(peca);
  }

  /**
   * Começa um caminho nesta peça, descartando qualquer um em curso.
   * @returns {boolean} começou (false se a peça não serve)
   */
  comecar(peca) {
    if (!peca) return false;
    this.pecas = [peca];
    this.emit('mudou', this.pecas, this);
    return true;
  }

  /**
   * Oferece uma peça ao caminho. **Ignora em silêncio o que não pode entrar** —
   * é o comportamento certo para arrasto, onde o dedo passa por cima de peças de
   * outras cores todo o tempo e nada disso é um erro da criança.
   *
   * @returns {'cresceu'|'cortou'|'ignorada'} o que aconteceu, para a cena poder
   *   dar retorno diferente a cada caso (um som ao crescer, por exemplo)
   */
  oferecer(peca) {
    if (!peca || this.pecas.length === 0) return 'ignorada';

    // Já está no caminho: corta o rabo. Voltar sobre a ÚLTIMA não faz nada, e é
    // o certo — o dedo tremendo sobre a peça atual não pode encurtar o caminho.
    const indice = this.pecas.indexOf(peca);
    if (indice !== -1) {
      if (indice === this.pecas.length - 1) return 'ignorada';
      this.pecas = this.pecas.slice(0, indice + 1);
      this.emit('mudou', this.pecas, this);
      return 'cortou';
    }

    if (!this._podeEntrar(peca)) return 'ignorada';

    this.pecas.push(peca);
    this.emit('mudou', this.pecas, this);
    return 'cresceu';
  }

  /**
   * O gesto de TOQUE, numa chamada: a mesma peça tocada duas vezes sai do
   * caminho. Existe porque no celular arrastar por células de 40 px físicos é
   * exigente, e soltar o dedo sem querer perde o caminho inteiro.
   *
   * Regras, escolhidas para o toque não ter surpresa:
   *
   *  - caminho vazio → começa aqui;
   *  - tocar na ÚLTIMA peça → tira ela (é o desfazer do toque);
   *  - tocar numa peça do MEIO → corta o rabo dali, como no arrasto;
   *  - o resto → mesma regra de vizinho-e-cor do arrasto.
   *
   * Tocar na única peça de um caminho de um esvazia — e isso é cancelar, não
   * "recomeçar aqui", senão não haveria como desistir de um caminho começado.
   *
   * @returns {'comecou'|'cresceu'|'cortou'|'removeu'|'esvaziou'|'ignorada'}
   */
  alternar(peca) {
    if (!peca) return 'ignorada';
    if (this.pecas.length === 0) {
      this.comecar(peca);
      return 'comecou';
    }

    if (peca === this.ultima) {
      this.pecas.pop();
      if (this.pecas.length === 0) {
        this.emit('mudou', this.pecas, this);
        this.emit('cancelado', this);
        return 'esvaziou';
      }
      this.emit('mudou', this.pecas, this);
      return 'removeu';
    }

    return this.oferecer(peca);
  }

  /**
   * Fecha o caminho. Devolve as peças se ele valia, ou `[]` se não — e nos dois
   * casos o seletor volta a vazio.
   *
   * Um caminho curto devolver `[]` em vez de lançar é deliberado: **não é erro**,
   * é tentativa cancelada, e a criança estava explorando o tabuleiro.
   */
  confirmar() {
    const conquistadas = this.valido ? this.pecas : [];
    const cancelou = conquistadas.length === 0 && this.pecas.length > 0;
    this.pecas = [];
    this.emit('mudou', this.pecas, this);
    if (cancelou) this.emit('cancelado', this);
    return conquistadas;
  }

  /** Descarta o caminho sem conquistar nada. */
  cancelar() {
    if (this.pecas.length === 0) return this;
    this.pecas = [];
    this.emit('mudou', this.pecas, this);
    this.emit('cancelado', this);
    return this;
  }

  /**
   * As peças que PODERIAM entrar agora — vizinhas da última, da cor do caminho,
   * e ainda fora dele.
   *
   * Serve para o tutorial e para uma ajuda futura ("acende as próximas"), e
   * também para o teste: é a lista que prova que a regra de vizinhança está
   * sendo aplicada a partir da ÚLTIMA peça, e não da primeira.
   */
  candidatas() {
    const ultima = this.ultima;
    if (!ultima) return [];
    return this.grade
      .vizinhos(ultima.lin, ultima.col)
      .filter((p) => !this.contem(p) && this.corDe(p) === this.cor);
  }

  _podeEntrar(peca) {
    if (this.corDe(peca) !== this.cor) return false;
    const ultima = this.ultima;
    if (!ultima) return false;
    // Vizinhança pela GRADE, não por aritmética de lin/col aqui: quem sabe se a
    // vizinhança é de 4 ou de 8 é o `GridBoard`, e duplicar isso deixaria os
    // dois podendo discordar.
    return this.grade.vizinhos(ultima.lin, ultima.col).includes(peca);
  }
}
