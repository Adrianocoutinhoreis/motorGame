import {
  Scene, Node, TextNode, Tween, Easing, ESTADOS, IconButton, SoundToggle,
  Background, cores, tipografia, espaco, raio, sombras, alvoAcessivel, texto as aplicarCaixa,
} from '../../engine/index.js';

/**
 * CartelaCard — cartão de seleção de cor/tema da cartela de bingo.
 */
class CartelaCard extends Node {
  constructor(tema, opcoes = {}) {
    const largura = alvoAcessivel(opcoes.largura ?? 230);
    const altura = alvoAcessivel(opcoes.altura ?? 300);
    super({ ...opcoes, largura, altura, interativo: true });

    this.tema = tema;
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
      this.aoEscolher?.(this.tema);
    });
  }

  _pressao(ativo) {
    Tween.removerDe(this);
    Tween.para(this, { scaleX: ativo ? 0.95 : 1, scaleY: ativo ? 0.95 : 1 }, 140, Easing.suaveSaida);
  }

  desenhar(ctx) {
    const { largura: l, altura: a, tema } = this;

    ctx.save();
    // Sombra do cartão
    ctx.shadowColor = sombras.cartao.cor;
    ctx.shadowBlur = sombras.cartao.desfoque;
    ctx.shadowOffsetY = sombras.cartao.y;

    // Cartão base
    ctx.fillStyle = cores.superficie;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, raio.lg);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Borda superior colorida
    ctx.fillStyle = tema.primary;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, 8, [raio.lg, raio.lg, 0, 0]);
    ctx.fill();

    // Miniatura da cartela 3x3 no centro do cartão
    const miniSize = 130;
    const miniPadding = 10;
    const miniX = (l - miniSize) / 2;
    const miniY = a * 0.18;
    const miniCell = (miniSize - miniPadding * 2 - 8) / 3;

    ctx.fillStyle = tema.light;
    ctx.beginPath();
    ctx.roundRect(miniX, miniY, miniSize, miniSize, 12);
    ctx.fill();

    // Células da miniatura
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cx = miniX + miniPadding + c * (miniCell + 4);
        const cy = miniY + miniPadding + r * (miniCell + 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(cx, cy, miniCell, miniCell, 4);
        ctx.fill();

        // Algumas células marcadas com ficha
        if ((r === 1 && c === 1) || (r === 0 && c === 0) || (r === 2 && c === 2)) {
          ctx.fillStyle = tema.chip;
          ctx.beginPath();
          ctx.arc(cx + miniCell / 2, cy + miniCell / 2, miniCell * 0.36, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Nome da Cor / Cartela
    ctx.fillStyle = cores.tinta;
    ctx.font = `${tipografia.pesoForte} 26px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(aplicarCaixa(tema.nome), l / 2, a * 0.82);

    ctx.restore();
  }

  contemPontoLocal(x, y) {
    return x >= 0 && y >= 0 && x <= this.largura && y <= this.altura;
  }
}

/**
 * EscolhaCartelaScreen — tela onde a criança escolhe o tema visual de sua cartela de bingo.
 */
export class EscolhaCartelaScreen extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.MENU;
    const { largura: L, altura: A, config } = this;

    this.adicionar(new Background({ largura: L, altura: A, tema: config.tema ?? 'bingo' }));

    // Título da tela
    this.adicionar(new TextNode('ESCOLHA SUA CARTELA', {
      x: L / 2,
      y: A * 0.12,
      tamanho: tipografia.titulo,
      peso: tipografia.pesoForte,
      cor: '#FFFFFF',
      alinhamento: 'center',
    }));

    // Subtítulo
    this.adicionar(new TextNode('Toque na sua cor favorita para jogar!', {
      x: L / 2,
      y: A * 0.20,
      tamanho: tipografia.corpo,
      peso: tipografia.pesoMedio,
      cor: '#94A3B8',
      alinhamento: 'center',
    }));

    // 4 cartões de cores (Azul, Coral, Verde, Roxo)
    const temas = config.temasCartela ?? [
      { id: 'azul', nome: 'Azul', primary: '#0284C7', light: '#E0F2FE', dark: '#0369A1', chip: 'rgba(2, 132, 199, 0.25)', glow: 'rgba(56, 189, 248, 0.6)' },
      { id: 'coral', nome: 'Coral', primary: '#EA580C', light: '#FFEDD5', dark: '#C2410C', chip: 'rgba(234, 88, 12, 0.25)', glow: 'rgba(251, 146, 60, 0.6)' },
      { id: 'esmeralda', nome: 'Verde', primary: '#059669', light: '#D1FAE5', dark: '#047857', chip: 'rgba(5, 150, 105, 0.25)', glow: 'rgba(52, 211, 153, 0.6)' },
      { id: 'roxo', nome: 'Roxo', primary: '#7C3AED', light: '#EDE9FE', dark: '#6D28D9', chip: 'rgba(124, 58, 237, 0.25)', glow: 'rgba(167, 139, 250, 0.6)' },
    ];

    const cardW = 230;
    const cardH = 320;
    const gap = 24;
    const totalW = temas.length * cardW + (temas.length - 1) * gap;
    const startX = (L - totalW) / 2;
    const cardY = A * 0.36;

    temas.forEach((tema, i) => {
      const card = new CartelaCard(tema, {
        x: startX + i * (cardW + gap),
        y: cardY,
        largura: cardW,
        altura: cardH,
        audio: this.audio,
        somToque: config.audio?.clique,
        aoEscolher: (t) => this._selecionar(t),
      });

      // Animação de entrada
      const finalY = card.y;
      card.y = finalY + 50;
      card.alpha = 0;
      Tween.de(card)
        .esperar(i * 80)
        .entao({ y: finalY, alpha: 1 }, 380, Easing.costasSaida);

      this.adicionar(card);
    });

    // Botão Voltar
    this.adicionar(new IconButton({
      icone: 'voltar',
      x: espaco.lg,
      y: espaco.lg,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => {
        const niveis = config.niveis ?? [];
        if (niveis.length > 1) this.irPara('niveis');
        else this.irPara('menu');
      },
    }));

    // Botão Som
    this.adicionar(new SoundToggle({
      audio: this.audio,
      x: L - 96,
      y: espaco.md,
      tamanho: 72,
      somToque: config.audio?.clique,
    }));
  }

  _selecionar(tema) {
    this.game.dados.temaCartela = tema;
    const nivel = this.game.dados.nivel ?? this.config.niveis[0];
    this.irPara('jogando', { nivel, temaCartela: tema });
  }
}
