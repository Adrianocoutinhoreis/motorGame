import { Emitter } from '../core/Emitter.js';

/**
 * CraneController — o guindaste, em dois modos.
 *
 *  'oscilante' — vai e volta sozinho entre dois limites, e o aluno toca para
 *                soltar no momento certo (é o Jogo dos Blocos: a habilidade
 *                está no TEMPO do toque).
 *  'colunas'   — o gancho se alinha a colunas discretas e o aluno escolhe uma
 *                (é o Jogo das Formas: a habilidade está na ESCOLHA).
 *
 * O original controlava isso com um `createjs.Tween` em laço mais um
 * `$(document).mousemove` — o que significava que a posição do gancho dependia
 * de o tween ter sido pausado no instante certo, e um toque em tablet não
 * movia nada. Aqui a posição é um estado calculado por delta de tempo, o que
 * torna a mecânica idêntica em qualquer taxa de quadros e em qualquer entrada.
 *
 * Eventos: 'soltou' (x, dados), 'chegouNaPonta' (lado), 'colunaMudou' (indice).
 */
export class CraneController extends Emitter {
  /**
   * @param {object} opcoes
   *   modo {'oscilante'|'colunas'}
   *   xMin, xMax {number}     limites do trajeto (modo oscilante)
   *   duracao {number}        segundos de UMA travessia (ida)
   *   colunas {number[]}      posições x de cada coluna (modo colunas)
   *   y {number}              altura do gancho
   */
  constructor(opcoes = {}) {
    super();
    this.modo = opcoes.modo ?? 'oscilante';
    this.xMin = opcoes.xMin ?? 0;
    this.xMax = opcoes.xMax ?? 800;
    this.duracao = opcoes.duracao ?? 2.4;
    this.colunas = opcoes.colunas ?? [];
    this.y = opcoes.y ?? 0;

    this.x = this.xMin;
    this.indiceColuna = 0;
    /** 1 = indo para a direita, -1 = voltando. */
    this.direcao = 1;
    this.ativo = true;
    /** Carga atual pendurada no gancho (o jogo põe e tira). */
    this.carga = null;

    this._fase = 0;
    this._ultimaDirecao = 1;
  }

  /** Reposiciona no início do trajeto, com a carga liberada. */
  reiniciar() {
    this._fase = 0;
    this.direcao = 1;
    this._ultimaDirecao = 1;
    this.x = this.modo === 'colunas' ? this._xDaColuna(this.indiceColuna) : this.xMin;
    this.ativo = true;
    return this;
  }

  /** Ajusta a velocidade (usado para deixar níveis mais difíceis). */
  definirDuracao(segundos) {
    this.duracao = Math.max(0.2, segundos);
    return this;
  }

  _xDaColuna(indice) {
    if (this.colunas.length === 0) return this.xMin;
    const i = Math.max(0, Math.min(indice, this.colunas.length - 1));
    return this.colunas[i];
  }

  /** Move para uma coluna (modo 'colunas'). */
  irParaColuna(indice) {
    const novo = Math.max(0, Math.min(indice, Math.max(0, this.colunas.length - 1)));
    if (novo !== this.indiceColuna) {
      this.indiceColuna = novo;
      this.emit('colunaMudou', novo);
    }
    this.x = this._xDaColuna(novo);
    return this;
  }

  /** Alinha o gancho à coluna mais próxima de um x qualquer (dedo/mouse). */
  seguirX(x) {
    if (this.modo !== 'colunas' || this.colunas.length === 0) {
      this.x = Math.max(this.xMin, Math.min(x, this.xMax));
      return this;
    }
    let melhor = 0;
    let menorDistancia = Infinity;
    for (let i = 0; i < this.colunas.length; i++) {
      const d = Math.abs(this.colunas[i] - x);
      if (d < menorDistancia) { menorDistancia = d; melhor = i; }
    }
    return this.irParaColuna(melhor);
  }

  /**
   * Avança o movimento. `dt` em segundos.
   * A curva é senoidal: o gancho desacelera nas pontas e acelera no meio — o
   * mesmo "peso" do quadInOut do original, mas sem depender de tween.
   */
  atualizar(dt) {
    if (!this.ativo || this.modo !== 'oscilante') return;

    // Uma volta completa (ida + volta) leva 2 × duracao.
    this._fase = (this._fase + dt / (this.duracao * 2)) % 1;
    const k = (1 - Math.cos(this._fase * Math.PI * 2)) / 2; // 0 → 1 → 0
    this.x = this.xMin + (this.xMax - this.xMin) * k;

    this.direcao = this._fase < 0.5 ? 1 : -1;
    if (this.direcao !== this._ultimaDirecao) {
      this._ultimaDirecao = this.direcao;
      this.emit('chegouNaPonta', this.direcao === 1 ? 'esquerda' : 'direita');
    }
  }

  /** Pausa o movimento sem perder a posição. */
  pausar() {
    this.ativo = false;
    return this;
  }

  retomar() {
    this.ativo = true;
    return this;
  }

  /**
   * Solta a carga. Devolve a posição do lançamento e para o guindaste — quem
   * decide o que acontece com a peça é o jogo, não o guindaste.
   * @returns {{x: number, y: number, carga: any}|null}
   */
  soltar() {
    if (!this.carga) return null;
    this.pausar();
    const dados = { x: this.x, y: this.y, carga: this.carga };
    this.carga = null;
    this.emit('soltou', dados.x, dados);
    return dados;
  }

  /** Pendura uma carga nova e volta a andar. */
  carregar(carga) {
    this.carga = carga;
    this.reiniciar();
    return this;
  }

  /** 0..1 — onde está no trajeto. Útil para desenhar a corrente/roldana. */
  get progressoTrajeto() {
    if (this.xMax === this.xMin) return 0;
    return (this.x - this.xMin) / (this.xMax - this.xMin);
  }
}
