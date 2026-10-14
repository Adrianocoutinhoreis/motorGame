import {
  Scene, Node, ScoreSystem, Button, IconButton, SoundToggle, PauseScreen, HelpScreen,
  Background, Tween, Easing, ESTADOS, Watchdog, tipografia,
} from '../../engine/index.js';
import {
  CHEGADA, ULTIMA_CASA, rolarDados, andanca, casaAlvo, chegou, dadosParaLeitura,
} from '../regras.js';
import {
  CORES, desenharFoguete, desenharDado, desenharPista, desenharChegada, desenharBalao,
  desenharIconeDado, desenharIconeCerto, escrever,
} from '../desenho.js';

// ---------------------------------------------------------------------------
// Layout (1280 × 720), medido no protótipo — ver docs/REGRAS-CORRIDA-ESPACIAL.md
//
// Pista horizontal: 20 casas de 52 px. As casas NÃO são alvo de toque (52 px
// fica abaixo dos 64 mínimos); o alvo é o foguete, 112 × 66.
// ---------------------------------------------------------------------------
const CASA_L = 52;
const PISTA_A = 88;
const PISTA_GAP = 40;
const LARGADA_L = 130;
const LISTRA_L = 28;
const CHEGADA_L = 70;
const PISTA_Y = 190;
const PAINEL_Y = 508;

const LARGURA_TOTAL = LARGADA_L + ULTIMA_CASA * CASA_L + LISTRA_L + CHEGADA_L;

function montarGeo(L) {
  const x0 = Math.max(0, (L - LARGURA_TOTAL) / 2) + LARGADA_L;
  const xFim = x0 + ULTIMA_CASA * CASA_L;
  const pistas = [
    { y: PISTA_Y, cy: PISTA_Y + PISTA_A / 2 },
    { y: PISTA_Y + PISTA_A + PISTA_GAP, cy: PISTA_Y + PISTA_A + PISTA_GAP + PISTA_A / 2 },
  ];
  const casaX = (i) => {
    if (i <= 0) return x0 - 40; // a chama (95 px atrás da janelinha) não sai da tela
    if (i >= CHEGADA) return xFim + LISTRA_L + 30; // o bico (42 px à frente) não passa da borda
    return x0 + (i - 0.5) * CASA_L;
  };
  return { x0, xFim, pistas, topo: PISTA_Y, base: pistas[1].y + PISTA_A, casaX };
}

/** A casa (de `minimo` à CHEGADA) cujo centro está mais perto de `x`. */
function casaMaisProxima(geo, x, minimo = 0) {
  let melhor = minimo;
  let dist = Infinity;
  for (let i = minimo; i <= CHEGADA; i++) {
    const d = Math.abs(geo.casaX(i) - x);
    if (d < dist) { dist = d; melhor = i; }
  }
  return melhor;
}

// ---------------------------------------------------------------------------
// Nós de desenho
// ---------------------------------------------------------------------------

/** O planeta de destino, meio para fora da tela à direita, atrás da chegada. */
class PlanetaDestino extends Node {
  constructor(geo, L) {
    super();
    this.geo = geo;
    this.L = L;
  }

