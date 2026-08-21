import { Node } from './Node.js';

/**
 * Scene — uma tela do jogo (menu, tutorial, partida, resultado…).
 *
 * Ciclo de vida:
 *   preload()  → assíncrono, antes de entrar (pode devolver um manifesto)
 *   aoEntrar() → monta a árvore visual
 *   atualizar(dt) → por quadro
 *   aoSair()   → limpa o que criou
 *
 * A cena É um Node: tudo que ela adiciona a si mesma some junto quando ela sai.
 * Esse detalhe é o que evita o vazamento clássico dos jogos originais, onde
 * `resetaJogo()` precisava percorrer arrays removendo blocos na mão — e às
 * vezes esquecia um.
 */
export class Scene extends Node {
  /**
   * @param {object} contexto injetado pelo Game: { game, stage, input, audio, loader, storage, config, largura, altura }
   */
  constructor(contexto = {}) {
    super({ nome: contexto.nome ?? 'cena', filhosInterativos: true });
    this.ctx = contexto;
    this.game = contexto.game ?? null;
    this.stage = contexto.stage ?? null;
    this.input = contexto.input ?? null;
    this.audio = contexto.audio ?? null;
    this.loader = contexto.loader ?? null;
    this.storage = contexto.storage ?? null;
    this.config = contexto.config ?? {};
    this.largura = contexto.largura ?? this.stage?.larguraLogica ?? 1280;
    this.altura = contexto.altura ?? this.stage?.alturaLogica ?? 720;

    /** Assinaturas a desfazer no aoSair(). */
    this._inscricoes = [];
    this.pausada = false;
  }

  /** Registra um `off` para rodar automaticamente ao sair da cena. */
  aoDesmontar(desfazer) {
    if (typeof desfazer === 'function') this._inscricoes.push(desfazer);
    return desfazer;
  }

  /** Assina um evento do Input já com limpeza automática. */
  ouvirEntrada(evento, fn) {
    return this.aoDesmontar(this.input.on(evento, fn));
  }

  /** Manifesto de recursos que esta cena precisa. Sobrescreva se necessário. */
  async preload() {}

  /** Monta a cena. Sobrescreva. */
  aoEntrar() {}

  /** Limpeza extra. A remoção dos filhos e das inscrições é automática. */
  aoSair() {}

  /** Chamado pelo Game — não sobrescreva; use `aoSair`. */
  _desmontar() {
    try {
      this.aoSair();
    } catch (err) {
      console.error('[motor] aoSair falhou:', err);
    }
    for (const desfazer of this._inscricoes) {
      try { desfazer(); } catch { /* ignora */ }
    }
    this._inscricoes.length = 0;
    this.destruir();
  }

  atualizar(dt) {
    if (this.pausada) return;
    super.atualizar(dt);
  }

  /** Atalho: troca para outra cena. */
  irPara(nomeDaCena, dados) {
    this.game.irPara(nomeDaCena, dados);
  }
}
