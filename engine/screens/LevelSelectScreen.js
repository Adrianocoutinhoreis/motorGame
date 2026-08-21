import { Scene } from '../core/Scene.js';
import { Node } from '../core/Node.js';
import { TextNode } from '../core/TextNode.js';
import { Tween, Easing } from '../core/Tween.js';
import { ESTADOS } from '../core/Estados.js';
import { Background } from '../ui/Background.js';
import { IconButton } from '../ui/Button.js';
import { SoundToggle } from '../ui/SoundToggle.js';
import { texto as aplicarCaixa } from '../theme/texto.js';
import { cores, tipografia, raio, sombras, espaco, alvoAcessivel } from '../theme/tokens.js';

/**
 * NivelCard — o cartão de um nível.
 *
 * Grande de propósito: é o alvo mais importante desta tela e o público tem 4 a
 * 7 anos. Cada cartão carrega número, cor e ícone próprios, para ser
 * distinguível sem depender de ler o nome.
 */
class NivelCard extends Node {
  constructor(nivel, indice, opcoes = {}) {
    const largura = alvoAcessivel(opcoes.largura ?? 300);
    const altura = alvoAcessivel(opcoes.altura ?? 330);
    super({ ...opcoes, largura, altura, interativo: true });

    this.nivel = nivel;
    this.indice = indice;
    this.cor = nivel.cor ?? [cores.primaria, cores.secundaria, cores.acerto][indice % 3];
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
      this.aoEscolher?.(this.nivel, this.indice);
    });
  }

  _pressao(ativo) {
    Tween.removerDe(this);
    Tween.para(this, { scaleX: ativo ? 0.96 : 1, scaleY: ativo ? 0.96 : 1 }, 140, Easing.suaveSaida);
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const r = raio.lg;

    ctx.save();

    ctx.shadowColor = sombras.cartao.cor;
    ctx.shadowBlur = sombras.cartao.desfoque;
    ctx.shadowOffsetY = sombras.cartao.y;
    ctx.fillStyle = cores.superficie;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, r);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Faixa colorida no topo: identidade visual do nível.
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, r);
    ctx.clip();
    ctx.fillStyle = this.cor;
    ctx.fillRect(0, 0, l, a * 0.52);
    ctx.restore();

    // Emblema com o número do nível.
    const cx = l / 2;
    const cy = a * 0.28;
    const rr = Math.min(l, a) * 0.16;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.arc(cx, cy, rr, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.cor;
    ctx.font = `${tipografia.pesoForte} ${Math.round(rr * 1.25)}px ${tipografia.familia}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(this.nivel.id ?? this.indice + 1), cx, cy + 2);

    // Amostra do conteúdo (ex.: "1 2 3 4 5", "A E I O U") — mostra o que se
    // aprende ali sem precisar de explicação escrita.
    if (this.nivel.amostra) {
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.font = `${tipografia.pesoForte} ${tipografia.corpo}px ${tipografia.familia}`;
      ctx.fillText(aplicarCaixa(this.nivel.amostra), cx, a * 0.46);
    }

    // Nome do nível
    ctx.fillStyle = cores.tinta;
    ctx.font = `${tipografia.pesoForte} ${tipografia.corpo}px ${tipografia.familia}`;
    ctx.fillText(aplicarCaixa(this.nivel.nome ?? `Nível ${this.indice + 1}`), cx, a * 0.68);

    if (this.nivel.descricao) {
      ctx.fillStyle = cores.tintaSuave;
      ctx.font = `${tipografia.pesoNormal} ${tipografia.apoio}px ${tipografia.familia}`;
      ctx.fillText(aplicarCaixa(this.nivel.descricao), cx, a * 0.80);
    }

    ctx.restore();
  }

  contemPontoLocal(x, y) {
    return x >= 0 && y >= 0 && x <= this.largura && y <= this.altura;
  }
}

/**
 * LevelSelectScreen — escolha do nível.
 *
 * O motor só chega aqui quando o jogo declara mais de um nível em
 * `config.niveis`; com um nível só, JOGAR vai direto à partida. Isso evita a
 * tela vazia de uma escolha que não existe.
 *
 * Nos originais a escolha era um par de botões "fácil"/"difícil" colado à tela
 * de instrução, sem indicar o que mudava. Aqui cada nível mostra o conteúdo
 * que ele treina — o que é a informação que a criança (e o professor) precisa.
 */
export class LevelSelectScreen extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.NIVEIS;
    const { largura: L, altura: A, config } = this;
    const niveis = config.niveis ?? [];

    this.adicionar(new Background({ largura: L, altura: A }));

    this.adicionar(new TextNode('Escolha um nível', {
      x: L / 2,
      y: A * 0.08,
      tamanho: tipografia.subtitulo,
      peso: tipografia.pesoForte,
      cor: cores.superficie,
      contorno: cores.primariaEscura,
      espessuraContorno: 7,
      alinhamento: 'center',
    }));

    // Distribuição horizontal com folga mínima entre alvos.
    const larguraCard = Math.min(300, (L - espaco.xl * 2 - (niveis.length - 1) * espaco.md) / Math.max(1, niveis.length));
    const alturaCard = 330;
    const larguraTotal = niveis.length * larguraCard + (niveis.length - 1) * espaco.md;
    const inicioX = (L - larguraTotal) / 2;
    const y = A * 0.24;

    niveis.forEach((nivel, i) => {
      const card = new NivelCard(nivel, i, {
        largura: larguraCard,
        altura: alturaCard,
        x: inicioX + i * (larguraCard + espaco.md),
        y,
        audio: this.audio,
        somToque: config.audio?.clique,
        aoEscolher: (escolhido) => this.irPara('jogando', { nivel: escolhido }),
      });
      this.adicionar(card);

      const alvoY = card.y;
      card.y = alvoY + 50;
      card.alpha = 0;
      Tween.de(card).esperar(80 * i).entao({ y: alvoY, alpha: 1 }, 360, Easing.costasSaida);
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

    if (config.audio?.escolhaNivel) {
      this.audio.falar(config.audio.escolhaNivel, { texto: 'Escolha um nível' });
    }
  }

  aoSair() {
    this.audio.calar();
  }
}
