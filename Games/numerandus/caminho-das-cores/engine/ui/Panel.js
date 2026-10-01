import { Shape } from '../core/Shape.js';
import { cores, raio, sombras } from '../theme/tokens.js';

/**
 * Panel — o cartão do design system: superfície arredondada com sombra suave.
 *
 * É a base visual de tudo que "flutua" sobre o cenário (menu, diálogo de pausa,
 * cartão de nível, painel de resultado). Existe para que esses elementos sejam
 * consistentes por construção, e não por alguém lembrar de repetir o mesmo raio
 * e a mesma sombra em cada tela.
 */
export class Panel extends Shape {
  constructor(opcoes = {}) {
    super({
      forma: 'retangulo',
      preenchimento: opcoes.preenchimento ?? cores.superficie,
      contorno: opcoes.contorno ?? null,
      espessura: opcoes.espessura ?? 3,
      raio: opcoes.raio ?? raio.lg,
      sombra: opcoes.sombra === null ? null : (opcoes.sombra ?? sombras.cartao),
      ...opcoes,
    });
  }

  /** Centraliza o painel numa área (normalmente a tela inteira). */
  centralizarEm(largura, altura, deslocY = 0) {
    this.x = (largura - this.largura) / 2;
    this.y = (altura - this.altura) / 2 + deslocY;
    return this;
  }
}
