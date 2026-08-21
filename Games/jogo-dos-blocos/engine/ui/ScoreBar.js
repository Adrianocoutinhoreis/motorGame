import { Node } from '../core/Node.js';
import { Tween, Easing } from '../core/Tween.js';
import { desenharIcone } from '../theme/icons.js';
import { cores, raio, tipografia, movimento } from '../theme/tokens.js';

/**
 * ScoreBar — barra de progresso da meta da partida.
 *
 * Sucede o par `barraPontosExterna` / `barraPontosInterna` dos três jogos
 * originais, que era um MovieClip com uma timeline percorrida por
 * `gotoAndStop(pontos * scoreRatio)` — ou seja, o progresso era um QUADRO de
 * animação. Isso dava saltos visíveis e, quando a razão não fechava, um frame
 * inválido travava a barra.
 *
 * Aqui o valor é 0..1 e a barra persegue esse valor com uma animação curta, o
 * que também dá ao aluno a percepção de "andou" a cada acerto.
 */
export class ScoreBar extends Node {
  constructor(opcoes = {}) {
    super({ largura: opcoes.largura ?? 360, altura: opcoes.altura ?? 34, ...opcoes });

    this.valor = 0;          // alvo lógico (0..1)
    this._valorVisual = 0;   // o que está desenhado agora
    this.cor = opcoes.cor ?? cores.acerto;
    this.corTrilho = opcoes.corTrilho ?? 'rgba(255,255,255,0.75)';
    this.corBorda = opcoes.corBorda ?? cores.linha;
    this.mostrarNumeros = opcoes.mostrarNumeros ?? true;
    this.icone = opcoes.icone ?? 'estrela';

    this.atual = 0;
    this.total = opcoes.total ?? 0;
  }

  /** Define pelo par (atual, total) — a forma que os jogos usam. */
  definir(atual, total = this.total) {
    this.atual = atual;
    this.total = total;
    this.definirValor(total > 0 ? atual / total : 0);
    return this;
  }

  /** Define diretamente pela fração 0..1. */
  definirValor(v, animar = true) {
    this.valor = Math.max(0, Math.min(1, v));
    Tween.removerDe(this);
    if (animar) {
      Tween.para(this, { _valorVisual: this.valor }, movimento.padrao, Easing.suaveSaida);
    } else {
      this._valorVisual = this.valor;
    }
    return this;
  }

  /** Liga a barra a um ScoreSystem: ela passa a se atualizar sozinha. */
  acompanhar(placar) {
    this.definir(placar.acertos, placar.total);
    placar.on('mudou', () => this.definir(placar.acertos, placar.total));
    return this;
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const r = a / 2;
    const espacoIcone = this.icone ? a + 10 : 0;
    const larguraTrilho = l - espacoIcone;

    ctx.save();

    if (this.icone) {
      ctx.save();
      ctx.translate(0, 0);
      desenharIcone(ctx, this.icone, a, cores.atencao, 2.2);
      ctx.restore();
    }

    // Trilho
    ctx.translate(espacoIcone, 0);
    ctx.fillStyle = this.corTrilho;
    ctx.beginPath();
    ctx.roundRect(0, 0, larguraTrilho, a, r);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.corBorda;
    ctx.stroke();

    // Preenchimento
    const larguraCheia = Math.max(0, (larguraTrilho - 6) * this._valorVisual);
    if (larguraCheia > 0) {
      ctx.fillStyle = this.cor;
      ctx.beginPath();
      ctx.roundRect(3, 3, Math.max(larguraCheia, a - 6), a - 6, r);
      ctx.fill();
    }

    if (this.mostrarNumeros && this.total > 0) {
      ctx.font = `${tipografia.pesoForte} ${Math.round(a * 0.6)}px ${tipografia.familia}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const texto = `${Math.round(this.atual)}/${this.total}`;
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.strokeText(texto, larguraTrilho / 2, a / 2 + 1);
      ctx.fillStyle = cores.tinta;
      ctx.fillText(texto, larguraTrilho / 2, a / 2 + 1);
    }

    ctx.restore();
  }
}

/**
 * TimerBar — tempo restante da partida.
 *
 * Substitui o `tempo_mc` + `setInterval(…, 1000)` dos originais. Dois ganhos
 * concretos: o tempo é contado por delta (uma aba em segundo plano não "come" a
 * partida do aluno) e a barra muda de cor e pulsa quando resta pouco — aviso
 * que não depende de o aluno saber ler o relógio.
 */
export class TimerBar extends ScoreBar {
  constructor(opcoes = {}) {
    super({ icone: 'reiniciar', mostrarNumeros: false, ...opcoes });
    this.duracao = opcoes.duracao ?? 120;
    this.restante = this.duracao;
    this.rodando = false;
    this.corNormal = opcoes.corNormal ?? cores.primaria;
    this.corAtencao = opcoes.corAtencao ?? cores.atencao;
    this.corCritico = opcoes.corCritico ?? cores.erro;
    this.cor = this.corNormal;
    this._pulso = 0;
  }

  iniciar(duracao = this.duracao) {
    this.duracao = duracao;
    this.restante = duracao;
    this.rodando = true;
    this.definirValor(1, false);
    return this;
  }

  pausar() { this.rodando = false; return this; }
  retomar() { this.rodando = true; return this; }

  atualizar(dt) {
    super.atualizar(dt);
    if (!this.rodando) return;

    this.restante = Math.max(0, this.restante - dt);
    const fracao = this.duracao > 0 ? this.restante / this.duracao : 0;
    // Sem tween: o tempo é contínuo, animar a animação só atrasaria a leitura.
    this.valor = fracao;
    this._valorVisual = fracao;

    if (fracao > 0.35) this.cor = this.corNormal;
    else if (fracao > 0.15) this.cor = this.corAtencao;
    else this.cor = this.corCritico;

    if (fracao <= 0.15 && fracao > 0) {
      this._pulso += dt * 6;
      this.alpha = 0.75 + Math.abs(Math.sin(this._pulso)) * 0.25;
    } else {
      this.alpha = 1;
    }

    if (this.restante <= 0 && this.rodando) {
      this.rodando = false;
      this.emit('acabou', this);
    }
  }
}
