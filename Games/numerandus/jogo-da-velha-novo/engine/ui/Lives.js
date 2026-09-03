import { Node } from '../core/Node.js';
import { Tween, Easing } from '../core/Tween.js';
import { desenharIcone } from '../theme/icons.js';
import { cores, movimento } from '../theme/tokens.js';

/**
 * Lives — as vidas restantes, em ícones.
 *
 * Sucede o `vidas_mc` + `folhaVida` do Jogo dos Blocos, onde perder uma vida
 * era `jogo.vidas_mc['v'+numErros+'_mc'].visible = false` — some, sem aviso.
 * Para uma criança de 5 anos, um elemento que simplesmente desaparece não
 * comunica "você perdeu uma chance".
 *
 * Aqui a vida perdida ENCOLHE e apaga com animação, e a que restou pulsa. O
 * ícone continua desenhado em contorno depois de perdido, para que o aluno veja
 * quantas chances tinha no total — informação que o original apagava.
 */
export class Lives extends Node {
  constructor(opcoes = {}) {
    const total = opcoes.total ?? 3;
    const tamanho = opcoes.tamanho ?? 44;
    const espaco = opcoes.espaco ?? 10;

    super({
      largura: total * tamanho + (total - 1) * espaco,
      altura: tamanho,
      ...opcoes,
    });

    this.total = total;
    this.tamanho = tamanho;
    this.espaco = espaco;
    this.icone = opcoes.icone ?? 'coracao';
    this.cor = opcoes.cor ?? cores.erro;
    this.corVazia = opcoes.corVazia ?? 'rgba(17,24,39,0.22)';

    /** Escala individual de cada ícone, para animar a perda. */
    this._escalas = Array.from({ length: total }, () => 1);
    this.restantes = total;
  }

  /** Define quantas vidas restam, animando as que acabaram de sumir. */
  definir(restantes) {
    const antes = this.restantes;
    this.restantes = Math.max(0, Math.min(restantes, this.total));

    // Vidas recuperadas (nova partida) voltam cheias imediatamente.
    for (let i = 0; i < this.restantes; i++) this._escalas[i] = 1;

    for (let i = this.restantes; i < antes; i++) {
      const alvo = { valor: 1 };
      // "Estufa e murcha": chama atenção para a chance perdida sem assustar.
      Tween.para(alvo, { valor: 1.45 }, movimento.rapido, Easing.suaveSaida)
        .entao({ valor: 0 }, movimento.padrao, Easing.suaveEntrada);
      this._animando ??= [];
      this._animando.push({ indice: i, alvo });
    }
    return this;
  }

  /** Liga às vidas de um ScoreSystem. */
  acompanhar(placar) {
    this.definir(placar.vidas);
    placar.on('mudou', () => this.definir(placar.vidas));
    return this;
  }

  atualizar(dt) {
    super.atualizar(dt);
    if (!this._animando) return;
    for (const item of this._animando) this._escalas[item.indice] = item.alvo.valor;
    this._animando = this._animando.filter((item) => item.alvo.valor > 0.001);
  }

  desenhar(ctx) {
    const passo = this.tamanho + this.espaco;
    for (let i = 0; i < this.total; i++) {
      const cheia = i < this.restantes;
      const escala = cheia ? 1 : this._escalas[i];

      ctx.save();
      ctx.translate(i * passo + this.tamanho / 2, this.tamanho / 2);

      // O contorno da vida perdida fica sempre visível: mostra o total de chances.
      if (!cheia) {
        ctx.save();
        ctx.translate(-this.tamanho / 2, -this.tamanho / 2);
        ctx.globalAlpha *= 0.5;
        desenharIcone(ctx, this.icone, this.tamanho, this.corVazia, 2);
        ctx.restore();
      }

      if (escala > 0.001) {
        ctx.scale(escala, escala);
        ctx.translate(-this.tamanho / 2, -this.tamanho / 2);
        desenharIcone(ctx, this.icone, this.tamanho, this.cor, 2);
      }
      ctx.restore();
    }
  }
}
