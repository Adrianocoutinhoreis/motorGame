import { Emitter } from './../core/Emitter.js';

/**
 * AvaBridge — a implementação do CONTRATO do AVA (Educandus).
 *
 * Fonte da verdade: `Aulas para Refazer/MD/METODO.md`, Parte A. Resumo do que
 * este arquivo garante, item a item do checklist A5:
 *
 *  - Existe UM único ponto de "fim de partida" (o Game chama `concluir()` ao
 *    entrar no estado RESULTADO) e ele não dispara duas vezes pela mesma partida.
 *  - `type` é exatamente "JOGO_CONCLUIDO".
 *  - `acertos`/`erros` são o total da PARTIDA INTEIRA, não da última jogada.
 *  - `totalPerguntas` reflete o total real declarado pelo jogo.
 *  - `nivel` é SEMPRE enviado, nunca null (convenção da seção 6d do METODO).
 *  - `jogo` é um slug estável vindo do config.
 *  - Os três números vão como `number`, nunca string.
 *  - `vitoria` vai como booleano de verdade, e `tempoSegundos` como inteiro de
 *    segundos MEDIDO PELO MOTOR. Os dois são acréscimos nossos ao contrato: o
 *    METODO A2.1 não os lista, e não precisa — a seção A4 diz que o servidor
 *    grava a mensagem crua inteira em `payload`, então campo extra fica
 *    registrado sem coluna própria.
 *  - `postMessage` vai para `window.parent` com `"*"`, protegido por
 *    `window.parent !== window`.
 *  - O jogo NÃO envia nem calcula aluno, lo_id, activity_id, turma, XP ou nota:
 *    isso é do AVA (METODO A3).
 *
 * Fora de um `<iframe>` (rodando o jogo direto no navegador), `window.parent`
 * é o próprio `window` e a mensagem corretamente NÃO sai — só o `console.log`
 * aparece. Isso não é falha: é como se valida localmente (METODO B4.5).
 */
export class AvaBridge extends Emitter {
  /**
   * @param {{jogo?: string, registrarDerrota?: boolean, aoEnviar?: Function}} opcoes
   */
  constructor(opcoes = {}) {
    super();
    this.jogo = opcoes.jogo ?? null;
    /** Decisão de projeto: derrota também é uma tentativa e também é registrada. */
    this.registrarDerrota = opcoes.registrarDerrota ?? true;
    /** Gancho opcional para teste — recebe a mensagem já montada. */
    this.aoEnviar = opcoes.aoEnviar ?? null;

    /** Guarda de borda: impede duplicar a MESMA partida. */
    this._armado = true;
    /** Histórico da sessão — útil para depurar e para os testes. */
    this.mensagens = [];
  }

  /**
   * Fim de partida. Chamado pelo Game na ENTRADA do estado RESULTADO.
   *
   * @param {object} resultado
   *   acertos {number}        progresso alcançado na partida
   *   erros {number}          falhas cometidas na partida
   *   totalPerguntas {number} a meta/total da partida
   *   nivel {number}          nível jogado (1 se o jogo tem um só)
   *   vitoria {boolean}       venceu ou perdeu — decide se registra E vai na mensagem
   *   extras {object}         campos livres; o AVA guarda tudo em `payload`
   * @param {object|null} medidoPeloMotor o que o MOTOR mediu, não o jogo:
   *   hoje `{ tempoSegundos }`. Separado do `resultado` porque a origem do dado
   *   importa — e porque `concluir(null)` precisa continuar avisando que o jogo
   *   não entregou resultado, em vez de o tempo disfarçar a falta.
   * @returns {object|null} a mensagem enviada, ou null se não houve envio
   */
  concluir(resultado, medidoPeloMotor = null) {
    if (!this._armado) {
      console.warn('[AVA] conclusão ignorada: esta partida já foi registrada (guarda de borda).');
      return null;
    }

    if (!resultado) {
      // Honestidade acima de conveniência (METODO B0.5): não se inventa número.
      console.warn('[AVA] concluir() sem resultado; enviando defaults honestos.');
      resultado = { acertos: 0, erros: 0, totalPerguntas: null, nivel: 1, vitoria: false };
    }

    if (resultado.vitoria === false && !this.registrarDerrota) {
      console.info('[AVA] derrota não registrada (registrarDerrota=false).');
      this._armado = false;
      return null;
    }

    const mensagem = this.montarMensagem(resultado, medidoPeloMotor);
    this._armado = false;
    this.mensagens.push(mensagem);

    // O log sai SEMPRE — é por ele que um humano valida a instrumentação
    // jogando uma partida com o console aberto (METODO B8).
    console.log('[AVA] JOGO_CONCLUIDO', mensagem);

    this._enviar(mensagem);
    this.emit('concluido', mensagem);
    return mensagem;
  }

