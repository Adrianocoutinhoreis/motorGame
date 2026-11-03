import { Emitter } from './Emitter.js';
import { Matrix2D } from './Matrix2D.js';

/**
 * Node — nó do scene-graph.
 *
 * Sucede o `MovieClip` do CreateJS que os jogos originais usavam: posição,
 * escala, rotação, alpha, filhos e hit-test. A diferença é que aqui não há
 * timeline nem `gotoAndStop` — animação é responsabilidade do Tween, e estado
 * visual é propriedade explícita. Isso torna o comportamento previsível.
 *
 * Subclasses implementam `desenhar(ctx)` para pintar a si mesmas; os filhos são
 * desenhados automaticamente depois, já com a transformação aplicada.
 */
export class Node extends Emitter {
  constructor(opcoes = {}) {
    super();

    this.x = opcoes.x ?? 0;
    this.y = opcoes.y ?? 0;
    this.scaleX = opcoes.scaleX ?? opcoes.escala ?? 1;
    this.scaleY = opcoes.scaleY ?? opcoes.escala ?? 1;
    /** Rotação em GRAUS. */
    this.rotation = opcoes.rotation ?? 0;
    this.regX = opcoes.regX ?? 0;
    this.regY = opcoes.regY ?? 0;
    this.alpha = opcoes.alpha ?? 1;
    this.visible = opcoes.visible ?? true;

    /** Largura/altura lógicas — base do hit-test padrão e do layout. */
    this.largura = opcoes.largura ?? 0;
    this.altura = opcoes.altura ?? 0;

    /** Recebe ponteiro? Se false, o nó é "transparente" ao toque. */
    this.interativo = opcoes.interativo ?? false;
    /** Se false, nem os filhos recebem ponteiro. */
    this.filhosInterativos = opcoes.filhosInterativos ?? true;

    /** Nome livre, útil para depurar e localizar nós. */
    this.nome = opcoes.nome ?? '';

    /** @type {Node[]} */
    this.filhos = [];
    /** @type {Node|null} */
    this.pai = null;

    this._matrizLocal = new Matrix2D();
    this._matrizMundo = new Matrix2D();
  }

  // ---------------------------------------------------------------- hierarquia

  adicionar(...nos) {
    for (const no of nos) {
      if (!no) continue;
      if (no === this) throw new Error('Node.adicionar: um nó não pode conter a si mesmo');
      if (no.pai) no.pai.remover(no);
      no.pai = this;
      this.filhos.push(no);
      no.emit('adicionado', this);
    }
    return this;
  }

  /** Adiciona em uma posição específica da lista de filhos (0 = atrás de todos). */
  adicionarEm(indice, no) {
    if (no.pai) no.pai.remover(no);
    no.pai = this;
    this.filhos.splice(Math.max(0, Math.min(indice, this.filhos.length)), 0, no);
    no.emit('adicionado', this);
    return this;
  }

  remover(...nos) {
    for (const no of nos) {
      const i = this.filhos.indexOf(no);
      if (i !== -1) {
        this.filhos.splice(i, 1);
        no.pai = null;
        no.emit('removido', this);
      }
    }
    return this;
  }

  /** Remove o nó do próprio pai (se tiver). */
  removerDoPai() {
    this.pai?.remover(this);
    return this;
  }

  removerTodos() {
    for (const filho of [...this.filhos]) this.remover(filho);
    return this;
  }

  /** Busca em profundidade pelo `nome`. */
  buscar(nome) {
    for (const filho of this.filhos) {
      if (filho.nome === nome) return filho;
      const achado = filho.buscar(nome);
      if (achado) return achado;
    }
    return null;
  }

  /** Traz o nó para a frente dos irmãos. */
  paraFrente() {
    const pai = this.pai;
    if (pai) {
      pai.remover(this);
      pai.adicionar(this);
    }
    return this;
  }

  // ----------------------------------------------------------------- transform

  /** Atalho para posicionar. */
  posicionar(x, y) {
    this.x = x; this.y = y;
    return this;
  }

  get matrizLocal() {
    return this._matrizLocal
      .identity()
      .anexarTransformacao(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.regX, this.regY);
  }

  /** Matriz acumulada da raiz até este nó. */
  get matrizMundo() {
    const m = this._matrizMundo.identity();
    const cadeia = [];
    for (let no = this; no; no = no.pai) cadeia.push(no);
    for (let i = cadeia.length - 1; i >= 0; i--) {
      const no = cadeia[i];
      m.anexarTransformacao(no.x, no.y, no.scaleX, no.scaleY, no.rotation, no.regX, no.regY);
    }
    return m;
  }

  localParaGlobal(x, y) {
    return this.matrizMundo.transformarPonto(x, y);
  }

  globalParaLocal(x, y) {
    const inv = this.matrizMundo.clonar().inverter();
    return inv ? inv.transformarPonto(x, y) : { x: 0, y: 0 };
  }

  /** Alpha efetivo, considerando todos os ancestrais. */
  get alphaMundo() {
    let a = this.alpha;
    for (let no = this.pai; no; no = no.pai) a *= no.alpha;
    return a;
  }

  /** Visível de fato? (false se qualquer ancestral estiver invisível) */
  get visivelMundo() {
    for (let no = this; no; no = no.pai) if (!no.visible) return false;
    return true;
  }

  // ------------------------------------------------------------------ hit-test

  /**
   * O ponto (em coordenada LOCAL do nó) está sobre este nó?
   * Padrão: retângulo `largura × altura` a partir da origem local. Subclasses e
   * instâncias podem trocar por qualquer forma sobrescrevendo este método.
   */
  contemPontoLocal(x, y) {
    if (this.largura <= 0 || this.altura <= 0) return false;
    return x >= 0 && y >= 0 && x <= this.largura && y <= this.altura;
  }

  /**
   * Nó mais à frente sob o ponto global, ou null.
   * Percorre os filhos de trás para frente (o desenhado por último é o de cima).
   */
  noSobPonto(gx, gy) {
    if (!this.visible || this.alpha <= 0) return null;

    if (this.filhosInterativos) {
      for (let i = this.filhos.length - 1; i >= 0; i--) {
        const achado = this.filhos[i].noSobPonto(gx, gy);
        if (achado) return achado;
      }
    }

    if (this.interativo) {
      const p = this.globalParaLocal(gx, gy);
      if (this.contemPontoLocal(p.x, p.y)) return this;
    }
    return null;
  }

  // -------------------------------------------------------------- ciclo de vida

  /** Chamado a cada quadro. `dt` em SEGUNDOS. Subclasses podem sobrescrever. */
  atualizar(dt) {
    for (const filho of this.filhos) filho.atualizar(dt);
  }

  /** Pintura do próprio nó, já dentro da transformação. Subclasses sobrescrevem. */
  desenhar(_ctx) {}

  /** Aplica transformação, desenha a si e depois os filhos. */
  renderizar(ctx) {
    if (!this.visible || this.alpha <= 0) return;

    ctx.save();
    const m = this.matrizLocal;
    ctx.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
    if (this.alpha !== 1) ctx.globalAlpha *= this.alpha;

    this.desenhar(ctx);
    for (const filho of this.filhos) filho.renderizar(ctx);

    ctx.restore();
  }

  /** Libera ouvintes e filhos. Chame ao descartar uma tela. */
  destruir() {
    for (const filho of [...this.filhos]) filho.destruir();
    this.removerTodos();
    this.removerDoPai();
    this.offAll();
  }
}
