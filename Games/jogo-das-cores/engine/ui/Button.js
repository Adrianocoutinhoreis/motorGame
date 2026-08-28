import { Node } from '../core/Node.js';
import { Tween, Easing } from '../core/Tween.js';
import { desenharIcone } from '../theme/icons.js';
import { texto as aplicarCaixa } from '../theme/texto.js';
import { cores, tipografia, raio, sombras, movimento, alvoAcessivel } from '../theme/tokens.js';

/**
 * Button — o botão do motor: superfície arredondada, ícone e rótulo.
 *
 * Decisões que vêm do perfil 4–7 anos e não são negociáveis:
 *
 * - **Tamanho mínimo garantido no construtor.** Nenhum botão pode nascer menor
 *   que o alvo acessível; se o layout pedir menos, o botão cresce. É a forma de
 *   a regra valer sempre, e não só quando alguém lembra dela.
 * - **Ícone junto do texto.** Boa parte do público ainda não lê; o desenho é
 *   quem comunica, e o rótulo é apoio.
 * - **Só dispara se apertar e soltar no mesmo botão** (regra do `Input`), então
 *   o aluno pode "desistir" arrastando o dedo para fora — perdoa o toque errado.
 * - **Feedback triplo**: afunda (visual), toca um som (auditivo) e pode narrar
 *   (fala), porque um único canal de retorno não serve a todo mundo.
 */
export class Button extends Node {
  /**
   * @param {object} opcoes
   *   rotulo {string}          texto (opcional)
   *   icone {string}           chave de ICONES (opcional)
   *   largura, altura {number}
   *   cor, corTexto {string}
   *   variante {'primario'|'secundario'|'suave'|'perigo'}
   *   audio, somToque {AudioBus, string}
   *   fala {string}            id de narração ao tocar
   *   aoTocar {Function}
   */
  constructor(opcoes = {}) {
    const altura = alvoAcessivel(opcoes.altura ?? 88);
    const largura = alvoAcessivel(opcoes.largura ?? 280);

    super({ ...opcoes, largura, altura, interativo: true });

    this.rotulo = opcoes.rotulo ?? '';
    this.icone = opcoes.icone ?? null;
    this.variante = opcoes.variante ?? 'primario';
    this.tamanhoTexto = opcoes.tamanhoTexto ?? tipografia.corpo;
    this.raioCanto = opcoes.raio ?? raio.lg;
    this.habilitado = opcoes.habilitado ?? true;
    this.pulse = opcoes.pulse ?? false;
    this._tPulse = Math.random() * 10;

    this.audio = opcoes.audio ?? null;
    this.somToque = opcoes.somToque ?? null;
    this.fala = opcoes.fala ?? null;
    this.aoTocar = opcoes.aoTocar ?? null;

    const paleta = Button.PALETAS[this.variante] ?? Button.PALETAS.primario;
    this.cor = opcoes.cor ?? paleta.fundo;
    this.corTexto = opcoes.corTexto ?? paleta.texto;
    this.corBorda = opcoes.corBorda ?? paleta.borda;

    // O ponto de registro no centro faz a animação de "afundar" escalar a partir
    // do meio, e não do canto.
    this.regX = largura / 2;
    this.regY = altura / 2;
    this.x += largura / 2;
    this.y += altura / 2;

    this._pressionado = false;

    this.on('apertar', () => this._animarPressao(true));
    this.on('soltar', () => this._animarPressao(false));
    this.on('sair', () => this._animarPressao(false));
    this.on('toque', () => this._acionar());
  }

  static PALETAS = {
    primario: { fundo: cores.primaria, texto: '#FFFFFF', borda: cores.primariaEscura },
    secundario: { fundo: '#7C3AED', texto: '#FFFFFF', borda: '#5B21B6' },
    dourado: { fundo: '#F59E0B', texto: '#FFFFFF', borda: '#B45309' },
    suave: { fundo: '#FFFFFF', texto: '#1E293B', borda: '#334155' },
    perigo: { fundo: cores.erro, texto: '#FFFFFF', borda: '#991B1B' },
    sucesso: { fundo: '#22C55E', texto: '#FFFFFF', borda: '#15803D' },
  };

  atualizar(dt) {
    super.atualizar(dt);
    if (this.pulse && this.habilitado && !this._pressionado) {
      this._tPulse += dt * 3.5;
      const k = 1 + Math.sin(this._tPulse) * 0.035;
      this.scaleX = k;
      this.scaleY = k;
    }
  }

  _animarPressao(pressionado) {
    if (!this.habilitado || this._pressionado === pressionado) return;
    this._pressionado = pressionado;
    Tween.removerDe(this);
    Tween.para(
      this,
      { scaleX: pressionado ? 0.94 : 1, scaleY: pressionado ? 0.94 : 1 },
      movimento.rapido,
      pressionado ? Easing.suaveSaida : Easing.costasSaida,
    );
  }

