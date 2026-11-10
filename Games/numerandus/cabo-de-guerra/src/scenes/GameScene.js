import {
  Scene, Node, ScoreSystem, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, Watchdog,
} from '../../engine/index.js';
import {
  TIRA, montarTrilha, rolarDado, alvoDaPuxada, vencedorDaPartida, faltam, progressoDaCrianca,
  sortearCarta, respostaDoComputador, NOME_DO_TIPO,
} from '../regras.js';
import {
  CORES, FONTE, escrever, escreverParagrafo, quebrarLinhas, desenharTrilha, desenharNo, desenharDado,
  desenharContagem, desenharDedo, desenharOndaToque, desenharCartao,
} from '../desenho.js';

// ---------------------------------------------------------------------------
// Layout (1280 × 720). **A tira é a protagonista**: grande, no meio da tela, com o
// nó como o ponto mais brilhante. Embaixo, uma barra baixa e calma com o dado, de
// quem é a vez e o botão JOGAR O DADO. Quanto falta para cada um ganhar vem escrito
// embaixo da própria ponta (nada de quadros grandes). Com a carta aberta a tira
// sobe e encolhe (PALCO.carta) e continua à vista: a criança vê o nó se mexer.
// ---------------------------------------------------------------------------
/** Onde o palco (tira + nó) fica: o centro da tira e a escala, na partida e com a carta aberta. */
const PALCO = { jogo: { cy: 330, escala: 1 }, carta: { cy: 168, escala: 0.8 } };
const BARRA = { x: 170, y: 586, l: 940, a: 104 };
const DADO = { cx: 250, cy: 638, lado: 88 };
const FAIXA = { x: 330, y: 604, l: 400, a: 68 };
const BOTAO_DADO = { x: 770, y: 598, l: 310, a: 80 };
const CARTA = { x: 130, y: 250, l: 1020, a: 464 };
/** Dentro da carta (coordenadas da carta): onde fica cada coisa. */
const C = {
  tipo: 34, pergunta: 78, larguraTexto: 780,
  dado: { x: 922, y: 26, lado: 76 },
  opcoes: { y: 156, l: 270, a: 108, gap: 30 },
  diz: 188, conferir: { y: 240, l: 260, a: 80, gap: 40 },
  continuar: { y: 396, l: 300, a: 64 },
  /** O retorno: na vez da criança sobe para perto das respostas; no computador fica logo abaixo do "diz". */
  retornoPergunta: 312, retornoComputador: 290, continuarPergunta: 380,
};
/** Quanto falta para alguém ganhar, no singular e no plural: "FALTA 1", "FALTAM 7", "CHEGOU!". */
const textoFalta = (n) => (n <= 0 ? 'CHEGOU!' : n === 1 ? 'FALTA 1' : `FALTAM ${n}`);

/** Uma pergunta que é só uma conta ("3 × 6 = ?"): sem nenhuma letra. */
const soConta = (txt) => !/\p{L}/u.test(txt);

/**
 * Desenha uma conta em DESTAQUE, centrada em (cx, cy): números grandes e escuros, sinais (× + =) em
 * marrom mais suave e o "?" em azul. Encolhe só se não couber em `larguraMax`.
 */
function desenharConta(ctx, texto, cx, cy, tamMax, larguraMax, corResultado = null) {
  const partes = texto.split(' ');
  const fonte = (t) => `800 ${t}px ${FONTE}`;
  const medir = (t) => {
    ctx.font = fonte(t);
    const esp = t * 0.3;
    return partes.reduce((s, p) => s + ctx.measureText(p).width, 0) + esp * (partes.length - 1);
  };
  const tam = Math.min(tamMax, Math.floor((tamMax * larguraMax) / Math.max(1, medir(tamMax))));
  const esp = tam * 0.3;
  ctx.save();
  ctx.font = fonte(tam);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  let x = cx - medir(tam) / 2;
  for (const p of partes) {
    ctx.fillStyle = /\d/.test(p) ? (corResultado && p === partes[partes.length - 1] ? corResultado : CORES.tinta)
      : p === '?' ? '#2563EB' : CORES.cartaTipo;
    ctx.fillText(p, x, cy);
    x += ctx.measureText(p).width + esp;
  }
  ctx.restore();
}

const NOMES = { crianca: 'VOCÊ', computador: 'COMPUTADOR' };
const outro = (quem) => (quem === 'crianca' ? 'computador' : 'crianca');

