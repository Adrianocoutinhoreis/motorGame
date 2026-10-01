/**
 * LoadingScreen — a tela de carregamento, viva ANTES do motor existir.
 *
 * Ela é HTML/CSS, e não uma cena de canvas, por um motivo prático: precisa
 * aparecer enquanto os módulos do motor ainda estão sendo baixados e antes de
 * qualquer `<canvas>` ter conteúdo. Uma cena só poderia aparecer depois de tudo
 * pronto — exatamente quando ela não é mais necessária.
 *
 * Sucede o `carregar_mc` dos originais, que era um MovieClip só escondido ao
 * final (`raiz.carregar_mc.visible = false`) e que, se um recurso falhasse,
 * ficava para sempre na tela sem explicar nada.
 *
 * O HTML esperado (já está no template de jogo):
 *   <div id="carregando"><p class="titulo">…</p><div class="barra"><i></i></div></div>
 */
export class LoadingScreen {
  constructor(seletor = '#carregando') {
    this.elemento = document.querySelector(seletor);
    this.barra = this.elemento?.querySelector('.barra > i') ?? null;
    this.titulo = this.elemento?.querySelector('.titulo') ?? null;
    if (!this.elemento) {
      console.warn(`[motor] LoadingScreen: elemento "${seletor}" não encontrado.`);
    }
  }

  definirTitulo(texto) {
    if (this.titulo) this.titulo.textContent = texto;
    return this;
  }

  /** @param {number} fracao 0..1 */
  definirProgresso(fracao) {
    if (this.barra) this.barra.style.width = `${Math.round(Math.max(0, Math.min(1, fracao)) * 100)}%`;
    return this;
  }

  /** Liga direto ao Loader: a barra passa a se atualizar sozinha. */
  acompanhar(loader) {
    loader.on('progresso', (fracao) => this.definirProgresso(fracao));
    return this;
  }

  mostrar() {
    if (this.elemento) {
      this.elemento.hidden = false;
      this.elemento.style.opacity = '1';
    }
    return this;
  }

  /** Some com uma transição curta e sai do fluxo. */
  esconder() {
    if (!this.elemento) return this;
    this.elemento.style.opacity = '0';
    setTimeout(() => { this.elemento.hidden = true; }, 420);
    return this;
  }

  /**
   * Mostra uma falha de forma honesta em vez de deixar a barra parada.
   * Quem abriu o jogo precisa saber que algo não carregou.
   */
  falhar(mensagem) {
    const alvo = document.querySelector('#erro-fatal');
    if (alvo) {
      alvo.textContent = mensagem;
      alvo.dataset.visivel = 'sim';
    }
    this.definirTitulo(mensagem);
    console.error('[motor]', mensagem);
    return this;
  }
}
