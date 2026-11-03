import {
  Scene, Node, ScoreSystem, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, Watchdog,
} from '../../engine/index.js';
import {
  ROTA, montarTrilha, rolarDado, alvoDaJogada, sortearCarta, respostaDoComputador,
} from '../regras.js';
import {
  CORES, FONTE, escrever, escreverParagrafo, quebrarLinhas, desenharTabuleiro, desenharAnel, desenharFicha, desenharDado,
  desenharContagem, desenharDedo, desenharOndaToque, desenharCartao,
} from '../desenho.js';

// ---------------------------------------------------------------------------
// Layout (1280 × 720), o mesmo do protótipo aprovado (artifact "Plano Corrida
// Maluca", 03/11/2026): o tabuleiro à esquerda e, à direita, a faixa de quem
// joga, o dado, o botão JOGAR O DADO e o placar de casas. A carta abre por cima
// do tabuleiro, sem cobrir o painel da direita.
// ---------------------------------------------------------------------------
const TABULEIRO = { x: 40, y: 72, l: 960, a: 620 };
const FAIXA = { x: 1016, y: 112, l: 244, a: 76 };
const DADO = { cx: 1138, cy: 278, lado: 128 };
const BOTAO_DADO = { x: 1016, y: 372, l: 244, a: 112 };
const PLACAR = { x: 1016, y: 556, l: 244, a: 64, passo: 76 };
const CARTA = { x: 110, y: 92, l: 820, a: 584 };
/** Dentro da carta (coordenadas da carta): onde fica cada coisa. */
const C = {
  tipo: 58, pergunta: 118, larguraTexto: 740,
  opcoes: { y: 228, l: 230, a: 120, gap: 25 },
  diz: 240, conferir: { y: 300, l: 260, a: 104, gap: 40 },
  retorno: 430, continuar: { y: 494, l: 300, a: 74 },
};
/** O deslocamento de cada ficha na casa, para as duas aparecerem quando dividem uma. */
const DESVIO = { crianca: [-10, -8], computador: [10, 8] };
const NOMES = { crianca: 'VOCÊ', computador: 'COMPUTADOR' };
const outro = (quem) => (quem === 'crianca' ? 'computador' : 'crianca');

// ---------------------------------------------------------------------------
// Nós de desenho
// ---------------------------------------------------------------------------

/** O tabuleiro do nível e o anel estável da casa verde de onde sai a jogada extra. */
class Tabuleiro extends Node {
  constructor(trilha, opcoes = {}) {
    super(opcoes);
    this.trilha = trilha;
    /** A casa com o anel amarelo (`null` sem jogada extra) e o alfa dele. */
    this.anelCasa = null;
    this.anel = 0;
  }

  desenhar(ctx) {
    desenharTabuleiro(ctx, TABULEIRO, this.trilha, ROTA);
    escrever(ctx, 'ENTRADA', 82, 568, 34, CORES.tinta, 'left');
    escrever(ctx, 'SAÍDA', 952, 206, 34, CORES.tinta, 'right');
    if (this.anelCasa != null) {
      const [x, y] = this.trilha.casas[this.anelCasa];
      desenharAnel(ctx, x, y, this.trilha.raio, this.anel);
    }
  }
}

/** Uma ficha redonda. `x`, `y` são o centro; `contagem` é o selo com os passos já andados. */
class Ficha extends Node {
  constructor(quem, raio, opcoes = {}) {
    super(opcoes);
    this.quem = quem;
    this.raio = raio;
    this.brilho = 0;
    this.contagem = 0;
    this.selo = 1;
  }

  desenhar(ctx) {
    desenharFicha(ctx, this.quem, this.raio, this.brilho);
    desenharContagem(ctx, 0, -this.raio - 30, this.contagem, this.selo);
  }
}

/** O dado. Rola trocando de face; parado, só respira (suave) enquanto convida ao toque. */
class Dado extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes, largura: DADO.lado, altura: DADO.lado, regX: DADO.lado / 2, regY: DADO.lado / 2, interativo: true });
    this.face = 0;
    this.rolando = false;
    this.convida = false;
    this.t = Math.random() * 6;
    this._troca = 0;
  }

  atualizar(dt) {
    super.atualizar(dt);
    this.t += dt;
    if (this.rolando) {
      this._troca += dt;
      if (this._troca >= 0.11) {
        this._troca = 0;
        this.face = 1 + Math.floor(Math.random() * 6);
      }
      this.rotation = Math.sin(this.t * 24) * 8;
    } else {
      this.rotation = 0;
      const k = this.convida ? 1 + Math.sin(this.t * 3.5) * 0.035 : 1;
      this.scaleX = k;
      this.scaleY = k;
    }
  }

  desenhar(ctx) {
    desenharDado(ctx, DADO.lado, this.face);
  }
}

