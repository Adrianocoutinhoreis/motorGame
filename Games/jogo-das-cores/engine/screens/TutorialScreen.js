import { Scene } from '../core/Scene.js';
import { Node } from '../core/Node.js';
import { TextNode } from '../core/TextNode.js';
import { Tween, Easing } from '../core/Tween.js';
import { ESTADOS } from '../core/Estados.js';
import { Background } from '../ui/Background.js';
import { Panel } from '../ui/Panel.js';
import { Button, IconButton } from '../ui/Button.js';
import { Mascot, mascoteVisivel } from '../ui/Mascot.js';
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
    this.loader = opcoes.loader ?? null;
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
      this.desenhoPasso(ctx, this.largura, this.altura, this._t, this.loader);
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

    /**
     * MODO AJUDA: esta mesma tela, servida por cima de uma partida em curso.
     *
     * Quando `aoFecharAjuda` vem no contexto, o `HelpScreen` está hospedando
     * este tutorial dentro do jogo (ver a classe dele). Três coisas mudam, e
     * são só três — o resto é o mesmo tutorial, de propósito: duas versões da
     * mesma explicação divergiriam com o tempo.
     */
    // `Scene` guarda o contexto inteiro em `this.ctx`, e é por ali que o campo
    // chega sem precisar de parâmetro novo no construtor.
    this.aoFecharAjuda = this.ctx?.aoFecharAjuda ?? null;

    // Sem cenário no modo ajuda: o véu do `HelpScreen` já separa a camada, e um
    // fundo opaco esconderia a partida que a criança precisa ver que continua lá.
    if (!this.aoFecharAjuda) {
      this.adicionar(new Background({ largura: L, altura: A, tema: config.tema ?? 'construcao' }));
    }

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
      loader: this.loader,
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
    // A arte do mascote é um BUSTO (recortado na coxa) com a mão estendida, não
    // uma figura inteira: 280 de altura dão 246 de largura, e dentro da imagem a
    // luva ocupa de 71% a 97% da largura.
    //
    // O deslocamento de 62 px existe para a luva NÃO invadir o texto. O texto do
    // painel começa, no pior caso, na borda do painel + `espaco.xxl` (72), ou
    // seja em 222; com este centro a luva termina em ~204. Em troca, uns 20 px do
    // braço esquerdo dele saem pela borda da tela — o que lê como alguém entrando
    // em cena para explicar, e é melhor que encolher a pessoa até caber.
    // No modo ajuda o mascote não entra: ele é um busto de 280 px que sai pela
    // borda esquerda da tela, e sobre uma partida em curso taparia justamente a
    // área de jogo que a criança está tentando entender.
    this.mascote = (!this.aoFecharAjuda && mascoteVisivel(config, 'tutorial')) ? new Mascot({
      tamanho: 280,
      x: L * 0.5 - larguraPainel / 2 - 62,
      y: A * 0.62,
      expressao: 'pensando',
      balanco: false,
      imagem: this.loader.imagem(config.mascote?.asset),
    }) : null;
    if (this.mascote) this.adicionar(this.mascote);

    // ------------------------------------------------------------ navegação
    //
    // Três botões dividem esta faixa, e nunca os três ao mesmo tempo: nos passos
    // do meio aparecem as duas setas; no último, a seta de voltar e o JOGAR.
    //
    // As posições saem da largura do JOGAR, não de números escolhidos a olho.
    // Antes as setas ficavam a 126 px do centro e o JOGAR tem 130 de meia
    // largura — os dois se SOBREPUNHAM em 4 px no último passo, com a seta de
    // voltar por baixo da borda do botão verde.
    const yNav = A * 0.82;
    const tamanhoSeta = 84;
    // 340 no modo ajuda: "VOLTAR AO JOGO" não cabe nos 260 de "JOGAR". E o
    // rótulo é esse, e não "VOLTAR" sozinho, porque a seta de voltar PASSO fica
    // ao lado — um botão dizendo só "voltar" ao lado dela é ambíguo.
    const larguraJogar = this.aoFecharAjuda ? 340 : 260;
    const folgaNav = 40; // respiro entre o JOGAR e as setas, dos dois lados
    // Aresta interna das setas, medida a partir do centro da tela.
    const arestaSeta = larguraJogar / 2 + folgaNav;

    this.botaoAnterior = new IconButton({
      icone: 'setaEsquerda',
      // No construtor do Button o `x` é a borda ESQUERDA, daí descontar o lado.
      x: L * 0.5 - arestaSeta - tamanhoSeta,
      y: yNav,
      tamanho: tamanhoSeta,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.mostrarPasso(this.indice - 1),
    });

    this.botaoProximo = new IconButton({
      icone: 'setaDireita',
      variante: 'primario',
      x: L * 0.5 + arestaSeta,
      y: yNav,
      tamanho: tamanhoSeta,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => this.mostrarPasso(this.indice + 1),
    });

    // No último passo: JOGAR começa a partida — ou, no modo ajuda, VOLTAR
    // devolve a partida que já estava em curso. É o mesmo botão, no mesmo lugar,
    // dizendo a verdade em cada caso.
    this.botaoJogar = new Button({
      rotulo: this.aoFecharAjuda ? 'VOLTAR AO JOGO' : 'JOGAR',
      icone: 'jogar',
      largura: larguraJogar,
      altura: 88,
      x: L * 0.5 - larguraJogar / 2,
      y: yNav - 2,
      variante: 'sucesso',
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => (this.aoFecharAjuda ? this.aoFecharAjuda() : this._comecar()),
    });
    this.botaoJogar.visible = false;

    this.contador = new TextNode('', {
      x: L / 2,
      y: yNav + 96,
      tamanho: tipografia.apoio,
      // No modo ajuda este texto cai sobre o VÉU escuro, não sobre o cenário
      // claro do tutorial: em tinta escura ele quase desaparecia. Visto numa
      // captura — nenhum teste julgaria contraste.
      cor: this.aoFecharAjuda ? cores.superficie : cores.tinta,
      alinhamento: 'center',
    });

    this.adicionar(this.botaoAnterior, this.botaoProximo, this.botaoJogar, this.contador);

    // Sair do tutorial: volta para de onde veio (menu, em geral). No modo ajuda
    // "sair" é fechar a camada — sair para o menu ali seria abandonar a partida,
    // que é exatamente o que a ajuda existe para não fazer.
    this.adicionar(new IconButton({
      icone: this.aoFecharAjuda ? 'fechar' : 'casa',
      x: espaco.md,
      y: espaco.md,
      audio: this.audio,
      somToque: config.audio?.clique,
      aoTocar: () => (this.aoFecharAjuda
        ? this.aoFecharAjuda()
        : this.irPara(this.game.dados.voltarPara ?? 'menu')),
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

    // Narração do passo. O `texto` NÃO é lido por voz sintética — o motor só
    // toca arquivo. Sem `passo.fala` declarado, o passo fica em silêncio e o
    // AudioBus diz no console qual gravação falta.
    if (passo.fala || passo.texto) {
      this.audio.falar(passo.fala ?? null, {
        texto: [passo.titulo, passo.texto].filter(Boolean).join('. '),
      });
    }
  }

  _comecar() {
    const niveis = this.config.niveis ?? [];
    if (niveis.length > 1) this.irPara('niveis');
    else this.irPara('jogando', { nivel: niveis[0] ?? { id: 1 } });
  }

}
