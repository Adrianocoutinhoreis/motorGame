import { Node } from '../core/Node.js';
import { Tween, Easing } from '../core/Tween.js';
import { cores, movimento } from '../theme/tokens.js';

/**
 * Mascot — o personagem que guia o aluno.
 *
 * A função é pedagógica, não decorativa: num público que ainda não lê, o
 * personagem é quem comunica "é a sua vez", "isso mesmo" e "tente outra vez",
 * reforçando o áudio sem depender de texto.
 *
 * Funciona em dois modos:
 *
 *  1. **Imagem** (`imagem`) — um PNG/WebP/SVG já carregado pelo Loader. É o modo
 *     usado quando o jogo declara `config.mascote.asset`. A arte manda no
 *     resultado, e o motor cuida de escala, proporção e animação de presença.
 *  2. **Coruja vetorial** (padrão) — desenhada em código, com cinco expressões.
 *     Continua sendo o padrão para um jogo novo que ainda não tem arte própria:
 *     nasce com um mascote funcionando, sem depender de nenhum arquivo.
 *
 * **Limite honesto do modo imagem:** uma figura estática não troca de rosto.
 * As expressões continuam funcionando como *linguagem corporal* — pulo ao
 * acertar, inclinação ao comemorar, encolher ao lamentar — mas não mudam a
 * feição. Para expressões faciais de verdade seriam necessárias várias imagens
 * (uma por estado), e aí `imagensPorExpressao` é o caminho.
 */
export class Mascot extends Node {
  constructor(opcoes = {}) {
    const tamanho = opcoes.tamanho ?? 180;
    super({ ...opcoes, largura: tamanho, altura: tamanho });

    this.tamanho = tamanho;
    this.expressao = opcoes.expressao ?? 'neutro';

    /** @type {HTMLImageElement|null} */
    this.imagem = opcoes.imagem ?? null;
    /** Mapa opcional expressão → imagem, para quando houver arte por estado. */
    this.imagensPorExpressao = opcoes.imagensPorExpressao ?? null;

    // No modo imagem, `tamanho` é a ALTURA e a largura sai da proporção da arte.
    // Uma figura de corpo inteiro é alta e estreita; forçá-la num quadrado a
    // deformaria.
    if (this.imagem) {
      const propor = (this.imagem.naturalWidth || 1) / (this.imagem.naturalHeight || 1);
      this.altura = tamanho;
      this.largura = Math.round(tamanho * propor);
    }

    // Cores da coruja vetorial (ignoradas no modo imagem).
    this.corCorpo = opcoes.corCorpo ?? cores.madeira;
    this.corBarriga = opcoes.corBarriga ?? '#FDE68A';
    this.corOlho = opcoes.corOlho ?? '#FFFFFF';
    this.corPupila = opcoes.corPupila ?? cores.tinta;
    this.corBico = opcoes.corBico ?? cores.atencao;

    /** Balanço suave de "respiração": presença sem disputar atenção. */
    this._t = Math.random() * Math.PI * 2;
    this.balanco = opcoes.balanco ?? true;
    this._baseY = this.y;
    this._piscar = 0;
    this._tempoAtePiscar = 2 + Math.random() * 3;

    this.regX = this.largura / 2;
    this.regY = this.altura / 2;
  }

  /** Troca a expressão, com um gesto curto para chamar atenção. */
  definirExpressao(expressao, comAnimacao = true) {
    this.expressao = expressao;

    if (this.imagensPorExpressao?.[expressao]) {
      this.imagem = this.imagensPorExpressao[expressao];
    }

    if (comAnimacao) {
      Tween.removerDe(this);
      this.scaleX = this.scaleY = 1;
      this.rotation = 0;

      if (expressao === 'comemorando') {
        // Sem troca de rosto, a comemoração vira linguagem corporal: pula e
        // balança. Funciona igual para a coruja e para uma figura fotográfica.
        Tween.para(this, { scaleX: 1.14, scaleY: 1.14, rotation: -5 }, movimento.rapido, Easing.suaveSaida)
          .entao({ rotation: 5 }, movimento.padrao, Easing.suave)
          .entao({ scaleX: 1, scaleY: 1, rotation: 0 }, movimento.padrao, Easing.costasSaida);
      } else if (expressao === 'triste') {
        Tween.para(this, { scaleX: 0.95, scaleY: 0.92, rotation: 3 }, movimento.padrao, Easing.suaveSaida);
      } else {
        Tween.para(this, { scaleX: 1.12, scaleY: 1.12 }, movimento.rapido, Easing.suaveSaida)
          .entao({ scaleX: 1, scaleY: 1 }, movimento.padrao, Easing.costasSaida);
      }
    }
    return this;
  }

  comemorar() { return this.definirExpressao('comemorando'); }
  animar() { return this.definirExpressao('feliz'); }
  lamentar() { return this.definirExpressao('triste'); }

  atualizar(dt) {
    super.atualizar(dt);
    if (this.balanco) {
      this._t += dt * 2;
      this.y = this._baseY + Math.sin(this._t) * 5;
    }
    this._tempoAtePiscar -= dt;
    if (this._tempoAtePiscar <= 0) {
      this._piscar = 0.14;
      this._tempoAtePiscar = 2.5 + Math.random() * 3.5;
    }
    if (this._piscar > 0) this._piscar -= dt;
  }

