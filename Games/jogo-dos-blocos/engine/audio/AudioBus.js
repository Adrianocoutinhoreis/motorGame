import { Emitter } from './../core/Emitter.js';

/**
 * AudioBus — todo o som do jogo em três canais.
 *
 *   music  — fundo em laço, volume baixo
 *   sfx    — efeitos curtos (acerto, erro, clique), podem se sobrepor
 *   speech — NARRAÇÃO, e este é o canal que justifica a classe inteira
 *
 * O canal `speech` é uma FILA serializada: "três", "quadrado", "azul" nunca
 * tocam por cima da instrução ou uma da outra. Os jogos originais chamavam
 * `createjs.Sound.play()` direto e as falas se atropelavam — num jogo cujo
 * conteúdo pedagógico É a palavra falada, isso destrói a aula.
 *
 * Também resolve a política de autoplay: navegadores modernos bloqueiam áudio
 * antes de um gesto do usuário, e é por isso que os jogos originais hoje abrem
 * mudos. `destravar()` é chamado pelo Game no primeiro toque.
 */
export class AudioBus extends Emitter {
  constructor(opcoes = {}) {
    super();
    this.storage = opcoes.storage ?? null;

    /** @type {AudioContext|null} */
    this.ctx = null;
    /** id → ArrayBuffer (cópia intocada, para poder redecodificar) */
    this._brutos = new Map();
    /** id → AudioBuffer decodificado */
    this._buffers = new Map();
    /** Fontes tocando agora, por canal. */
    this._tocando = { music: new Set(), sfx: new Set(), speech: new Set() };

    this.volumes = {
      music: opcoes.volumeMusica ?? 0.25,
      sfx: opcoes.volumeEfeitos ?? 0.8,
      speech: opcoes.volumeFala ?? 1,
    };

    this._filaFala = [];
    this._falando = false;
    this._musicaAtual = null;
    this._destravado = false;

    this._mudo = this.storage ? this.storage.ler('mudo', false) : false;
  }

  // ------------------------------------------------------------------ registro

  /** Guarda um recurso de áudio já baixado (ArrayBuffer vindo do Loader). */
  registrar(id, arrayBuffer) {
    if (!arrayBuffer) return this;
    this._brutos.set(id, arrayBuffer);
    return this;
  }

  /** Registra de uma vez todos os áudios que o Loader baixou. */
  registrarDoLoader(loader) {
    for (const [id, buffer] of loader.audios) this.registrar(id, buffer);
    return this;
  }

  temSom(id) {
    return this._brutos.has(id) || this._buffers.has(id);
  }

  // ------------------------------------------------------------------ contexto

  _garantirContexto() {
    if (!this.ctx) {
      const Contexto = window.AudioContext || window.webkitAudioContext;
      if (!Contexto) {
        console.warn('[motor] WebAudio indisponível; o jogo roda sem som.');
        return null;
      }
      this.ctx = new Contexto();
      this._ganhos = {};
      for (const canal of ['music', 'sfx', 'speech']) {
        const ganho = this.ctx.createGain();
        ganho.gain.value = this._mudo ? 0 : this.volumes[canal];
        ganho.connect(this.ctx.destination);
        this._ganhos[canal] = ganho;
      }
    }
    return this.ctx;
  }