/** A faixa de quem joga: vermelha a criança, madeira o computador; "DE NOVO" na jogada extra. */
class FaixaVez extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes, largura: FAIXA.l, altura: FAIXA.a });
    this.quem = 'crianca';
    this.deNovo = false;
    this.visivel = true;
  }

  desenhar(ctx) {
    if (!this.visivel) return;
    ctx.save();
    ctx.fillStyle = this.quem === 'crianca' ? CORES.fichaC : CORES.fichaPTexto;
    ctx.beginPath();
    ctx.roundRect(0, 0, FAIXA.l, FAIXA.a, 18);
    ctx.fill();
    const texto = this.quem === 'crianca'
      ? (this.deNovo ? 'SUA VEZ DE NOVO!' : 'SUA VEZ')
      : (this.deNovo ? 'COMPUTADOR DE NOVO' : 'VEZ DO COMPUTADOR');
    ctx.font = `800 26px ${FONTE}`;
    const linhas = quebrarLinhas(ctx, texto, FAIXA.l - 28).length;
    escreverParagrafo(ctx, texto, FAIXA.l / 2, FAIXA.a / 2 - (linhas - 1) * 15, FAIXA.l - 28, 26, '#FFFFFF', 1.15);
    ctx.restore();
  }
}

/** O placar: a ficha de cada um e a casa em que ela está. */
class Placar extends Node {
  constructor(saida, opcoes = {}) {
    super(opcoes);
    this.saida = saida;
    this.casas = { crianca: 0, computador: 0 };
  }

  desenhar(ctx) {
    ['crianca', 'computador'].forEach((quem, i) => {
      const y = i * PLACAR.passo;
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(0, y, PLACAR.l, PLACAR.a, 16);
      ctx.fill();
      ctx.stroke();
      ctx.translate(34, y + PLACAR.a / 2);
      desenharFicha(ctx, quem, 18);
      ctx.restore();
      const casa = this.casas[quem];
      escrever(ctx, NOMES[quem], 64, y + 20, 18, CORES.tintaSuave, 'left', 700);
      const onde = casa === 0 ? 'ENTRADA' : casa >= this.saida ? 'SAÍDA' : `CASA ${casa}`;
      escrever(ctx, onde, 64, y + 44, 24, CORES.tintaClara, 'left');
    });
  }
}

/** O botão JOGAR O DADO: o botão primário do motor, com o rótulo em duas linhas. */
class BotaoDado extends Button {
  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const r = 26;
    const dy = this._pressionado ? 6 : 0;
    ctx.save();
    if (this.habilitado && !this._pressionado) {
      ctx.fillStyle = '#1741A8';
      ctx.beginPath();
      ctx.roundRect(0, 8, l, a, r);
      ctx.fill();
    }
    ctx.fillStyle = this.habilitado ? '#2563EB' : 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.roundRect(0, dy, l, a, r);
    ctx.fill();
    const cor = this.habilitado ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)';
    escrever(ctx, 'JOGAR', l / 2, a / 2 - 18 + dy, 32, cor);
    escrever(ctx, 'O DADO', l / 2, a / 2 + 18 + dy, 32, cor);
    ctx.restore();
  }
}

/** Uma resposta da carta: branca com borda de madeira; acende verde (a certa) ou laranja (a errada tocada). */
class BotaoOpcao extends Button {
  constructor(opcao, opcoes = {}) {
    super({ ...opcoes, rotulo: opcao.texto });
    this.opcao = opcao;
    /** 'certa' | 'errada' | 'sim' | 'nao' | null */
    this.marca = opcoes.marca ?? null;
    this.estilo = opcoes.estilo ?? 'opcao';
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const dy = this._pressionado ? 5 : 0;
    const fundo = this.marca === 'certa' ? '#D9F7E6'
      : this.marca === 'errada' ? '#FDE4E4'
        : this.estilo === 'sim' ? '#E6F7EE' : this.estilo === 'nao' ? '#FDECEC' : '#FFFFFF';
    const borda = this.marca === 'certa' ? CORES.okEscuro : this.marca === 'errada' ? CORES.erro : CORES.cartaBorda;
    ctx.save();
    if (this.marca === 'errada') ctx.globalAlpha *= 0.85;
    ctx.fillStyle = 'rgba(58, 42, 18, 0.25)';
    ctx.beginPath();
    ctx.roundRect(0, 6, l, a, 22);
    ctx.fill();
    ctx.fillStyle = fundo;
    ctx.strokeStyle = borda;
    ctx.lineWidth = this.marca ? 6 : 4;
    ctx.beginPath();
    ctx.roundRect(0, dy, l, a, 22);
    ctx.fill();
    ctx.stroke();
    const texto = this.opcao.texto;
    ctx.font = `800 46px ${FONTE}`;
    const tam = Math.min(46, Math.floor(46 * (l - 24) / Math.max(1, ctx.measureText(texto).width)));
    if (this.opcao.sub) {
      escrever(ctx, texto, l / 2, a / 2 - 14 + dy, tam, CORES.tinta);
      escrever(ctx, this.opcao.sub, l / 2, a / 2 + 26 + dy, 26, '#6B7280', 'center', 700);
    } else {
      escrever(ctx, texto, l / 2, a / 2 + 2 + dy, tam, CORES.tinta);
    }
    ctx.restore();
  }
}

