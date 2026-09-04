import { Emitter } from './Emitter.js';

/**
 * Loader — pré-carregamento de imagens e áudio com progresso.
 *
 * Sucede o `createjs.LoadQueue` dos jogos originais. Diferenças que importam:
 *
 * - Um item que falha **não derruba o carregamento**: registra o erro, entrega
 *   `null` e o jogo decide o que fazer. Nos originais, um MP3 ausente travava a
 *   tela de carregamento para sempre, sem mensagem.
 * - Todos os caminhos são resolvidos como RELATIVOS à página do jogo, o que é o
 *   requisito de publicar a pasta sozinha em qualquer subpasta do servidor.
 *
 * Emite: 'progresso' (0..1, item), 'erro' (item, erro), 'completo' (recursos).
 */
export class Loader extends Emitter {
  constructor() {
    super();
    /** @type {Map<string, HTMLImageElement>} */
    this.imagens = new Map();
    /** @type {Map<string, ArrayBuffer>} */
    this.audios = new Map();
    this.falhas = [];
  }

  /**
   * @param {Array<{id: string, src: string, tipo?: 'imagem'|'audio'}>} manifesto
   */
  async carregar(manifesto) {
    const itens = manifesto.filter(Boolean);
    const total = itens.length;
    let prontos = 0;

    if (total === 0) {
      this.emit('progresso', 1, null);
      this.emit('completo', this);
      return this;
    }

    const avancar = (item) => {
      prontos++;
      this.emit('progresso', prontos / total, item);
    };

    await Promise.all(itens.map(async (item) => {
      const tipo = item.tipo ?? Loader.detectarTipo(item.src);
      try {
        if (tipo === 'imagem') {
          this.imagens.set(item.id, await Loader.carregarImagem(item.src));
        } else if (tipo === 'audio') {
          this.audios.set(item.id, await Loader.carregarBinario(item.src));
        } else {
          throw new Error(`tipo desconhecido para "${item.src}"`);
        }
      } catch (err) {
        this.falhas.push({ item, erro: err });
        console.error(`[motor] falha ao carregar "${item.id}" (${item.src}):`, err);
        this.emit('erro', item, err);
      } finally {
        avancar(item);
      }
    }));

    if (this.falhas.length > 0) {
      console.warn(`[motor] ${this.falhas.length} recurso(s) não carregaram; o jogo segue sem eles.`);
    }
    this.emit('completo', this);
    return this;
  }

  /**
   * Devolve uma imagem já carregada, ou null.
   *
   * Pedir sem id (`null`/`undefined`) NÃO é erro: é o jogo dizendo "não tenho
   * arte para isto". As telas padrão fazem exatamente isso com
   * `loader.imagem(config.mascote?.asset)` quando o jogo usa a coruja vetorial —
   * que é o padrão de todo jogo novo. Avisar ali imprimia
   * `imagem "undefined" não foi carregada` em toda partida, e um aviso sobre
   * nada é pior que nenhum aviso: ensina a ignorar o console. Id AUSENTE segue
   * avisando alto, porque aí falta um arquivo de verdade.
   */
  imagem(id) {
    if (id == null) return null;
    const img = this.imagens.get(id);
    if (!img) console.warn(`[motor] imagem "${id}" não foi carregada.`);
    return img ?? null;
  }

  audio(id) {
    return this.audios.get(id) ?? null;
  }

  static detectarTipo(src) {
    const ext = src.split('?')[0].split('.').pop().toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'imagem';
    if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext)) return 'audio';
    return null;
  }

  static carregarImagem(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`imagem não carregou: ${src}`));
      img.src = src;
    });
  }

  static async carregarBinario(src) {
    const resposta = await fetch(src);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status} em ${src}`);
    return resposta.arrayBuffer();
  }
}