  desenhar(ctx) {
    const cy = (this.geo.topo + this.geo.base) / 2;
    const r = Math.max(150, (this.geo.base - this.geo.topo) * 0.75);
    const cx = this.L + 40;
    const g = ctx.createRadialGradient(cx - 30, cy - r * 0.3, r * 0.1, cx, cy, r);
    g.addColorStop(0, '#5EEAD4');
    g.addColorStop(1, '#0F766E');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#042F2E';
    ctx.beginPath();
    ctx.arc(this.L - 40, cy + 40, 22, 0, Math.PI * 2);
    ctx.arc(this.L - 10, cy - 60, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

/** As duas pistas, os rótulos, a largada e a chegada quadriculada. */
class Pistas extends Node {
  constructor(geo) {
    super();
    this.geo = geo;
    /** Ajuda em curso: { de, ate, acesas } — casas de de+1 até de+acesas pintadas. */
    this.ajuda = null;
  }

  desenhar(ctx) {
    const g = this.geo;
    for (const time of [0, 1]) {
      const p = g.pistas[time];
      escrever(ctx, time === 0 ? 'VOCÊ' : 'COMPUTADOR', g.x0 - LARGADA_L + 2, p.y - 14, 17,
        time === 0 ? CORES.azulPista : CORES.laranjaPista, 'left');
      // Largada: o lugar dos foguetes antes da casa 1.
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.roundRect(g.x0 - LARGADA_L + 4, p.y + 4, LARGADA_L - 12, PISTA_A - 8, 14);
      ctx.stroke();
      ctx.restore();

      const ajuda = time === 0 ? this.ajuda : null;
      const acesas = ajuda && ajuda.acesas > 0 ? { de: ajuda.de + 1, ate: ajuda.de + ajuda.acesas } : null;
      const completa = ajuda && ajuda.acesas >= ajuda.ate - ajuda.de;
      desenharPista(ctx, g.x0, p.y, CASA_L, PISTA_A, ULTIMA_CASA, {
        time, destacar: true, acesas, anel: completa && ajuda.ate <= ULTIMA_CASA ? ajuda.ate : 0,
      });
      // A ajuda que leva para além do 20 acende a faixa da chegada.
      if (completa && ajuda.ate >= CHEGADA) {
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = CORES.ajudaAnel;
        ctx.beginPath();
        ctx.roundRect(g.xFim + LISTRA_L + 4, p.y - 5, CHEGADA_L - 8, PISTA_A + 10, 12);
        ctx.stroke();
        ctx.restore();
      }
    }
    desenharChegada(ctx, g.xFim, g.topo - 8, LISTRA_L, g.base - g.topo + 16);
  }
}

/**
 * Um foguete (a arte de `assets/img/foguete.png`). A posição (x, y) é o centro
 * da JANELINHA, que fica sobre a casa. O corpo e a chama vão para trás dela:
 * 95 px até a ponta da chama, 42 px até o bico, 84 px de altura — e o alvo de
 * toque (o do azul) cobre esse retângulo inteiro, 137 × 84.
 * A janelinha mostra a casa mais próxima do foguete, inclusive durante o
 * movimento — é o retorno imediato a cada casa avançada.
 */
const FOGUETE_ATRAS = 95;
const FOGUETE_FRENTE = 42;
const FOGUETE_ALTURA = 84;

class Foguete extends Node {
  constructor(time, geo, opcoes = {}) {
    super({ ...opcoes, largura: FOGUETE_ATRAS + FOGUETE_FRENTE, altura: FOGUETE_ALTURA, interativo: time === 0 });
    this.regX = FOGUETE_ATRAS;
    this.regY = FOGUETE_ALTURA / 2;
    this.time = time;
    this.geo = geo;
    /** A arte carregada; sem ela, o desenho cai no foguete vetorial. */
    this.imagem = opcoes.imagem ?? null;
    this.brilho = false;
    /** Quantas casas andou na jogada (balão); 0 esconde. */
    this.balao = 0;
    /** Casa mínima da leitura da janelinha (a casa em que a jogada começou). */
    this.casaMinima = 0;
  }

  get casaVisivel() {
    return casaMaisProxima(this.geo, this.x, this.casaMinima);
  }

  desenhar(ctx) {
    const cy = FOGUETE_ALTURA / 2;
    desenharFoguete(ctx, FOGUETE_ATRAS, cy, 1, this.time, this.casaVisivel, this.brilho, this.imagem);
    // Ponta do balão na borda de cima da pista, em cima da janelinha.
    if (this.balao > 0) desenharBalao(ctx, FOGUETE_ATRAS, cy - PISTA_A / 2, this.balao);
  }
}

/** Os dados da jogada, no meio do painel de baixo. */
class Dados extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.valores = [];
    this.dono = 0;
    this.modo = 'dado';
    this.rolando = false;
    this.giro = 0;
    this.mostrarAlgarismo = true;
    this.t = 0;
  }

  desenhar(ctx) {
    const tam = 104;
    const borda = this.dono === 0 ? CORES.azulForte : CORES.laranjaForte;
    if (!this.valores.length) {
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.roundRect(-tam / 2, -tam / 2, tam, tam, 18);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const valores = this.rolando ? this.valores : dadosParaLeitura(this.modo, this.valores);
    const algarismo = this.mostrarAlgarismo && !this.rolando;
    if (valores.length === 1) {
      desenharDado(ctx, 0, 0, tam, valores[0], borda, this.giro);
      if (algarismo) escrever(ctx, String(valores[0]), 0, 76, 24, '#E0E7FF');
      return;
    }
    desenharDado(ctx, -92, 0, tam, valores[0], borda, this.giro);
    desenharDado(ctx, 92, 0, tam, valores[1], borda, -this.giro);
    escrever(ctx, this.modo === 'soma' ? '+' : '−', 0, 0, 56, '#E0E7FF');
    if (algarismo) {
      escrever(ctx, String(valores[0]), -92, 76, 24, '#E0E7FF');
      escrever(ctx, String(valores[1]), 92, 76, 24, '#E0E7FF');
    }
  }
}

/** Botão grande da partida (ROLAR / PRONTO): glifo em cima, rótulo embaixo. */
class BotaoGrande extends Button {
  constructor(opcoes = {}) {
    super({ ...opcoes, rotulo: opcoes.rotulo, icone: null });
    this.glifo = opcoes.glifo;
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
    ctx.fillStyle = this.cor;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, r);
    ctx.fill();
    if (this.habilitado && !this._pressionado) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath();
      ctx.roundRect(4, 3, l - 8, a * 0.42, [r - 2, r - 2, 4, 4]);
      ctx.fill();
    }
    if (this.glifo === 'dado') desenharIconeDado(ctx, l / 2, a * 0.38, 46, this.cor);
    else desenharIconeCerto(ctx, l / 2, a * 0.38, 46);
    escrever(ctx, this.rotulo, l / 2, a * 0.78, 24, '#FFFFFF');
    ctx.restore();
  }
}