/**
 * A carta aberta por cima do tabuleiro: o tipo, a pergunta e, embaixo, ou as três respostas (a vez
 * da criança) ou a resposta do computador com CERTO / ERRADO (a criança confere). Depois de
 * responder, o retorno (a conta certa e o que acontece com a ficha) e o CONTINUAR. Cobre a tela
 * inteira para segurar os toques, mas escurece só o tabuleiro: o painel da direita e os botões de
 * pausa e ajuda continuam à vista.
 */
class PainelCarta extends Node {
  constructor(cena, opcoes = {}) {
    super({ ...opcoes, largura: cena.largura, altura: cena.altura, interativo: true });
    this.cena = cena;
    this.carta = null;
    this.diz = null;
    this.retorno = null;
    this.botoes = [];
    this.visible = false;
  }

  _limpar() {
    for (const b of this.botoes) b.destruir();
    this.botoes = [];
    this.retorno = null;
    this.diz = null;
  }

  _botao(no) {
    this.adicionar(no);
    this.botoes.push(no);
    return no;
  }

  /** A vez da criança: as três respostas. */
  abrirPergunta(carta, aoResponder) {
    this._limpar();
    this.carta = carta;
    const { y, l, a, gap } = C.opcoes;
    const x0 = CARTA.x + (CARTA.l - (3 * l + 2 * gap)) / 2;
    carta.opcoes.forEach((op, i) => {
      const b = this._botao(new BotaoOpcao(op, {
        x: x0 + i * (l + gap), y: CARTA.y + y, largura: l, altura: a,
        audio: this.cena.audio, aoTocar: () => aoResponder(op, b),
      }));
    });
    this._mostrar();
  }

  /** A vez do computador: a resposta dele e os botões para a criança conferir. */
  abrirComputador(carta, opcao, aoConferir) {
    this._limpar();
    this.carta = carta;
    this.diz = opcao;
    const { y, l, a, gap } = C.conferir;
    const x0 = CARTA.x + (CARTA.l - (2 * l + gap)) / 2;
    [['CERTO', true, 'sim'], ['ERRADO', false, 'nao']].forEach(([rotulo, valor, estilo], i) => {
      const b = this._botao(new BotaoOpcao({ texto: rotulo }, {
        x: x0 + i * (l + gap), y: CARTA.y + y, largura: l, altura: a, estilo,
        audio: this.cena.audio, aoTocar: () => aoConferir(valor, b),
      }));
    });
    this._mostrar();
  }

  /** Trava as respostas e mostra o retorno com o CONTINUAR. */
  mostrarRetorno(bom, titulo, detalhe, aoContinuar) {
    for (const b of this.botoes) b.definirHabilitado(false);
    for (const b of this.botoes) b.alpha = b.marca ? 1 : 0.55;
    this.retorno = { bom, titulo, detalhe, k: 0 };
    Tween.para(this.retorno, { k: 1 }, 250, Easing.suaveSaida);
    const { y, l, a } = C.continuar;
    this._botao(new Button({
      // Texto escuro no verde (6,5:1), como o PRONTO do Subtraindo o Dominó: o branco dá 2,3:1.
      rotulo: 'CONTINUAR', variante: 'sucesso', corTexto: '#052E16', x: CARTA.x + (CARTA.l - l) / 2, y: CARTA.y + y, largura: l, altura: a,
      tamanhoTexto: 34, audio: this.cena.audio, aoTocar: () => aoContinuar(),
    }));
  }

  _mostrar() {
    this.visible = true;
    this.alpha = 0;
    Tween.removerDe(this);
    Tween.para(this, { alpha: 1 }, 220, Easing.suaveSaida);
  }

  fechar() {
    this._limpar();
    this.carta = null;
    this.visible = false;
  }

  desenhar(ctx) {
    if (!this.carta) return;
    ctx.save();
    ctx.fillStyle = 'rgba(15, 20, 35, 0.45)';
    ctx.beginPath();
    ctx.roundRect(TABULEIRO.x - 6, TABULEIRO.y - 6, TABULEIRO.l + 12, TABULEIRO.a + 12, 26);
    ctx.fill();
    ctx.translate(CARTA.x, CARTA.y);
    desenharCartao(ctx, CARTA.l, CARTA.a);
    const tipo = { dobro: 'DOBRO', triplo: 'TRIPLO', ordinal: 'ORDINAIS', problema: 'PROBLEMA' }[this.carta.tipo];
    escrever(ctx, tipo, CARTA.l / 2, C.tipo, 24, CORES.cartaTipo, 'center', 800);
    escreverParagrafo(ctx, this.carta.pergunta, CARTA.l / 2, C.pergunta, C.larguraTexto, 40, CORES.tinta, 1.2);
    if (this.diz) {
      const texto = this.diz.sub ? `${this.diz.texto} (${this.diz.sub})` : this.diz.texto;
      ctx.font = `800 30px ${FONTE}`;
      const w1 = ctx.measureText('O COMPUTADOR DIZ:').width;
      ctx.font = `800 40px ${FONTE}`;
      const w2 = ctx.measureText(texto).width + 36;
      const x0 = (CARTA.l - (w1 + 18 + w2)) / 2;
      escrever(ctx, 'O COMPUTADOR DIZ:', x0, C.diz, 30, CORES.tinta, 'left');
      ctx.fillStyle = CORES.fichaP;
      ctx.beginPath();
      ctx.roundRect(x0 + w1 + 18, C.diz - 30, w2, 60, 14);
      ctx.fill();
      escrever(ctx, texto, x0 + w1 + 18 + w2 / 2, C.diz + 2, 40, CORES.tinta);
    }
    if (this.retorno) {
      const r = this.retorno;
      ctx.globalAlpha *= r.k;
      escreverParagrafo(ctx, r.titulo, CARTA.l / 2, C.retorno - 4, C.larguraTexto, 32, r.bom ? CORES.okTexto : CORES.erroTexto, 1.15);
      escrever(ctx, r.detalhe, CARTA.l / 2, C.retorno + 40, 26, CORES.tinta, 'center', 700);
    }
    ctx.restore();
  }
}