  /**
   * Monta a mensagem no formato exato do contrato.
   * Separado de `concluir()` para poder ser testado sem tocar em `window`.
   */
  montarMensagem(resultado, medidoPeloMotor = null) {
    const mensagem = {
      type: 'JOGO_CONCLUIDO',
      acertos: AvaBridge.numero(resultado.acertos, 0),
      erros: AvaBridge.numero(resultado.erros, 0),
      totalPerguntas: AvaBridge.numero(resultado.totalPerguntas, null),
      // Convenção 6d do METODO: nunca null, nunca omitido. Um jogo de nível
      // único envia 1.
      nivel: AvaBridge.numero(resultado.nivel, 1) ?? 1,
      jogo: this.jogo ?? null,
      /**
       * A criança atingiu a meta?
       *
       * Os quatro números acima não respondem isso: "14 de 20" e "14 de 14" têm
       * o mesmo `acertos`, e só o segundo é vitória. O motor já sabia — a tela
       * final usa o dado para escolher o que dizer — e o AVA não recebia.
       *
       * Vai como booleano de verdade, não como 0/1 nem "true": o `payload` é
       * gravado cru, e um campo que muda de tipo entre partidas é o que estraga
       * relatório depois.
       */
      vitoria: AvaBridge.booleano(resultado.vitoria, false),
    };

    // Campos extras viajam junto: o servidor grava a mensagem crua inteira em
    // `payload`, então qualquer dado adicional já fica registrado sem precisar
    // de coluna própria (METODO A4).
    if (resultado.extras && typeof resultado.extras === 'object') {
      Object.assign(mensagem, resultado.extras);
    }

    // **O que o MOTOR mediu entra por último, e é de propósito.**
    //
    // `tempoSegundos` é medido pelo motor (ver `Game._tempoJogando`), então ele
    // vence um campo de mesmo nome que um jogo tenha mandado nos extras. Um
    // número medido em dois lugares é um número em que não se pode confiar, e
    // aqui a fonte única é o motor.
    if (medidoPeloMotor && typeof medidoPeloMotor === 'object') {
      for (const [campo, valor] of Object.entries(medidoPeloMotor)) {
        if (valor === null || valor === undefined) continue;
        mensagem[campo] = valor;
      }
    }
    return mensagem;
  }

  _enviar(mensagem) {
    try {
      this.aoEnviar?.(mensagem);
    } catch (err) {
      console.error('[AVA] gancho aoEnviar falhou:', err);
    }

    try {
      if (typeof window === 'undefined') return;
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(mensagem, '*');
      } else {
        console.info('[AVA] fora de iframe: a mensagem não é enviada (comportamento esperado em teste local).');
      }
    } catch (err) {
      console.error('[AVA] postMessage falhou:', err);
    }
  }

  /**
   * Re-arma para a próxima partida. Chamado pelo Game na SAÍDA do RESULTADO.
   * É a borda de descida do METODO B3.5: um replay genuíno DEVE gerar um novo
   * registro (é uma nova tentativa); o que não pode é duplicar a mesma partida.
   */
  rearmar() {
    this._armado = true;
    this.emit('rearmado');
  }

  get armado() {
    return this._armado;
  }

  get ultimaMensagem() {
    return this.mensagens[this.mensagens.length - 1] ?? null;
  }

  /**
   * Converte para número de forma estrita.
   * Aceita string numérica (o AVA tolera, mas nós enviamos number),
   * e devolve o padrão quando o valor não é um número utilizável.
   */
  static numero(valor, padrao = 0) {
    if (valor === null || valor === undefined || valor === '') return padrao;
    const n = Number(valor);
    if (!Number.isFinite(n)) return padrao;
    return n;
  }

  /**
   * Normaliza um booleano do contrato.
   *
   * `!!valor` não serve: a string `'false'` é verdadeira em JavaScript, e um jogo
   * que lesse uma configuração de texto mandaria vitória onde houve derrota.
   * Aqui as formas de "falso" que aparecem na prática são tratadas por nome.
   */
  static booleano(valor, padrao = false) {
    if (valor === null || valor === undefined || valor === '') return padrao;
    if (typeof valor === 'string') {
      const s = valor.trim().toLowerCase();
      if (s === 'false' || s === '0' || s === 'nao' || s === 'não') return false;
      if (s === 'true' || s === '1' || s === 'sim') return true;
      return padrao;
    }
    return !!valor;
  }
}
