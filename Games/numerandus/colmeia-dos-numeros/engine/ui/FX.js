import { Node } from '../core/Node.js';
import { Tween, Easing } from '../core/Tween.js';
import { desenharIcone } from '../theme/icons.js';
import { cores } from '../theme/tokens.js';

/**
 * FX — efeitos decorativos. **Nada aqui pode lançar exceção.**
 *
 * Não é zelo genérico: é a lição de um defeito real. `criarEstrelaVoadora`
 * chamava um método inexistente do `Tween`, e como estes efeitos rodam DENTRO da
 * cascata de combos do `jogo-das-formas` — que por sua vez roda dentro de um
 * `Tween.chamar`, que engole exceções e loga —, a página não caía: a cascata
 * abortava pela metade, os blocos não saíam da grade, a fase nunca voltava a
 * 'livre' e a garra travava para sempre.
 *
 * A regra que sai disso, e que vale para todo efeito que este arquivo vier a
 * ganhar: **decoração falha sozinha.** Uma partícula que não aparece é um
 * arranhão; uma jogada que morre no meio é o jogo. Por isso cada entrada pública
 * daqui é envolvida em `try`, o erro vai ao console com o nome do efeito, e a
 * mecânica segue. O `Watchdog` da cena cobre o que escapar disso.
 */

/** Roda um efeito sem deixar que a falha dele suba para a mecânica. */
function semQuebrar(nome, fn) {
  try {
    return fn();
  } catch (err) {
    console.error(`[motor] FX: o efeito "${nome}" falhou e foi ignorado:`, err);
    return null;
  }
}

/**
 * ParticleSystem — Gerenciador de partículas vetoriais leves.
 *
 * Utiliza o Canvas 2D nativo sem alocação contínua de memória para manter
 * o desempenho fluido em qualquer dispositivo.
 */
export class ParticleSystem extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.particulas = [];
  }

  /**
   * Dispara um estouro de partículas no ponto especificado.
   * @param {Object} params
   * @param {number} params.x posição X em px
   * @param {number} params.y posição Y em px
   * @param {string} params.cor cor da partícula
   * @param {number} [params.quantidade=12] número de partículas
   * @param {number} [params.tamanhoMin=4] tamanho mínimo em px
   * @param {number} [params.tamanhoMax=8] tamanho máximo em px
   * @param {number} [params.velocidade=140] velocidade inicial em px/s
   * @param {number} [params.duracao=0.5] tempo de vida em segundos
   * @param {boolean} [params.gravidade=true] se aplica gravidade para baixo
   */
  disparar(params = {}) {
    return semQuebrar('partículas', () => this._disparar(params));
  }

  _disparar({
    x, y, cor = cores.atencao, quantidade = 12,
    tamanhoMin = 8, tamanhoMax = 16, velocidade = 140,
    duracao = 0.5, gravidade = true,
  }) {
    for (let i = 0; i < quantidade; i++) {
      const angulo = Math.random() * Math.PI * 2;
      const v = velocidade * (0.5 + Math.random() * 0.7);
      const tam = tamanhoMin + Math.random() * (tamanhoMax - tamanhoMin);
      this.particulas.push({
        x,
        y,
        vx: Math.cos(angulo) * v,
        vy: Math.sin(angulo) * v,
        tamanho: tam,
        cor,
        alpha: 1,
        rotacao: Math.random() * Math.PI * 2,
        vRotacao: (Math.random() - 0.5) * 8,
        vidaTotal: duracao * (0.8 + Math.random() * 0.4),
        vidaRestante: duracao * (0.8 + Math.random() * 0.4),
        gravidade: gravidade ? 280 : 0,
      });
    }
  }

  atualizar(dt) {
    super.atualizar(dt);
    for (let i = this.particulas.length - 1; i >= 0; i--) {
      const p = this.particulas[i];
      p.vidaRestante -= dt;
      if (p.vidaRestante <= 0) {
        this.particulas.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravidade * dt;
      p.rotacao += p.vRotacao * dt;
      p.alpha = Math.max(0, p.vidaRestante / p.vidaTotal);
    }
  }

  desenhar(ctx) {
    if (this.particulas.length === 0) return;

    ctx.save();
    for (const p of this.particulas) {
      ctx.globalAlpha = p.alpha;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotacao);
      ctx.translate(-p.tamanho / 2, -p.tamanho / 2);
      desenharIcone(ctx, 'estrela', p.tamanho, p.cor, 1.8);
      ctx.restore();
    }
    ctx.restore();
  }
}

