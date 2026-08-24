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
 *
 * **REGRA: todo som sai de arquivo.** O motor não sintetiza voz nem gera tom.
 * Faltando a gravação, a tela fica em silêncio e o console diz qual arquivo
 * falta — ver `_avisarNarracaoAusente`.
 *
 * A voz sintética do navegador chegou a cobrir essa lacuna e foi removida de
 * propósito. O ponto NÃO é que voz sintetizada seja ruim — a locução dos jogos
 * deste motor é sintética, e sempre foi. O ponto é QUANDO ela é sintetizada:
 * um arquivo é fixo, revisável, transcrito numa ficha e idêntico em todo
 * aparelho; a API de síntese do navegador decide o timbre no aparelho do aluno,
 * em tempo de execução, e não existe em parte dos tablets escolares. (O nome da
 * API não aparece escrito aqui de propósito: o teste que trava esta regra varre
 * o motor por substring, e é bom que ele seja simples demais para ter exceção.)
 * Numa atividade cujo
 * conteúdo pedagógico É a palavra falada, ninguém pode revisar o que a criança
 * vai ouvir se isso só se decide na hora.
 *
 * Silêncio é uma falha visível; fala que ninguém revisou é uma falha disfarçada.
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
    /** Lacunas de narração já denunciadas — para avisar uma vez, não a cada quadro. */
    this._avisados = new Set();

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
   * @param {string|null} id id de um áudio registrado. Sem arquivo não há fala.
   * @param {{texto?: string, aoTerminar?: Function}} opcoes
   *   `texto` é o que a locução DIZ, escrito. Não é lido por voz sintética:
   *   serve à legenda (evento `narracao`) e faz o aviso de console nomear
   *   exatamente a gravação que falta.
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

    if (item.id && this.temSom(item.id)) {
      // A legenda escuta aqui: o texto acompanha a fala que está começando.
      this.emit('narracao', { id: item.id, texto: item.texto ?? null });
      const handle = await this.tocar(item.id, { canal: 'speech', aoTerminar: () => encerrar(true) });
      if (!handle) encerrar(false);
      return;
    }

    this._avisarNarracaoAusente(item);
    encerrar(false);
  }

  /**
   * Denuncia uma narração que não tem arquivo, uma vez por lacuna.
   *
   * O motor não cobre esse buraco (ver a REGRA no topo da classe), então faz a
   * única coisa honesta: cala a boca e diz no console qual gravação falta e o
   * que ela deveria dizer. É esta mensagem que transforma "o jogo está meio
   * mudo" em uma lista de trabalho.
   *
   * Avisa uma vez por lacuna porque a tela de tutorial renarra a cada ida e
   * volta de passo, e um aviso repetido afoga o resto do console.
   */
  _avisarNarracaoAusente(item) {
    const chave = item.id ?? `texto:${item.texto ?? ''}`;
    if (this._avisados.has(chave)) return;
    this._avisados.add(chave);

    const alvo = item.id
      ? `o áudio "${item.id}" não está registrado`
      : 'nenhum áudio foi declarado no config para esta fala';
    const diz = item.texto ? ` Deveria dizer: "${item.texto}".` : '';
    console.warn(`[motor] narração ausente: ${alvo}; fica em silêncio.${diz}`);
  }

  /** Lacunas de narração encontradas nesta sessão. Útil ao revisar o jogo. */
  get narracoesAusentes() {
    return [...this._avisados];
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
    this.emit('mudo', this._mudo);
  }

  alternarMudo() {
    this.mudo = !this._mudo;
    return this._mudo;
  }

  pausarTudo() {
    if (this.ctx?.state === 'running') this.ctx.suspend().catch(() => {});
  }

  retomarTudo() {
    if (this.ctx?.state === 'suspended' && this._destravado) this.ctx.resume().catch(() => {});
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
