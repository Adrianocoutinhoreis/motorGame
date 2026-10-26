import {
  Scene, Node, ScoreSystem, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, Watchdog,
} from '../../engine/index.js';
import {
  criarPecas, sortearDados, embaralhar, posicionarMesa, pecaDeAjuda, pecasQueSomam, quemVence, MESA_COLUNAS,
} from '../regras.js';
import {
  CORES, escrever, desenharPeca, desenharDado, desenharSinalPeca, desenharEstrelaRodada,
  desenharIconeQuem, desenharIconeCerto, desenharDedo, desenharOndaToque,
} from '../desenho.js';

// ---------------------------------------------------------------------------
// Layout (1280 × 720), o mesmo do protótipo aprovado (artifact "Subtraindo o
// Dominó", 26/10/2026): a pergunta no alto, a mesa de pedras à esquerda, os dois
// dados e o PRONTO à direita e, embaixo, as duas bandejas — que SÃO o placar,
// sem número. Os marcadores de rodada ficam no canto de cima, à esquerda.
// ---------------------------------------------------------------------------
const PECA_L = 128;
const PECA_A = 64;
/** A mesa: células de 144 × 80 em 6 colunas, a partir de (MESA.x, MESA.y); 4 linhas no máximo. */
const MESA = { x: 32, y: 164, celulaL: 144, celulaA: 80, linhasMax: 4, largura: 864 };
const DADO_L = 128;
/** Os dois dados moram num quadro próprio, alinhado ao PRONTO (x 920, largura 320): 20 px de folga de cada lado. */
const QUADRO_DADOS = { x: 920, y: 172, l: 320, a: 174 };
const DADOS = { y: 195, x1: 940, x2: 1092 };
const PRONTO = { x: 920, y: 390, l: 320, a: 96 };
const BANDEJA = { y: 520, l: 580, a: 170, xv: 40, xc: 660 };
/** Cada vaga da bandeja: uma pedra a 75% de escala (96 × 48), a 24 px da borda e 108 px da vizinha. */
const VAGA = { x: 24, y: 78, passo: 108, l: PECA_L * 0.75, a: PECA_A * 0.75 };
const PERGUNTA = { x: 640, y: 118 };
const TRILHA = { x: 56, y: 62, passo: 62, r: 24 };

/** Os números por extenso, para o texto de apoio da fala do total (a gravação existe de "dois" a "nove"). */
const NUMEROS = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze'];

// ---------------------------------------------------------------------------
// Nós de desenho
// ---------------------------------------------------------------------------

/**
 * Uma pedra da mesa. O ponto de registro é o centro (`x`, `y` são o centro da
 * pedra), então girar e encolher a pedra a leva à bandeja sem desvio. Todo o
 * retorno visual (contorno, elevação, ✓/✕, balanço) mora em `efeitos`, um objeto
 * à parte: os tweens de efeito não cancelam o tween de voo da pedra, e o
 * contrário também não.
 */
class Peca extends Node {
  constructor(dados, alg, opcoes = {}) {
    super({ ...opcoes, largura: PECA_L, altura: PECA_A, regX: PECA_L / 2, regY: PECA_A / 2, interativo: true });
    this.dados = dados;
    this.alg = alg;
    this.efeitos = { elev: 0, desvio: 0, marcada: 0, erro: 0, dica: 0, sinal: 0, cpu: 0, apagada: 0 };
    this.t = Math.random() * 6;
    /** 'ok' | 'erro' | null: o ✓ ou o ✕ sobre a pedra. */
    this.sinal = null;
  }

  atualizar(dt) {
    super.atualizar(dt);
    this.t += dt;
  }

  desenhar(ctx) {
    const e = this.efeitos;
    // Respiração lenta (período de ~1,8 s, sem piscar) que dá vida ao destaque da ajuda.
    const pulso = 0.5 + 0.5 * Math.sin(this.t * 3.5);
    ctx.save();
    // Quando a ajuda acende uma pedra, as outras escurecem para o foco ficar nela.
    ctx.globalAlpha *= 1 - 0.55 * e.apagada;
    ctx.translate(e.desvio, -(e.elev + e.dica * (12 + 3 * pulso)));
    if (e.dica > 0) {
      // A pedra da ajuda cresce um pouco, ganha um halo largo que respira e um segundo anel que se abre.
      const s = 1 + 0.07 * e.dica;
      ctx.translate(PECA_L / 2, PECA_A / 2);
      ctx.scale(s, s);
      ctx.translate(-PECA_L / 2, -PECA_A / 2);
      ctx.save();
      ctx.shadowColor = '#FFF3C4';
      ctx.shadowBlur = 34 + 16 * pulso;
      ctx.globalAlpha *= e.dica * (0.7 + 0.3 * pulso);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(-5, -5, PECA_L + 10, PECA_A + 10, PECA_A * 0.28);
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      const grow = 6 + 14 * pulso;
      ctx.globalAlpha = e.dica * 0.45 * (1 - pulso);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-5 - grow, -5 - grow, PECA_L + 10 + grow * 2, PECA_A + 10 + grow * 2, PECA_A * 0.28 + grow);
      ctx.stroke();
      ctx.restore();
    }
    for (const [valor, cor, largura] of [[e.marcada, CORES.ouro, 5], [e.cpu, CORES.computador, 5], [e.erro, CORES.erro, 5]]) {
      if (valor <= 0) continue;
      ctx.save();
      ctx.globalAlpha *= valor;
      ctx.strokeStyle = cor;
      ctx.lineWidth = largura;
      ctx.shadowColor = cor;
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.roundRect(-4, -4, PECA_L + 8, PECA_A + 8, PECA_A * 0.26);
      ctx.stroke();
      ctx.restore();
    }
    desenharPeca(ctx, this.dados.a, this.dados.b, { alg: this.alg });
    if (this.sinal && e.sinal > 0) desenharSinalPeca(ctx, this.sinal, PECA_L / 2, PECA_A / 2, 27, e.sinal);
    ctx.restore();
  }
}

