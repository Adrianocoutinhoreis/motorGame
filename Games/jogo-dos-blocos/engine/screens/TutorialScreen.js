import { Scene } from '../core/Scene.js';
import { Node } from '../core/Node.js';
import { TextNode } from '../core/TextNode.js';
import { Tween, Easing } from '../core/Tween.js';
import { ESTADOS } from '../core/Estados.js';
import { Background } from '../ui/Background.js';
import { Panel } from '../ui/Panel.js';
import { Button, IconButton } from '../ui/Button.js';
import { Mascot } from '../ui/Mascot.js';
import { SoundToggle } from '../ui/SoundToggle.js';
import { cores, tipografia, espaco, raio } from '../theme/tokens.js';

/**
 * Ilustracao — a área de desenho de um passo do tutorial.
 *
 * O passo pode trazer uma função `desenho(ctx, largura, altura, t)` e ela é
 * chamada a cada quadro, com o tempo acumulado — o que permite mostrar o gesto
 * do jogo ANIMADO (a mão tocando, o bloco caindo), que é a única forma honesta
 * de explicar um jogo para quem ainda não lê.
 */
class Ilustracao extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.desenhoPasso = opcoes.desenho ?? null;
    this._t = 0;
  }

  definirDesenho(fn) {
    this.desenhoPasso = fn ?? null;
    this._t = 0;
    return this;
  }

  atualizar(dt) {
    super.atualizar(dt);
    this._t += dt;
  }

  desenhar(ctx) {
    if (!this.desenhoPasso) return;
    ctx.save();
    try {
      this.desenhoPasso(ctx, this.largura, this.altura, this._t);
    } catch (err) {
      console.error('[motor] desenho do tutorial falhou:', err);
    }
    ctx.restore();
  }
}

/**
 * TutorialScreen — "como jogar", em passos narrados.
 *
 * Substitui o `tutorial_mc` dos originais: um MovieClip em laço dentro da tela
 * de abertura, sem controle de avanço, que rodava junto com um MP3 de
 * instrução. Quem não acompanhasse na primeira vez precisava recarregar a
 * página inteira.
 *
 * Aqui os passos vêm de `config.tutorial`, o aluno avança e volta no próprio
 * ritmo, cada passo é narrado, e existe um caminho direto para começar a jogar.
 */
export class TutorialScreen extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.TUTORIAL;
    const { largura: L, altura: A, config } = this;

    this.passos = config.tutorial ?? [];
    this.indice = 0;

    this.adicionar(new Background({ largura: L, altura: A, mostrarColinas: false }));

    // ------------------------------------------------------------ cartão
    const larguraPainel = Math.min(980, L - espaco.xl * 2);
    const alturaPainel = A * 0.62;
    this.painel = new Panel({
      largura: larguraPainel,
      altura: alturaPainel,
      x: (L - larguraPainel) / 2,
      y: A * 0.14,
      raio: raio.lg,
    });
    this.adicionar(this.painel);

    this.ilustracao = new Ilustracao({
      x: 0,
      y: 0,
      largura: larguraPainel,
      altura: alturaPainel * 0.6,
    });
    this.painel.adicionar(this.ilustracao);

    this.titulo = new TextNode('', {
      x: larguraPainel / 2,
      y: alturaPainel * 0.63,
      tamanho: tipografia.subtitulo,
      peso: tipografia.pesoForte,
      cor: cores.tinta,
      alinhamento: 'center',
    });
    this.texto = new TextNode('', {
      x: larguraPainel / 2,
      y: alturaPainel * 0.75,
      tamanho: tipografia.corpo,
      peso: tipografia.pesoNormal,
      cor: cores.tintaSuave,
      alinhamento: 'center',
      larguraMaxima: larguraPainel - espaco.xxl * 2,
    });
    this.painel.adicionar(this.titulo, this.texto);

    // ------------------------------------------------------------ mascote
    this.mascote = new Mascot({
      tamanho: 210,
      x: L * 0.5 - larguraPainel / 2 - 30,
      y: A * 0.62,
      expressao: 'pensando',
      balanco: true,
      imagem: this.loader.imagem(config.mascote?.asset),
    });
    this.adicionar(this.mascote);

    // ------------------------------------------------------------ navegação
    const yNav = A * 0.82;

    this.botaoAnterior = new IconButton({
      icone: 'setaEsquerda',
      x: L * 0.5 - 210,
      y: yNav,
      tamanho: 84,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.mostrarPasso(this.indice - 1),
    });

    this.botaoProximo = new IconButton({
      icone: 'setaDireita',
      variante: 'primario',
      x: L * 0.5 + 126,
      y: yNav,
      tamanho: 84,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.mostrarPasso(this.indice + 1),
    });

    this.botaoJogar = new Button({
      rotulo: 'JOGAR',
      icone: 'jogar',
      largura: 260,
      altura: 88,
      x: L * 0.5 - 130,
      y: yNav - 2,
      variante: 'sucesso',
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this._comecar(),
    });
    this.botaoJogar.visible = false;

    this.contador = new TextNode('', {
      x: L / 2,
      y: yNav + 96,
      tamanho: tipografia.apoio,
      cor: cores.tinta,
      alinhamento: 'center',
    });

    this.adicionar(this.botaoAnterior, this.botaoProximo, this.botaoJogar, this.contador);

    // Sair do tutorial: volta para de onde veio (menu, em geral).
    this.adicionar(new IconButton({
      icone: 'casa',
      x: espaco.md,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.irPara(this.game.dados.voltarPara ?? 'menu'),
    }));

    this.adicionar(new SoundToggle({
      audio: this.audio,
      x: L - 96,
      y: espaco.md,
      somToque: config.audio?.clique,
    }));

    if (this.passos.length === 0) {
      console.warn('[motor] config.tutorial está vazio: o tutorial não tem o que mostrar.');
    }
    this.mostrarPasso(0);
  }

  mostrarPasso(indice) {
    if (this.passos.length === 0) return;
    const novo = Math.max(0, Math.min(indice, this.passos.length - 1));
    const passo = this.passos[novo];
    this.indice = novo;

    this.audio.calar();

    this.titulo.texto = passo.titulo ?? '';
    this.texto.texto = passo.texto ?? '';
    this.ilustracao.definirDesenho(passo.desenho ?? null);

    const ultimo = novo === this.passos.length - 1;
    this.botaoAnterior.definirHabilitado(novo > 0);
    this.botaoProximo.visible = !ultimo;
    this.botaoProximo.interativo = !ultimo;
    this.botaoJogar.visible = ultimo;
    this.botaoJogar.interativo = ultimo;
    this.contador.texto = `${novo + 1} de ${this.passos.length}`;

    // Transição curta para o olho perceber que a página mudou.
    this.painel.alpha = 0.35;
    Tween.removerDe(this.painel);
    Tween.para(this.painel, { alpha: 1 }, 260, Easing.suaveSaida);

    // Narração do passo — com o texto como fallback de síntese de voz.
    if (passo.fala || passo.texto) {
      this.audio.falar(passo.fala ?? `__tutorial_${novo}`, {
        texto: [passo.titulo, passo.texto].filter(Boolean).join('. '),
      });
    }
  }

  _comecar() {
    const niveis = this.config.niveis ?? [];
    if (niveis.length > 1) this.irPara('niveis');
    else this.irPara('jogando', { nivel: niveis[0] ?? { id: 1 } });
  }

  aoSair() {
    this.audio.calar();
  }
}
