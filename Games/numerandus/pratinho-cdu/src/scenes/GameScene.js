import {
  Scene, Node, ScoreSystem, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, Watchdog,
} from '../../engine/index.js';
import {
  CASAS, VALOR, sortearJogada, opcoesFacil, casasErradas, quemFormouMaior, sinalEntre,
} from '../regras.js';
import {
  CORES, escrever, desenharPrato, desenharGrao, desenharZero, fatiaNoPonto, GRAO_RX,
  desenharEstrelaRodada, desenharIconeQuem, desenharVisto, desenharIconeCerto, desenharIconeJogar,
  desenharIconeDesfazer, alturaRolinho,
  desenharDedo, desenharOndaToque, desenharSinalComparacao,
} from '../desenho.js';

// ---------------------------------------------------------------------------
// Layout (1280 × 720), o mesmo do protótipo aprovado (artifact "Pratinho CDU",
// 19/10/2026): o prato à esquerda; à direita um CARTÃO com a ação da vez e,
// embaixo dele, o quadro das rodadas deitado. As 5 estrelas da partida ficam
// no canto de cima, como no Caminho das Cores.
// ---------------------------------------------------------------------------
const PRATO_X = 340;
const PRATO_Y = 396;
/** Raio das fatias. No Difícil o prato encolhe para caberem os grãos que caem fora. */
const PRATO_R = 236;
const PRATO_R_COM_FORA = 196;

const CARTAO = { x: 640, y: 118, l: 600, a: 430 };
const CARTAO_CX = CARTAO.x + CARTAO.l / 2;
const QUADRO = { x: 640, y: 566, l: 600, a: 132 };

/** Coluna de ação à direita do cartão (PRONTO e DESFAZER). */
const COLUNA_X = 1082;
const COLUNA_L = 140;

const ROLINHO_L = 100;
const ROLINHO_GAP = 26;
const ROLINHO_Y = 226;
/** Área livre à esquerda da coluna de ação (rolinhos, opções, comparação). */
const AREA_X = 660;
const AREA_L = COLUNA_X - 16 - AREA_X;

/**
 * A linha da comparação: [número da criança] ? [número do computador] [PRONTO],
 * tudo no MESMO eixo, centrada no cartão na horizontal e no espaço abaixo da
 * pergunta na vertical (o PRONTO sai da coluna dos rolinhos para entrar na linha).
 */
const COMPARAR = { y: 372, lado: 136, altura: 132, meio: 50, ate_pronto: 30 };
const PRONTO_Y = 232;

const TOTAL_RODADAS = 5;


/** Fala pelo id definitivo; sem a gravação, o motor fica mudo e avisa o texto no console. */
const NUMEROS = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
const NOME_CASA = { c: 'centena', d: 'dezena', u: 'unidade' };

// ---------------------------------------------------------------------------
// Nós de desenho
// ---------------------------------------------------------------------------

/**
 * O prato com os grãos. A contagem é tocar no PRÓPRIO grão (pedido do humano,
 * 20/10/2026): ele fica marcado com o halo, e um toque de novo desmarca. O grão
 * desenhado tem ~30 px, então o alvo de toque é um círculo de pelo menos 64 px
 * em volta dele (`graoNoPonto`); onde dois alvos se sobrepõem, vale o grão mais
 * perto do dedo.
 */
class Prato extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes, interativo: true });
    this.R = PRATO_R;
    this.ativas = CASAS;
    this.acesas = [];
    this.piscando = null;
    /** Grãos em px relativos ao centro, com o estado de animação de cada um. */
    this.graos = [];
    this.fora = [];
    /** Animação do "0" por casa: { c: 0..1 }. */
    this.zeros = {};
  }

  contemPontoLocal(x, y) {
    return Math.hypot(x, y) <= this.R * 1.1;
  }

  /** Põe a jogada no prato; os grãos começam no alto, para cair. */
  carregar(jogada) {
    this.graos = jogada.graos.map((g) => ({
      casa: g.casa, k: g.k, x: g.x * this.R, y: g.y * this.R, giro: g.giro,
      queda: 0, halo: 0, onda: 0, marcado: false,
    }));
    this.fora = jogada.fora.map((g) => ({ x: g.x * this.R, y: g.y * this.R, giro: g.giro, queda: 0 }));
    this.zeros = {};
    this.acesas = [];
  }

  esvaziar() {
    for (const g of [...this.graos, ...this.fora]) Tween.removerDe(g);
    this.graos = [];
    this.fora = [];
    this.zeros = {};
    this.acesas = [];
  }

  grao(casa, k) {
    return this.graos.find((g) => g.casa === casa && g.k === k);
  }

  /** O grão mais perto do ponto (local, em px), se estiver a até `raio` dele. */
  graoNoPonto(x, y, raio) {
    let melhor = null;
    let dist = raio;
    for (const g of this.graos) {
      const d = Math.hypot(g.x - x, g.y - y);
      if (d <= dist) { dist = d; melhor = g; }
    }
    return melhor;
  }

  desenhar(ctx) {
    desenharPrato(ctx, 0, 0, this.R, { ativas: this.ativas, acesas: this.acesas, piscando: this.piscando });
    const rx = GRAO_RX * this.R;
    for (const g of this.fora) {
      if (g.queda <= 0) continue;
      ctx.save();
      ctx.globalAlpha = Math.min(1, g.queda * 2);
      desenharGrao(ctx, g.x, g.y - (1 - g.queda) * 260, rx, g.giro, { fora: true });
      ctx.restore();
    }
    for (const g of this.graos) {
      if (g.queda <= 0) continue;
      ctx.save();
      ctx.globalAlpha = Math.min(1, g.queda * 2);
      desenharGrao(ctx, g.x, g.y - (1 - g.queda) * 260, rx, g.giro, { halo: g.halo, onda: g.onda });
      ctx.restore();
    }
    for (const [casa, d] of Object.entries(this.zeros)) desenharZero(ctx, casa, 0, 0, this.R, d);
  }
}

/** As 5 estrelas da partida, no canto de cima: uma por rodada, na cor de quem ganhou. */
class TrilhaEstrelas extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    /** 'vazia' | 'v' | 'c' | 'e' por rodada. */
    this.estados = new Array(TOTAL_RODADAS).fill('vazia');
    this.atual = 0;
    this.escalas = new Array(TOTAL_RODADAS).fill(1);
  }

  desenhar(ctx) {
    for (let i = 0; i < TOTAL_RODADAS; i++) {
      const e = this.escalas[i];
      ctx.save();
      ctx.translate(i * 62, 0);
      ctx.scale(e, e);
      desenharEstrelaRodada(ctx, 0, 0, 24, this.estados[i], this.estados[i] === 'vazia' && i === this.atual);
      ctx.restore();
    }
  }
}

/**
 * O fundo do cartão de ação, com o ícone de quem joga no canto. Guarda os dois
 * retornos do cartão inteiro: o anel verde do acerto e o âmbar do erro (este
 * acompanhado de um balanço do cartão, feito pela cena).
 */
class CartaoFundo extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.vez = 'v';
    this.verde = 0;
    this.ambar = 0;
    /** Nome escrito ao lado do ícone (VOCÊ / COMPUTADOR) — `nomes` do nível, ligado no Fácil. */
    this.nomes = false;
  }

  desenhar(ctx) {
    const { l, a } = CARTAO;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, 26);
    ctx.fillStyle = CORES.cartao;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = CORES.cartaoBorda;
    ctx.stroke();
    for (const [valor, cor] of [[this.verde, CORES.ok], [this.ambar, CORES.ambar]]) {
      if (valor <= 0) continue;
      ctx.globalAlpha = valor;
      ctx.lineWidth = 7;
      ctx.strokeStyle = cor;
      ctx.beginPath();
      ctx.roundRect(-4, -4, l + 8, a + 8, 30);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // Ícone de quem joga: pessoa azul (criança) ou computador âmbar.
    const cor = this.vez === 'c' ? CORES.computador : CORES.crianca;
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.arc(40, 40, 28, 0, Math.PI * 2);
    ctx.fill();
    desenharIconeQuem(ctx, this.vez, 40, 41, 34, CORES.cartao);
    if (this.nomes) escrever(ctx, this.vez === 'c' ? 'COMPUTADOR' : 'VOCÊ', 80, 42, 26, cor, 'left');
    ctx.restore();
  }
}