  _acionar() {
    if (!this.habilitado) return;
    if (this.audio) {
      if (this.somToque) this.audio.efeito(this.somToque);
      if (this.fala) this.audio.falar(this.fala, { texto: this.rotulo || undefined });
    }
    try {
      this.aoTocar?.(this);
    } catch (err) {
      console.error('[motor] aoTocar do botão falhou:', err);
    }
    this.emit('acionado', this);
  }

  definirHabilitado(valor) {
    this.habilitado = !!valor;
    this.interativo = this.habilitado;
    this.alpha = this.habilitado ? 1 : 0.45;
    return this;
  }

  desenhar(ctx) {
    const { largura: l, altura: a } = this;
    const r = Math.min(this.raioCanto, l / 2, a / 2);

    ctx.save();

    // Base sólida 3D de relevo embaixo
    if (this.habilitado && !this._pressionado) {
      ctx.fillStyle = this.corBorda;
      ctx.beginPath();
      ctx.roundRect(0, 8, l, a, r);
      ctx.fill();
    }

    ctx.shadowColor = sombras.botao.cor;
    ctx.shadowBlur = this._pressionado ? 4 : sombras.botao.desfoque;
    ctx.shadowOffsetY = this._pressionado ? 2 : sombras.botao.y;
    ctx.fillStyle = this.cor;
    ctx.beginPath();
    ctx.roundRect(0, 0, l, a, r);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Brilho biseado superior (Glossy top highlight)
    if (this.habilitado && !this._pressionado) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath();
      ctx.roundRect(4, 3, l - 8, a * 0.42, [r - 2, r - 2, 4, 4]);
      ctx.fill();
    }

    // Conteúdo: ícone + rótulo, centralizados juntos.
    const tamIcone = Math.min(a * 0.5, 44);
    const espacoIcone = this.icone ? tamIcone + 14 : 0;

    const rotulo = aplicarCaixa(this.rotulo);
    ctx.font = `${tipografia.pesoForte} ${this.tamanhoTexto}px ${tipografia.familia}`;
    const larguraTexto = rotulo ? ctx.measureText(rotulo).width : 0;
    const larguraConteudo = espacoIcone + larguraTexto;
    let cursorX = (l - larguraConteudo) / 2;

    if (this.icone) {
      ctx.save();
      ctx.translate(cursorX, (a - tamIcone) / 2);
      desenharIcone(ctx, this.icone, tamIcone, this.corTexto, 2.4);
      ctx.restore();
      cursorX += espacoIcone;
    }

    if (rotulo) {
      ctx.fillStyle = this.corTexto;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(rotulo, cursorX, a / 2 + 1);
    }

    ctx.restore();
  }

  contemPontoLocal(x, y) {
    return x >= 0 && y >= 0 && x <= this.largura && y <= this.altura;
  }
}

/**
 * IconButton — botão redondo só com ícone (som, pausa, voltar, setas).
 * Mesmas garantias do Button, incluindo o tamanho mínimo tocável.
 */
export class IconButton extends Button {
  constructor(opcoes = {}) {
    const lado = alvoAcessivel(opcoes.tamanho ?? 72);
    super({
      ...opcoes,
      rotulo: '',
      largura: lado,
      altura: lado,
      raio: lado / 2,
      variante: opcoes.variante ?? 'suave',
    });
    this.tamanhoIcone = opcoes.tamanhoIcone ?? lado * 0.5;
  }

  desenhar(ctx) {
    const lado = this.largura;
    const r = lado / 2;
    ctx.save();

    // 1. Base 3D de relevo no fundo para dar peso visual e destacar da nuvem
    if (this.habilitado && !this._pressionado) {
      ctx.fillStyle = this.corBorda || '#1E293B';
      ctx.beginPath();
      ctx.arc(r, r + 4, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Sombra projetada
    ctx.shadowColor = sombras.suave?.cor ?? 'rgba(15, 23, 42, 0.25)';
    ctx.shadowBlur = this._pressionado ? 3 : 6;
    ctx.shadowOffsetY = this._pressionado ? 1 : 3;
    ctx.fillStyle = this.cor;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // 3. Contorno forte de alto contraste (garante destaque absoluto contra nuvens)
    const strokeCor = this.corBorda || '#334155';
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = strokeCor;
    ctx.stroke();

    // 4. Brilho biseado superior (Glossy top highlight)
    if (this.habilitado && !this._pressionado) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.arc(r, r * 0.52, r * 0.74, Math.PI * 1.15, Math.PI * 1.85);
      ctx.fill();
    }

    // 5. Ícone centralizado
    if (this.icone) {
      const t = this.tamanhoIcone;
      ctx.translate((lado - t) / 2, (lado - t) / 2);
      desenharIcone(ctx, this.icone, t, this.corTexto, 2.5);
    }
    ctx.restore();
  }

  contemPontoLocal(x, y) {
    const r = this.largura / 2;
    const dx = x - r;
    const dy = y - r;
    return dx * dx + dy * dy <= r * r;
  }
}