// ---------------------------------------------------------------------------
// Nós de desenho
// ---------------------------------------------------------------------------

/**
 * A tira com as bolinhas e as duas pontas. Embaixo de cada ponta, discretos: o nome e quantas casas
 * faltam. A ponta de quem joga ganha um aro branco estável (a vez); a de quem ganhou acende.
 */
class Tira extends Node {
  constructor(trilha, lados, opcoes = {}) {
    super(opcoes);
    this.trilha = trilha;
    this.lados = lados;
    this.ganhou = null;
    this.vez = 'crianca';
    /** Os nomes embaixo da tira somem enquanto a carta está aberta (ela sobe até aí). */
    this.nomes = true;
  }

  desenhar(ctx) {
    desenharTrilha(ctx, TIRA, this.trilha, this.ganhou);
    const { xs, y, raio, ultimo } = this.trilha;
    const yb = TIRA.y + TIRA.a + 38;
    const faltas = this.lados;
    const par = [
      ['VOCÊ', 'crianca', TIRA.x + 14, 'left', xs[0]],
      ['COMPUTADOR', 'computador', TIRA.x + TIRA.l - 14, 'right', xs[ultimo]],
    ];
    for (const [nome, quem, x, alin, xPonta] of par) {
      const n = faltas[quem].falta;
      const daVez = this.vez === quem && !this.ganhou;
      const cor = quem === 'crianca' ? CORES.pontaC : CORES.pontaPTexto;
      if (daVez) {
        // A vez, bem à vista e estável (sem piscar): um aro escuro em volta da ponta e, quando a carta
        // não está aberta, o bloco de baixo vira uma etiqueta cheia da cor da ponta, com uma seta para ela.
        ctx.save();
        ctx.strokeStyle = '#102A6B';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(xPonta, y, raio * 1.25 + 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        if (this.nomes) {
          ctx.font = `800 28px ${FONTE}`;
          const w = Math.max(ctx.measureText(textoFalta(n)).width, ctx.measureText(nome).width * 22 / 28) + 40;
          const x0 = alin === 'left' ? x - 14 + 8 : x + 14 - 8 - w;
          const top = yb - 28;
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 4;
          ctx.fillStyle = cor;
          ctx.beginPath();
          ctx.roundRect(x0, top, w, 82, 20);
          ctx.fill();
          ctx.shadowColor = 'transparent';
          ctx.beginPath();
          ctx.moveTo(xPonta - 16, top + 1);
          ctx.lineTo(xPonta, top - 16);
          ctx.lineTo(xPonta + 16, top + 1);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          escrever(ctx, nome, x0 + w / 2, yb, 22, '#FFFFFF', 'center', 800);
          escrever(ctx, textoFalta(n), x0 + w / 2, yb + 30, 28, '#FFFFFF', 'center');
        }
      } else if (this.nomes) {
        // Branco (3,5:1 sobre o gramado): o cinza-esverdeado de antes dava 1,7:1.
        escrever(ctx, nome, x, yb, 24, '#FFFFFF', alin, 700);
        escrever(ctx, textoFalta(n), x, yb + 30, 28, '#FFFFFF', alin);
      }
    }
  }
}

/** O nó. `x`, `y` são o centro; `contagem` é o selo com as casas já puxadas. */
class No extends Node {
  constructor(raio, opcoes = {}) {
    super(opcoes);
    this.raio = raio;
    this.brilho = 0;
    this.contagem = 0;
    this.selo = 1;
  }

  desenhar(ctx) {
    desenharNo(ctx, 0, 0, this.raio, this.brilho);
    desenharContagem(ctx, 0, -this.raio - 34, this.contagem, this.selo);
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

/** A barra de ação de baixo: um painel discreto que reúne o dado, de quem é a vez e o botão. */
class BarraAcao extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes, largura: BARRA.l, altura: BARRA.a });
  }

  desenhar(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(0, 0, BARRA.l, BARRA.a, 28);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

/** De quem é a vez: uma bolinha da cor da ponta e o texto, sem faixa colorida. */
class FaixaVez extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes, largura: FAIXA.l, altura: FAIXA.a });
    this.quem = 'crianca';
  }

  desenhar(ctx) {
    ctx.save();
    const dela = this.quem === 'crianca';
    ctx.fillStyle = dela ? CORES.pontaC : CORES.pontaP;
    ctx.strokeStyle = dela ? CORES.pontaCBorda : CORES.pontaPBorda;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(24, FAIXA.a / 2, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    escrever(ctx, dela ? 'SUA VEZ' : 'VEZ DO COMPUTADOR', 58, FAIXA.a / 2, 30, CORES.tintaClara, 'left');
    ctx.restore();
  }
}