/** Um dado. Rola trocando de face; parado, só respira (suave) enquanto convida ao toque. */
class Dado extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes, largura: DADO_L, altura: DADO_L, regX: DADO_L / 2, regY: DADO_L / 2, interativo: true });
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
    desenharDado(ctx, DADO_L, this.face);
  }
}

/**
 * O quadro dos dados: um painel só para eles, no mesmo estilo das bandejas. A borda acompanha de quem
 * é a vez (dourada a da criança, azul-acinzentada a do computador), sem frase.
 */
class QuadroDados extends Node {
  constructor(opcoes = {}) {
    super({ ...opcoes, largura: QUADRO_DADOS.l, altura: QUADRO_DADOS.a });
    this.quem = 'v';
  }

  desenhar(ctx) {
    const { l, a } = QUADRO_DADOS;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, 26);
    ctx.fillStyle = CORES.bandeja;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.quem === 'c' ? CORES.computador : CORES.ouro;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.restore();
  }
}

/** O botão PRONTO: verde com texto escuro (6,5:1; o branco da série dá 2,3:1). */
class BotaoPronto extends Button {
  constructor(opcoes = {}) {
    super({ ...opcoes, icone: null });
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const r = 28;
    const dy = this._pressionado ? 5 : 0;
    ctx.save();
    if (this.habilitado && !this._pressionado) {
      ctx.fillStyle = CORES.okEscuro;
      ctx.beginPath();
      ctx.roundRect(0, 8, l, a, r);
      ctx.fill();
    }
    ctx.fillStyle = this.habilitado ? CORES.ok : 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.roundRect(0, dy, l, a, r);
    ctx.fill();
    const cor = this.habilitado ? CORES.sobreOk : 'rgba(255, 255, 255, 0.5)';
    desenharIconeCerto(ctx, l * 0.2, a / 2 + dy, 40, cor);
    escrever(ctx, 'PRONTO', l * 0.6, a / 2 + dy + 2, 40, cor);
    ctx.restore();
  }
}

/**
 * O lugar de cada pedra na mesa: quando a pedra sai, fica um contorno tracejado no lugar dela — a
 * "subtração" do nome, visível sem escrever nada. Antes de sair, o contorno não aparece (ficava
 * espiando pelas bordas das pedras jogadas de leve).
 */
class Mesa extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    /** {x, y, vazia} do centro de cada pedra que começou na mesa; `vazia` quando ela saiu. */
    this.vagas = [];
  }

  desenhar(ctx) {
    ctx.save();
    ctx.setLineDash([9, 7]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.13)';
    for (const v of this.vagas) {
      if (!v.vazia) continue;
      ctx.beginPath();
      ctx.roundRect(v.x - PECA_L / 2, v.y - PECA_A / 2, PECA_L, PECA_A, 13);
      ctx.stroke();
    }
    ctx.restore();
  }
}

/**
 * A bandeja de um lado: as pedras que ele levou ficam nela, uma por rodada (as duas enchem
 * juntas; quem vence a rodada é a ESTRELA do alto). Um anel suave marca de quem é a vez e um
 * anel forte, quem ganhou a estrela. Mostra o ícone de quem é e, no Fácil, o nome por extenso
 * (pedido do humano, como no Pratinho CDU).
 */
class Bandeja extends Node {
  constructor(quem, opcoes = {}) {
    super({ ...opcoes, largura: BANDEJA.l, altura: BANDEJA.a });
    this.quem = quem;
    this.vagas = 3;
    this.nomes = false;
    /** Anel de quem acabou de levar uma pedra, 0..1. */
    this.brilho = 0;
  }