  desenhar(ctx) {
    if (this.imagem) {
      if (this.imagem.naturalWidth > 0 && this.imagem.naturalHeight > 0) {
        const propor = this.imagem.naturalWidth / this.imagem.naturalHeight;
        const larguraReal = Math.round(this.tamanho * propor);
        if (this.largura !== larguraReal) {
          this.largura = larguraReal;
          this.altura = this.tamanho;
          this.regX = this.largura / 2;
          this.regY = this.altura / 2;
        }
      }
      ctx.drawImage(this.imagem, 0, 0, this.largura, this.altura);
      return;
    }
    this._desenharCoruja(ctx);
  }

  // ------------------------------------------------------- coruja vetorial

  _desenharCoruja(ctx) {
    const t = this.tamanho;
    const cx = t / 2;
    const piscando = this._piscar > 0;

    ctx.save();

    // ----- tufos de orelha
    ctx.fillStyle = this.corCorpo;
    ctx.beginPath();
    ctx.moveTo(cx - t * 0.30, t * 0.20);
    ctx.lineTo(cx - t * 0.16, t * 0.02);
    ctx.lineTo(cx - t * 0.06, t * 0.20);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + t * 0.30, t * 0.20);
    ctx.lineTo(cx + t * 0.16, t * 0.02);
    ctx.lineTo(cx + t * 0.06, t * 0.20);
    ctx.closePath();
    ctx.fill();

    // ----- corpo
    ctx.beginPath();
    ctx.ellipse(cx, t * 0.55, t * 0.38, t * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();

    // ----- barriga
    ctx.fillStyle = this.corBarriga;
    ctx.beginPath();
    ctx.ellipse(cx, t * 0.63, t * 0.25, t * 0.30, 0, 0, Math.PI * 2);
    ctx.fill();

    // ----- olhos
    const olhoY = t * 0.42;
    const olhoR = t * 0.145;
    const desvioX = t * 0.17;

    for (const lado of [-1, 1]) {
      const ox = cx + lado * desvioX;
      ctx.fillStyle = this.corOlho;
      ctx.beginPath();
      ctx.ellipse(ox, olhoY, olhoR, piscando ? olhoR * 0.16 : olhoR, 0, 0, Math.PI * 2);
      ctx.fill();

      if (!piscando) {
        let pupilaR = olhoR * 0.5;
        let pupilaY = olhoY;
        if (this.expressao === 'feliz' || this.expressao === 'comemorando') pupilaR = olhoR * 0.58;
        if (this.expressao === 'triste') pupilaY = olhoY + olhoR * 0.28;
        if (this.expressao === 'pensando') pupilaY = olhoY - olhoR * 0.22;

        ctx.fillStyle = this.corPupila;
        ctx.beginPath();
        ctx.arc(ox, pupilaY, pupilaR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(ox + pupilaR * 0.35, pupilaY - pupilaR * 0.4, pupilaR * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ----- sobrancelhas: é o que realmente lê como emoção
    ctx.strokeStyle = this.corCorpo;
    ctx.lineWidth = t * 0.035;
    ctx.lineCap = 'round';
    for (const lado of [-1, 1]) {
      const ox = cx + lado * desvioX;
      const topo = olhoY - olhoR * 1.25;
      ctx.beginPath();
      if (this.expressao === 'triste') {
        ctx.moveTo(ox - olhoR * 0.8 * lado, topo - olhoR * 0.18);
        ctx.lineTo(ox + olhoR * 0.8 * lado, topo + olhoR * 0.3);
      } else if (this.expressao === 'pensando') {
        ctx.moveTo(ox - olhoR * 0.8, topo + (lado < 0 ? -olhoR * 0.2 : 0));
        ctx.lineTo(ox + olhoR * 0.8, topo);
      } else {
        ctx.moveTo(ox - olhoR * 0.8, topo + olhoR * 0.1);
        ctx.quadraticCurveTo(ox, topo - olhoR * 0.35, ox + olhoR * 0.8, topo + olhoR * 0.1);
      }
      ctx.stroke();
    }

    // ----- bico
    ctx.fillStyle = this.corBico;
    ctx.beginPath();
    if (this.expressao === 'feliz' || this.expressao === 'comemorando') {
      ctx.moveTo(cx - t * 0.06, t * 0.52);
      ctx.quadraticCurveTo(cx, t * 0.66, cx + t * 0.06, t * 0.52);
    } else {
      ctx.moveTo(cx - t * 0.055, t * 0.52);
      ctx.lineTo(cx + t * 0.055, t * 0.52);
      ctx.lineTo(cx, t * 0.61);
    }
    ctx.closePath();
    ctx.fill();

    // ----- asas (levantadas ao comemorar)
    ctx.fillStyle = this.corCorpo;
    const asaLevantada = this.expressao === 'comemorando';
    for (const lado of [-1, 1]) {
      ctx.save();
      ctx.translate(cx + lado * t * 0.35, t * 0.55);
      ctx.rotate(lado * (asaLevantada ? -0.9 : -0.15));
      ctx.beginPath();
      ctx.ellipse(0, 0, t * 0.09, t * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ----- pés
    ctx.strokeStyle = this.corBico;
    ctx.lineWidth = t * 0.03;
    for (const lado of [-1, 1]) {
      const px = cx + lado * t * 0.12;
      ctx.beginPath();
      ctx.moveTo(px, t * 0.95);
      ctx.lineTo(px, t * 0.99);
      ctx.stroke();
    }

    ctx.restore();
  }
}
