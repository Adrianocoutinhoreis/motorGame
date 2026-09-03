import { Emitter } from '../core/Emitter.js';
import { rand } from '../core/Rand.js';

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
 * A peça pode ser qualquer objeto; o tabuleiro lê dela só o "tipo", e quem diz
 * como se lê o tipo é `tipoDe`.
 */
export class GridBoard extends Emitter {
  /**
   * @param {object} opcoes
   *   linhas, colunas {number}
   *   diagonais {boolean} vizinhança de 8 (Cores) em vez de 4 (Formas)
   *   tipoDe {Function} extrai o atributo que decide se duas peças são iguais
   *     (padrão `peca.tipo`)
   */
  constructor(opcoes = {}) {
    super();
    this.linhas = opcoes.linhas ?? 5;
    this.colunas = opcoes.colunas ?? 7;
    this.diagonais = opcoes.diagonais ?? false;
    /**
     * Como se lê o "tipo" de uma peça. É função, e não nome de campo, pelo mesmo
     * motivo do `corDe` do `PathSelector`: o motor não supõe como o jogo guarda
     * o atributo que compara.
     *
     * **Isto nasceu de um defeito real.** O Jogo das Cores guarda `peca.cor`, e
     * o padrão daqui era `peca.tipo` cravado — então `temJogada()` comparava
     * `undefined` com `undefined`, achava o tabuleiro inteiro de um tipo só e
     * respondia "tem jogada" SEMPRE. Uma verificação que nunca reprova é pior
     * que verificação nenhuma: ela dá a impressão de que o caso está coberto.
     */
    this.tipoDe = opcoes.tipoDe ?? ((p) => p?.tipo);
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
    const alvo = this.tipoDe(peca);
    const vistos = new Set([peca]);
    const fila = [peca];
    const grupo = [];

    while (fila.length > 0) {
      const atual = fila.pop();
      grupo.push(atual);
      for (const vizinho of this.vizinhos(atual.lin, atual.col)) {
        if (!vistos.has(vizinho) && this.tipoDe(vizinho) === alvo) {
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

  /**
   * Existe ao menos uma jogada no tabuleiro? Um `false` aqui é tabuleiro morto:
   * a criança não tem o que fazer, e nenhum gesto dela vai mudar isso.
   *
   * **Também vale para o caminho do Jogo das Cores, e isso não é óbvio.** Lá a
   * jogada é um caminho simples (cada peça vizinha da ANTERIOR), não um grupo
   * conexo — e `PathSelector` existe justamente porque o flood-fill é o
   * primitivo errado para o gesto. Mas para a pergunta "existe alguma jogada?"
   * os dois coincidem: todo grafo conexo com 3+ vértices tem um vértice de grau
   * 2 ou mais, e ele com dois vizinhos JÁ É um caminho de 3. Então
   * "componente conexo >= mínimo" é o teste exato, não uma aproximação.
   */
  temJogada(minimo = 3) {
    return this.gruposValidos(minimo).length > 0;
  }

  /** Troca duas peças de lugar. Não muda quais peças existem, só onde estão. */
  trocar(linA, colA, linB, colB) {
    if (!this.dentro(linA, colA) || !this.dentro(linB, colB)) return this;
    const a = this.celulas[linA][colA];
    const b = this.celulas[linB][colB];
    this.definir(linA, colA, b);
    this.definir(linB, colB, a);
    return this;
  }

  /**
   * Embaralha as peças entre as células que já estavam OCUPADAS — as vazias
   * continuam vazias, para poder ser chamado no meio de uma cascata.
   *
   * O censo não muda: as mesmas peças, nos mesmos números, em outros lugares.
   * Num jogo de cores isso é o que separa "misturar" de "trocar as cores": a
   * criança que estava olhando uma peça vermelha a reencontra em outro lugar,
   * em vez de vê-la virar azul onde estava.
   *
   * @returns {Array<{peca, deLin, deCol, paraLin, paraCol}>} só quem se mexeu
   */
  embaralhar(aleatorio = rand) {
    const ocupadas = [];
    this.paraCada((peca, lin, col) => { if (peca) ocupadas.push({ lin, col, peca }); });
    // A origem é fotografada ANTES de qualquer atribuição: `definir` sobrescreve
    // `peca.lin`/`peca.col`, e sem a foto o movimento sairia com o destino nos
    // dois lados.
    const origem = new Map(ocupadas.map((o) => [o.peca, { lin: o.lin, col: o.col }]));
    const sorteadas = aleatorio.embaralhar(ocupadas.map((o) => o.peca));

    const movimentos = [];
    ocupadas.forEach((celula, i) => {
      const peca = sorteadas[i];
      this.definir(celula.lin, celula.col, peca);
      const de = origem.get(peca);
      if (de.lin !== celula.lin || de.col !== celula.col) {
        movimentos.push({
          peca, deLin: de.lin, deCol: de.col, paraLin: celula.lin, paraCol: celula.col,
        });
      }
    });

    if (movimentos.length > 0) this.emit('embaralhado', movimentos, this);
    return movimentos;
  }

  /**
   * Garante que o tabuleiro tenha jogada, mexendo o MENOS possível.
   *
   * `null` quando já havia jogada — e é o caso quase sempre, então o chamador
   * escreve `if (!info) return;` e nada acontece.
   *
   * ## Por que isto existe
   *
   * Medido por simulação (200 mil tabuleiros e 20 mil partidas por nível), no
   * Jogo das Cores: um tabuleiro de 7x5 recém-sorteado sai sem jogada em 1,6%
   * das vezes com 8 cores, e **76% das partidas de 8 cores chegam a um tabuleiro
   * morto antes da meta**. Com 4 cores é 1 em 20 mil. Não é canto raro: com
   * muitas cores é o caso comum, e sem isto o jogo simplesmente para.
   *
   * ## Como
   *
   * 1. embaralha e reconfere, até `maxEmbaralhos` vezes. Resolve em 1,03
   *    embaralhadas em média — o sorteio quase nunca reincide;
   * 2. se ainda não houver jogada, **planta um grupo** trocando peças de lugar
   *    (ver `_plantarGrupo`). É a saída garantida, e existe para o laço do passo
   *    1 poder ter limite: `while` sem limite é exatamente o defeito que o
   *    original de 2013 tinha em `validaLinha`.
   *
   * @returns {null|{embaralhos, plantou, movimentos, possivel}}
   *   `movimentos` é o DIFERENCIAL entre antes e depois — um movimento por peça,
   *   direto para o lugar final, para a cena animar sem ver as tentativas.
   *   `possivel: false` diz que nem plantando dava: não existem `minimo` peças de
   *   um mesmo tipo no tabuleiro. Aí o tabuleiro fica como está, e quem chamou
   *   decide (é situação de configuração impossível, não de azar).
   */
  garantirJogada({ minimo = 3, maxEmbaralhos = 30 } = {}) {
    if (this.temJogada(minimo)) return null;

    const antes = new Map();
    this.paraCada((peca, lin, col) => { if (peca) antes.set(peca, { lin, col }); });

    let embaralhos = 0;
    while (!this.temJogada(minimo) && embaralhos < maxEmbaralhos) {
      this.embaralhar();
      embaralhos++;
    }

    let plantou = false;
    if (!this.temJogada(minimo)) plantou = this._plantarGrupo(minimo);

    const movimentos = [];
    this.paraCada((peca, lin, col) => {
      if (!peca) return;
      const de = antes.get(peca);
      if (de && (de.lin !== lin || de.col !== col)) {
        movimentos.push({ peca, deLin: de.lin, deCol: de.col, paraLin: lin, paraCol: col });
      }
    });

    const info = { embaralhos, plantou, movimentos, possivel: this.temJogada(minimo) };
    this.emit('jogadaGarantida', info, this);
    return info;
  }

  /**
   * Junta `minimo` peças de um mesmo tipo, trocando-as de lugar.
   *
   * O tipo escolhido é o mais numeroso, e a casa central é sorteada — se fosse
   * sempre a mesma, a criança aprenderia que depois de uma mistura a resposta
   * está sempre no mesmo canto.
   *
   * Termina em uma passada, e é por isso que dá garantia: o tipo mais numeroso
   * tem pelo menos `minimo` peças (senão devolve `false`), cada alvo consome uma
   * delas, e as que já estão no lugar não são consumidas.
   *
   * @returns {boolean} conseguiu
   */
  _plantarGrupo(minimo = 3) {
    const contagem = new Map();
    for (const peca of this.todas()) {
      const t = this.tipoDe(peca);
      contagem.set(t, (contagem.get(t) ?? 0) + 1);
    }
    let tipo = null;
    let maior = 0;
    for (const [t, n] of contagem) if (n > maior) { maior = n; tipo = t; }
    if (maior < minimo) return false;

    const centros = [];
    this.paraCada((peca, lin, col) => {
      if (peca && this.vizinhos(lin, col).length >= minimo - 1) centros.push({ lin, col });
    });
    if (centros.length === 0) return false;
    const centro = rand.item(centros);

    const alvos = [
      centro,
      ...rand.embaralhar(this.vizinhos(centro.lin, centro.col))
        .slice(0, minimo - 1)
        .map((p) => ({ lin: p.lin, col: p.col })),
    ];
    const naAlvo = (p) => alvos.some((a) => a.lin === p.lin && a.col === p.col);

    for (const alvo of alvos) {
      const atual = this.obter(alvo.lin, alvo.col);
      if (this.tipoDe(atual) === tipo) continue;
      const fonte = this.todas().find((p) => this.tipoDe(p) === tipo && !naAlvo(p));
      if (!fonte) return false;
      this.trocar(alvo.lin, alvo.col, fonte.lin, fonte.col);
    }
    return true;
  }

  /**
   * Troca o tipo de peças que já nascem formando grupo — evita pontos de graça
   * ao montar o tabuleiro. (O original fazia isso em `validaLinha`, sorteando
   * num `while` que podia, em teoria, não terminar; aqui há limite de tentativas.)
   * **Só serve com o `tipoDe` padrão**, porque escreve em `peca.tipo` direto —
   * a leitura passou a ser configurável, a escrita não. Um jogo que compare por
   * outro campo (o Jogo das Cores compara `cor`) precisa da sua própria versão.
   *
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
      .map((linha) => linha.map((p) => (p ? String(this.tipoDe(p)).charAt(0) : vazio)).join(' '))
      .join('\n');
  }
}