/** De quem é a vez: mini foguete + "SUA VEZ" + a dica do que fazer agora. */
class PlacaVez extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.vez = 0;
    this.dica = '';
    this.imagem = opcoes.imagem ?? null;
  }

  desenhar(ctx) {
    desenharFoguete(ctx, 62, 0, 0.8, this.vez, 0, false);
    // O título tem o mesmo limite da dica: os dados começam em x ≈ 496 (absoluto)
    // e a placa está em x:48, então sobram 300 px a partir do x 132. "VEZ DO
    // COMPUTADOR" a 28px passa disso e ficava atrás do dado — encolhe até caber.
    const titulo = this.vez === 0 ? 'SUA VEZ' : 'VEZ DO COMPUTADOR';
    let tam = 28;
    ctx.font = `800 ${tam}px ${tipografia.familia}`;
    while (tam > 20 && ctx.measureText(titulo).width > 300) {
      tam -= 2;
      ctx.font = `800 ${tam}px ${tipografia.familia}`;
    }
    escrever(ctx, titulo, 132, -16, tam,
      this.vez === 0 ? CORES.azulPista : CORES.laranjaPista, 'left');
    if (!this.dica) return;
    // Até duas linhas, quebradas no próprio texto: a dica não pode encostar nos dados (x ≈ 496).
    this.dica.split('\n').forEach((linha, i) => escrever(ctx, linha, 132, 20 + i * 24, 17, '#CBD5E1', 'left', 700));
  }
}

/** Aviso curto no alto da tela ("TENTE DE NOVO", "MUITO BEM!"). Some sozinho. */
class Aviso extends Node {
  constructor(opcoes = {}) {
    super(opcoes);
    this.texto = '';
    this.cor = '#FFFFFF';
    this.alpha = 0;
  }

  mostrar(texto, cor, duracaoMs = 1500) {
    this.texto = texto;
    this.cor = cor;
    Tween.removerDe(this);
    this.alpha = 0;
    Tween.para(this, { alpha: 1 }, 150, Easing.suaveSaida)
      .esperar(duracaoMs)
      .entao({ alpha: 0 }, 250, Easing.suave);
  }

