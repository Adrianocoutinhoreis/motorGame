import { Node } from './Node.js';
import { texto as aplicarCaixa } from '../theme/texto.js';

/**
 * TextNode — texto desenhado no canvas.
 *
 * No perfil 4–7 anos o texto é apoio, nunca requisito: toda instrução também é
 * narrada e todo botão tem ícone. Por isso o padrão aqui é fonte grande, peso
 * alto e contorno opcional — legível de longe e sobre qualquer fundo.
 */
export class TextNode extends Node {
  constructor(texto = '', opcoes = {}) {
    super(opcoes);
    this.texto = String(texto);
    this.tamanho = opcoes.tamanho ?? 28;
    this.familia = opcoes.familia ?? 'system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
    this.peso = opcoes.peso ?? '700';
    this.cor = opcoes.cor ?? '#1F2937';
    /** 'left' | 'center' | 'right' */
    this.alinhamento = opcoes.alinhamento ?? 'left';
    /** 'top' | 'middle' | 'bottom' | 'alphabetic' */
    this.linhaBase = opcoes.linhaBase ?? 'top';
    /** Largura máxima para quebra automática (0 = não quebra). */
    this.larguraMaxima = opcoes.larguraMaxima ?? 0;
    this.alturaLinha = opcoes.alturaLinha ?? 1.3;
    /** Contorno para garantir contraste sobre fundos ilustrados. */
    this.contorno = opcoes.contorno ?? null;
    this.espessuraContorno = opcoes.espessuraContorno ?? 4;
    this.sombra = opcoes.sombra ?? null;
  }

  get fonte() {
    return `${this.peso} ${this.tamanho}px ${this.familia}`;
  }

  /**
   * Quebra o texto em linhas respeitando `larguraMaxima`.
   *
   * A caixa é aplicada ANTES da quebra, e não na hora de pintar: em caixa alta
   * o texto fica mais largo, então medir a versão minúscula quebraria as linhas
   * no lugar errado e o texto vazaria do painel.
   */
  _linhas(ctx) {
    const paragrafos = aplicarCaixa(this.texto).split('\n');
    if (!this.larguraMaxima) return paragrafos;

    const linhas = [];
    for (const paragrafo of paragrafos) {
      const palavras = paragrafo.split(' ');
      let atual = '';
      for (const palavra of palavras) {
        const teste = atual ? `${atual} ${palavra}` : palavra;
        if (ctx.measureText(teste).width > this.larguraMaxima && atual) {
          linhas.push(atual);
          atual = palavra;
        } else {
          atual = teste;
        }
      }
      linhas.push(atual);
    }
    return linhas;
  }

  /** Largura do texto em px lógicos (mede de verdade, precisa de canvas). */
  medir(ctx) {
    ctx.save();
    ctx.font = this.fonte;
    const linhas = this._linhas(ctx);
    const largura = Math.max(...linhas.map((l) => ctx.measureText(l).width), 0);
    ctx.restore();
    return { largura, altura: linhas.length * this.tamanho * this.alturaLinha, linhas };
  }

  desenhar(ctx) {
    if (!this.texto) return;

    ctx.save();
    ctx.font = this.fonte;
    ctx.textAlign = this.alinhamento;
    ctx.textBaseline = this.linhaBase;

    const linhas = this._linhas(ctx);
    const passo = this.tamanho * this.alturaLinha;

    if (this.sombra) {
      ctx.shadowColor = this.sombra.cor ?? 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = this.sombra.desfoque ?? 6;
      ctx.shadowOffsetY = this.sombra.y ?? 2;
    }

    linhas.forEach((linha, i) => {
      const y = i * passo;
      if (this.contorno) {
        ctx.lineWidth = this.espessuraContorno;
        ctx.strokeStyle = this.contorno;
        ctx.lineJoin = 'round';
        ctx.strokeText(linha, 0, y);
      }
      ctx.fillStyle = this.cor;
      ctx.fillText(linha, 0, y);
    });

    ctx.restore();
  }
}