/**
 * Cria a animação de uma Estrela Voadora que viaja da peça até a barra de progresso no HUD.
 *
 * @param {Object} params
 * @param {Node} params.cena a cena pai onde o nó voador será adicionado
 * @param {number} params.origemX coordenada X inicial
 * @param {number} params.origemY coordenada Y inicial
 * @param {number} params.destinoX coordenada X final (HUD)
 * @param {number} params.destinoY coordenada Y final (HUD)
 * @param {ParticleSystem} [params.particulas] sistema de partículas opcional para rastro
 * @param {Function} [params.aoChegar] callback executado quando a estrela chega ao destino
 */
export function criarEstrelaVoadora(params) {
  return semQuebrar('estrela voadora', () => _criarEstrelaVoadora(params));
}

function _criarEstrelaVoadora({
  cena, origemX, origemY, destinoX, destinoY, particulas = null, aoChegar = null,
}) {
  const tamanhoIcone = 32;
  const noEstrela = new Node({
    x: origemX,
    y: origemY,
    largura: tamanhoIcone,
    altura: tamanhoIcone,
    regX: tamanhoIcone / 2,
    regY: tamanhoIcone / 2,
  });

  noEstrela.desenhar = (ctx) => {
    ctx.save();
    // Brilho exterior radiante
    ctx.shadowColor = 'rgba(234, 179, 8, 0.8)';
    ctx.shadowBlur = 12;
    desenharIcone(ctx, 'estrela', tamanhoIcone, cores.atencao, 2.5);
    ctx.restore();
  };

  cena.adicionar(noEstrela);

  // Ponto de controle da curva de Bézier (arco suave para cima)
  const controleX = (origemX + destinoX) / 2 - 40;
  const controleY = Math.min(origemY, destinoY) - 70;

  const progresso = { t: 0 };
  let tempoRastro = 0;

  // `Easing.suave` é o ease-in-out do motor. Estava `Easing.suaveEntradaSaida`,
  // que não existe: chegava como `undefined` e o valor-padrão do `entao` salvava
  // a animação por acidente. Nome errado que funciona é pior que erro — o
  // próximo efeito copiaria daqui.
  Tween.para(progresso, { t: 1 }, 650, Easing.suave)
    .emCadaQuadro((_alvo, dt) => {
      const u = 1 - progresso.t;
      const tt = progresso.t * progresso.t;
      const uu = u * u;

      noEstrela.x = uu * origemX + 2 * u * progresso.t * controleX + tt * destinoX;
      noEstrela.y = uu * origemY + 2 * u * progresso.t * controleY + tt * destinoY;
      noEstrela.scaleX = 1 + 0.3 * Math.sin(progresso.t * Math.PI);
      noEstrela.scaleY = noEstrela.scaleX;

      // Deixa faíscas brilhantes pelo caminho. O intervalo vem do `dt` real, e
      // não de um 0.016 fixo: com quadro fixo o rastro fica mais denso num
      // aparelho lento — exatamente onde ele custa mais caro.
      tempoRastro += dt;
      if (particulas && tempoRastro >= 0.04) {
        tempoRastro = 0;
        particulas.disparar({
          x: noEstrela.x,
          y: noEstrela.y,
          cor: '#FDE047',
          quantidade: 2,
          tamanhoMin: 6,
          tamanhoMax: 10,
          velocidade: 30,
          duracao: 0.3,
          gravidade: false,
        });
      }
    })
    .chamar(() => {
      noEstrela.removerDoPai();
      if (particulas) {
        particulas.disparar({
          x: destinoX,
          y: destinoY,
          cor: '#EAB308',
          quantidade: 14,
          tamanhoMin: 8,
          tamanhoMax: 14,
          velocidade: 100,
          duracao: 0.4,
          gravidade: true,
        });
      }
      if (typeof aoChegar === 'function') aoChegar();
    });
}