/** O botão JOGAR O DADO: azul mais calmo que o do motor; só aparece "aceso" na vez da criança. */
class BotaoDado extends Button {
  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const r = 24;
    const dy = this._pressionado ? 5 : 0;
    ctx.save();
    if (this.habilitado && !this._pressionado) {
      ctx.fillStyle = '#16346F';
      ctx.beginPath();
      ctx.roundRect(0, 6, l, a, r);
      ctx.fill();
    }
    ctx.fillStyle = this.habilitado ? '#2A57C2' : 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(0, dy, l, a, r);
    ctx.fill();
    const cor = this.habilitado ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
    escrever(ctx, 'JOGAR O DADO', l / 2, a / 2 + dy, 32, cor);
    ctx.restore();
  }
}

/** Uma resposta da carta: branca com borda de madeira; acende verde (a certa) ou laranja (a errada tocada). */
class BotaoOpcao extends Button {
  constructor(opcao, opcoes = {}) {
    super({ ...opcoes, rotulo: opcao.texto });
    this.opcao = opcao;
    /** 'certa' | 'errada' | null */
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
      escrever(ctx, texto, l / 2, a / 2 - 12 + dy, tam, CORES.tinta);
      escrever(ctx, this.opcao.sub, l / 2, a / 2 + 28 + dy, 24, '#6B7280', 'center', 700);
    } else {
      escrever(ctx, texto, l / 2, a / 2 + 2 + dy, tam, CORES.tinta);
    }
    ctx.restore();
  }
}

/**
 * A carta aberta por baixo da tira: o tipo, o dado do lance, a pergunta e, embaixo, ou as três
 * respostas (a vez da criança) ou a resposta do computador com CERTO / ERRADO (a criança confere).
 * Depois de responder, o retorno (a conta certa e o que acontece com o nó) e o CONTINUAR. Cobre a tela
 * inteira para segurar os toques, mas escurece só a parte de baixo: a tira, o nó e os botões de pausa
 * e ajuda continuam à vista.
 */