  desenhar(ctx) {
    if (!this.texto) return;
    ctx.font = `800 28px ${tipografia.familia}`;
    const w = Math.max(300, ctx.measureText(this.texto).width + 64);
    ctx.beginPath();
    ctx.roundRect(-w / 2, -29, w, 58, 29);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.cor;
    ctx.stroke();
    escrever(ctx, this.texto, 0, 1, 28, this.cor);
  }
}

/** O painel escuro de baixo, onde ficam a vez, os dados e os botões. */
class PainelFundo extends Node {
  desenhar(ctx) {
    ctx.beginPath();
    ctx.roundRect(0, 0, this.largura, this.altura, 24);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.62)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.stroke();
  }
}

const NUMEROS = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
  'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove', 'vinte'];

/**
 * GameScene — a corrida.
 *
 * Fases da partida (`this.fase`):
 *   'rolar'      vez da criança, esperando o ROLAR
 *   'rolando'    dados girando
 *   'mover'      a criança leva o foguete (toque = 1 casa, arrasto = pulo) e confirma
 *   'conferindo' jogada certa, comemorando antes de passar a vez
 *   'cpu'        o foguete laranja rola e anda contando
 *   'fim'        alguém chegou; indo para o resultado
 *
 * O placar (`ScoreSystem`, meta 20) soma as casas que o foguete AZUL avança
 * em jogadas certas: a vitória dispara sozinha quando ele chega ao 20, e a
 * pontuação final desconta os erros (RE-02). A derrota é o foguete laranja
 * chegar antes; aí a pontuação é a casa alcançada, sem desconto.
 *
 * Todo o tempo da partida passa por Tween (nenhum setTimeout): a pausa e a
 * ajuda congelam os tweens e, com eles, a vez do computador.
 */
