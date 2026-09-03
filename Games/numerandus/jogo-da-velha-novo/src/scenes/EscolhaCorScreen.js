import {
  Scene, Node, TextNode, Tween, Easing, ESTADOS, IconButton, SoundToggle,
  Background, cores, tipografia, espaco, raio, sombras, alvoAcessivel, texto as aplicarCaixa,
} from '../../engine/index.js';

/**
 * CorCard — o cartão de uma cor, na tela "Escolha sua cor".
 *
 * Mesmo vocabulário visual do `NivelCard` da tela de níveis (cartão branco,
 * sombra, alvo grande) — mas simples: aqui não há número nem faixa colorida
 * no topo, porque a COR É o conteúdo do cartão (o rostinho já é vermelho ou
 * azul), não um rótulo por cima dele.
 */
class CorCard extends Node {
  constructor(cor, rotulo, imagem, opcoes = {}) {
    const largura = alvoAcessivel(opcoes.largura ?? 320);
    const altura = alvoAcessivel(opcoes.altura ?? 360);
    super({ ...opcoes, largura, altura, interativo: true });

    this.cor = cor; // 'vermelho' | 'azul'
    this.rotulo = rotulo;
    this.imagem = imagem;
    this.aoEscolher = opcoes.aoEscolher ?? null;
    this.audio = opcoes.audio ?? null;
    this.somToque = opcoes.somToque ?? null;

    this.regX = largura / 2;
    this.regY = altura / 2;
    this.x += largura / 2;
    this.y += altura / 2;

    this.on('apertar', () => this._pressao(true));
    this.on('soltar', () => this._pressao(false));
    this.on('sair', () => this._pressao(false));
    this.on('toque', () => {
      if (this.somToque) this.audio?.efeito(this.somToque);
      this.aoEscolher?.(this.cor);
    });
  }

  _pressao(ativo) {
    Tween.removerDe(this);
    Tween.para(this, { scaleX: ativo ? 0.96 : 1, scaleY: ativo ? 0.96 : 1 }, 140, Easing.suaveSaida);
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;

    ctx.save();
    ctx.shadowColor = sombras.cartao.cor;
    ctx.shadowBlur = sombras.cartao.desfoque;
    ctx.shadowOffsetY = sombras.cartao.y;
    ctx.fillStyle = cores.superficie;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, raio.lg);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    if (this.imagem) {
      const d = Math.min(l, a) * 0.5;
      ctx.drawImage(this.imagem, l / 2 - d / 2, a * 0.32 - d / 2, d, d);
    }

    ctx.fillStyle = cores.tinta;
    ctx.font = `${tipografia.pesoForte} ${tipografia.subtitulo}px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(aplicarCaixa(this.rotulo), l / 2, a * 0.76);

    ctx.restore();
  }

  contemPontoLocal(x, y) {
    return x >= 0 && y >= 0 && x <= this.largura && y <= this.altura;
  }
}

/**
 * EscolhaCorScreen — o aluno escolhe se joga de vermelho ou de azul, antes da
 * partida. Própria deste jogo (não é uma tela padrão do motor).
 *
 * **Como entra no fluxo, sem mexer no motor:** `MenuScreen`/`LevelSelectScreen`
 * (telas padrão) continuam indo direto para `'jogando'`, como sempre — nenhum
 * dos dois sabe que esta tela existe. É `GameScene.aoEntrar()` quem redireciona
 * para cá quando `this.game.dados.corAluno` ainda não foi escolhido, e volta
 * para `'jogando'` já com a cor quando o aluno toca um cartão (ver
 * `src/scenes/GameScene.js`). Um "jogar de novo" reaproveita a cor da partida
 * anterior (o mesmo `dados` que já reaproveita o nível), sem perguntar de novo
 * — é o mesmo comportamento que o nível já tem hoje.
 *
 * **`estado` reaproveita `ESTADOS.MENU`**, de propósito: `JOGANDO → MENU` e
 * `MENU → JOGANDO` já são transições válidas em `engine/core/Estados.js`, e
 * usar um nome de estado novo aqui geraria avisos de transição inválida na
 * entrada E na saída desta tela. É o mesmo espírito de `mascoteVisivel`: pedir
 * ao motor algo que ele já sabe fazer, em vez de inventar estado novo.
 */
export class EscolhaCorScreen extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.MENU;
    const { largura: L, altura: A, config } = this;

    this.adicionar(new Background({ largura: L, altura: A, tema: config.tema ?? 'quadro' }));

    this.adicionar(new TextNode('Escolha sua cor', {
      x: L / 2,
      y: A * 0.14,
      tamanho: tipografia.subtitulo,
      peso: tipografia.pesoForte,
      cor: '#F8FAFC',
      contorno: '#0F3D2E',
      espessuraContorno: 7,
      alinhamento: 'center',
    }));

    const nivel = this.game.dados.nivel ?? config.niveis?.[0];

    const larguraCard = 320;
    const alturaCard = 360;
    const gap = espaco.xl;
    const larguraTotal = larguraCard * 2 + gap;
    const x0 = (L - larguraTotal) / 2;
    const y = A * 0.28;

    const opcoes = [
      { cor: 'vermelho', rotulo: 'Vermelho', asset: 'pecaVermelha' },
      { cor: 'azul', rotulo: 'Azul', asset: 'pecaAzul' },
    ];

    opcoes.forEach((op, i) => {
      const card = new CorCard(op.cor, op.rotulo, this.loader.imagem(op.asset), {
        largura: larguraCard,
        altura: alturaCard,
        x: x0 + i * (larguraCard + gap),
        y,
        audio: this.audio,
        somToque: config.audio?.clique,
        aoEscolher: (cor) => this.irPara('jogando', { nivel, corAluno: cor }),
      });
      this.adicionar(card);

      const alvoY = card.y;
      card.y = alvoY + 50;
      card.alpha = 0;
      Tween.de(card).esperar(100 * i).entao({ y: alvoY, alpha: 1 }, 360, Easing.costasSaida);
    });

    // ------------------------------------------------------------- navegação
    this.adicionar(new IconButton({
      icone: 'casa',
      x: espaco.md,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.irPara('menu'),
    }));

    this.adicionar(new SoundToggle({
      audio: this.audio,
      x: L - 96,
      y: espaco.md,
      somToque: config.audio?.clique,
    }));

    this.audio.falar(config.audio?.escolhaCor ?? null, { texto: 'Escolha sua cor' });
  }
}