  desenhar(ctx) {
    const { l, a } = BANDEJA;
    const cor = CORES[this.quem === 'v' ? 'crianca' : 'computador'];
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, 26);
    ctx.fillStyle = CORES.bandeja;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = CORES.bandejaBorda;
    ctx.stroke();
    if (this.brilho > 0) {
      ctx.globalAlpha = this.brilho;
      ctx.lineWidth = 6;
      ctx.strokeStyle = cor;
      ctx.beginPath();
      ctx.roundRect(-4, -4, l + 8, a + 8, 30);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    desenharIconeQuem(ctx, this.quem, 44, 40, 40, cor);
    if (this.nomes) escrever(ctx, this.quem === 'v' ? 'VOCÊ' : 'COMPUTADOR', 76, 42, 24, CORES.tintaSuave, 'left');
    ctx.setLineDash([7, 6]);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = CORES.vaga;
    for (let i = 0; i < this.vagas; i++) {
      ctx.beginPath();
      ctx.roundRect(VAGA.x + i * VAGA.passo, VAGA.y, VAGA.l, VAGA.a, 10);
      ctx.stroke();
    }
    ctx.restore();
  }
}

/** As estrelas das rodadas, no canto: uma por rodada; dourada é da criança, azul-acinzentada é do computador. */
class TrilhaRodadas extends Node {
  constructor(total, opcoes = {}) {
    super(opcoes);
    /** 'vazia' | 'v' | 'c' por rodada. */
    this.estados = new Array(total).fill('vazia');
    this.escalas = new Array(total).fill(1);
    this.atual = 0;
  }

  desenhar(ctx) {
    this.estados.forEach((estado, i) => {
      const e = this.escalas[i];
      ctx.save();
      ctx.translate(i * TRILHA.passo, 0);
      ctx.scale(e, e);
      desenharEstrelaRodada(ctx, 0, 0, TRILHA.r, estado, i === this.atual);
      ctx.restore();
    });
  }
}

/**
 * A pergunta da vez: "QUAL PEDRA SOMA [9]?". É a única frase escrita da partida
 * (a única tarefa que não se explica só pelo gesto); o total vem num selo âmbar.
 * Já em caixa alta (RE-01). Sem total, não desenha nada.
 */
class Pergunta extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.total = null;
    this.pulo = 1;
    /** De quem é o total: 'v' (selo dourado) ou 'c' (selo azul, a vez do computador). */
    this.quem = 'v';
  }

  desenhar(ctx) {
    if (this.total == null) return;
    const tam = 44;
    const fonte = `800 ${tam}px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`;
    ctx.font = fonte;
    const inicio = 'QUAL PEDRA SOMA';
    const w1 = ctx.measureText(inicio).width;
    const w2 = ctx.measureText('?').width;
    const wn = ctx.measureText(String(this.total)).width;
    const wSelo = Math.max(84, wn + 36);
    const gap = 18;
    const x0 = -(w1 + gap + wSelo + gap * 0.4 + w2) / 2;
    escrever(ctx, inicio, x0, 0, tam, CORES.tinta, 'left');
    const xs = x0 + w1 + gap + wSelo / 2;
    ctx.save();
    ctx.translate(xs, 0);
    ctx.scale(this.pulo, this.pulo);
    ctx.fillStyle = this.quem === 'c' ? CORES.computador : CORES.ouro;
    ctx.beginPath();
    ctx.roundRect(-wSelo / 2, -32, wSelo, 64, 16);
    ctx.fill();
    escrever(ctx, String(this.total), 0, 2, tam, '#1B212B');
    ctx.restore();
    escrever(ctx, '?', xs + wSelo / 2 + gap * 0.4, 0, tam, CORES.tinta, 'left');
  }
}