export class GameScene extends Scene {
  aoEntrar() {
    this.estado = ESTADOS.JOGANDO;
    const { largura: L, altura: A, config } = this;

    this.nivel = this.game.dados.nivel ?? config.niveis[0];
    this.modo = this.nivel.modo ?? 'dado';
    this.regras = { chegada: 'passar', errosParaAjuda: 2, passoCpuMs: 540, mostrarAndou: true, algarismoDado: true, ...config.regras };

    this.placar = new ScoreSystem({ total: this.nivel.meta ?? ULTIMA_CASA, nivel: this.nivel.id ?? 1, vidas: 0 });

    this.fase = 'rolar';
    this.vez = 0;
    this.pos = [0, 0];
    this.inicio = 0;
    this.errosJogada = 0;
    this.usouAjuda = false;
    this.jogadas = 0;
    this.certasDePrimeira = 0;
    this.jogadasComAjuda = 0;
    this._gesto = null;
    this._fimResolvido = false;

    this.geo = montarGeo(L);
    const geo = this.geo;

    // O planeta de destino encosta na borda direita: ele também é desenhado na
    // sangria, para continuar pela barra lateral em vez de parar seco na borda.
    const planeta = new PlanetaDestino(geo, L);
    this.adicionar(new Background({
      largura: L, altura: A, tema: config.tema ?? 'espaco', mostrarChao: false,
      desenharNaSangria: (ctx) => planeta.desenhar(ctx),
    }));
    this.adicionar(planeta);
    this.pistas = new Pistas(geo);
    this.adicionar(this.pistas);

    // ------------------------------------------------------------- foguetes
    this.foguetes = [0, 1].map((time) => new Foguete(time, geo, { x: geo.casaX(0), y: geo.pistas[time].cy, imagem: this.loader.imagem('foguete') }));
    this.adicionar(this.foguetes[1], this.foguetes[0]);
    const azul = this.foguetes[0];
    azul.on('apertar', (p) => this._comecarGesto(p));
    azul.on('arrastar', (p) => this._arrastar(p));
    // O `soltar` vai para o nó sob o dedo, que pode já não ser o foguete:
    // por isso o fim do gesto escuta a entrada inteira (e só age com gesto aberto).
    this.ouvirEntrada('soltar', () => this._terminarGesto(true));
    this.ouvirEntrada('cancelar', () => this._terminarGesto(false));

    // ---------------------------------------------------------------- painel
    this.adicionar(new PainelFundo({ x: 24, y: PAINEL_Y, largura: L - 48, altura: A - PAINEL_Y - 16 }));
    this.placaVez = new PlacaVez({ x: 48, y: 604, imagem: this.loader.imagem('foguete') });
    this.adicionar(this.placaVez);

    this.dados = new Dados({ x: L / 2, y: 594 });
    this.dados.modo = this.modo;
    this.dados.mostrarAlgarismo = this.regras.algarismoDado;
    this.adicionar(this.dados);

    this.botaoRolar = new BotaoGrande({
      rotulo: 'ROLAR', glifo: 'dado', largura: 160, altura: 136, x: L - 380, y: 530,
      cor: '#4F46E5', corBorda: '#312E81', audio: this.audio, somToque: config.audio?.clique,
      aoTocar: () => this._rolar(),
    });
    this.botaoPronto = new BotaoGrande({
      rotulo: 'PRONTO', glifo: 'certo', largura: 160, altura: 136, x: L - 200, y: 530,
      variante: 'sucesso', audio: this.audio, somToque: config.audio?.clique,
      aoTocar: () => this._pronto(),
    });
    this.adicionar(this.botaoRolar, this.botaoPronto);

    // ------------------------------------------------------------------- HUD
    // Só pausa, ajuda e som: sem título nem chip de nível (pedido do humano,
    // 14/10/2026) — a pista é o que a criança precisa ver.
    this.adicionar(
      new IconButton({ icone: 'pausa', x: L - 272, y: 20, audio: this.audio, somToque: config.audio?.clique, corContorno: 'transparent', aoTocar: () => this.pausar() }),
      new IconButton({ icone: 'tutorial', x: L - 184, y: 20, audio: this.audio, somToque: config.audio?.clique, corContorno: 'transparent', aoTocar: () => this.pedirAjuda() }),
      new SoundToggle({ audio: this.audio, x: L - 96, y: 20, somToque: config.audio?.clique }),
    );

    this.aviso = new Aviso({ x: L / 2, y: 132 });
    this.adicionar(this.aviso);

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

    this.placar.on('vitoria', () => this._terminar(true));

    // --------------------------------------------------------------- guarda
    // A vez do computador é uma cadeia de tweens. Se uma exceção engolida
    // cortar a cadeia, a partida não pode ficar presa na vez dele.
    this.guarda = new Watchdog({
      nome: 'vez do computador',
      ocupado: () => (this.fase === 'cpu' || this.fase === 'rolando' || this.fase === 'conferindo') && !this.pausada && !this._fimResolvido,
      vivo: () => Tween.temAtivo(this) || Tween.temAtivo(this.foguetes[1]) || Tween.temAtivo(this.dados),
      graca: 0.6,
      limite: 12,
      aoTravar: () => {
        if (chegou(this.pos[1])) this._terminar(false);
        else if (this.fase === 'rolando' && this.vez === 0) this._liberarMovimento();
        else this._vezDaCrianca();
      },
    });

    this._atualizarControles();
    this._falar('suaVez', 'Sua vez!');
  }

  // ----------------------------------------------------------------- narração

  /** Fala pelo id definitivo; sem a gravação, o motor fica mudo e avisa o texto no console. */
  _falar(id, texto, interromper = false) {
    if (interromper) this.audio?.calar();
    this.audio?.falar(id, { texto });
  }

  _falarNumero(n, interromper = false) {
    this._falar(`numero${n}`, NUMEROS[n] ?? String(n), interromper);
  }

  _falarDados(valores) {
    const [a, b] = dadosParaLeitura(this.modo, valores);
    this._falarNumero(a, true);
    if (this.modo === 'soma') { this._falar('mais', 'mais'); this._falarNumero(b); }
    if (this.modo === 'diferenca') { this._falar('menos', 'menos'); this._falarNumero(b); }
  }

  // ------------------------------------------------------------------- estado

