import { Emitter } from '../core/Emitter.js';

/**
 * GridBoard — tabuleiro em grade com adjacência, sequências e gravidade.
 *
 * Extraído da lógica que estava duplicada (e sutilmente diferente) no
 * `JogoCores.js` e no `JogoFormas.js`: procurar peças iguais vizinhas, remover
 * um grupo, fazer as de cima caírem, subir uma linha nova. Nos originais isso
 * eram laços aninhados manipulando `arrayBlocos[lin][col]` direto, com casos de
 * borda tratados de forma diferente em cada jogo — e um `console.log('ERRO')`
 * no meio do `JogoFormas.js` denunciando que o estado às vezes divergia.
 *
 * Aqui a grade é um dado só, e as operações são funções puras sobre ela.
 * A peça pode ser qualquer objeto; o tabuleiro só olha `peca.tipo`.
 */
export class GridBoard extends Emitter {
  /**
   * @param {object} opcoes
   *   linhas, colunas {number}
   *   diagonais {boolean} vizinhança de 8 (Cores) em vez de 4 (Formas)
   */
  constructor(opcoes = {}) {
    super();
    this.linhas = opcoes.linhas ?? 5;
    this.colunas = opcoes.colunas ?? 7;
    this.diagonais = opcoes.diagonais ?? false;
    /** @type {Array<Array<object|null>>} */
    this.celulas = [];
    this.limpar();
  }

  limpar() {
    this.celulas = Array.from({ length: this.linhas }, () => new Array(this.colunas).fill(null));
    this.emit('limpo', this);
    return this;
  }

  dentro(lin, col) {
    return lin >= 0 && col >= 0 && lin < this.linhas && col < this.colunas;
  }

  obter(lin, col) {
    return this.dentro(lin, col) ? this.celulas[lin][col] : null;
  }

  definir(lin, col, peca) {
    if (!this.dentro(lin, col)) return this;
    this.celulas[lin][col] = peca;
    if (peca) { peca.lin = lin; peca.col = col; }
    return this;
  }

  remover(lin, col) {
    const peca = this.obter(lin, col);
    if (peca) this.celulas[lin][col] = null;
    return peca;
  }

  /** Todas as peças não nulas, em ordem de linha. */
  todas() {
    const lista = [];
    for (let lin = 0; lin < this.linhas; lin++) {
      for (let col = 0; col < this.colunas; col++) {
        const p = this.celulas[lin][col];
        if (p) lista.push(p);
      }
    }
    return lista;
  }

  /** Percorre a grade. `fn(peca, lin, col)`. */
  paraCada(fn) {
    for (let lin = 0; lin < this.linhas; lin++) {
      for (let col = 0; col < this.colunas; col++) fn(this.celulas[lin][col], lin, col);
    }
    return this;
  }

  /** Vizinhos ocupados de uma posição (4 ou 8, conforme `diagonais`). */
  vizinhos(lin, col) {
    const deltas = this.diagonais
      ? [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
      : [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const lista = [];
    for (const [dl, dc] of deltas) {
      const p = this.obter(lin + dl, col + dc);
      if (p) lista.push(p);
    }
    return lista;
  }

  /**
   * Grupo conectado de peças do MESMO tipo a partir de uma peça (flood-fill).
   * Iterativo de propósito: a versão recursiva do jogo original estourava a
   * pilha quando o tabuleiro ficava quase todo da mesma cor.
   */
  grupoConectado(peca) {
    if (!peca) return [];
    const alvo = peca.tipo;
    const vistos = new Set([peca]);
    const fila = [peca];
    const grupo = [];

    while (fila.length > 0) {
      const atual = fila.pop();
      grupo.push(atual);
      for (const vizinho of this.vizinhos(atual.lin, atual.col)) {
        if (!vistos.has(vizinho) && vizinho.tipo === alvo) {
          vistos.add(vizinho);
          fila.push(vizinho);
        }
      }
    }
    return grupo;
  }

  /** Todos os grupos com pelo menos `minimo` peças. */
  gruposValidos(minimo = 3) {
    const vistos = new Set();
    const grupos = [];
    for (const peca of this.todas()) {
      if (vistos.has(peca)) continue;
      const grupo = this.grupoConectado(peca);
      for (const p of grupo) vistos.add(p);
      if (grupo.length >= minimo) grupos.push(grupo);
    }
    return grupos;
  }

  /** Remove um grupo do tabuleiro e devolve as peças removidas. */
  removerGrupo(grupo) {
    for (const peca of grupo) {
      if (this.obter(peca.lin, peca.col) === peca) this.celulas[peca.lin][peca.col] = null;
    }
    this.emit('grupoRemovido', grupo, this);
    return grupo;
  }

  /**
   * Aplica gravidade: peças caem para o maior índice de linha livre.
   * @param {'baixo'|'cima'} sentido 'baixo' = linha 0 é o topo (Cores);
   *                                  'cima'  = a pilha cresce para o topo (Formas)
   * @returns {Array<{peca, deLin, paraLin, col}>} movimentos, para animar
   */
  aplicarGravidade(sentido = 'baixo') {
    const movimentos = [];
    for (let col = 0; col < this.colunas; col++) {
      if (sentido === 'baixo') {
        let destino = this.linhas - 1;
        for (let lin = this.linhas - 1; lin >= 0; lin--) {
          const peca = this.celulas[lin][col];
          if (!peca) continue;
          if (lin !== destino) {
            this.celulas[destino][col] = peca;
            this.celulas[lin][col] = null;
            movimentos.push({ peca, deLin: lin, paraLin: destino, col });
            peca.lin = destino;
          }
          destino--;
        }
      } else {
        let destino = 0;
        for (let lin = 0; lin < this.linhas; lin++) {
          const peca = this.celulas[lin][col];
          if (!peca) continue;
          if (lin !== destino) {
            this.celulas[destino][col] = peca;
            this.celulas[lin][col] = null;
            movimentos.push({ peca, deLin: lin, paraLin: destino, col });
            peca.lin = destino;
          }
          destino++;
        }
      }
    }
    if (movimentos.length > 0) this.emit('gravidade', movimentos, this);
    return movimentos;
  }

  /** Posições vazias, para saber onde repor peças. */
  vazias() {
    const lista = [];
    this.paraCada((peca, lin, col) => { if (!peca) lista.push({ lin, col }); });
    return lista;
  }

  /** Existe ao menos um grupo válido no tabuleiro? (fim de jogo por travamento) */
  temJogada(minimo = 3) {
    return this.gruposValidos(minimo).length > 0;
  }

  /**
   * Troca o tipo de peças que já nascem formando grupo — evita pontos de graça
   * ao montar o tabuleiro. (O original fazia isso em `validaLinha`, sorteando
   * num `while` que podia, em teoria, não terminar; aqui há limite de tentativas.)
   * @param {Function} sortearTipo função que devolve um tipo novo
   */
  desfazerCombosIniciais(sortearTipo, minimo = 3, maxTentativas = 40) {
    for (const peca of this.todas()) {
      let tentativas = 0;
      while (this.grupoConectado(peca).length >= minimo && tentativas++ < maxTentativas) {
        peca.tipo = sortearTipo(peca);
      }
      if (tentativas >= maxTentativas) {
        console.warn('[motor] GridBoard: não consegui desfazer um combo inicial; seguindo assim mesmo.');
      }
    }
    return this;
  }

  /** Representação em texto — usada nos testes e ótima para depurar. */
  paraTexto(vazio = '.') {
    return this.celulas
      .map((linha) => linha.map((p) => (p ? String(p.tipo).charAt(0) : vazio)).join(' '))
      .join('\n');
  }
}