/**
 * A conta da casa (200 + 30 + 5 = 235), só números e cores, e o visto do acerto.
 * Os números são o conteúdo da tela nesta hora, então vêm grandes: as parcelas
 * em pílulas nas cores das fatias e o resultado numa caixa contornada na cor de
 * quem formou o número (`quem`: azul a criança, âmbar o computador).
 */
const FONTE_CONTA = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

class Conta extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.qt = null;
    this.casas = CASAS;
    this.quem = 'v';
    this.pulo = 1;
    this.visto = 0;
  }

  desenhar(ctx) {
    if (!this.qt) return;
    // 46 é o maior que cabe "900 + 90 + 9 = 999" no cartão com ~40 px de margem.
    const tam = 46;
    const tamResultado = Math.round(tam * 1.3);
    const partes = [];
    this.casas.forEach((casa, i) => {
      if (i > 0) partes.push({ texto: '+' });
      partes.push({ texto: String(this.qt[casa] * VALOR[casa]), casa });
    });
    partes.push({ texto: '=' });
    partes.push({ texto: String(this.casas.reduce((s, c) => s + this.qt[c] * VALOR[c], 0)), resultado: true });

    const larguras = partes.map((p) => {
      ctx.font = `800 ${p.resultado ? tamResultado : tam}px ${FONTE_CONTA}`;
      const w = ctx.measureText(p.texto).width;
      if (p.casa) return w + 24;
      if (p.resultado) return w + 30;
      return w;
    });
    const gap = 10;
    const total = larguras.reduce((s, w) => s + w, 0) + gap * (partes.length - 1);
    let x = -total / 2;
    partes.forEach((p, i) => {
      const w = larguras[i];
      const cx = x + w / 2;
      if (p.casa) {
        ctx.fillStyle = CORES[`${p.casa}Escuro`];
        ctx.beginPath();
        ctx.roundRect(x, -tam * 0.74 + 5, w, tam * 1.48, 14);
        ctx.fill();
        ctx.fillStyle = CORES[p.casa];
        ctx.beginPath();
        ctx.roundRect(x, -tam * 0.74, w, tam * 1.48, 14);
        ctx.fill();
        // Branco sobre o laranja da U dá só 2,64:1 (abaixo dos 3:1 do texto grande, WCAG AA):
        // na pílula da unidade o número vai em tinta escura (≈ 7:1). Verde e vermelho passam com branco.
        escrever(ctx, p.texto, cx, 2, tam, p.casa === 'u' ? '#1B212B' : '#FFFFFF');
      } else if (p.resultado) {
        const cor = this.quem === 'c' ? CORES.computador : CORES.crianca;
        const a = tamResultado * 1.42;
        ctx.save();
        ctx.translate(cx, 0);
        ctx.scale(this.pulo, this.pulo);
        ctx.beginPath();
        ctx.roundRect(-w / 2, -a / 2, w, a, 18);
        ctx.fillStyle = '#1B212B';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = cor;
        ctx.stroke();
        escrever(ctx, p.texto, 0, 3, tamResultado, cor);
        ctx.restore();
      } else {
        escrever(ctx, p.texto, cx, 2, tam, CORES.tintaSuave);
      }
      x += w + gap;
    });
    if (this.visto > 0) desenharVisto(ctx, 0, 128, 50, this.visto);
  }
}

/** Botão de seta de um rolinho: a cor da casa e um triângulo branco. */
class BotaoSeta extends Button {
  constructor(opcoes = {}) {
    super({ ...opcoes, rotulo: '', icone: null });
    this.casa = opcoes.casa;
    this.sobe = opcoes.sobe;
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    ctx.save();
    if (!this._pressionado) {
      ctx.fillStyle = CORES[`${this.casa}Escuro`];
      ctx.beginPath();
      ctx.roundRect(0, 5, l, a, 16);
      ctx.fill();
    }
    ctx.fillStyle = CORES[this.casa];
    ctx.beginPath();
    ctx.roundRect(0, this._pressionado ? 4 : 0, l, a, 16);
    ctx.fill();
    const cy = a / 2 + (this._pressionado ? 4 : 0);
    const s = 13;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    if (this.sobe) {
      ctx.moveTo(l / 2, cy - s); ctx.lineTo(l / 2 + s * 1.2, cy + s * 0.75); ctx.lineTo(l / 2 - s * 1.2, cy + s * 0.75);
    } else {
      ctx.moveTo(l / 2, cy + s); ctx.lineTo(l / 2 + s * 1.2, cy - s * 0.75); ctx.lineTo(l / 2 - s * 1.2, cy - s * 0.75);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Um rolinho de algarismo: ▲, a janela com o número, ▼ e a letra da casa.
 * Para no 0 e no 9 (a seta do limite apaga) em vez de dar a volta: um toque a
 * mais não vira um número longe.
 */
class Rolinho extends Node {
  constructor(casa, opcoes = {}) {
    super(opcoes);
    this.casa = casa;
    this.valor = 0;
    this.acesa = false;
    this.livre = false;
    const alturaSeta = Math.round(ROLINHO_L * 0.62);
    this.janelaY = alturaSeta + 8;
    this.subir = new BotaoSeta({
      casa, sobe: true, x: 0, y: 0, largura: ROLINHO_L, altura: alturaSeta,
      aoTocar: () => opcoes.aoMudar?.(casa, +1),
    });
    this.descer = new BotaoSeta({
      casa, sobe: false, x: 0, y: this.janelaY + ROLINHO_L + 8, largura: ROLINHO_L, altura: alturaSeta,
      aoTocar: () => opcoes.aoMudar?.(casa, -1),
    });
    this.adicionar(this.subir, this.descer);
    this.travar(true);
  }

  definir(valor) {
    this.valor = valor;
    this._atualizarSetas();
  }

  /** `true`: só mostra (vez do computador, ajuda); `false`: a criança mexe. */
  travar(travado) {
    this.livre = !travado;
    this._atualizarSetas();
  }

  _atualizarSetas() {
    this.subir.definirHabilitado(this.livre && this.valor < 9);
    this.descer.definirHabilitado(this.livre && this.valor > 0);
  }

  desenhar(ctx) {
    const y = this.janelaY;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, y, ROLINHO_L, ROLINHO_L, 18);
    ctx.fillStyle = '#1B212B';
    ctx.fill();
    ctx.lineWidth = this.acesa ? 6 : 4;
    ctx.strokeStyle = this.acesa ? CORES.ambar : CORES[this.casa];
    ctx.stroke();
    escrever(ctx, String(this.valor), ROLINHO_L / 2, y + ROLINHO_L / 2 + 2, 58, CORES.tinta);
    escrever(ctx, this.casa.toUpperCase(), ROLINHO_L / 2, alturaRolinho(ROLINHO_L) - 10, 24, CORES[this.casa]);
    ctx.restore();
  }
}

/** Uma das três opções do Fácil: tocar MARCA (dá para trocar); quem confere é o PRONTO. */
class BotaoNumero extends Button {
  constructor(opcoes = {}) {
    super({ ...opcoes, rotulo: '', icone: null });
    this.numero = opcoes.numero;
    /** 'v' | 'c' | null: com dono, desenha o ícone de quem formou o número. */
    this.quem = opcoes.quem ?? null;
    this.marcado = false;
    this.errado = false;
    /** Comparação resolvida: 0..1 do contorno do número MAIOR (a resposta certa); o outro fica `perdeu`. */
    this.vencedor = 0;
    this.perdeu = false;
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const corDono = this.quem === 'c' ? CORES.computador : CORES.crianca;
    ctx.save();
    if (this.errado) ctx.globalAlpha = 0.3;
    else if (this.perdeu) ctx.globalAlpha = 0.35;
    if (!this._pressionado) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.roundRect(0, 6, l, a, 22);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.roundRect(0, this._pressionado ? 4 : 0, l, a, 22);
    ctx.fillStyle = this.marcado ? corDono : '#1B212B';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = corDono;
    ctx.stroke();
    const dy = this._pressionado ? 4 : 0;
    const corTexto = this.marcado ? '#1B212B' : CORES.tinta;
    if (this.quem) {
      escrever(ctx, String(this.numero), l / 2, a * 0.42 + dy, 46, corTexto);
      desenharIconeQuem(ctx, this.quem, l / 2, a * 0.8 + dy, 30, this.marcado ? '#1B212B' : corDono);
    } else {
      escrever(ctx, String(this.numero), l / 2, a / 2 + dy, 50, corTexto);
    }
    // O número maior (a resposta certa): contorno dourado. A estrela da rodada NÃO fica aqui:
    // ela é de quem fez a rodada limpa, e o maior número pode ser o de qualquer um dos dois.
    if (this.vencedor > 0) {
      ctx.globalAlpha *= Math.min(1, this.vencedor);
      ctx.lineWidth = 7;
      ctx.strokeStyle = CORES.estrela;
      ctx.beginPath();
      ctx.roundRect(-2, -2 + dy, l + 4, a + 4, 24);
      ctx.stroke();
    }
    ctx.restore();
  }
}

/**
 * O sinal entre os dois números: "?" enquanto a criança decide, depois >, < ou =.
 * Enquanto ela decide, a estrela da rodada flutua em cima do "?" (`premio`): a
 * estrela está em jogo e vai para um dos dois lados.
 */
class Sinal extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.texto = '?';
    this.certo = false;
    this.pulo = 1;
    this.premio = false;
    this.t = 0;
    /** 'simbolo' (>, <, =) ou 'jacare' (boca aberta para o maior): `config.sinalComparacao`. */
    this.estilo = opcoes.estilo ?? 'simbolo';
  }