  _atualizarControles() {
    const rolar = this.vez === 0 && this.fase === 'rolar';
    const pronto = this.vez === 0 && this.fase === 'mover';
    this.botaoRolar.definirHabilitado(rolar);
    this.botaoPronto.definirHabilitado(pronto);
    this.botaoRolar.pulse = rolar;
    this.botaoPronto.pulse = pronto;
    if (!rolar) { this.botaoRolar.scaleX = 1; this.botaoRolar.scaleY = 1; }
    if (!pronto) { this.botaoPronto.scaleX = 1; this.botaoPronto.scaleY = 1; }

    const azul = this.foguetes[0];
    azul.brilho = pronto;
    azul.interativo = pronto;
    this.placaVez.vez = this.vez;
    this.placaVez.dica = this.vez === 0
      ? ({ rolar: 'TOQUE EM ROLAR', mover: 'LEVE O FOGUETE\nE TOQUE EM PRONTO' }[this.fase] ?? '')
      : 'OLHE O FOGUETE\nLARANJA CONTAR';
  }

  /** Rola os dados de `dono` com a animação; `aoParar(valores)` no fim. */
  _rolarDados(dono, aoParar) {
    const final = rolarDados(this.modo);
    const d = this.dados;
    d.dono = dono;
    d.rolando = true;
    d.valores = rolarDados(this.modo);
    let acumulado = 0;
    const giro = { t: 0 };
    Tween.para(giro, { t: 1 }, 700, Easing.linear)
      .emCadaQuadro((_alvo, dt) => {
        acumulado += dt;
        if (acumulado >= 0.11) {
          acumulado = 0;
          d.valores = rolarDados(this.modo);
          d.giro = (Math.random() - 0.5) * 0.5;
        }
      });
    // A espera que importa fica nos próprios dados: é ela que o cão de guarda enxerga.
    Tween.de(d).esperar(720).chamar(() => {
      Tween.removerDe(giro);
      d.valores = final;
      d.giro = 0;
      d.rolando = false;
      aoParar(final);
    });
  }

  // ------------------------------------------------------------ vez da criança

  _rolar() {
    if (this.pausada || this.vez !== 0 || this.fase !== 'rolar') return;
    this.fase = 'rolando';
    this._atualizarControles();
    this._rolarDados(0, (valores) => {
      this._falarDados(valores);
      this._liberarMovimento();
    });
  }

  _liberarMovimento() {
    this.inicio = this.pos[0];
    this.errosJogada = 0;
    this.usouAjuda = false;
    this.pistas.ajuda = null;
    this.foguetes[0].casaMinima = this.inicio;
    this.fase = 'mover';
    this._atualizarControles();
  }

  _comecarGesto(p) {
    if (this.pausada || this.fase !== 'mover') return;
    const azul = this.foguetes[0];
    Tween.removerDe(azul);
    this._gesto = { x0: p.x, y0: p.y, dx: azul.x - p.x, moveu: false };
  }

  _arrastar(p) {
    const gesto = this._gesto;
    if (!gesto || this.pausada) return;
    // Qualquer deslize conta como arrasto (não como toque), mas só o horizontal move o foguete.
    if (!gesto.moveu && Math.hypot(p.x - gesto.x0, p.y - gesto.y0) > 10) gesto.moveu = true;
    if (!gesto.moveu) return;
    const g = this.geo;
    this.foguetes[0].x = Math.max(g.casaX(this.inicio), Math.min(g.casaX(CHEGADA), p.x + gesto.dx));
    this.foguetes[0].balao = this.regras.mostrarAndou ? this.foguetes[0].casaVisivel - this.inicio : 0;
  }

  /** Fim do gesto: arrasto encaixa na casa mais próxima; toque anda UMA casa, contando. */
  _terminarGesto(valeToque) {
    const gesto = this._gesto;
    if (!gesto) return;
    this._gesto = null;
    const azul = this.foguetes[0];
    if (gesto.moveu) {
      this.pos[0] = casaMaisProxima(this.geo, azul.x, this.inicio);
    } else if (valeToque && this.pos[0] < CHEGADA) {
      this.pos[0] += 1;
      this._falarNumero(Math.min(this.pos[0] - this.inicio, 20), true);
    }
    Tween.para(azul, { x: this.geo.casaX(this.pos[0]) }, 180, Easing.suaveSaida);
    azul.balao = this.regras.mostrarAndou ? this.pos[0] - this.inicio : 0;
  }