/**
 * O dedinho branco da coleção mostrando o gesto da vez, sem frase: aponta o botão JOGAR O DADO
 * quando é a vez da criança. Nunca aponta a resposta certa.
 */
class DicaDedo extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.alvo = null;
    this.t = 0;
    this.visible = false;
  }

  mostrar(alvo) {
    this.alvo = alvo;
    this.t = 0;
    this.visible = true;
  }

  esconder() {
    this.visible = false;
    this.alvo = null;
  }

  atualizar(dt) {
    super.atualizar(dt);
    if (this.visible) this.t += dt;
  }

  desenhar(ctx) {
    if (!this.alvo) return;
    const f = (this.t % 1.4) / 1.4;
    const tocando = f > 0.55 && f < 0.72;
    desenharOndaToque(ctx, this.alvo.x, this.alvo.y, 40, (f - 0.55) / 0.4);
    desenharDedo(ctx, this.alvo.x, this.alvo.y + (tocando ? 6 : 0), 62, Math.min(1, this.t / 0.4));
  }
}

/**
 * GameScene — a partida da Corrida Maluca.
 *
 * Fases (`this.fase`):
 *   'dado'       a vez da criança, esperando o toque no dado (o dedinho aponta o botão)
 *   'cpuEspera'  a vez do computador, antes de ele jogar o dado
 *   'rolando'    o dado rolando
 *   'andando'    a ficha andando casa a casa, contando
 *   'carta'      a criança escolhe a resposta da carta
 *   'conferir'   o computador respondeu; a criança confere com CERTO / ERRADO
 *   'retorno'    a carta mostra a conta e o que acontece; espera o CONTINUAR (no ritmo da criança)
 *   'voltando'   errou a carta: a ficha volta casa a casa para onde a jogada começou
 *
 * **As regras do vídeo** (docs/REGRAS-CORRIDA-MALUCA.md §4): joga o dado, anda, responde a carta;
 * acertou fica, errou volta de onde partiu; quem FICA numa casa verde joga o dado de novo; vence
 * quem fica na SAÍDA (passar dela vale, mas a última carta precisa ser acertada). O computador joga do
 * mesmo jeito, erra de propósito 1 vez em 4 (`regras.computadorErra`) e a criança confere.
 *
 * **A nota** (`_terminar`): meta = os passos da trilha; vitória = meta − cartas erradas, derrota = a
 * casa alcançada (RE-02, a conta do próprio `ScoreSystem`). Conferir mal não conta como erro.
 *
 * Todo o tempo passa por Tween (nenhum setTimeout): pausa e ajuda congelam tudo.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.regras = { rolarMs: 900, passoMs: 300, cpuEsperaMs: 900, computadorErra: 0.25, falaMaxMs: 2000, ...config.regras };
    /** A fala do número do passo ainda tocando (a ficha e a carta esperam por ela). */
    this._falaPendente = false;
    this._idFala = 0;
    this.trilha = montarTrilha(this.nivel.passos ?? 15);
    this.saida = this.trilha.saida;

    this.placar = new ScoreSystem({ total: this.saida, nivel: this.nivel.id ?? 1, vidas: 0 });
    this.pos = { crianca: 0, computador: 0 };
    this.fase = 'dado';
    this.vez = null;
    this.recentes = [];
    this.stats = { respondidas: 0, certas: 0, porTipo: {}, conferencias: 0, conferenciasCertas: 0, jogadasExtras: 0, jogadas: 0 };
    /** Ganchos de teste: o próximo dado (de qualquer um) e se o computador erra a próxima carta (`null` = sorteio). */
    this.dadoDeTeste = null;
    this.computadorErraDeTeste = null;
    this._fimResolvido = false;

    this.adicionar(new Background({
      largura: L, altura: A, tema: config.tema ?? 'tabuleiro', mostrarDecoracoes: false, mostrarChao: false,
    }));

    this.tabuleiro = new Tabuleiro(this.trilha);
    this.adicionar(this.tabuleiro);
    // As fichas moram numa camada própria: `paraFrente()` traz a ficha da vez à frente da outra SEM
    // passar por cima da carta, do HUD, da pausa e da ajuda.
    this.camadaFichas = new Node();
    this.adicionar(this.camadaFichas);
    const raioFicha = Math.round(this.trilha.raio * 0.72);
    this.fichas = {
      computador: new Ficha('computador', raioFicha),
      crianca: new Ficha('crianca', raioFicha),
    };
    for (const quem of ['computador', 'crianca']) {
      this._colocar(quem, 0);
      this.camadaFichas.adicionar(this.fichas[quem]);
    }

    // ------------------------------------------------------- painel da direita
    this.faixa = new FaixaVez({ x: FAIXA.x, y: FAIXA.y });
    this.adicionar(this.faixa);
    this.dado = new Dado({ x: DADO.cx, y: DADO.cy });
    this.dado.on('toque', () => this._tocarDado());
    this.adicionar(this.dado);
    const clique = config.audio?.clique;
    this.botaoDado = new BotaoDado({
      x: BOTAO_DADO.x, y: BOTAO_DADO.y, largura: BOTAO_DADO.l, altura: BOTAO_DADO.a,
      audio: this.audio, somToque: clique, aoTocar: () => this._tocarDado(),
    });
    this.adicionar(this.botaoDado);
    this.placarNo = new Placar(this.saida, { x: PLACAR.x, y: PLACAR.y });
    this.adicionar(this.placarNo);

    this.dica = new DicaDedo();
    this.adicionar(this.dica);

    this.painel = new PainelCarta(this);
    this.adicionar(this.painel);

    // ------------------------------------------------------------------- HUD
    this.adicionar(
      new IconButton({ icone: 'pausa', x: L - 272, y: 20, audio: this.audio, somToque: clique, corContorno: 'transparent', aoTocar: () => this.pausar() }),
      new IconButton({ icone: 'tutorial', x: L - 184, y: 20, audio: this.audio, somToque: clique, corContorno: 'transparent', aoTocar: () => this.pedirAjuda() }),
      new SoundToggle({ audio: this.audio, x: L - 96, y: 20, somToque: clique }),
    );

    // ----------------------------------------------------------- pausa/ajuda
    this.pausa = new PauseScreen({
      largura: L,
      altura: A,
      audio: this.audio,
      config,
      mostrarSom: false,
      aoContinuar: () => { this.pausada = false; Tween.retomarTodos(); },
      aoReiniciar: () => this.irPara('jogando', { nivel: this.nivel }),
      aoSair: () => this.irPara('menu'),
    });
    this.adicionar(this.pausa);
    this.ajuda = new HelpScreen({
      cena: this,
      aoFechar: () => { this.pausada = false; Tween.retomarTodos(); },
    });
    this.adicionar(this.ajuda);

    // --------------------------------------------------------------- guarda
    // O dado rolando e a ficha andando são cadeias de tweens no `relogio`. Se uma exceção engolida
    // cortar a cadeia, a partida não pode ficar presa: o cão de guarda leva a um ponto seguro.
    this.relogio = new Node();
    this.adicionar(this.relogio);
    this.guarda = new Watchdog({
      nome: 'jogada da corrida',
      ocupado: () => ['cpuEspera', 'rolando', 'andando', 'voltando'].includes(this.fase) && !this.pausada && !this._fimResolvido,
      vivo: () => Tween.temAtivo(this.relogio) || Tween.temAtivo(this.fichas.crianca) || Tween.temAtivo(this.fichas.computador),
      graca: 0.6,
      limite: 14,
      aoTravar: () => this._destravar(),
    });

    this._comecarVez('crianca', false);
  }

  // ----------------------------------------------------------------- narração

  _falar(id, texto, interromper = false) {
    if (interromper) this.audio?.calar();
    this.audio?.falar(id, { texto });
  }

  /**
   * Fala uma frase em pedaços, em fila: `{id, texto}` gravado ou `{numero}` (o `numeroN` da coleção).
   *
   * **Toca inteira ou não toca.** Com um pedaço sem gravação, o resto soltaria só o número ("três")
   * no meio do silêncio, sem sentido para a criança (visto pelo humano, 03/11/2026). Então a frase
   * fica muda e o console diz o que falta; quando as gravações chegarem, ela volta sozinha.
   */
  _falarPedacos(pedacos, interromper = false) {
    if (interromper) this.audio?.calar();
    const ids = pedacos.map((p) => (p.numero != null ? `numero${p.numero}` : p.id));
    const faltam = ids.filter((id) => !this.audio?.temSom(id));
    if (faltam.length) {
      const frase = pedacos.map((p) => (p.numero != null ? String(p.numero) : p.texto)).join(' ');
      console.warn(`[corrida-maluca] frase sem gravação completa (faltam: ${faltam.join(', ')}); fica em silêncio: "${frase}"`);
      return;
    }
    pedacos.forEach((p, i) => this.audio?.falar(ids[i], { texto: p.numero != null ? String(p.numero) : p.texto }));
  }

  _efeito(chave) {
    const id = this.config.audio?.[chave];
    if (id) this.audio?.efeito(id);
  }

  // ------------------------------------------------------------------- fichas

  /** O ponto da casa `casa` para a ficha de `quem` (com o desvio que deixa as duas à vista). */
  _ponto(quem, casa) {
    const [x, y] = this.trilha.casas[casa];
    return { x: x + DESVIO[quem][0], y: y + DESVIO[quem][1] };
  }

  _colocar(quem, casa) {
    Object.assign(this.fichas[quem], this._ponto(quem, casa));
  }

  _nomeCasa(casa) {
    return casa === 0 ? 'A ENTRADA' : `A CASA ${casa}`;
  }

  // ---------------------------------------------------------------------- vez

  /**
   * Começa a vez de `quem`. `deNovo` é a jogada extra da casa verde: a faixa diz "DE NOVO" e a casa
   * verde ganha o anel amarelo, estável, até o dado parar.
   */
  _comecarVez(quem, deNovo) {
    if (this._fimResolvido) return;
    this.vez = { quem, deNovo, inicio: this.pos[quem], dado: null, alvo: null, carta: null, certo: null };
    this.faixa.quem = quem;
    this.faixa.deNovo = deNovo;
    for (const q of ['crianca', 'computador']) {
      Tween.removerDe(this.fichas[q]);
      this._colocar(q, this.pos[q]);
      this.fichas[q].brilho = q === quem ? 1 : 0;
      this.fichas[q].contagem = 0;
    }
    this.fichas[quem].paraFrente();
    this.tabuleiro.anelCasa = deNovo ? this.pos[quem] : null;
    this.tabuleiro.anel = deNovo ? 1 : 0;
    this.dado.face = 0;
    this.dado.rolando = false;

    if (quem === 'crianca') {
      this.fase = 'dado';
      this.dado.convida = true;
      this.botaoDado.definirHabilitado(true);
      this.botaoDado.pulse = true;
      const b = this.botaoDado;
      this.dica.mostrar({ x: b.x + b.largura * 0.28, y: b.y - b.altura / 2 + 26 });
      if (deNovo) this._falar('casaVerde', 'Casa verde! Jogue o dado de novo!', true);
      else this._falar('suaVez', 'Sua vez!', true);
    } else {
      this.fase = 'cpuEspera';
      this.dado.convida = false;
      this._desligarBotaoDado();
      this.dica.esconder();
      if (deNovo) this._falar('casaVerdeComputador', 'Casa verde! O computador joga de novo!', true);
      else this._falar('vezDoComputador', 'Vez do computador!', true);
      Tween.de(this.relogio).esperar(this.regras.cpuEsperaMs + (deNovo ? 700 : 0)).chamar(() => this._rolar());
    }
  }

  _desligarBotaoDado() {
    this.botaoDado.definirHabilitado(false);
    this.botaoDado.pulse = false;
    this.botaoDado.scaleX = 1;
    this.botaoDado.scaleY = 1;
  }

  _tocarDado() {
    if (this.pausada || this.fase !== 'dado') return;
    this._rolar();
  }

  _rolar() {
    if (this._fimResolvido || !['dado', 'cpuEspera'].includes(this.fase)) return;
    this.fase = 'rolando';
    this.dica.esconder();
    this._desligarBotaoDado();
    this.dado.rolando = true;
    this.dado.convida = false;
    this.vez.dado = this.dadoDeTeste ?? rolarDado();
    this.dadoDeTeste = null;
    Tween.de(this.relogio).esperar(this.regras.rolarMs).chamar(() => this._dadoParou());
  }

  _dadoParou() {
    if (this.fase !== 'rolando') return;
    this.dado.rolando = false;
    this.dado.face = this.vez.dado;
    this._efeito('pouso');
    this.tabuleiro.anelCasa = null;
    this.stats.jogadas += this.vez.quem === 'crianca' ? 1 : 0;
    this.vez.alvo = alvoDaJogada(this.vez.inicio, this.vez.dado, this.saida);
    this.fase = 'andando';
    this.vez.passos = 0;
    Tween.de(this.relogio).esperar(350).chamar(() => this._passo());
  }

  /**
   * Um passo da ficha: na ida conta em voz alta ("um", "dois"…) e mostra o número sobre ela; na volta
   * (errou a carta) anda em silêncio. Chegando, abre a carta (ida) ou passa a vez (volta).
   */
  _passo() {
    if (!['andando', 'voltando'].includes(this.fase)) return;
    const { quem } = this.vez;
    const ida = this.fase === 'andando';
    const destino = ida ? this.vez.alvo : this.vez.inicio;
    const ficha = this.fichas[quem];
    if (this.pos[quem] === destino) {
      Tween.de(this.relogio).esperar(ida ? 450 : 350).chamar(() => (ida ? this._abrirCarta() : this._passarAVez()));
      return;
    }
    const proxima = this.pos[quem] + (ida ? 1 : -1);
    this.pos[quem] = proxima;
    this.placarNo.casas[quem] = proxima;
    Tween.removerDe(ficha);
    Tween.para(ficha, this._ponto(quem, proxima), this.regras.passoMs * 0.8, Easing.suave);
    if (ida) {
      this.vez.passos += 1;
      ficha.contagem = this.vez.passos;
      ficha.selo = 0.6;
      Tween.para(ficha, { selo: 1 }, 220, Easing.costasSaida);
      this._falarPasso(this.vez.passos);
    }
    Tween.de(this.relogio).esperar(this.regras.passoMs * 0.8).chamar(() => this._efeito('pouso'))
      .esperar(this.regras.passoMs * 0.5).chamar(() => this._depoisDaFala(() => this._passo()));
  }

  /**
   * Fala o número do passo e marca a fala como pendente até ela acabar. O "quatro" gravado dura quase
   * 1 s e a ficha anda uma casa a cada ~0,4 s: sem esperar, as falas ficavam na fila, atrasadas, e a
   * carta abria por cima cortando a contagem no meio (visto pelo humano, 03/11/2026: o dado deu 5 e a
   * voz parou no "quatro").
   */
  _falarPasso(n) {
    const id = ++this._idFala;
    this._falaPendente = true;
    Promise.resolve(this.audio?.falar(`numero${n}`, { texto: String(n) }))
      .finally(() => { if (this._idFala === id) this._falaPendente = false; });
  }

  /**
   * Chama `fn` quando a fala do passo acabar: a ficha anda no ritmo da voz e a carta só abre depois do
   * último número. Espera em sondagens de 80 ms no `relogio` (a pausa congela a espera e o `Watchdog`
   * vê a jogada viva), com um teto (`regras.falaMaxMs`) para um áudio que nunca avise o fim não prender
   * a partida. Sem a gravação, o `falar` resolve na hora e não há espera.
   */
  _depoisDaFala(fn, esperou = 0) {
    if (!this._falaPendente || esperou >= this.regras.falaMaxMs) { fn(); return; }
    Tween.de(this.relogio).esperar(80).chamar(() => this._depoisDaFala(fn, esperou + 80));
  }

  // -------------------------------------------------------------------- carta

  _abrirCarta() {
    if (this.fase !== 'andando') return;
    this.fichas[this.vez.quem].contagem = 0;
    const { carta, recentes } = sortearCarta(this.nivel.cartas, this.recentes);
    this.recentes = recentes;
    this.vez.carta = carta;
    if (this.vez.quem === 'crianca') {
      this.fase = 'carta';
      this.painel.abrirPergunta(carta, (op, b) => this._responder(op, b));
      this._falarPedacos(carta.fala, true);
    } else {
      this._abrirCartaComputador();
    }
  }

  /** A criança tocou uma resposta: confere, mostra a conta e o que acontece com a ficha. */
  _responder(op, botao) {
    if (this.pausada || this.fase !== 'carta') return;
    const { carta, alvo, inicio } = this.vez;
    const certo = op.valor === carta.certa;
    this.vez.certo = certo;
    this.fase = 'retorno';
    const tipo = (this.stats.porTipo[carta.tipo] ??= { certas: 0, respondidas: 0 });
    tipo.respondidas += 1;
    this.stats.respondidas += 1;
    for (const b of this.painel.botoes) if (b.opcao?.valor === carta.certa) b.marca = 'certa';
    if (certo) {
      this.stats.certas += 1;
      tipo.certas += 1;
      this._efeito('acerto');
      this._falar('muitoBem', 'Muito bem!', true);
      const detalhe = alvo === this.saida ? 'VOCÊ CHEGOU NA SAÍDA!'
        : this.trilha.verdes.includes(alvo) ? 'CASA VERDE: JOGUE DE NOVO!' : `FICA NA CASA ${alvo}!`;
      this.painel.mostrarRetorno(true, 'ACERTOU!', detalhe, () => this._continuar());
    } else {
      botao.marca = 'errada';
      this.placar.errar();
      this._efeito('erro');
      this._falar('volteDeOndePartiu', 'Volte para a casa de onde partiu.', true);
      this.painel.mostrarRetorno(false, carta.conta, `VOLTE PARA ${this._nomeCasa(inicio)}.`, () => this._continuar());
    }
  }

  /** A vez do computador: ele responde em voz alta (às vezes errado, de propósito) e a criança confere. */
  _abrirCartaComputador() {
    const { carta } = this.vez;
    const erra = this.computadorErraDeTeste == null ? this.regras.computadorErra : (this.computadorErraDeTeste ? 1 : 0);
    this.computadorErraDeTeste = null;
    const resposta = respostaDoComputador(carta, erra);
    this.vez.resposta = resposta;
    this.vez.certo = resposta.certo;
    this.fase = 'conferir';
    this.painel.abrirComputador(carta, resposta.opcao, (valor, b) => this._conferir(valor, b));
    const pedacos = [...carta.fala, { id: 'oComputadorDiz', texto: 'O computador diz:' }];
    if (carta.tipo === 'ordinal') pedacos.push({ id: `ordinal${resposta.opcao.valor}`, texto: resposta.opcao.texto.toLowerCase() });
    else pedacos.push({ numero: resposta.opcao.valor });
    pedacos.push({ id: 'eleAcertou', texto: 'Ele acertou?' });
    this._falarPedacos(pedacos, true);
  }

  /** A criança conferiu a resposta do computador. Conferir mal não é erro na nota: é treino, só no relatório. */
  _conferir(disseCerto, botao) {
    if (this.pausada || this.fase !== 'conferir') return;
    const { carta, resposta } = this.vez;
    const conferiuBem = disseCerto === resposta.certo;
    this.fase = 'retorno';
    this.stats.conferencias += 1;
    if (conferiuBem) this.stats.conferenciasCertas += 1;
    botao.marca = conferiuBem ? 'certa' : 'errada';
    this._efeito(conferiuBem ? 'acerto' : 'erro');
    const ele = resposta.certo ? 'ELE ACERTOU.' : 'ELE ERROU.';
    const titulo = conferiuBem ? `ISSO! ${ele}` : `OLHE DE NOVO: ${ele}`;
    if (conferiuBem) this._falar('isso', 'Isso!', true);
    else this._falar('olheDeNovo', 'Olhe de novo!', true);
    this.painel.mostrarRetorno(conferiuBem, titulo, carta.conta, () => this._continuar());
  }

  /** CONTINUAR: fica (e talvez joga de novo, ou vence) ou volta de onde partiu. */
  _continuar() {
    if (this.pausada || this.fase !== 'retorno') return;
    this.painel.fechar();
    const { quem, certo, alvo } = this.vez;
    if (!certo) {
      this.fase = 'voltando';
      Tween.de(this.relogio).esperar(250).chamar(() => this._passo());
      return;
    }
    if (alvo === this.saida) { this._terminar(quem); return; }
    if (this.trilha.verdes.includes(alvo)) {
      if (quem === 'crianca') this.stats.jogadasExtras += 1;
      this._comecarVez(quem, true);
      return;
    }
    this._passarAVez();
  }

  _passarAVez() {
    this._comecarVez(outro(this.vez.quem), false);
  }

  // ---------------------------------------------------------------------- fim

  /**
   * Vai ao resultado. A nota é a do `ScoreSystem` (RE-02): na vitória a ficha chegou (acertos = meta) e
   * ele desconta as cartas erradas; na derrota vale a casa alcançada. Não passa `estrelas`: a tela
   * deriva a fileira (RE-04).
   */
  _terminar(vencedor) {
    if (this._fimResolvido) return;
    this._fimResolvido = true;
    const vitoria = vencedor === 'crianca';
    this.placar.acertos = vitoria ? this.saida : this.pos.crianca;
    const porTipo = {};
    for (const [tipo, v] of Object.entries(this.stats.porTipo)) porTipo[tipo] = `${v.certas}/${v.respondidas}`;
    const resultado = this.placar.paraAva(vitoria, {
      casaAlcancada: this.pos.crianca,
      casaComputador: this.pos.computador,
      cartasRespondidas: this.stats.respondidas,
      cartasCertas: this.stats.certas,
      cartasPorTipo: porTipo,
      conferencias: this.stats.conferencias,
      conferenciasCertas: this.stats.conferenciasCertas,
      jogadasExtras: this.stats.jogadasExtras,
      jogadas: this.stats.jogadas,
      venceuCorrida: vitoria,
    });
    this.irPara('resultado', { nivel: this.nivel, resultado });
  }

  /** O cão de guarda achou uma cadeia cortada: leva a partida a um ponto seguro, de onde ela parou. */
  _destravar() {
    if (this.fase === 'cpuEspera') this._rolar();
    else if (this.fase === 'rolando') this._dadoParou();
    else if (this.fase === 'andando' || this.fase === 'voltando') {
      // A ficha vai direto ao destino, e a partida segue dali.
      const { quem } = this.vez;
      const destino = this.fase === 'andando' ? this.vez.alvo : this.vez.inicio;
      this.pos[quem] = destino;
      this.placarNo.casas[quem] = destino;
      Tween.removerDe(this.fichas[quem]);
      this._colocar(quem, destino);
      this._passo();
    }
  }

  // ------------------------------------------------------------ pausa e ajuda

  pausar() {
    if (this._fimResolvido || this.pausada) return;
    Tween.pausarTodos();
    this.pausada = true;
    this.pausa.abrir();
  }

  /** Ajuda: o tutorial por cima da partida, sem perdê-la (RE-05). */
  pedirAjuda() {
    if (this._fimResolvido || this.pausada) return;
    Tween.pausarTodos();
    this.pausada = true;
    this.ajuda.abrir();
  }

  atualizar(dt) {
    if (this.pausada) {
      this.pausa.atualizar(dt);
      this.ajuda.atualizar(dt);
      return;
    }
    super.atualizar(dt);
    this.guarda.atualizar(dt);
  }

  aoSair() {
    Tween.removerTodos();
  }
}