  /** Chamado no primeiro gesto do usuário. Sem isto, nada toca. */
  async destravar() {
    const ctx = this._garantirContexto();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch { /* ignora */ }
    }
    this._destravado = ctx.state === 'running';
    if (this._destravado) this.emit('destravado');
    return this._destravado;
  }

  async _decodificar(id) {
    if (this._buffers.has(id)) return this._buffers.get(id);
    const ctx = this._garantirContexto();
    const bruto = this._brutos.get(id);
    if (!ctx || !bruto) return null;
    try {
      // `decodeAudioData` DESTACA o ArrayBuffer que recebe; decodificar a partir
      // de uma cópia mantém o original reutilizável (ex.: recriar o contexto).
      const copia = bruto.slice(0);
      const buffer = await ctx.decodeAudioData(copia);
      this._buffers.set(id, buffer);
      return buffer;
    } catch (err) {
      console.error(`[motor] áudio "${id}" não pôde ser decodificado:`, err);
      return null;
    }
  }

  // ------------------------------------------------------------- reprodução

  /**
   * Toca um som.
   * @returns {Promise<{parar: Function}|null>}
   */
  async tocar(id, opcoes = {}) {
    const canal = opcoes.canal ?? 'sfx';
    const ctx = this._garantirContexto();
    if (!ctx) return null;
    if (!this.temSom(id)) {
      console.warn(`[motor] som "${id}" não registrado.`);
      return null;
    }

    const buffer = await this._decodificar(id);
    if (!buffer) return null;

    const fonte = ctx.createBufferSource();
    fonte.buffer = buffer;
    fonte.loop = opcoes.loop ?? false;

    let saida = this._ganhos[canal];
    if (opcoes.volume !== undefined) {
      const ganhoLocal = ctx.createGain();
      ganhoLocal.gain.value = opcoes.volume;
      ganhoLocal.connect(saida);
      saida = ganhoLocal;
    }
    fonte.connect(saida);

    const conjunto = this._tocando[canal];
    conjunto.add(fonte);
    fonte.onended = () => {
      conjunto.delete(fonte);
      opcoes.aoTerminar?.();
    };

    try {
      fonte.start(0);
    } catch (err) {
      console.error(`[motor] falha ao iniciar "${id}":`, err);
      return null;
    }

    return {
      fonte,
      duracao: buffer.duration,
      parar: () => { try { fonte.stop(); } catch { /* já parou */ } },
    };
  }

  /** Efeito curto. */
  efeito(id, opcoes = {}) {
    return this.tocar(id, { ...opcoes, canal: 'sfx' });
  }

  /** Música de fundo em laço (só uma por vez). */
  async musica(id, opcoes = {}) {
    if (this._musicaAtual?.id === id) return this._musicaAtual.handle;
    this.pararMusica();
    const handle = await this.tocar(id, { ...opcoes, canal: 'music', loop: true });
    this._musicaAtual = handle ? { id, handle } : null;
    return handle;
  }

  pararMusica() {
    this._musicaAtual?.handle?.parar();
    this._musicaAtual = null;
  }

  // ------------------------------------------------------------------- fala

  /**
   * Enfileira uma narração. É a API que os jogos devem usar para TODO conteúdo
   * falado — nunca `tocar()` direto, senão volta a atropelar.
   *
   * @param {string} id id do áudio registrado
   * @param {{texto?: string, aoTerminar?: Function}} opcoes
   *   `texto` é o fallback lido por síntese de voz quando o MP3 não existe
   *   (é assim que o nível "6 a 10" funciona antes de a narração ser gravada).
   */
  falar(id, opcoes = {}) {
    return new Promise((resolve) => {
      this._filaFala.push({ id, texto: opcoes.texto ?? null, resolver: resolve });
      this._processarFala();
    });
  }

  /** Interrompe a fala atual e esvazia a fila (ex.: aluno pulou a instrução). */
  calar() {
    for (const fonte of this._tocando.speech) {
      try { fonte.stop(); } catch { /* já parou */ }
    }
    this._tocando.speech.clear();
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    for (const item of this._filaFala) item.resolver(false);
    this._filaFala.length = 0;
    this._falando = false;
  }

  async _processarFala() {
    if (this._falando) return;
    const item = this._filaFala.shift();
    if (!item) return;

    this._falando = true;
    const encerrar = (ok) => {
      this._falando = false;
      item.resolver(ok);
      this._processarFala();
    };

    if (this.temSom(item.id)) {
      const handle = await this.tocar(item.id, { canal: 'speech', aoTerminar: () => encerrar(true) });
      if (!handle) encerrar(false);
      return;
    }

    if (item.texto) {
      this._sintetizar(item.texto, () => encerrar(true));
      return;
    }

    console.warn(`[motor] fala "${item.id}" sem áudio e sem texto de fallback.`);
    encerrar(false);
  }

  /**
   * Fallback de narração por síntese de voz do navegador.
   * Qualidade inferior a uma locução gravada — é uma ponte até o MP3 existir,
   * não o destino. Ver a pendência de áudio 6–10 no CHECKLIST do jogo.
   */
  _sintetizar(texto, aoTerminar) {
    if (this._mudo || typeof speechSynthesis === 'undefined') {
      aoTerminar();
      return;
    }
    try {
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = 'pt-BR';
      fala.rate = 0.9;
      fala.pitch = 1.1;
      const vozPt = speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith('pt'));
      if (vozPt) fala.voice = vozPt;
      fala.onend = aoTerminar;
      fala.onerror = aoTerminar;
      speechSynthesis.cancel();
      speechSynthesis.speak(fala);
      // Rede de segurança: alguns navegadores não disparam `onend` de forma
      // confiável, e a fila de fala ficaria travada para sempre.
      setTimeout(aoTerminar, Math.max(1500, texto.length * 120));
    } catch (err) {
      console.error('[motor] síntese de voz falhou:', err);
      aoTerminar();
    }
  }

  // -------------------------------------------------------------- mudo/pausa

  get mudo() {
    return this._mudo;
  }

  set mudo(valor) {
    this._mudo = !!valor;
    this.storage?.gravar('mudo', this._mudo);
    if (this._ganhos) {
      for (const canal of ['music', 'sfx', 'speech']) {
        this._ganhos[canal].gain.value = this._mudo ? 0 : this.volumes[canal];
      }
    }
    if (this._mudo && typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    this.emit('mudo', this._mudo);
  }

  alternarMudo() {
    this.mudo = !this._mudo;
    return this._mudo;
  }

  pausarTudo() {
    if (this.ctx?.state === 'running') this.ctx.suspend().catch(() => {});
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.pause?.();
  }

  retomarTudo() {
    if (this.ctx?.state === 'suspended' && this._destravado) this.ctx.resume().catch(() => {});
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.resume?.();
  }

  destruir() {
    this.calar();
    this.pararMusica();
    for (const canal of Object.keys(this._tocando)) {
      for (const fonte of this._tocando[canal]) {
        try { fonte.stop(); } catch { /* ignora */ }
      }
      this._tocando[canal].clear();
    }
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.offAll();
  }
}
