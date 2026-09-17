import { Node } from './Node.js';

/**
 * Sprite — nó que desenha uma imagem (PNG, JPG ou SVG já carregado).
 *
 * Como o design system do motor é vetorial, na prática a imagem quase sempre é
 * um SVG rasterizado pelo navegador no `Loader` — o que dá arte nítida em
 * qualquer escala sem precisar de sprite sheet.
 */
export class Sprite extends Node {
  /**
   * @param {HTMLImageElement|null} imagem
   * @param {object} opcoes  aceita tudo de Node, mais `ancoraX`/`ancoraY` (0..1)
   */
  constructor(imagem, opcoes = {}) {
    super(opcoes);
    this.imagem = imagem ?? null;

    // Se largura/altura não vieram, usa o tamanho natural da imagem.
    if (this.imagem) {
      this.largura = opcoes.largura ?? (this.imagem.naturalWidth || this.imagem.width);
      this.altura = opcoes.altura ?? (this.imagem.naturalHeight || this.imagem.height);
    }

    // Âncora em fração (0.5, 0.5 = centro). Convertida para regX/regY.
    if (opcoes.ancoraX !== undefined) this.regX = this.largura * opcoes.ancoraX;
    if (opcoes.ancoraY !== undefined) this.regY = this.altura * opcoes.ancoraY;
  }

  /** Centraliza o ponto de registro (útil para girar/pulsar a partir do meio). */
  centralizarAncora() {
    this.regX = this.largura / 2;
    this.regY = this.altura / 2;
    return this;
  }

  desenhar(ctx) {
    if (!this.imagem) return;
    ctx.drawImage(this.imagem, 0, 0, this.largura, this.altura);
  }
}