  _pronto() {
    if (this.pausada || this.vez !== 0 || this.fase !== 'mover' || this._gesto) return;
    const casas = andanca(this.modo, this.dados.valores);
    const alvo = casaAlvo(this.inicio, casas, this.regras.chegada);
    if (this.pos[0] === alvo) this._acertou(alvo, casas);
    else this._errou(alvo);
  }

  _acertou(alvo, casas) {
    this.fase = 'conferindo';
    this.jogadas += 1;
    if (this.errosJogada === 0) this.certasDePrimeira += 1;
    if (this.usouAjuda) this.jogadasComAjuda += 1;
    this.pistas.ajuda = null;
    Tween.removerDe(this.pistas);
    const azul = this.foguetes[0];
    azul.balao = 0;
    azul.casaMinima = 0;
    this._atualizarControles();

    const avancou = Math.min(alvo, ULTIMA_CASA) - Math.min(this.inicio, ULTIMA_CASA);
    if (alvo === this.inicio) {
      const passou = this.inicio + casas > ULTIMA_CASA;
      this.aviso.mostrar(passou ? 'PASSOU DO 20: FICA NO LUGAR!' : 'ZERO: FICA NO LUGAR!', '#4ADE80');
      if (passou) this._falar('passouFicaNoLugar', 'Passou do vinte, fica no lugar!', true);
      else this._falar('zeroFicaNoLugar', 'Zero, fica no lugar!', true);
    } else {
      this.aviso.mostrar(chegou(alvo) ? 'CHEGOU!' : 'MUITO BEM!', '#4ADE80');
      if (chegou(alvo)) this._falar('chegou', 'Chegou!', true);
      else this._falarNumero(alvo, true);
      if (this.config.audio?.acerto) this.audio?.efeito(this.config.audio.acerto);
      azul.scaleX = 1.18;
      azul.scaleY = 1.18;
      Tween.para(azul, { scaleX: 1, scaleY: 1 }, 420, Easing.costasSaida);
    }

    Tween.de(this).esperar(950).chamar(() => {
      if (avancou > 0) this.placar.acertar(avancou); // no 20, dispara 'vitoria' → _terminar(true)
      if (!this.placar.encerrado) this._vezDoComputador();
    });
  }

  _errou(alvo) {
    this.placar.errar();
    this.errosJogada += 1;
    if (this.config.audio?.erro) this.audio?.efeito(this.config.audio.erro);
    this.aviso.mostrar('TENTE DE NOVO', '#FACC15');
    this._falar('tenteDeNovo', 'Tente de novo!', true);

    const azul = this.foguetes[0];
    this.pos[0] = this.inicio;
    azul.balao = 0;
    Tween.removerDe(azul);
    Tween.para(azul, { x: this.geo.casaX(this.inicio) }, 450, Easing.suave);

    const limite = this.regras.errosParaAjuda;
    if (limite > 0 && this.errosJogada >= limite && !this.pistas.ajuda) this._mostrarAjuda(alvo);
  }

  /** Ajuda: as casas acendem uma a uma, contadas, até a certa. A criança ainda leva o foguete. */
  _mostrarAjuda(alvo) {
    this.usouAjuda = true;
    const ajuda = { de: this.inicio, ate: alvo, acesas: 0 };
    this.pistas.ajuda = ajuda;
    if (alvo === this.inicio) {
      Tween.de(this.pistas).esperar(1700).chamar(() => {
        this.aviso.mostrar('NÃO SAI DO LUGAR: TOQUE EM PRONTO', '#FACC15', 2600);
      });
      return;
    }
    const cadeia = Tween.de(this.pistas).esperar(900);
    for (let k = 1; k <= alvo - this.inicio; k++) {
      cadeia.chamar(() => {
        ajuda.acesas = k;
        this._falarNumero(Math.min(k, 20), true);
      }).esperar(620);
    }
  }