class PainelCarta extends Node {
  constructor(cena, opcoes = {}) {
    super({ ...opcoes, largura: cena.largura, altura: cena.altura, interativo: true });
    this.cena = cena;
    this.carta = null;
    this.dado = 0;
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
  abrirPergunta(carta, dado, aoResponder) {
    this._limpar();
    this.carta = carta;
    this.dado = dado;
    const { l, a, gap } = C.opcoes;
    // A conta grande ocupa mais altura: as respostas descem um pouco para a conta respirar.
    const y = C.opcoes.y + (soConta(carta.pergunta) ? 16 : 0);
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
  abrirComputador(carta, dado, opcao, aoConferir) {
    this._limpar();
    this.carta = carta;
    this.dado = dado;
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
    // Conferido o computador, CERTO/ERRADO saem de cena: o retorno ocupa o lugar deles e respira
    // como na vez da criança (o texto já diz se ela conferiu bem).
    if (this.diz) for (const b of this.botoes) b.visible = false;
    this.retorno = { bom, titulo, detalhe, k: 0 };
    Tween.para(this.retorno, { k: 1 }, 250, Easing.suaveSaida);
    // Com a conta grande no retorno (vez da criança), o CONTINUAR desce um pouco para o texto respirar.
    const { y, l, a } = { ...C.continuar, y: C.continuarPergunta + (!this.diz && soConta(titulo) ? 10 : 0) };
    this._botao(new Button({
      // Texto escuro no verde (6,5:1), como o PRONTO do Subtraindo o Dominó: o branco dá 2,3:1.
      rotulo: 'CONTINUAR', variante: 'sucesso', corTexto: '#052E16', x: CARTA.x + (CARTA.l - l) / 2, y: CARTA.y + y, largura: l, altura: a,
      tamanhoTexto: 32, audio: this.cena.audio, aoTocar: () => aoContinuar(),
    }));
  }

  _mostrar() {
    this.cena.tira.nomes = false;
    this.cena.moverPalco('carta');
    this.visible = true;
    this.alpha = 0;
    Tween.removerDe(this);
    Tween.para(this, { alpha: 1 }, 220, Easing.suaveSaida);
  }

  fechar() {
    this.cena.tira.nomes = true;
    this.cena.moverPalco('jogo');
    this._limpar();
    this.carta = null;
    this.visible = false;
  }

  desenhar(ctx) {
    if (!this.carta) return;
    ctx.save();
    // Escurece só o que fica abaixo da tira: o nó e a trilha continuam à vista.
    ctx.fillStyle = 'rgba(14, 70, 48, 0.4)';
    ctx.fillRect(0, CARTA.y - 8, this.largura, this.altura);
    ctx.translate(CARTA.x, CARTA.y);
    desenharCartao(ctx, CARTA.l, CARTA.a);
    const nome = NOME_DO_TIPO[this.carta.tipo];
    escrever(ctx, `${nome} · PUXA ${this.dado} ${this.dado === 1 ? 'CASA' : 'CASAS'}`, 40, C.tipo, 24, CORES.cartaTipo, 'left', 800);
    ctx.save();
    ctx.translate(C.dado.x, C.dado.y);
    desenharDado(ctx, C.dado.lado, this.dado);
    ctx.restore();
    if (soConta(this.carta.pergunta)) desenharConta(ctx, this.carta.pergunta, CARTA.l / 2 - 40, 96, 80, C.larguraTexto);
    else escreverParagrafo(ctx, this.carta.pergunta, CARTA.l / 2 - 40, C.pergunta, C.larguraTexto, 36, CORES.tinta, 1.18);
    if (this.diz) {
      const texto = this.diz.sub ? `${this.diz.texto} ${this.diz.sub}` : this.diz.texto;
      ctx.font = `800 30px ${FONTE}`;
      const w1 = ctx.measureText('O COMPUTADOR DIZ:').width;
      ctx.font = `800 40px ${FONTE}`;
      const w2 = ctx.measureText(texto).width + 36;
      const x0 = (CARTA.l - (w1 + 18 + w2)) / 2;
      escrever(ctx, 'O COMPUTADOR DIZ:', x0, C.diz, 30, CORES.tinta, 'left');
      ctx.fillStyle = CORES.pontaP;
      ctx.beginPath();
      ctx.roundRect(x0 + w1 + 18, C.diz - 30, w2, 60, 14);
      ctx.fill();
      escrever(ctx, texto, x0 + w1 + 18 + w2 / 2, C.diz + 2, 40, CORES.tinta);
    }
    if (this.retorno) {
      const r = this.retorno;
      const yr = this.diz ? C.retornoComputador : C.retornoPergunta + (soConta(r.titulo) ? 14 : 0);
      ctx.globalAlpha *= r.k;
      if (soConta(r.titulo)) {
        // A conta certa, quando é só uma conta ("3 × 6 = 18"), também em destaque.
        desenharConta(ctx, r.titulo, CARTA.l / 2, yr - 2, 50, CARTA.l - 80, CORES.okTexto);
        escreverParagrafo(ctx, r.detalhe, CARTA.l / 2, yr + 40, CARTA.l - 80, 24, CORES.tinta, 1.15, 700);
      } else {
        const nl = escreverParagrafo(ctx, r.titulo, CARTA.l / 2, yr - 4, CARTA.l - 80, 30, r.bom ? CORES.okTexto : CORES.erroTexto, 1.15);
        escreverParagrafo(ctx, r.detalhe, CARTA.l / 2, yr + 34 + (nl - 1) * 35, CARTA.l - 80, 24, CORES.tinta, 1.15, 700);
      }
    }
    ctx.restore();
  }
}

/** O dedinho branco da coleção mostrando o gesto da vez, sem frase: aponta o botão JOGAR O DADO. */
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
 * GameScene — a partida do Cabo de Guerra.
 *
 * Fases (`this.fase`):
 *   'dado'       a vez da criança, esperando o toque no dado (o dedinho aponta o botão)
 *   'cpuEspera'  a vez do computador, antes de ele jogar o dado
 *   'rolando'    o dado rolando
 *   'carta'      a criança escolhe a resposta da carta
 *   'conferir'   o computador respondeu; a criança confere com CERTO / ERRADO
 *   'retorno'    a carta mostra a conta e o que acontece; espera o CONTINUAR (no ritmo da criança)
 *   'puxando'    acertou: o nó anda casa a casa para a ponta de quem acertou, contando
 *   'chegou'     o nó chegou a uma ponta: vence na hora, sem carta, e vai ao resultado
 *
 * **As regras do vídeo** (docs/REGRAS-CABO-DE-GUERRA.md §4): joga o dado, tira a carta; acertou, o
 * nó anda tantas casas quanto o dado para a ponta de quem acertou; errou, o nó fica e a vez passa
 * (o vídeo não mostra o erro: decisão do plano). Vence quem leva o nó à própria ponta, na hora e
 * sem carta (passar da ponta vale). O computador joga do mesmo jeito, erra de propósito 1 vez em 4
 * (`regras.computadorErra`) e a criança confere. Nenhuma carta repete na partida.
 *
 * **A nota** (`_terminar`): meta = os passos do nível; vitória = meta − cartas erradas, derrota = as
 * casas que a criança puxou do centro (RE-02, a conta do próprio `ScoreSystem`). Conferir mal não conta
 * como erro.
 *
 * Todo o tempo passa por Tween (nenhum setTimeout): pausa e ajuda congelam tudo.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.regras = { rolarMs: 900, passoMs: 320, cpuEsperaMs: 900, computadorErra: 0.25, falaMaxMs: 2000, ...config.regras };
    /** A fala do número do passo ainda tocando (o nó e o fim da jogada esperam por ela). */
    this._falaPendente = false;
    this._idFala = 0;
    this.passos = this.nivel.passos ?? 5;
    this.trilha = montarTrilha(this.passos);

    this.placar = new ScoreSystem({ total: this.passos, nivel: this.nivel.id ?? 1, vidas: 0 });
    /** A posição do nó: 0 é a ponta da criança, `passos` o centro, `2 × passos` a ponta do computador. */
    this.pos = this.passos;
    /** O mais perto da ponta dela que a criança chegou (0 a passos − 1): é a nota de uma derrota. */
    this.melhor = 0;
    this.fase = 'dado';
    this.vez = null;
    this.usadas = [];
    this.stats = { respondidas: 0, certas: 0, porGrupo: {}, conferencias: 0, conferenciasCertas: 0, maiorPuxada: 0, jogadas: 0 };
    /** Ganchos de teste: o próximo dado (de qualquer um) e se o computador erra a próxima carta (`null` = sorteio). */
    this.dadoDeTeste = null;
    this.computadorErraDeTeste = null;
    this._fimResolvido = false;

    this.adicionar(new Background({
      largura: L, altura: A, tema: config.tema ?? 'cabo', mostrarDecoracoes: false, mostrarChao: false, campoJogo: true,
      // Com a carta aberta, o escurecimento atrás dela continua pelas barras do letterbox (janela mais
      // larga que 16:9); sem isto ele termina em bordas retas e deixa uma faixa clara dos lados.
      desenharNaSangria: (ctx) => {
        const p = this.painel;
        if (!p || !p.visible || !p.carta) return;
        ctx.save();
        ctx.globalAlpha *= p.alpha;
        ctx.fillStyle = 'rgba(14, 70, 48, 0.4)';
        ctx.fillRect(-4000, CARTA.y - 8, 9300, 4000);
        ctx.restore();
      },
    }));

    /** Quantas casas faltam para cada um (a tira escreve embaixo das pontas). */
    this.ladoC = { falta: this.passos };
    this.ladoP = { falta: this.passos };
    // O palco leva a tira e o nó juntos: sobem e encolhem quando a carta abre.
    this.palco = new Node({ x: L / 2, y: PALCO.jogo.cy });
    this.palco.regX = L / 2;
    this.palco.regY = this.trilha.y;
    this.tira = new Tira(this.trilha, { crianca: this.ladoC, computador: this.ladoP });
    this.no = new No(this.trilha.noRaio, { x: this.trilha.xs[this.pos], y: this.trilha.y });
    this.palco.adicionar(this.tira, this.no);
    this.adicionar(this.palco);

    // ------------------------------------------------------- parte de baixo
    this.adicionar(new BarraAcao({ x: BARRA.x, y: BARRA.y }));
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
    this._atualizarLados();

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
    // O dado rolando e o nó andando são cadeias de tweens no `relogio`. Se uma exceção engolida cortar
    // a cadeia, a partida não pode ficar presa: o cão de guarda leva a um ponto seguro.
    this.relogio = new Node();
    this.adicionar(this.relogio);
    this.guarda = new Watchdog({
      nome: 'jogada do cabo de guerra',
      ocupado: () => ['cpuEspera', 'rolando', 'puxando', 'chegou'].includes(this.fase) && !this.pausada && !this._fimResolvido,
      vivo: () => Tween.temAtivo(this.relogio) || Tween.temAtivo(this.no),
      graca: 0.6,
      limite: 14,
      aoTravar: () => this._destravar(),
    });

    this._comecarVez('crianca');
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
   * no meio do silêncio, sem sentido para a criança (visto pelo humano na Corrida Maluca, 03/11/2026).
   * Então a frase fica muda e o console diz o que falta; quando as gravações chegarem, ela volta sozinha.
   */
  _falarPedacos(pedacos, interromper = false) {
    if (interromper) this.audio?.calar();
    const ids = pedacos.map((p) => (p.numero != null ? `numero${p.numero}` : p.id));
    const faltamIds = ids.filter((id) => !this.audio?.temSom(id));
    if (faltamIds.length) {
      const frase = pedacos.map((p) => (p.numero != null ? String(p.numero) : p.texto)).join(' ');
      this._avisadas ??= new Set();
      if (this._avisadas.has(frase)) return;
      this._avisadas.add(frase);
      console.warn(`[cabo-de-guerra] frase sem gravação completa (faltam: ${faltamIds.join(', ')}); fica em silêncio: "${frase}"`);
      return;
    }
    pedacos.forEach((p, i) => this.audio?.falar(ids[i], { texto: p.numero != null ? String(p.numero) : p.texto }));
  }

  _efeito(chave) {
    const id = this.config.audio?.[chave];
    if (id) this.audio?.efeito(id);
  }

  // ----------------------------------------------------------------------- nó

  _colocarNo(pos) {
    this.no.x = this.trilha.xs[pos];
    this.no.y = this.trilha.y;
  }

  /** Leva o palco (tira + nó) para a posição do jogo ou da carta aberta, suave. */
  moverPalco(onde) {
    const alvo = PALCO[onde];
    Tween.removerDe(this.palco);
    Tween.para(this.palco, { y: alvo.cy, scaleX: alvo.escala, scaleY: alvo.escala }, 320, Easing.suaveSaida);
  }

  _atualizarLados() {
    this.ladoC.falta = faltam(this.pos, 'crianca', this.passos);
    this.ladoP.falta = faltam(this.pos, 'computador', this.passos);
  }

  // ---------------------------------------------------------------------- vez

  /** Começa a vez de `quem`: a faixa muda e, se é da criança, o dedinho aponta o dado. */
  _comecarVez(quem) {
    if (this._fimResolvido) return;
    this.vez = { quem, dado: null, alvo: null, carta: null, certo: null, passos: 0 };
    this.faixa.quem = quem;
    this.tira.vez = quem;
    Tween.removerDe(this.no);
    this._colocarNo(this.pos);
    this.no.contagem = 0;
    this.dado.face = 0;
    this.dado.rolando = false;

    if (quem === 'crianca') {
      this.fase = 'dado';
      this.dado.convida = true;
      this.botaoDado.definirHabilitado(true);
      this.botaoDado.pulse = true;
      const b = this.botaoDado;
      // `x`, `y` do Button são o CENTRO; a ponta do dedo cai logo dentro da borda de cima.
      this.dica.mostrar({ x: b.x + b.largura * 0.3, y: b.y - b.altura / 2 + 22 });
      this._falar('suaVez', 'Sua vez!', true);
    } else {
      this.fase = 'cpuEspera';
      this.dado.convida = false;
      this._desligarBotaoDado();
      this.dica.esconder();
      this._falar('vezDoComputador', 'Vez do computador!', true);
      Tween.de(this.relogio).esperar(this.regras.cpuEsperaMs).chamar(() => this._rolar());
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
    this.stats.jogadas += this.vez.quem === 'crianca' ? 1 : 0;
    this.vez.alvo = alvoDaPuxada(this.pos, this.vez.quem, this.vez.dado, this.passos);
    Tween.de(this.relogio).esperar(450).chamar(() => this._abrirCarta());
  }

  // -------------------------------------------------------------------- carta

  _abrirCarta() {
    if (this.fase !== 'rolando') return;
    const { carta, usadas } = sortearCarta(this.nivel.cartas, this.usadas);
    this.usadas = usadas;
    this.vez.carta = carta;
    if (this.vez.quem === 'crianca') {
      this.fase = 'carta';
      this.painel.abrirPergunta(carta, this.vez.dado, (op, b) => this._responder(op, b));
      this._falarPedacos(carta.fala, true);
    } else {
      this._abrirCartaComputador();
    }
  }

  /** O que acontece com o nó, dito em palavras, para o retorno da carta. */
  _frasePuxada(quem) {
    const d = Math.abs(this.pos - this.vez.alvo) || this.vez.dado;
    const casas = `${d} ${d === 1 ? 'CASA' : 'CASAS'}`;
    return quem === 'crianca' ? `A FICHA VEM ${casas} PARA VOCÊ!` : `A FICHA VAI ${casas} PARA O COMPUTADOR.`;
  }

  /** A criança tocou uma resposta: confere, mostra a conta e o que acontece com o nó. */
  _responder(op, botao) {
    if (this.pausada || this.fase !== 'carta') return;
    const { carta } = this.vez;
    const certo = op.valor === carta.certa;
    this.vez.certo = certo;
    this.fase = 'retorno';
    const grupo = (this.stats.porGrupo[carta.grupo] ??= { certas: 0, respondidas: 0 });
    grupo.respondidas += 1;
    this.stats.respondidas += 1;
    for (const b of this.painel.botoes) if (b.opcao?.valor === carta.certa) b.marca = 'certa';
    if (certo) {
      this.stats.certas += 1;
      grupo.certas += 1;
      this._efeito('acerto');
      this._falar('muitoBem', 'Muito bem!', true);
      this.painel.mostrarRetorno(true, 'ACERTOU!', this._frasePuxada('crianca'), () => this._continuar());
    } else {
      botao.marca = 'errada';
      this.placar.errar();
      this._efeito('erro');
      this._falar('quaseLa', 'Quase! Veja a conta certa.', true);
      this.painel.mostrarRetorno(false, carta.conta, 'A FICHA FICA PARADA.', () => this._continuar());
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
    this.painel.abrirComputador(carta, this.vez.dado, resposta.opcao, (valor, b) => this._conferir(valor, b));
    const pedacos = [...carta.fala, { id: 'oComputadorDiz', texto: 'O computador diz:' }];
    if (typeof resposta.opcao.valor === 'number') pedacos.push({ numero: resposta.opcao.valor });
    else pedacos.push({ id: `resposta_${String(resposta.opcao.valor).toLowerCase()}`, texto: resposta.opcao.texto.toLowerCase() });
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
    const destino = resposta.certo ? this._frasePuxada('computador') : 'A FICHA FICA PARADA.';
    this.painel.mostrarRetorno(conferiuBem, titulo, `${carta.conta}. ${destino}`, () => this._continuar());
  }

  /** CONTINUAR: o nó anda (acertou) ou a vez passa (errou). */
  _continuar() {
    if (this.pausada || this.fase !== 'retorno') return;
    this.painel.fechar();
    if (!this.vez.certo) {
      this._passarAVez();
      return;
    }
    if (this.vez.quem === 'crianca') {
      this.stats.maiorPuxada = Math.max(this.stats.maiorPuxada, Math.abs(this.pos - this.vez.alvo));
    }
    this.fase = 'puxando';
    this.no.brilho = 1;
    Tween.de(this.relogio).esperar(250).chamar(() => this._passo());
  }

  // --------------------------------------------------------------------- puxar

  /**
   * Um passo do nó, rumo à ponta de quem acertou, contando em voz alta ("um", "dois"…) e mostrando o
   * número sobre ele. Chegando ao alvo, se ele está numa ponta quem puxou vence na hora, sem carta
   * (`_chegou`); senão a vez passa.
   */
  _passo() {
    if (this.fase !== 'puxando') return;
    const { quem, alvo } = this.vez;
    if (this.pos === alvo) {
      this.no.contagem = 0;
      this.no.brilho = 0;
      if (vencedorDaPartida(this.pos, this.passos)) { this._chegou(); return; }
      Tween.de(this.relogio).esperar(450).chamar(() => this._passarAVez());
      return;
    }
    this.pos += quem === 'crianca' ? -1 : 1;
    this._registrarProgresso();
    this._atualizarLados();
    Tween.removerDe(this.no);
    Tween.para(this.no, { x: this.trilha.xs[this.pos] }, this.regras.passoMs * 0.8, Easing.suave);
    this.vez.passos += 1;
    this.no.contagem = this.vez.passos;
    this.no.selo = 0.6;
    Tween.para(this.no, { selo: 1 }, 220, Easing.costasSaida);
    this._falarPasso(this.vez.passos);
    Tween.de(this.relogio).esperar(this.regras.passoMs * 0.8).chamar(() => this._efeito('pouso'))
      .esperar(this.regras.passoMs * 0.5).chamar(() => this._depoisDaFala(() => this._passo()));
  }

  /**
   * Fala o número do passo e marca a fala como pendente até ela acabar: o nó anda no ritmo da voz e o
   * fim da jogada só vem depois do último número (a lição da Corrida Maluca, 03/11/2026).
   */
  _falarPasso(n) {
    const id = ++this._idFala;
    this._falaPendente = true;
    Promise.resolve(this.audio?.falar(`numero${n}`, { texto: String(n) }))
      .finally(() => { if (this._idFala === id) this._falaPendente = false; });
  }

  /**
   * Chama `fn` quando a fala do passo acabar. Espera em sondagens de 80 ms no `relogio` (a pausa
   * congela a espera e o `Watchdog` vê a jogada viva), com um teto (`regras.falaMaxMs`) para um áudio
   * que nunca avise o fim não prender a partida. Sem a gravação, o `falar` resolve na hora.
   */
  _depoisDaFala(fn, esperou = 0) {
    if (!this._falaPendente || esperou >= this.regras.falaMaxMs) { fn(); return; }
    Tween.de(this.relogio).esperar(80).chamar(() => this._depoisDaFala(fn, esperou + 80));
  }

  /**
   * O nó chegou a uma ponta: **vence na hora, sem carta**, quem o puxou. A ponta acende, uma pausa
   * curta e vai ao resultado.
   */
  _chegou() {
    if (this.fase !== 'puxando') return;
    this.fase = 'chegou';
    this.tira.ganhou = this.vez.quem;
    this.no.brilho = 1;
    Tween.de(this.relogio).esperar(900).chamar(() => this._terminar(this.vez.quem));
  }

  /** Guarda o mais perto da ponta da criança que o nó já esteve (o computador puxar de volta não apaga). */
  _registrarProgresso() {
    this.melhor = Math.max(this.melhor, progressoDaCrianca(this.pos, this.passos));
  }

  _passarAVez() {
    this._comecarVez(outro(this.vez.quem));
  }

  // ---------------------------------------------------------------------- fim

  /**
   * Vai ao resultado. A nota é a do `ScoreSystem` (RE-02): na vitória o nó chegou (acertos = meta) e
   * ele desconta as cartas erradas; na derrota vale o que a criança puxou do centro. Não passa
   * `estrelas`: a tela deriva a fileira (RE-04).
   */
  _terminar(vencedor) {
    if (this._fimResolvido) return;
    this._fimResolvido = true;
    const vitoria = vencedor === 'crianca';
    // Vitória: o nó chegou (passos). Derrota: o melhor ponto a que a criança chegou, nunca a posição final
    // (o computador só vence com o nó na ponta DELE, e dali a conta daria sempre 0).
    const progresso = vitoria ? this.passos : Math.min(this.melhor, this.passos - 1);
    this.placar.acertos = vitoria ? this.passos : progresso;
    const porTipo = {};
    for (const [g, v] of Object.entries(this.stats.porGrupo)) porTipo[g] = `${v.certas}/${v.respondidas}`;
    const resultado = this.placar.paraAva(vitoria, {
      casasPuxadas: progresso,
      cartasRespondidas: this.stats.respondidas,
      cartasCertas: this.stats.certas,
      cartasPorTipo: porTipo,
      conferencias: this.stats.conferencias,
      conferenciasCertas: this.stats.conferenciasCertas,
      maiorPuxada: this.stats.maiorPuxada,
      jogadas: this.stats.jogadas,
      venceuCabo: vitoria,
    });
    this.irPara('resultado', { nivel: this.nivel, resultado });
  }

  /** O cão de guarda achou uma cadeia cortada: leva a partida a um ponto seguro, de onde ela parou. */
  _destravar() {
    if (this.fase === 'chegou') this._terminar(this.vez.quem);
    else if (this.fase === 'cpuEspera') this._rolar();
    else if (this.fase === 'rolando') {
      if (this.vez.dado != null && this.dado.rolando) this._dadoParou();
      else this._abrirCarta();
    } else if (this.fase === 'puxando') {
      // O nó vai direto ao alvo, e a partida segue dali.
      this.pos = this.vez.alvo;
      this._registrarProgresso();
      this._atualizarLados();
      Tween.removerDe(this.relogio); // a cadeia de passos antiga não pode seguir em paralelo
      Tween.removerDe(this.no);
      this._colocarNo(this.pos);
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