  atualizar(dt) {
    super.atualizar(dt);
    this.t += dt;
  }

  desenhar(ctx) {
    if (this.premio && !this.certo) {
      // Balanço suave e lento (nada pisca): só para a estrela parecer "no ar".
      const y = -76 + Math.sin(this.t * 2.2) * 4;
      desenharEstrelaRodada(ctx, 0, y, 26, 'v');
    }
    ctx.save();
    ctx.scale(this.pulo, this.pulo);
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    if (this.certo) {
      ctx.fillStyle = CORES.ok;
      ctx.fill();
    } else {
      ctx.setLineDash([7, 6]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = CORES.tintaSuave;
      ctx.stroke();
    }
    if (this.certo) desenharSinalComparacao(ctx, this.texto, 0, 0, 40, this.estilo);
    else escrever(ctx, this.texto, 0, 2, 46, CORES.tintaSuave);
    ctx.restore();
  }
}

/**
 * A pergunta da vez, no alto do cartão ("QUAL NÚMERO É O MAIOR?"). Só a
 * comparação tem pergunta escrita (pedido do humano, 20/10/2026): é a única
 * tarefa que não se explica pelo gesto. Já em caixa alta (RE-01).
 *
 * `destaque` é a palavra-chave da pergunta (MAIOR): vem em âmbar.
 */
class Pergunta extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.texto = '';
    this.destaque = '';
  }

  desenhar(ctx) {
    if (!this.texto) return;
    const tam = 30;
    const fim = `${this.destaque}?`;
    ctx.font = `800 ${tam}px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
    const w1 = ctx.measureText(this.texto).width;
    const w2 = ctx.measureText(fim).width;
    const x0 = -(w1 + w2) / 2;
    escrever(ctx, this.texto, x0, 0, tam, CORES.tinta, 'left');
    escrever(ctx, fim, x0 + w1, 0, tam, CORES.ambar, 'left');
  }
}

/**
 * O dedinho branco da coleção mostrando o gesto da vez, sem frase: vai de um
 * alvo ao outro e toca em cada um, em laço. Na comparação aponta os DOIS
 * números (não entrega a resposta); com um marcado, aponta o PRONTO.
 */
class DicaDedo extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.alvos = [];
    this.t = 0;
    this.visible = false;
  }

  mostrar(alvos) {
    this.alvos = alvos;
    this.t = 0;
    this.visible = alvos.length > 0;
  }

  esconder() {
    this.visible = false;
    this.alvos = [];
  }

  atualizar(dt) {
    super.atualizar(dt);
    if (this.visible) this.t += dt;
  }

  desenhar(ctx) {
    const n = this.alvos.length;
    if (!n) return;
    const PASSO = 1.4;
    const tc = this.t % (PASSO * n);
    const i = Math.floor(tc / PASSO);
    const f = (tc % PASSO) / PASSO;
    const de = this.alvos[(i - 1 + n) % n];
    const ate = this.alvos[i];
    const ida = n === 1 ? 1 : Math.min(1, f / 0.45);
    const k = ida * ida * (3 - 2 * ida);
    const x = de.x + (ate.x - de.x) * k;
    const y = de.y + (ate.y - de.y) * k;
    const tocando = f > 0.55 && f < 0.72;
    desenharOndaToque(ctx, ate.x, ate.y, 40, (f - 0.55) / 0.4);
    desenharDedo(ctx, x, y + (tocando ? 6 : 0), 62, Math.min(1, this.t / 0.4));
  }
}

/** Botão grande do cartão (JOGAR / seguir): glifo em cima, rótulo embaixo. */
class BotaoGrande extends Button {
  constructor(opcoes = {}) {
    super({ ...opcoes, icone: null });
    this.glifo = opcoes.glifo ?? 'jogar';
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const r = 24;
    ctx.save();
    if (this.habilitado && !this._pressionado) {
      ctx.fillStyle = this.corBorda;
      ctx.beginPath();
      ctx.roundRect(0, 8, l, a, r);
      ctx.fill();
    }
    const dy = this._pressionado ? 5 : 0;
    ctx.fillStyle = this.cor;
    ctx.beginPath();
    ctx.roundRect(0, dy, l, a, r);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(4, 3 + dy, l - 8, a * 0.42, [r - 2, r - 2, 4, 4]);
    ctx.fill();
    const lado = Math.min(a * 0.38, 54);
    const yIcone = (this.rotulo ? a * 0.38 : a / 2) + dy;
    if (this.glifo === 'jogar') desenharIconeJogar(ctx, l / 2, yIcone, lado * 1.1);
    else if (this.glifo === 'pronto') desenharIconeCerto(ctx, l / 2, yIcone, lado);
    else desenharIconeDesfazer(ctx, l / 2, yIcone, lado * 0.9);
    if (this.rotulo) escrever(ctx, this.rotulo, l / 2, a * 0.78 + dy, Math.min(26, a * 0.2), '#FFFFFF');
    ctx.restore();
  }
}

/** O quadro das rodadas, deitado como a folha do caderno: colunas = rodadas. */
class Quadro extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.linhas = [];
    this.atual = 0;
  }

  desenhar(ctx) {
    const { l, a } = QUADRO;
    const col0 = 110;
    const colL = (l - col0) / TOTAL_RODADAS;
    const cab = 36;
    const linhaA = (a - cab) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, 18);
    ctx.fillStyle = CORES.cartao;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = CORES.cartaoBorda;
    ctx.stroke();
    ctx.clip();
    // A coluna da rodada de agora fica destacada.
    if (this.atual >= 0 && this.atual < TOTAL_RODADAS) {
      ctx.fillStyle = 'rgba(125, 162, 255, 0.14)';
      ctx.fillRect(col0 + this.atual * colL, 0, colL, a);
    }
    for (let i = 0; i < TOTAL_RODADAS; i++) {
      escrever(ctx, `${i + 1}ª`, col0 + (i + 0.5) * colL, cab / 2 + 2, 18, CORES.tintaSuave, 'center', 700);
    }
    ctx.strokeStyle = CORES.cartaoBorda;
    ctx.lineWidth = 1.5;
    for (const y of [cab, cab + linhaA]) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(l, y);
      ctx.stroke();
    }
    ['v', 'c'].forEach((quem, linha) => {
      const cy = cab + linhaA * (linha + 0.5);
      desenharIconeQuem(ctx, quem, col0 / 2, cy, 34);
      for (let i = 0; i < TOTAL_RODADAS; i++) {
        const dado = this.linhas[i] ?? {};
        const v = dado[quem];
        const cx = col0 + (i + 0.5) * colL;
        if (v == null) {
          escrever(ctx, '–', cx, cy, 22, CORES.tintaSuave);
          continue;
        }
        // Só os números: a estrela da rodada é de quem fez a rodada limpa, não do maior número,
        // e já aparece na trilha de cima. Uma segunda estrela aqui, ao lado do número, dava
        // dois "vencedores" por rodada.
        escrever(ctx, String(v), cx, cy + 1, 26, CORES.tinta);
      }
    });
    ctx.restore();
  }
}

/**
 * GameScene — a partida do Pratinho CDU.
 *
 * Fases (`this.fase`):
 *   'jogar'      cartão com o JOGAR, esperando a criança
 *   'caindo'     os grãos caindo no prato
 *   'responder'  a criança conta (toque no grão marca/desmarca) e forma o número; PRONTO confere
 *   'ajudando'   o jogo conta uma fatia junto com ela (ajuda do 4º erro)
 *   'acertou'    comemorando a leitura certa, antes da vez do computador
 *   'cpu'        o computador joga, conta e forma o número dele
 *   'comparar'   a criança marca o maior número e confirma no PRONTO
 *   'fimRodada'  a estrela da rodada acendendo; depois da 5ª, vai direto ao resultado
 *
 * **Nada vale antes do PRONTO.** Contar, girar rolinho e marcar opção são
 * livres e voltam com DESFAZER, um passo por toque; só o PRONTO errado conta
 * como erro (RE-02).
 *
 * **Retorno sem frase na tela** (pedido do humano, 20/10/2026): acerto, erro e
 * ajuda são cor, símbolo, movimento e som. As frases existem só como fala
 * (ids definitivos, mudos até a gravação chegar).
 *
 * **Como termina** (`_desfecho`): a estrela de cada rodada é de quem fez a rodada limpa
 * (a criança, se leu e comparou sem PRONTO errado; senão o computador, que nunca erra).
 * Mais estrelas que o computador vence; menos é derrota — a tela "QUASE LÁ!" da série. A
 * nota (`_notaDaPartida`) é 5 estrelas na vitória e, na derrota, as rodadas limpas. O
 * payload é montado no fim (`_terminar`): `erros` cru e `acertos` = a nota
 * (docs/REGRAS-PRATINHO-CDU.md §6).
 *
 * Todo o tempo passa por Tween (nenhum setTimeout): pausa e ajuda congelam a
 * vez do computador junto.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.casas = this.nivel.casas ?? CASAS;
    this.porOpcoes = this.nivel.resposta === 'opcoes';
    this.regras = {
      errosParaAcender: 2, errosParaContarJunto: 4, passoAjudaMs: 420, passoCpuMs: 260, pausaRodadaMs: 1700,
      ...config.regras,
    };

    this.placar = new ScoreSystem({ total: TOTAL_RODADAS, nivel: this.nivel.id ?? 1, vidas: 0 });
    this.fase = 'jogar';
    this.rodada = 0;
    this.linhas = [];
    this.estrelas = { v: 0, c: 0 };
    this.jogada = null;
    this.contagem = { c: 0, d: 0, u: 0 };
    this.digitos = { c: 0, d: 0, u: 0 };
    this.historico = [];
    this.escolha = null;
    this.errosRodada = 0;
    this.usouAjuda = false;
    this.leiturasDePrimeira = 0;
    this.errosLeitura = 0;
    this.errosComparacao = 0;
    /** A rodada de agora já teve uma falha descontada da nota? (no máximo uma por rodada) */
    this.falhaNaRodada = false;
    /** Quantas rodadas tiveram pelo menos uma falha (0 a 5). */
    this.rodadasComFalha = 0;
    this.rodadasComAjuda = 0;
    this._fimResolvido = false;

    this.adicionar(new Background({
      largura: L, altura: A, tema: config.tema ?? 'mesa', mostrarDecoracoes: false, mostrarChao: false,
    }));

    // ------------------------------------------------------------------ prato
    this.prato = new Prato({ x: PRATO_X, y: PRATO_Y });
    this.prato.ativas = this.casas;
    if ((this.nivel.fora?.[1] ?? 0) > 0) this.prato.R = PRATO_R_COM_FORA;
    this.prato.on('toque', (p) => this._tocarPrato(p.x, p.y));
    this.adicionar(this.prato);

    this.trilha = new TrilhaEstrelas({ x: 56, y: 60 });
    this.adicionar(this.trilha);

    // ----------------------------------------------------------------- cartão
    // Tudo o que é do cartão mora num grupo: o balanço do erro mexe nele inteiro.
    this.cartao = new Node({ x: 0, y: 0 });
    this.fundoCartao = new CartaoFundo({ x: CARTAO.x, y: CARTAO.y });
    this.cartao.adicionar(this.fundoCartao);

    this.conta = new Conta({ x: CARTAO_CX, y: 290 });
    this.cartao.adicionar(this.conta);

    const aoMudar = (casa, passo) => this._mudarDigito(casa, passo);
    this.rolinhos = {};
    const larguraRolinhos = this.casas.length * ROLINHO_L + (this.casas.length - 1) * ROLINHO_GAP;
    const x0 = AREA_X + (AREA_L - larguraRolinhos) / 2;
    this.casas.forEach((casa, i) => {
      const r = new Rolinho(casa, { x: x0 + i * (ROLINHO_L + ROLINHO_GAP), y: ROLINHO_Y, aoMudar });
      r.visible = false;
      this.rolinhos[casa] = r;
      this.cartao.adicionar(r);
    });

    /** Opções do Fácil e os dois números da comparação: recriados a cada uso. */
    this.grupoEscolha = new Node();
    this.cartao.adicionar(this.grupoEscolha);
    this.sinal = new Sinal({ x: AREA_X + AREA_L / 2, y: 354, estilo: config.sinalComparacao });
    this.sinal.visible = false;
    this.cartao.adicionar(this.sinal);
    // Centrada no cartão, um pouco à direita para não encostar no ícone de quem joga.
    this.pergunta = new Pergunta({ x: CARTAO_CX, y: CARTAO.y + 42 });
    // Com o nome escrito ao lado do ícone, a pergunta desce para a linha de baixo
    // (na mesma linha, "VOCÊ" e a pergunta se encostariam).
    this.fundoCartao.nomes = !!this.nivel.nomes;
    if (this.fundoCartao.nomes) this.pergunta.y = CARTAO.y + 100;
    this.cartao.adicionar(this.pergunta);

    const clique = config.audio?.clique;
    this.botaoGrande = new BotaoGrande({
      rotulo: 'JOGAR', glifo: 'jogar', largura: 280, altura: 150, x: CARTAO_CX - 140, y: 252,
      cor: '#3B6FE0', corBorda: '#22449A', audio: this.audio, somToque: clique,
      aoTocar: () => this._tocouBotaoGrande(),
    });
    this.botaoPronto = new BotaoGrande({
      rotulo: 'PRONTO', glifo: 'pronto', largura: COLUNA_L, altura: 150, x: COLUNA_X, y: PRONTO_Y,
      variante: 'sucesso', audio: this.audio, somToque: clique,
      aoTocar: () => this._pronto(),
    });
    this.botaoDesfazer = new BotaoGrande({
      rotulo: 'DESFAZER', glifo: 'desfazer', largura: COLUNA_L, altura: 112, x: COLUNA_X, y: 404,
      cor: '#4B5567', corBorda: '#2B3341', audio: this.audio, somToque: clique,
      aoTocar: () => this._desfazer(),
    });
    this.cartao.adicionar(this.botaoGrande, this.botaoPronto, this.botaoDesfazer);

    // Por cima de tudo do cartão; não é alvo de toque (o dedo passa o toque adiante).
    this.dica = new DicaDedo();
    this.cartao.adicionar(this.dica);
    this.adicionar(this.cartao);

    this.quadro = new Quadro({ x: QUADRO.x, y: QUADRO.y });
    this.quadro.linhas = this.linhas;
    this.adicionar(this.quadro);

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
    // A queda dos grãos e a vez do computador são cadeias de tweens. Se uma
    // exceção engolida cortar a cadeia, a partida não pode ficar presa.
    this.guarda = new Watchdog({
      nome: 'vez do computador',
      ocupado: () => ['caindo', 'cpu', 'acertou', 'fimRodada', 'ajudando'].includes(this.fase) && !this.pausada && !this._fimResolvido,
      vivo: () => Tween.temAtivo(this) || Tween.temAtivo(this.prato) || Tween.temAtivo(this.cartao),
      graca: 0.6,
      limite: 14,
      aoTravar: () => this._destravar(),
    });

    this._novaRodada();
  }

  // ----------------------------------------------------------------- narração

  _falar(id, texto, interromper = false) {
    if (interromper) this.audio?.calar();
    this.audio?.falar(id, { texto });
  }

  _efeito(chave) {
    const id = this.config.audio?.[chave];
    if (id) this.audio?.efeito(id);
  }

  // ------------------------------------------------------------------ rodadas

  _novaRodada() {
    this.rodada += 1;
    this.falhaNaRodada = false;
    this.fase = 'jogar';
    this.jogada = null;
    this.prato.esvaziar();
    this.trilha.atual = this.rodada - 1;
    this.quadro.atual = this.rodada - 1;
    this._limparCartao();
    this.fundoCartao.vez = 'v';
    this._mostrarBotaoGrande('JOGAR', 'jogar', 252);
    this._falar('suaVez', 'Sua vez!', true);
  }

  /** Esconde tudo o que fica dentro do cartão (menos o fundo). */
  _limparCartao() {
    // Sem isto, o visto de uma animação ainda em curso reaparece na próxima conta.
    Tween.removerDe(this.conta);
    // O anel verde (acerto) e o âmbar (erro) do cartão também: cancelar a animação de um deles
    // (`_comemorar` e `_sinalizarErro` chamam `Tween.removerDe`) deixava o outro aceso para
    // sempre, e o cartão do fim aparecia com a moldura âmbar de um erro antigo.
    Tween.removerDe(this.fundoCartao);
    this.fundoCartao.verde = 0;
    this.fundoCartao.ambar = 0;
    this.conta.pulo = 1;
    this.conta.qt = null;
    this.conta.visto = 0;
    for (const r of Object.values(this.rolinhos)) { r.visible = false; r.acesa = false; r.travar(true); }
    this.grupoEscolha.removerTodos();
    this.sinal.visible = false;
    this.sinal.premio = false;
    this.pergunta.texto = '';
    this.dica.esconder();
    this.botaoGrande.visible = false;
    this.botaoPronto.visible = false;
    this.botaoDesfazer.visible = false;
  }

  _mostrarBotaoGrande(rotulo, glifo, y) {
    const b = this.botaoGrande;
    b.rotulo = rotulo;
    b.glifo = glifo;
    b.y = y + b.altura / 2;
    b.visible = true;
    b.definirHabilitado(true);
    b.pulse = true;
  }

  _tocouBotaoGrande() {
    if (this.pausada) return;
    if (this.fase === 'jogar') this._jogarGraos('v');
  }

  /** Os grãos caem no prato. Depois, `aoCair()`. */
  _jogarGraos(quem, aoCair) {
    this.fase = quem === 'v' ? 'caindo' : 'cpu';
    this.botaoGrande.visible = false;
    this.botaoGrande.pulse = false;
    this.jogada = sortearJogada(this.nivel);
    this.prato.carregar(this.jogada);
    this.contagem = { c: 0, d: 0, u: 0 };
    this._mostrarRolinhosTravados();
    this._efeito('pouso');
    const todos = [...this.prato.graos, ...this.prato.fora].sort(() => Math.random() - 0.5);
    todos.forEach((g, i) => {
      Tween.de(g).esperar(i * 55).entao({ queda: 1 }, 460, Easing.costasSaida);
    });
    Tween.de(this.prato).esperar(todos.length * 55 + 620).chamar(() => {
      if (quem === 'v') this._liberarResposta();
      else aoCair?.();
    });
  }

  /**
   * Os rolinhos aparecem já na queda dos grãos, travados no 0: o cartão não
   * fica vazio esperando, e a criança já vê onde vai responder.
   */
  _mostrarRolinhosTravados() {
    if (this.porOpcoes) {
      // No Fácil, as três opções da jogada da criança: já sorteadas, só não tocáveis ainda.
      if (this.fase === 'caindo') {
        this._montarOpcoes();
        for (const b of this.grupoEscolha.filhos) b.definirHabilitado(false);
      }
      return;
    }
    for (const casa of this.casas) {
      const r = this.rolinhos[casa];
      r.visible = true;
      r.acesa = false;
      r.definir(0);
      r.travar(true);
    }
  }

  // ------------------------------------------------------------ vez da criança

  _liberarResposta() {
    this.fase = 'responder';
    this.errosRodada = 0;
    this.usouAjuda = false;
    this.historico = [];
    this.escolha = null;
    this.digitos = { c: 0, d: 0, u: 0 };
    if (this.porOpcoes) {
      if (!this.grupoEscolha.filhos.length) this._montarOpcoes();
      for (const b of this.grupoEscolha.filhos) b.definirHabilitado(true);
    } else {
      for (const casa of this.casas) {
        const r = this.rolinhos[casa];
        r.visible = true;
        r.acesa = false;
        r.definir(0);
        r.travar(false);
      }
    }
    this._posicionarPronto(COLUNA_X, PRONTO_Y);
    this.botaoPronto.visible = true;
    this.botaoDesfazer.visible = true;
    this._atualizarBotoes();
  }

  /** Põe o PRONTO com o canto de cima-esquerdo em (x, y); o `Button` guarda o centro. */
  _posicionarPronto(x, y) {
    const b = this.botaoPronto;
    b.x = x + b.largura / 2;
    b.y = y + b.altura / 2;
  }

  _montarOpcoes() {
    this.grupoEscolha.removerTodos();
    const opcoes = opcoesFacil(this.jogada.qt);
    const lado = 116;
    const gap = 20;
    const total = opcoes.length * lado + (opcoes.length - 1) * gap;
    const x0 = AREA_X + (AREA_L - total) / 2;
    opcoes.forEach((numero, i) => {
      const b = new BotaoNumero({
        numero, x: x0 + i * (lado + gap), y: 300, largura: lado, altura: lado,
        audio: this.audio, somToque: this.config.audio?.clique,
        aoTocar: () => this._marcarOpcao(numero),
      });
      this.grupoEscolha.adicionar(b);
    });
  }

  _atualizarBotoes() {
    const respondendo = this.fase === 'responder';
    const comparando = this.fase === 'comparar';
    const podeConfirmar = (respondendo && (!this.porOpcoes || this.escolha != null))
      || (comparando && this.escolha != null);
    this.botaoPronto.definirHabilitado(podeConfirmar);
    this.botaoPronto.pulse = podeConfirmar;
    if (!podeConfirmar) { this.botaoPronto.scaleX = 1; this.botaoPronto.scaleY = 1; }
    this.botaoDesfazer.definirHabilitado(respondendo && this.historico.length > 0);
  }

  /**
   * Toque no prato (px da tela). No grão: marca ou desmarca aquele grão. Numa
   * fatia sem grão nenhum: o "0" grande. No vazio de uma fatia com grãos: ela
   * pisca, sem contar nada.
   */
  _tocarPrato(px, py) {
    if (this.pausada || this.fase !== 'responder') return;
    const R = this.prato.R;
    const g = this.prato.graoNoPonto(px - PRATO_X, py - PRATO_Y, Math.max(32, R * 0.14));
    if (g && this.casas.includes(g.casa)) {
      this._alternarGrao(g);
      return;
    }
    const casa = fatiaNoPonto(px, py, PRATO_X, PRATO_Y, R);
    if (!casa || !this.casas.includes(casa)) return;
    if (this.jogada.qt[casa] === 0) {
      this._mostrarZero(casa);
      this._falar('nenhumGraoZero', 'Nenhum grão. Essa casa vale zero.', true);
    } else {
      this._piscar(casa);
    }
  }

  _alternarGrao(g) {
    const marcar = !g.marcado;
    if (marcar) this._acenderGrao(g.casa, g.k);
    else this._apagarGrao(g.casa, g.k);
    this.historico.push({ tipo: 'grao', casa: g.casa, k: g.k, marcou: marcar });
    if (marcar) this._falar(`numero${this.contagem[g.casa]}`, NUMEROS[this.contagem[g.casa]], true);
    this._atualizarBotoes();
  }

  /** Marca o grão (halo + onda + som) e soma na contagem da casa. */
  /**
   * Um PRONTO errado (leitura ou comparação). Para a NOTA, a falha é por RODADA: só a
   * primeira de cada rodada conta em `rodadasComFalha` — a criança que precisou de várias
   * tentativas na mesma conta não perde mais por isso. A nota é montada em `_terminar`
   * (ver `_notaDaPartida`); o campo `erros` do AVA segue a contagem crua (RE-02), a partir
   * de `errosLeitura` + `errosComparacao`.
   */
  _registrarFalha() {
    if (this.falhaNaRodada) return;
    this.falhaNaRodada = true;
    this.rodadasComFalha += 1;
  }

  _acenderGrao(casa, k) {
    const g = this.prato.grao(casa, k);
    if (!g || g.marcado) return;
    g.marcado = true;
    this.contagem[casa] += 1;
    Tween.removerDe(g);
    g.queda = 1;
    g.halo = 0;
    g.onda = 0.001;
    Tween.para(g, { halo: 1 }, 320, Easing.costasSaida);
    Tween.para(g, { onda: 1 }, 600, Easing.suaveSaida);
    this._efeito('conta');
  }

  _apagarGrao(casa, k) {
    const g = this.prato.grao(casa, k);
    if (!g || !g.marcado) return;
    g.marcado = false;
    this.contagem[casa] -= 1;
    Tween.removerDe(g);
    g.queda = 1;
    g.halo = 0;
    g.onda = 0;
  }

  _mostrarZero(casa) {
    const alvo = this.prato.zeros;
    alvo[casa] = 0.001;
    const animado = { d: 0.001 };
    Tween.para(animado, { d: 0.999 }, 1100, Easing.linear).emCadaQuadro(() => { alvo[casa] = animado.d; })
      .chamar(() => { delete alvo[casa]; });
    this._efeito('conta');
  }

  _piscar(casa) {
    this.prato.piscando = casa;
    Tween.de(this.prato.zeros).esperar(200).chamar(() => { if (this.prato.piscando === casa) this.prato.piscando = null; });
  }

  _mudarDigito(casa, passo) {
    if (this.pausada || this.fase !== 'responder') return;
    const novo = this.digitos[casa] + passo;
    if (novo < 0 || novo > 9) return;
    this.historico.push({ tipo: 'rolo', casa, antes: this.digitos[casa] });
    this.digitos[casa] = novo;
    const r = this.rolinhos[casa];
    r.acesa = false;
    r.definir(novo);
    this._atualizarBotoes();
  }

  _marcarOpcao(numero) {
    if (this.pausada || this.fase !== 'responder' || this.escolha === numero) return;
    this.historico.push({ tipo: 'escolha', antes: this.escolha });
    this._definirEscolha(numero);
  }

  _definirEscolha(numero) {
    this.escolha = numero;
    for (const b of this.grupoEscolha.filhos) b.marcado = b.numero === numero;
    this._atualizarBotoes();
  }

  _desfazer() {
    if (this.pausada || this.fase !== 'responder') return;
    const h = this.historico.pop();
    if (!h) return;
    if (h.tipo === 'grao') {
      if (h.marcou) this._apagarGrao(h.casa, h.k);
      else this._acenderGrao(h.casa, h.k);
    } else if (h.tipo === 'rolo') {
      this.digitos[h.casa] = h.antes;
      this.rolinhos[h.casa].definir(h.antes);
    } else {
      this._definirEscolha(h.antes);
    }
    this._atualizarBotoes();
  }

  _pronto() {
    if (this.pausada) return;
    if (this.fase === 'responder') {
      if (this.porOpcoes) this._conferirOpcao();
      else this._conferirRolinhos();
    } else if (this.fase === 'comparar') {
      this._conferirComparacao();
    }
  }

  _conferirOpcao() {
    if (this.escolha == null) return;
    if (this.escolha === this.jogada.valor) { this._acertouLeitura(); return; }
    const b = this.grupoEscolha.filhos.find((o) => o.numero === this.escolha);
    if (b) { b.errado = true; b.marcado = false; b.definirHabilitado(false); b.alpha = 1; }
    this.historico = this.historico.filter((h) => h.tipo !== 'escolha');
    this.escolha = null;
    this._errouLeitura(this.casas);
  }

  _conferirRolinhos() {
    const erradas = casasErradas(this.digitos, this.jogada.qt, this.casas);
    if (!erradas.length) { this._acertouLeitura(); return; }
    this._errouLeitura(erradas);
  }

  /**
   * PRONTO errado: o cartão balança com o anel âmbar e o som de erro. Depois,
   * em degraus: no 2º erro da rodada as casas erradas acendem (fatia e
   * rolinho); no 4º, o jogo conta essas fatias junto com a criança. No Fácil
   * não há rolinho para acender: o 2º erro já conta junto.
   */
  _errouLeitura(erradas) {
    this._registrarFalha();
    this.errosLeitura += 1;
    this.errosRodada += 1;
    this._sinalizarErro();
    const { errosParaAcender, errosParaContarJunto } = this.regras;
    if (this.porOpcoes) {
      if (this.errosRodada >= errosParaAcender) { this._contarJunto(this.casas); return; }
      this._falar('tenteDeNovo', 'Tente de novo!', true);
      this._atualizarBotoes();
      return;
    }
    if (this.errosRodada >= errosParaContarJunto) {
      this._acender(erradas);
      this._contarJunto(erradas);
      return;
    }
    if (this.errosRodada >= errosParaAcender) {
      this._acender(erradas);
      this._falar('confiraACasaAcesa', 'Confira a casa acesa.', true);
    } else {
      this._falar('tenteDeNovo', 'Tente de novo!', true);
    }
    this._atualizarBotoes();
  }

  _acender(casas) {
    this.usouAjuda = true;
    this.prato.acesas = [...casas];
    for (const casa of this.casas) this.rolinhos[casa].acesa = casas.includes(casa);
  }

  _sinalizarErro() {
    this._efeito('erro');
    const f = this.fundoCartao;
    Tween.removerDe(f);
    f.ambar = 1;
    Tween.para(f, { ambar: 0 }, 700, Easing.suave);
    Tween.removerDe(this.cartao);
    this.cartao.x = 0;
    Tween.de(this.cartao)
      .entao({ x: -12 }, 60, Easing.suave)
      .entao({ x: 12 }, 90, Easing.suave)
      .entao({ x: -7 }, 80, Easing.suave)
      .entao({ x: 0 }, 70, Easing.suave);
  }

  /** O jogo conta as fatias `casas` junto, grão por grão, a partir do zero. */
  _contarJunto(casas) {
    this.usouAjuda = true;
    this.fase = 'ajudando';
    this.historico = this.historico.filter((h) => !(h.tipo === 'grao' && casas.includes(h.casa)));
    this.prato.acesas = [...casas];
    for (const r of Object.values(this.rolinhos)) r.travar(true);
    for (const b of this.grupoEscolha.filhos) b.interativo = false;
    this._atualizarBotoes();
    this._falar('vamosContarJuntos', 'Vamos contar juntos.', true);

    const cadeia = Tween.de(this.prato).esperar(700);
    for (const casa of casas) {
      cadeia.chamar(() => {
        for (const g of this.prato.graos) if (g.casa === casa) this._apagarGrao(casa, g.k);
      }).esperar(250);
      const n = this.jogada.qt[casa];
      if (n === 0) {
        cadeia.chamar(() => {
          this._mostrarZero(casa);
          this._falar('nenhumGraoZero', 'Nenhum grão. Essa casa vale zero.', true);
        }).esperar(1200);
        continue;
      }
      for (let k = 0; k < n; k++) {
        cadeia.chamar(() => {
          this._acenderGrao(casa, k);
          this._falar(`numero${k + 1}`, NUMEROS[k + 1], true);
        }).esperar(this.regras.passoAjudaMs);
      }
      cadeia.esperar(500);
    }
    cadeia.chamar(() => {
      this.prato.acesas = [];
      this.fase = 'responder';
      if (!this.porOpcoes) for (const casa of this.casas) this.rolinhos[casa].travar(false);
      for (const b of this.grupoEscolha.filhos) if (!b.errado) b.interativo = true;
      this._atualizarBotoes();
    });
  }

  _acertouLeitura() {
    this.fase = 'acertou';
    if (this.errosRodada === 0) this.leiturasDePrimeira += 1;
    if (this.usouAjuda) this.rodadasComAjuda += 1;
    this.numeroCrianca = this.jogada.valor;
    this.linhas[this.rodada - 1] = { v: this.numeroCrianca };
    this.prato.acesas = [];

    this._limparCartao();
    this.conta.casas = this.casas;
    this.conta.qt = this.jogada.qt;
    this.conta.y = 290;
    this.conta.quem = 'v';
    this._comemorar();
    this.conta.visto = 0.01;
    Tween.para(this.conta, { visto: 1 }, 420, Easing.costasSaida);
    this._falar('muitoBem', 'Muito bem!', true);

    Tween.de(this.cartao).esperar(this.regras.pausaRodadaMs).chamar(() => this._vezDoComputador());
  }

  /** Acerto: anel verde no cartão, o resultado da conta dá um pulo e o som de progresso. */
  _comemorar() {
    this._efeito('acerto');
    const f = this.fundoCartao;
    Tween.removerDe(f);
    f.verde = 1;
    Tween.de(f).esperar(700).entao({ verde: 0 }, 600, Easing.suave);
    this.conta.pulo = 0.3;
    Tween.para(this.conta, { pulo: 1 }, 500, Easing.costasSaida);
  }

  // ---------------------------------------------------------- vez do computador

  _vezDoComputador() {
    if (this._fimResolvido) return;
    this._limparCartao();
    this.fundoCartao.vez = 'c';
    this.fase = 'cpu';
    this.prato.esvaziar();
    this._mostrarRolinhosTravados();
    this._falar('vezDoComputador', 'Vez do computador!', true);
    Tween.de(this.prato).esperar(700).chamar(() => this._jogarGraos('c', () => this._computadorConta()));
  }

  /** O computador conta casa por casa (os mesmos halos) e põe cada número no rolinho. */
  _computadorConta() {
    const qt = this.jogada.qt;
    const cadeia = Tween.de(this.prato).esperar(300);
    for (const casa of this.casas) {
      if (qt[casa] === 0) {
        cadeia.chamar(() => this._mostrarZero(casa)).esperar(900);
      }
      for (let k = 0; k < qt[casa]; k++) {
        cadeia.chamar(() => this._acenderGrao(casa, k)).esperar(this.regras.passoCpuMs);
      }
      cadeia.chamar(() => {
        if (!this.porOpcoes) this.rolinhos[casa].definir(qt[casa]);
      }).esperar(380);
    }
    cadeia.chamar(() => {
      this.numeroComputador = this.jogada.valor;
      this.linhas[this.rodada - 1].c = this.numeroComputador;
      for (const r of Object.values(this.rolinhos)) r.visible = false;
      this.conta.casas = this.casas;
      this.conta.qt = qt;
      this.conta.y = 330;
      this.conta.quem = 'c';
      this.conta.pulo = 0.3;
      Tween.para(this.conta, { pulo: 1 }, 500, Easing.costasSaida);
    }).esperar(1400).chamar(() => this._perguntarComparacao());
  }

  // ---------------------------------------------------------------- comparação

  _perguntarComparacao() {
    this._limparCartao();
    this.fundoCartao.vez = 'v';
    this.escolha = null;
    const quem = quemFormouMaior(this.numeroCrianca, this.numeroComputador);
    this.pergunta.texto = 'QUAL NÚMERO É O ';
    this.pergunta.destaque = 'MAIOR';
    const { y, lado, altura, meio, ate_pronto: folga } = COMPARAR;
    const larguraLinha = lado * 2 + meio * 2 + folga + COLUNA_L;
    const xCrianca = CARTAO.x + (CARTAO.l - larguraLinha) / 2;
    const xSinal = xCrianca + lado + meio;
    const xComputador = xSinal + meio;
    this._posicionarPronto(xComputador + lado + folga, y - this.botaoPronto.altura / 2);
    this.sinal.x = xSinal;
    this.sinal.y = y;
    const botoes = [
      ['v', this.numeroCrianca, xCrianca],
      ['c', this.numeroComputador, xComputador],
    ].map(([dono, numero, x]) => new BotaoNumero({
      numero, quem: dono, x, y: y - altura / 2, largura: lado, altura,
      audio: this.audio, somToque: this.config.audio?.clique,
      aoTocar: () => this._marcarNumero(dono),
    }));
    this.grupoEscolha.adicionar(...botoes);
    this.sinal.visible = true;
    this.sinal.certo = false;
    this.sinal.texto = '?';

    if (quem === 'empate') {
      // Empate: os dois números com o "=" já certo, e a rodada fecha sozinha.
      this.fase = 'fimRodada';
      for (const b of botoes) { b.definirHabilitado(false); b.alpha = 1; }
      this._mostrarSinal('=');
      this._falar('empate', 'Os dois formaram o mesmo número!', true);
      Tween.de(this.cartao).esperar(900).chamar(() => this._fecharRodada());
      return;
    }
    this.fase = 'comparar';
    this.resposta = quem;
    this.botaoPronto.visible = true;
    this.sinal.premio = true;
    this._atualizarBotoes();
    this._guiarComparacao();
    this._falar('qualEMaior', 'Qual número é o maior?', true);
  }

  _marcarNumero(dono) {
    if (this.pausada || this.fase !== 'comparar') return;
    this.escolha = dono;
    for (const b of this.grupoEscolha.filhos) b.marcado = b.quem === dono;
    this._atualizarBotoes();
    this._guiarComparacao();
  }

  /**
   * O que fazer agora, sem frase: sem número marcado, os números que ainda
   * valem pulsam e o dedinho toca em cada um; com um marcado, o dedinho vai
   * para o PRONTO (que já pulsa quando está liberado).
   */
  _guiarComparacao() {
    const livres = this.grupoEscolha.filhos.filter((b) => !b.errado);
    for (const b of livres) {
      b.pulse = this.escolha == null;
      if (!b.pulse) { b.scaleX = 1; b.scaleY = 1; }
    }
    // A ponta do dedo toca a borda de cima de cada número, à direita: a mão fica
    // ACIMA do botão e nunca cobre os algarismos (como no PRONTO).
    if (this.escolha == null) this.dica.mostrar(livres.map((b) => ({ x: b.x + b.largura * 0.3, y: b.y - b.altura / 2 + 14 })));
    // No PRONTO a ponta toca a borda de cima, à direita: a mão fica ACIMA do botão
    // (pedido do humano, 20/10/2026) e o visto e o rótulo continuam à vista.
    else {
      const b = this.botaoPronto;
      this.dica.mostrar([{ x: b.x + b.largura * 0.28, y: b.y - b.altura / 2 + 14 }]);
    }
  }

  _conferirComparacao() {
    if (!this.escolha) return;
    if (this.escolha !== this.resposta) {
      this._registrarFalha();
      this.errosComparacao += 1;
      const b = this.grupoEscolha.filhos.find((o) => o.quem === this.escolha);
      if (b) { b.errado = true; b.marcado = false; b.definirHabilitado(false); b.alpha = 1; }
      this.escolha = null;
      this._sinalizarErro();
      const casa = this.casas[0];
      this._falar(`olheA${casa === 'c' ? 'Centena' : 'Dezena'}`, `Olhe a ${NOME_CASA[casa]} primeiro.`, true);
      this._atualizarBotoes();
      this._guiarComparacao();
      return;
    }
    this.fase = 'fimRodada';
    this.dica.esconder();
    for (const b of this.grupoEscolha.filhos) {
      b.definirHabilitado(false);
      b.alpha = 1;
      b.pulse = false;
      b.scaleX = 1;
      b.scaleY = 1;
    }
    this.botaoPronto.visible = false;
    this._mostrarSinal(sinalEntre(this.numeroCrianca, this.numeroComputador));
    this._mostrarVencedor(this.resposta);
    this._efeito('acerto');
    this._falar(this.resposta === 'v' ? 'voceFezOMaior' : 'computadorFezOMaior',
      this.resposta === 'v' ? 'Você fez o maior número!' : 'O computador fez o maior número.', true);
    Tween.de(this.cartao).esperar(1400).chamar(() => this._fecharRodada());
  }

  /**
   * Diz, sem frase, quem fez o maior: o número vencedor ganha o contorno
   * dourado e a estrela (na cor da trilha de cima), e o outro apaga.
   */
  _mostrarVencedor(quem) {
    for (const b of this.grupoEscolha.filhos) {
      b.marcado = false;
      if (b.quem === quem) {
        b.vencedor = 0.2;
        Tween.para(b, { vencedor: 1 }, 520, Easing.costasSaida);
      } else {
        b.perdeu = true;
      }
    }
  }

  _mostrarSinal(texto) {
    this.sinal.texto = texto;
    this.sinal.certo = true;
    this.sinal.pulo = 0.3;
    Tween.para(this.sinal, { pulo: 1 }, 450, Easing.costasSaida);
  }

  /**
   * Fecha a rodada e dá a estrela. **Rodada limpa**: a estrela é da criança se leu e
   * comparou SEM nenhum PRONTO errado (`falhaNaRodada` falso); se precisou de nova tentativa,
   * é do computador, que nunca erra. Quem tem o maior número NÃO decide a estrela: isso
   * dependia da sorte dos grãos, e a vitória não podia depender dela (decisão do humano,
   * 22/10/2026). O maior número é só o conteúdo da comparação.
   */
  _fecharRodada() {
    const ganhador = this.falhaNaRodada ? 'c' : 'v';
    const i = this.rodada - 1;
    this.linhas[i].ganhador = ganhador;
    this.estrelas[ganhador] += 1;
    this.trilha.estados[i] = ganhador;
    this.trilha.escalas[i] = 0.3;
    Tween.para(this.trilha.escalas, { [i]: 1 }, 550, Easing.costasSaida);
    if (ganhador === 'v') this._efeito('acerto');

    Tween.de(this.cartao).esperar(this.regras.pausaRodadaMs).chamar(() => {
      if (this.rodada >= TOTAL_RODADAS) this._terminar();
      else this._novaRodada();
    });
  }

  // ---------------------------------------------------------------------- fim

  /**
   * Como a partida termina: a criança vence com mais estrelas que o computador, ou seja, com
   * 3 ou mais rodadas limpas (`_fecharRodada`). Como toda rodada dá a estrela a um dos dois e
   * são 5 rodadas, não há empate.
   */
  _desfecho() {
    return this.estrelas.v > this.estrelas.c ? 'vitoria' : 'derrota';
  }

  /**
   * A nota (`acertos`) e as estrelas da tela (RE-04):
   *  - vitória: sempre 5 estrelas (decisão do humano, 22/10/2026) — NÃO desconta os erros;
   *  - derrota: as rodadas limpas da criança (0 a 2), sem desconto.
   * Com 5 rodadas, 3 estrelas já vencem, então uma vitória nunca mostra menos estrelas do
   * que uma derrota. Como o desconto deixa de existir na vitória, quanto a criança errou só
   * aparece no relatório (`erros`, `rodadasComFalha`, `errosLeitura`).
   */
  _notaDaPartida() {
    return this._desfecho() === 'vitoria' ? TOTAL_RODADAS : this.estrelas.v;
  }

  /**
   * Vai ao resultado. `vitoria` do contrato é binária: `true` com mais rodadas limpas que o
   * computador, `false` na derrota. A vitória depende só de a criança ler e comparar sem
   * errar (não da sorte dos grãos); o detalhe viaja nos extras (`leiturasDePrimeira`,
   * `rodadasComFalha`, `errosLeitura`). Não passa `estrelas`: a tela deriva a fileira (RE-04).
   */
  _terminar() {
    if (this._fimResolvido) return;
    this._fimResolvido = true;
    const desfecho = this._desfecho();
    const resultado = this.placar.paraAva(desfecho === 'vitoria', {
      desfecho,
      leiturasDePrimeira: this.leiturasDePrimeira,
      errosLeitura: this.errosLeitura,
      errosComparacao: this.errosComparacao,
      rodadasComFalha: this.rodadasComFalha,
      rodadasComAjuda: this.rodadasComAjuda,
      estrelasCrianca: this.estrelas.v,
      estrelasComputador: this.estrelas.c,
      ganhouDoComputador: desfecho === 'vitoria',
      numeros: this.linhas.map((l) => ({ crianca: l.v, computador: l.c })),
    });
    // O `ScoreSystem` desconta os erros sozinho numa vitória (RE-02); aqui a vitória vale 5
    // fixas por decisão do humano, então a nota e os erros são definidos explicitamente:
    // `acertos` = a nota, `erros` = a contagem crua de PRONTOs errados.
    resultado.acertos = this._notaDaPartida();
    resultado.erros = this.errosLeitura + this.errosComparacao;
    this.irPara('resultado', { nivel: this.nivel, resultado });
  }

  /** O cão de guarda achou uma cadeia cortada: leva a partida a um ponto seguro. */
  _destravar() {
    if (this.fase === 'caindo') {
      for (const g of [...this.prato.graos, ...this.prato.fora]) g.queda = 1;
      this._liberarResposta();
    } else if (this.fase === 'ajudando') {
      this.prato.acesas = [];
      this.fase = 'responder';
      if (!this.porOpcoes) for (const casa of this.casas) this.rolinhos[casa].travar(false);
      for (const b of this.grupoEscolha.filhos) if (!b.errado) b.interativo = true;
      this._atualizarBotoes();
    } else if (this.fase === 'acertou') {
      this._vezDoComputador();
    } else if (this.fase === 'cpu') {
      if (this.jogada && this.linhas[this.rodada - 1]) {
        this.numeroComputador = this.jogada.valor;
        this.linhas[this.rodada - 1].c = this.numeroComputador;
        this._perguntarComparacao();
      } else {
        this._novaRodada();
      }
    } else if (this.fase === 'fimRodada') {
      if (this.rodada >= TOTAL_RODADAS) this._terminar();
      else this._novaRodada();
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