  // ---------------------------------------------------------- vez do computador

  _vezDoComputador() {
    if (this._fimResolvido) return;
    this.vez = 1;
    this.fase = 'cpu';
    this.dados.valores = [];
    this._atualizarControles();
    this._falar('vezDoComputador', 'Vez do computador!', true);

    Tween.de(this).esperar(800).chamar(() => {
      this._rolarDados(1, (valores) => {
        this._falarDados(valores);
        Tween.de(this).esperar(900).chamar(() => this._andarComputador(valores));
      });
    });
  }

  _andarComputador(valores) {
    const de = this.pos[1];
    const casas = andanca(this.modo, valores);
    const alvo = casaAlvo(de, casas, this.regras.chegada);
    const laranja = this.foguetes[1];
    const passo = this.regras.passoCpuMs;

    if (alvo === de) {
      const passou = de + casas > ULTIMA_CASA;
      this.aviso.mostrar(passou ? 'PASSOU DO 20: FICA NO LUGAR' : 'ZERO: FICA NO LUGAR', '#FB923C');
      if (passou) this._falar('passouFicaNoLugar', 'Passou do vinte, fica no lugar!', true);
      else this._falar('zeroFicaNoLugar', 'Zero, fica no lugar!', true);
      Tween.de(this).esperar(1500).chamar(() => this._fimDoComputador());
      return;
    }

    const cadeia = Tween.de(laranja);
    for (let k = de + 1; k <= alvo; k++) {
      cadeia.chamar(() => this._falarNumero(Math.min(k - de, 20), true))
        .entao({ x: this.geo.casaX(k) }, passo * 0.7, Easing.suave)
        .esperar(passo * 0.3);
    }
    cadeia.chamar(() => {
      this.pos[1] = alvo;
      if (this.config.audio?.pouso) this.audio?.efeito(this.config.audio.pouso);
      if (chegou(alvo)) this._falar('chegouLaranja', 'O foguete laranja chegou!', true);
      else this._falarNumero(alvo, true);
    }).esperar(900).chamar(() => this._fimDoComputador());
  }

  _fimDoComputador() {
    if (chegou(this.pos[1])) this._terminar(false);
    else this._vezDaCrianca();
  }

  _vezDaCrianca() {
    if (this._fimResolvido) return;
    this.vez = 0;
    this.fase = 'rolar';
    this.dados.valores = [];
    this._atualizarControles();
    this._falar('suaVez', 'Sua vez!', true);
  }

  // ---------------------------------------------------------------------- fim

  /**
   * Fim de partida. Vitória: o placar chegou a 20 (pontuação = 20 − erros, RE-02).
   * Derrota: o laranja chegou antes (pontuação = casa alcançada).
   * Não passa `estrelas`: a tela de resultado deriva a fileira (RE-04).
   */
  _terminar(venceu) {
    if (this._fimResolvido) return;
    this._fimResolvido = true;
    this.fase = 'fim';
    this._atualizarControles();
    this.irPara('resultado', {
      nivel: this.nivel,
      resultado: this.placar.paraAva(venceu, {
        modo: this.modo,
        casaAlcancada: Math.min(this.pos[0], ULTIMA_CASA),
        casaComputador: Math.min(this.pos[1], ULTIMA_CASA),
        jogadas: this.jogadas,
        certasDePrimeira: this.certasDePrimeira,
        jogadasComAjuda: this.jogadasComAjuda,
        venceuCorrida: venceu,
      }),
    });
  }

  // ------------------------------------------------------------ pausa e ajuda

  _cancelarGesto() {
    if (this._gesto) this._terminarGesto(false);
  }

  pausar() {
    if (this._fimResolvido || this.pausada) return;
    this._cancelarGesto();
    Tween.pausarTodos();
    this.pausada = true;
    this.pausa.abrir();
  }

  /** Ajuda: o tutorial por cima da partida, sem perdê-la (RE-05). */
  pedirAjuda() {
    if (this._fimResolvido || this.pausada) return;
    this._cancelarGesto();
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
