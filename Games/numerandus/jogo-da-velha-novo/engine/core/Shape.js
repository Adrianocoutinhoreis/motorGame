import { Node } from './Node.js';

/**
 * Shape — formas vetoriais desenhadas direto no canvas.
 *
 * É o cavalo de batalha do visual flat: painéis, cartões, botões, barras e as
 * peças dos jogos são formas puras com canto arredondado e sombra suave. Nada
 * disso precisa virar arquivo de imagem, o que mantém a pasta do jogo pequena
 * e a arte nítida em qualquer resolução.
 */
export class Shape extends Node {
  /**
   * @param {object} opcoes
   *   forma: 'retangulo' | 'circulo' | 'poligono' | 'personalizada'
   *   preenchimento: cor ou null
   *   contorno: cor ou null   |  espessura: número
   *   raio: raio do canto (retângulo) ou raio (círculo)
   *   lados: número de lados (polígono)
   *   sombra: {cor, desfoque, x, y} ou null
   *   desenharPersonalizado: (ctx, shape) => void
   */
  constructor(opcoes = {}) {
    super(opcoes);
    this.forma = opcoes.forma ?? 'retangulo';
    this.preenchimento = opcoes.preenchimento ?? null;
    this.contorno = opcoes.contorno ?? null;
    this.espessura = opcoes.espessura ?? 2;
    this.raio = opcoes.raio ?? 0;
    this.lados = opcoes.lados ?? 6;
    this.sombra = opcoes.sombra ?? null;
    this.desenharPersonalizado = opcoes.desenharPersonalizado ?? null;
  }

  /** Traça o caminho da forma (sem pintar) — reaproveitado no hit-test. */
  tracar(ctx) {
    const { largura: l, altura: a } = this;
    ctx.beginPath();
    switch (this.forma) {
      case 'circulo': {
        const r = this.raio || Math.min(l, a) / 2;
        ctx.arc(l / 2, a / 2, r, 0, Math.PI * 2);
        break;
      }
      case 'poligono': {
        const cx = l / 2, cy = a / 2, r = this.raio || Math.min(l, a) / 2;
        for (let i = 0; i < this.lados; i++) {
          // -90° para o polígono nascer com a ponta para cima.
          const ang = (i / this.lados) * Math.PI * 2 - Math.PI / 2;
          const px = cx + Math.cos(ang) * r;
          const py = cy + Math.sin(ang) * r;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      }
      case 'personalizada':
        this.desenharPersonalizado?.(ctx, this);
        break;
      default: {
        const r = Math.min(this.raio, l / 2, a / 2);
        if (r > 0) ctx.roundRect(0, 0, l, a, r);
        else ctx.rect(0, 0, l, a);
      }
    }
  }

  desenhar(ctx) {
    if (this.forma === 'personalizada' && this.desenharPersonalizado) {
      ctx.save();
      this.desenharPersonalizado(ctx, this);
      ctx.restore();
      return;
    }

    ctx.save();
    if (this.sombra) {
      ctx.shadowColor = this.sombra.cor ?? 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = this.sombra.desfoque ?? 12;
      ctx.shadowOffsetX = this.sombra.x ?? 0;
      ctx.shadowOffsetY = this.sombra.y ?? 4;
    }

    this.tracar(ctx);

    if (this.preenchimento) {
      ctx.fillStyle = this.preenchimento;
      ctx.fill();
    }
    if (this.contorno) {
      // A sombra já foi aplicada no preenchimento; repetir no contorno suja a borda.
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = this.espessura;
      ctx.strokeStyle = this.contorno;
      ctx.stroke();
    }
    ctx.restore();
  }

  contemPontoLocal(x, y) {
    if (this.forma === 'circulo') {
      const r = this.raio || Math.min(this.largura, this.altura) / 2;
      const dx = x - this.largura / 2;
      const dy = y - this.altura / 2;
      return dx * dx + dy * dy <= r * r;
    }
    return super.contemPontoLocal(x, y);
  }
}