/**
 * O dedinho branco da coleção mostrando o gesto da vez, sem frase: vai de um alvo
 * ao outro e toca em cada um, em laço. Aponta os dados antes de jogar e o PRONTO
 * quando há uma pedra marcada — nunca aponta a pedra certa.
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

/**
 * GameScene — a partida do Subtraindo o Dominó.
 *
 * Fases (`this.fase`):
 *   'dados'      os dados com "?", esperando o toque da criança (o dedinho aponta)
 *   'rolando'    os dados rolando
 *   'escolher'   a criança marca uma pedra que soma o total; PRONTO confere
 *   'levando'    o ✓ na pedra certa, a pedra indo para a bandeja da criança e, no fim, a estrela
 *   'cpu'        o computador joga (etapas em `cpuEtapa`): rola os dados dele, marca uma pedra
 *                (anel azul) e a leva para a bandeja dele
 *
 * **Os dois jogam em TODA rodada**, como no vídeo (decisão do humano, 26/10/2026): a criança acha
 * a pedra do total dela e leva; depois o computador joga os dados dele e leva a pedra dele. O
 * computador nunca erra. **A estrela da rodada é de quem faz a rodada limpa**: da criança se ela
 * achou a pedra SEM nenhum PRONTO errado; senão do computador. As bandejas registram as pedras
 * de cada um e enchem juntas; quem decide é a estrela. A vitória depende só do que a criança sabe,
 * não da sorte dos dados (o total sorteado sempre tem uma pedra na mesa).
 *
 * **Nada vale antes do PRONTO.** Marcar e desmarcar uma pedra é livre (toque de
 * novo desmarca); só o PRONTO errado conta como erro (RE-02).
 *
 * **Retorno sem frase na tela**: acerto, erro e ajuda são cor, símbolo,
 * movimento e som. A única frase escrita é a pergunta com o total.
 *
 * **Como termina** (`_desfecho`): mais estrelas que o computador vence; com número
 * ímpar de rodadas não há empate. A nota (`_notaDaPartida`) é nota cheia na
 * vitória e, na derrota, as rodadas limpas. O payload é montado em `_terminar`:
 * `erros` cru e `acertos` = a nota (docs/REGRAS-SUBTRAINDO-O-DOMINO.md §6).
 *
 * Todo o tempo passa por Tween (nenhum setTimeout): pausa e ajuda congelam tudo.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.totalRodadas = this.nivel.meta ?? 3;
    this.regras = { rolarMs: 900, acertoMs: 650, pausaRodadaMs: 900, cpuEsperaMs: 700, cpuPensaMs: 800, ...config.regras };

    this.placar = new ScoreSystem({ total: this.totalRodadas, nivel: this.nivel.id ?? 1, vidas: 0 });
    this.fase = 'dados';
    this.rodada = 0;
    this.total = null;
    this.sorteio = null;
    this.escolhida = null;
    this.pendente = null;
    this.errosRodada = 0;
    this.errosPronto = 0;
    this.falhaNaRodada = false;
    this.rodadasComFalha = 0;
    this.rodadasComAjuda = 0;
    this.usouAjudaNaRodada = false;
    this.ganhadores = [];
    this.estrelas = { v: 0, c: 0 };
    this.totais = [];
    this.totaisComputador = [];
    /** A etapa da vez do computador (para o `Watchdog` saber de onde retomar). */
    this.cpuEtapa = null;
    this.cpuSorteio = null;
    this.cpuPeca = null;
    this.levadas = { v: [], c: [] };
    this._fimResolvido = false;

    this.adicionar(new Background({
      largura: L, altura: A, tema: config.tema ?? 'feltro', mostrarDecoracoes: false, mostrarChao: false,
    }));

    // ----------------------------------------------------------------- bandejas
    this.bandejas = {
      v: new Bandeja('v', { x: BANDEJA.xv, y: BANDEJA.y }),
      c: new Bandeja('c', { x: BANDEJA.xc, y: BANDEJA.y }),
    };
    for (const b of Object.values(this.bandejas)) {
      b.vagas = this.totalRodadas;
      b.nomes = !!this.nivel.nomes;
      this.adicionar(b);
    }

    // ------------------------------------------------------------------- a mesa
    this.mesa = new Mesa();
    this.adicionar(this.mesa);
    // As pedras moram numa camada própria: `paraFrente()` traz a pedra marcada (ou a que voa para a
    // bandeja) à frente das outras SEM passar por cima do HUD, da pausa e da ajuda.
    this.camada = new Node();
    this.adicionar(this.camada);
    this.pecas = criarPecas(this.nivel.faces ?? 6).map((p) => ({ ...p, livre: true, no: null }));
    const posicoes = posicionarMesa(this.pecas.length);
    const linhas = Math.ceil(this.pecas.length / MESA_COLUNAS);
    const oy = MESA.y + (MESA.linhasMax - linhas) * (MESA.celulaA / 2);
    const ox = MESA.x + (MESA.largura - MESA_COLUNAS * MESA.celulaL) / 2;
    const clique = config.audio?.clique;
    embaralhar(this.pecas).forEach((p, i) => {
      const pos = posicoes[i];
      const cx = ox + pos.col * MESA.celulaL + MESA.celulaL / 2;
      const cy = oy + pos.linha * MESA.celulaA + MESA.celulaA / 2;
      this.mesa.vagas.push({ x: cx, y: cy, vazia: false });
      p.vaga = this.mesa.vagas.length - 1;
      const no = new Peca(p, !!this.nivel.alg, { x: cx + pos.dx, y: cy + pos.dy, rotation: pos.giro });
      no.on('toque', () => this._tocarPeca(p));
      p.no = no;
      this.camada.adicionar(no);
    });

    // -------------------------------------------------------------- dados e botão
    this.quadroDados = new QuadroDados({ x: QUADRO_DADOS.x, y: QUADRO_DADOS.y });
    this.adicionar(this.quadroDados);
    this.dado1 = new Dado({ x: DADOS.x1 + DADO_L / 2, y: DADOS.y + DADO_L / 2 });
    this.dado2 = new Dado({ x: DADOS.x2 + DADO_L / 2, y: DADOS.y + DADO_L / 2 });
    for (const d of [this.dado1, this.dado2]) {
      d.on('toque', () => this._jogarDados());
      this.adicionar(d);
    }
    this.pergunta = new Pergunta({ x: PERGUNTA.x, y: PERGUNTA.y });
    this.adicionar(this.pergunta);

    this.botaoPronto = new BotaoPronto({
      largura: PRONTO.l, altura: PRONTO.a, x: PRONTO.x, y: PRONTO.y,
      audio: this.audio, somToque: clique, aoTocar: () => this._pronto(),
    });
    this.botaoPronto.visible = false;
    this.adicionar(this.botaoPronto);

    this.dica = new DicaDedo();
    this.adicionar(this.dica);

    this.trilha = new TrilhaRodadas(this.totalRodadas, { x: TRILHA.x, y: TRILHA.y });
    this.adicionar(this.trilha);

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
    // Os dados rolando e a pedra indo para a bandeja são cadeias de tweens no
    // `relogio`. Se uma exceção engolida cortar a cadeia, a partida não pode
    // ficar presa: o cão de guarda leva a um ponto seguro.
    this.relogio = new Node();
    this.adicionar(this.relogio);
    this.guarda = new Watchdog({
      nome: 'rodada do dominó',
      ocupado: () => ['rolando', 'levando', 'cpu'].includes(this.fase) && !this.pausada && !this._fimResolvido,
      vivo: () => Tween.temAtivo(this.relogio),
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
    this.fase = 'dados';
    this.total = null;
    this.sorteio = null;
    this.escolhida = null;
    this.pendente = null;
    this.pecaAjuda = null;
    this.errosRodada = 0;
    this.falhaNaRodada = false;
    this.usouAjudaNaRodada = false;
    this.trilha.atual = this.rodada - 1;
    this.pergunta.total = null;
    this.pergunta.quem = 'v';
    this._vez('v');
    this.botaoPronto.visible = false;
    for (const d of [this.dado1, this.dado2]) { d.face = 0; d.rolando = false; d.convida = true; }
    for (const p of this.pecas) if (p.livre) this._limparPeca(p);
    // O dedinho aponta o primeiro dado: o gesto da vez, sem frase.
    this.dica.mostrar([{ x: this.dado1.x + 24, y: this.dado1.y - DADO_L / 2 + 40 }]);
    this._falar('suaVez', 'Sua vez!', true);
  }

  /** Tira de uma pedra da mesa todo retorno visual da rodada anterior. */
  _limparPeca(p) {
    Tween.removerDe(p.no.efeitos);
    Object.assign(p.no.efeitos, { elev: 0, desvio: 0, marcada: 0, erro: 0, dica: 0, sinal: 0, cpu: 0, apagada: 0 });
    p.no.sinal = null;
  }

  _jogarDados() {
    if (this.pausada || this.fase !== 'dados') return;
    this.fase = 'rolando';
    this.dica.esconder();
    this.sorteio = sortearDados(this.pecas);
    for (const d of [this.dado1, this.dado2]) { d.rolando = true; d.convida = false; }
    Tween.de(this.relogio).esperar(this.regras.rolarMs).chamar(() => this._dadosParam());
  }

  _dadosParam() {
    if (this.fase !== 'rolando') return;
    // Sem sorteio (mesa vazia, impossível numa partida normal): fecha o jogo com o que há.
    if (!this.sorteio) { this._terminar(); return; }
    const { d1, d2, total } = this.sorteio;
    this.dado1.rolando = false;
    this.dado2.rolando = false;
    this.dado1.face = d1;
    this.dado2.face = d2;
    this.total = total;
    this.totais.push(total);
    this._efeito('pouso');
    this.fase = 'escolher';
    this.pergunta.total = total;
    this.pergunta.pulo = 0.6;
    Tween.para(this.pergunta, { pulo: 1 }, 450, Easing.costasSaida);
    this.botaoPronto.visible = true;
    this.botaoPronto.definirHabilitado(false);
    this.botaoPronto.pulse = false;
    this._falar(`numero${total}`, NUMEROS[total] ?? String(total));
  }

  // ------------------------------------------------------------ vez da criança

  /** Marca uma pedra; tocar de novo na mesma desmarca. Só uma pedra marcada por vez. */
  _tocarPeca(p) {
    if (this.pausada || this.fase !== 'escolher' || !p.livre) return;
    const desmarcar = this.escolhida === p;
    if (this.escolhida && this.escolhida !== p) this._desmarcar(this.escolhida);
    // Marcar uma pedra apaga o contorno e o ✕ de um erro anterior (só nas pedras que o têm: mexer nos
    // tweens de outra pedra cancelaria, por exemplo, a desmarcação da que acabou de ser trocada).
    for (const q of this.pecas) {
      if (q.livre && q !== p && (q.no.efeitos.erro > 0 || q.no.sinal === 'erro')) {
        Tween.removerDe(q.no.efeitos);
        Object.assign(q.no.efeitos, { erro: 0, sinal: 0, desvio: 0 });
        q.no.sinal = null;
      }
    }
    if (desmarcar) {
      this._desmarcar(p);
      this.escolhida = null;
    } else {
      this.escolhida = p;
      p.no.paraFrente();
      Tween.removerDe(p.no.efeitos);
      Tween.para(p.no.efeitos, { marcada: 1, elev: 8, erro: 0, apagada: 0 }, 140, Easing.suaveSaida);
      this._efeito('conta');
    }
    this._atualizarPronto();
  }

  _desmarcar(p) {
    Tween.removerDe(p.no.efeitos);
    // Com a ajuda acesa, a pedra desmarcada volta a escurecer (menos a pedra da ajuda).
    Tween.para(p.no.efeitos, { marcada: 0, elev: 0, apagada: this.pecaAjuda && p !== this.pecaAjuda ? 1 : 0 }, 140, Easing.suaveSaida);
  }

  /** O PRONTO só liga com uma pedra marcada; então pulsa e o dedinho vai nele. */
  _atualizarPronto() {
    const pronto = this.fase === 'escolher' && this.escolhida != null;
    this.botaoPronto.definirHabilitado(pronto);
    this.botaoPronto.pulse = pronto;
    if (!pronto) { this.botaoPronto.scaleX = 1; this.botaoPronto.scaleY = 1; }
    if (pronto) {
      const b = this.botaoPronto;
      // A ponta toca a borda de cima, à direita: a mão fica ACIMA do botão e o rótulo continua à vista.
      this.dica.mostrar([{ x: b.x - b.largura / 2 + b.largura * 0.78, y: b.y - b.altura / 2 + 16 }]);
    } else {
      this.dica.esconder();
    }
  }

  _pronto() {
    if (this.pausada || this.fase !== 'escolher' || !this.escolhida) return;
    const p = this.escolhida;
    if (p.soma === this.total) this._acertou(p);
    else this._errou(p);
  }

  _errou(p) {
    // A rodada deixa de ser limpa: a pedra desta rodada será do computador.
    if (!this.falhaNaRodada) { this.falhaNaRodada = true; this.rodadasComFalha += 1; }
    this.errosRodada += 1;
    this.errosPronto += 1;
    this.escolhida = null;
    this.dica.esconder();
    this.botaoPronto.definirHabilitado(false);
    this.botaoPronto.pulse = false;
    this.botaoPronto.scaleX = 1;
    this.botaoPronto.scaleY = 1;

    // Ajuda em degraus: no N-ésimo erro da rodada uma pedra certa acende (`pecaAjuda`).
    const { ajuda } = this.nivel;
    const certa = ajuda > 0 && this.errosRodada >= ajuda ? pecaDeAjuda(this.pecas, this.total) : null;

    const e = p.no.efeitos;
    Tween.removerDe(e);
    p.no.sinal = 'erro';
    Object.assign(e, { marcada: 0, elev: 0, erro: 1, sinal: 0.6 });
    Tween.de(e)
      .entao({ desvio: -12, sinal: 1 }, 60, Easing.suave)
      .entao({ desvio: 12 }, 90, Easing.suave)
      .entao({ desvio: -7 }, 80, Easing.suave)
      .entao({ desvio: 0 }, 70, Easing.suave)
      .esperar(500)
      .entao({ erro: 0, sinal: 0, apagada: certa ? 1 : 0 }, 300, Easing.suave)
      .chamar(() => { if (p.no.sinal === 'erro') p.no.sinal = null; });
    this._efeito('erro');
    this._falar('tenteDeNovo', 'Tente de novo!', true);

    if (certa) {
      if (!this.usouAjudaNaRodada) { this.usouAjudaNaRodada = true; this.rodadasComAjuda += 1; }
      this.pecaAjuda = certa;
      // A pedra certa sobe, cresce e respira em branco; as outras escurecem (depois de o ✕ do erro sair).
      Tween.para(certa.no.efeitos, { dica: 1, apagada: 0 }, 450, Easing.costasSaida);
      for (const q of this.pecas) {
        if (!q.livre || q === certa || q === p) continue;
        Tween.removerDe(q.no.efeitos);
        Tween.de(q.no.efeitos).esperar(700).entao({ apagada: 1 }, 400, Easing.suave);
      }
    }
  }

  _acertou(p) {
    this.fase = 'levando';
    this.pendente = { p };
    this.escolhida = null;
    this.dica.esconder();
    this.botaoPronto.definirHabilitado(false);
    this.botaoPronto.pulse = false;
    this.botaoPronto.scaleX = 1;
    this.botaoPronto.scaleY = 1;
    const e = p.no.efeitos;
    Tween.removerDe(e);
    p.no.sinal = 'ok';
    Object.assign(e, { marcada: 0, dica: 0, erro: 0, sinal: 0.3, apagada: 0 });
    // A ajuda acaba: as outras pedras voltam ao brilho normal e a pedra acesa (se não foi esta) apaga.
    this.pecaAjuda = null;
    for (const q of this.pecas) {
      if (!q.livre || q === p) continue;
      Tween.removerDe(q.no.efeitos);
      Tween.para(q.no.efeitos, { apagada: 0, dica: 0 }, 300, Easing.suave);
    }
    Tween.para(e, { sinal: 1, elev: 6 }, 260, Easing.costasSaida);
    // Só a rodada limpa comemora com som e fala: a pedra é a mesma, mas a estrela é de quem acertou de primeira.
    if (!this.falhaNaRodada) {
      this._efeito('acerto');
      this._falar('muitoBem', 'Muito bem!', true);
    }
    Tween.de(this.relogio).esperar(this.regras.acertoMs).chamar(() => this._levar());
  }

  /** De quem é a vez, sem frase: um anel suave na bandeja de quem joga (o do vencedor da rodada vem depois). */
  _vez(quem) {
    this.quadroDados.quem = quem;
    for (const q of ['v', 'c']) {
      Tween.removerDe(this.bandejas[q]);
      Tween.para(this.bandejas[q], { brilho: q === quem ? 0.55 : 0 }, 250, Easing.suave);
    }
  }

  /** A pedra de `dono` ('v' ou 'c') voa para a vaga seguinte da bandeja dele, a 75% do tamanho. */
  _voar(p, dono) {
    const lista = this.levadas[dono];
    const bandeja = this.bandejas[dono];
    const i = lista.length;
    lista.push(p);
    p.livre = false;
    this.mesa.vagas[p.vaga].vazia = true;
    p.no.interativo = false;
    p.no.paraFrente();
    this._efeito('pouso');
    const alvoX = bandeja.x + VAGA.x + i * VAGA.passo + VAGA.l / 2;
    const alvoY = bandeja.y + VAGA.y + VAGA.a / 2;
    Tween.para(p.no, { x: alvoX, y: alvoY, scaleX: 0.75, scaleY: 0.75, rotation: 0 }, 600, Easing.suave);
    Tween.para(p.no.efeitos, { elev: 0, sinal: 0, cpu: 0 }, 400, Easing.suave);
  }

  /** A pedra que a criança achou vai para a bandeja DELA (a rodada ser limpa ou não só decide a estrela); depois joga o computador. */
  _levar() {
    const pend = this.pendente;
    if (!pend) return;
    this.pendente = null;
    this._voar(pend.p, 'v');
    this.fase = 'levando';
    this.cpuEtapa = 'vai';
    Tween.de(this.relogio).esperar(600 + this.regras.cpuEsperaMs).chamar(() => this._vezDoComputador());
  }

  // ------------------------------------------------------ vez do computador

  /**
   * O computador joga em TODA rodada, como no vídeo: rola os PRÓPRIOS dados, marca uma pedra que
   * soma o total dele (anel azul) e a leva para a bandeja dele. Nunca erra, então é um modelo; a
   * estrela da rodada não depende dele (`_fecharRodada`).
   */
  _vezDoComputador() {
    if (this._fimResolvido) return;
    this.fase = 'cpu';
    this.cpuEtapa = 'espera';
    this.cpuSorteio = null;
    this.cpuPeca = null;
    this._vez('c');
    this.pergunta.total = null;
    this.pergunta.quem = 'c';
    this.botaoPronto.visible = false;
    for (const d of [this.dado1, this.dado2]) { d.face = 0; d.rolando = false; d.convida = false; }
    this._falar('vezDoComputador', 'Vez do computador!', true);
    Tween.de(this.relogio).esperar(this.regras.cpuEsperaMs).chamar(() => this._cpuRola());
  }

  _cpuRola() {
    if (this.fase !== 'cpu' || this.cpuEtapa !== 'espera') return;
    this.cpuEtapa = 'dados';
    this.cpuSorteio = sortearDados(this.pecas);
    for (const d of [this.dado1, this.dado2]) d.rolando = true;
    Tween.de(this.relogio).esperar(this.regras.rolarMs).chamar(() => this._cpuDadosParam());
  }

  _cpuDadosParam() {
    if (this.fase !== 'cpu' || this.cpuEtapa !== 'dados') return;
    // Sem sorteio (mesa vazia, impossível numa partida normal): fecha a rodada sem a pedra dele.
    if (!this.cpuSorteio) { this._fecharRodada(); return; }
    const { d1, d2, total } = this.cpuSorteio;
    this.dado1.rolando = false;
    this.dado2.rolando = false;
    this.dado1.face = d1;
    this.dado2.face = d2;
    this.totaisComputador.push(total);
    this._efeito('pouso');
    this.pergunta.total = total;
    this.pergunta.pulo = 0.6;
    Tween.para(this.pergunta, { pulo: 1 }, 450, Easing.costasSaida);
    const certas = pecasQueSomam(this.pecas, total);
    this.cpuPeca = certas[Math.floor(Math.random() * certas.length)];
    this.cpuEtapa = 'escolheu';
    Tween.de(this.relogio).esperar(this.regras.cpuPensaMs).chamar(() => this._cpuMarca());
  }

  /** O computador marca a pedra: anel azul e ela sobe um pouco, como a criança vê a dela. */
  _cpuMarca() {
    if (this.fase !== 'cpu' || this.cpuEtapa !== 'escolheu' || !this.cpuPeca) return;
    const no = this.cpuPeca.no;
    no.paraFrente();
    Tween.removerDe(no.efeitos);
    Tween.para(no.efeitos, { cpu: 1, elev: 8 }, 250, Easing.suaveSaida);
    this._efeito('conta');
    this.cpuEtapa = 'marcou';
    Tween.de(this.relogio).esperar(Math.round(this.regras.cpuPensaMs * 0.7)).chamar(() => this._cpuLeva());
  }

  _cpuLeva() {
    if (this.fase !== 'cpu' || this.cpuEtapa !== 'marcou' || !this.cpuPeca) return;
    this.cpuEtapa = 'voando';
    this._voar(this.cpuPeca, 'c');
    Tween.de(this.relogio).esperar(600 + 300).chamar(() => this._fecharRodada());
  }

  /**
   * Fecha a rodada e dá a ESTRELA. **Rodada limpa**: a estrela é da criança se achou a pedra SEM
   * nenhum PRONTO errado (`falhaNaRodada` falso); se precisou de nova tentativa, é do computador,
   * que nunca erra. Quem tem mais estrelas vence; as pedras de cada bandeja são o registro do que
   * cada um levou (as duas bandejas enchem juntas) e não decidem nada. A vitória depende só da
   * criança, não da sorte dos dados (decisão do humano, 26/10/2026: o computador joga em toda
   * rodada e as estrelas decidem, como no Pratinho CDU).
   */
  _fecharRodada() {
    if (this._fimResolvido) return;
    this.cpuEtapa = 'fim';
    this.fase = 'levando';
    const dono = this.falhaNaRodada ? 'c' : 'v';
    const idx = this.rodada - 1;
    this.ganhadores[idx] = dono;
    this.estrelas[dono] += 1;
    this.trilha.estados[idx] = dono;
    this.trilha.escalas[idx] = 0.3;
    Tween.para(this.trilha.escalas, { [idx]: 1 }, 550, Easing.costasSaida);
    for (const q of ['v', 'c']) {
      Tween.removerDe(this.bandejas[q]);
      this.bandejas[q].brilho = q === dono ? 1 : 0;
      Tween.para(this.bandejas[q], { brilho: 0 }, 1200, Easing.suave);
    }
    Tween.de(this.relogio).esperar(this.regras.pausaRodadaMs).chamar(() => this._proximaRodada());
  }

  _proximaRodada() {
    if (this._fimResolvido) return;
    if (this.rodada >= this.totalRodadas) this._terminar();
    else this._novaRodada();
  }

  // ---------------------------------------------------------------------- fim

  /** Quem vence: mais ESTRELAS que o computador. Com rodadas ímpares e uma estrela por rodada, não há empate. */
  _desfecho() {
    return quemVence(this.estrelas.v, this.estrelas.c) === 'v' ? 'vitoria' : 'derrota';
  }

  /**
   * A nota (`acertos`) e as estrelas da tela (RE-04), a mesma regra do Pratinho CDU:
   *  - vitória: nota cheia (todas as rodadas), sem descontar os erros — eles vão para o relatório;
   *  - derrota: as rodadas limpas da criança (as estrelas dela), sem desconto.
   */
  _notaDaPartida() {
    return this._desfecho() === 'vitoria' ? this.totalRodadas : this.estrelas.v;
  }

  /**
   * Vai ao resultado. `vitoria` do contrato é binária: `true` com mais estrelas que o computador.
   * O detalhe viaja nos extras. Não passa `estrelas`: a tela deriva a fileira (RE-04).
   */
  _terminar() {
    if (this._fimResolvido) return;
    this._fimResolvido = true;
    const desfecho = this._desfecho();
    const resultado = this.placar.paraAva(desfecho === 'vitoria', {
      desfecho,
      rodadasLimpas: this.estrelas.v,
      rodadasComFalha: this.rodadasComFalha,
      errosPronto: this.errosPronto,
      rodadasComAjuda: this.rodadasComAjuda,
      estrelasCrianca: this.estrelas.v,
      estrelasComputador: this.estrelas.c,
      ganhouDoComputador: desfecho === 'vitoria',
      totais: [...this.totais],
      totaisComputador: [...this.totaisComputador],
    });
    // O `ScoreSystem` desconta os erros sozinho numa vitória (RE-02); aqui a vitória vale a nota
    // cheia (mesma decisão do Pratinho CDU), então a nota e os erros são definidos explicitamente:
    // `acertos` = a nota, `erros` = a contagem crua de PRONTOs errados.
    resultado.acertos = this._notaDaPartida();
    resultado.erros = this.errosPronto;
    this.irPara('resultado', { nivel: this.nivel, resultado });
  }

  /** O cão de guarda achou uma cadeia cortada: leva a partida a um ponto seguro, de onde ela parou. */
  _destravar() {
    if (this.fase === 'rolando') {
      this._dadosParam();
    } else if (this.fase === 'levando') {
      if (this.pendente) this._levar();
      else if (this.cpuEtapa === 'vai') this._vezDoComputador();
      else this._proximaRodada();
    } else if (this.fase === 'cpu') {
      const etapas = {
        espera: () => this._cpuRola(),
        dados: () => this._cpuDadosParam(),
        escolheu: () => this._cpuMarca(),
        marcou: () => this._cpuLeva(),
        voando: () => this._fecharRodada(),
      };
      (etapas[this.cpuEtapa] ?? (() => this._fecharRodada()))();
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
