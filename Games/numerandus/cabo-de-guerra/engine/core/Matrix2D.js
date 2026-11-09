/**
 * Matrix2D — matriz de transformação 2D afim (a, b, c, d, tx, ty).
 *
 * Usada para compor as transformações do scene-graph e — principalmente — para
 * INVERTER a transformação e descobrir qual nó está sob o dedo/mouse. Sem isso
 * não existe hit-test correto em nó rotacionado ou escalado.
 */
export class Matrix2D {
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.set(a, b, c, d, tx, ty);
  }

  set(a, b, c, d, tx, ty) {
    this.a = a; this.b = b; this.c = c; this.d = d; this.tx = tx; this.ty = ty;
    return this;
  }

  identity() {
    return this.set(1, 0, 0, 1, 0, 0);
  }

  copiarDe(m) {
    return this.set(m.a, m.b, m.c, m.d, m.tx, m.ty);
  }

  clonar() {
    return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
  }

  /** this = this × (a,b,c,d,tx,ty) */
  anexar(a, b, c, d, tx, ty) {
    const a1 = this.a, b1 = this.b, c1 = this.c, d1 = this.d;
    this.a = a * a1 + b * c1;
    this.b = a * b1 + b * d1;
    this.c = c * a1 + d * c1;
    this.d = c * b1 + d * d1;
    this.tx = tx * a1 + ty * c1 + this.tx;
    this.ty = tx * b1 + ty * d1 + this.ty;
    return this;
  }

  anexarMatriz(m) {
    return this.anexar(m.a, m.b, m.c, m.d, m.tx, m.ty);
  }

  /**
   * Anexa uma transformação completa de nó.
   * @param {number} rotacaoGraus rotação em GRAUS (como no Flash/CreateJS original)
   * @param {number} regX ponto de registro (âncora) em X
   * @param {number} regY ponto de registro (âncora) em Y
   */
  anexarTransformacao(x, y, scaleX, scaleY, rotacaoGraus, regX = 0, regY = 0) {
    let a, b, c, d;
    if (rotacaoGraus % 360 === 0) {
      a = scaleX; b = 0; c = 0; d = scaleY;
    } else {
      const r = rotacaoGraus * Math.PI / 180;
      const cos = Math.cos(r), sen = Math.sin(r);
      a = cos * scaleX; b = sen * scaleX; c = -sen * scaleY; d = cos * scaleY;
    }
    if (regX || regY) {
      // Desloca a origem para o ponto de registro sem aplicar a rotação duas vezes.
      this.tx -= regX * a + regY * c;
      this.ty -= regX * b + regY * d;
    }
    return this.anexar(a, b, c, d, x, y);
  }

  /** Inverte a matriz no lugar. Retorna `this`, ou `null` se não for inversível. */
  inverter() {
    const { a, b, c, d, tx, ty } = this;
    const det = a * d - b * c;
    if (det === 0 || !Number.isFinite(det)) return null;
    this.a = d / det;
    this.b = -b / det;
    this.c = -c / det;
    this.d = a / det;
    this.tx = (c * ty - d * tx) / det;
    this.ty = -(a * ty - b * tx) / det;
    return this;
  }

  /** Aplica a matriz a um ponto. */
  transformarPonto(x, y, saida = { x: 0, y: 0 }) {
    saida.x = x * this.a + y * this.c + this.tx;
    saida.y = x * this.b + y * this.d + this.ty;
    return saida;
  }
}
