/**
 * Storage — preferências locais do jogo (som ligado, nível alcançado…).
 *
 * Encapsula o `localStorage` por dois motivos concretos:
 *
 * 1. **Namespace por jogo.** Vários jogos podem ser publicados no MESMO domínio
 *    do AVA; sem prefixo, um sobrescreveria a preferência do outro.
 * 2. **Nunca lançar.** Dentro de um `<iframe>` de terceiros, ou em navegação
 *    privada, o acesso ao localStorage pode disparar SecurityError. Aqui isso
 *    vira um cache em memória e o jogo segue funcionando.
 *
 * Nada aqui é dado de aluno — isso é do AVA, não do jogo (METODO.md, A3).
 */
export class Storage {
  constructor(namespace = 'motor') {
    this.prefixo = `${namespace}:`;
    this._memoria = new Map();
    this._disponivel = this._testar();
    if (!this._disponivel) {
      console.info('[motor] localStorage indisponível; preferências valem só nesta sessão.');
    }
  }

  _testar() {
    try {
      const chave = '__motor_teste__';
      window.localStorage.setItem(chave, '1');
      window.localStorage.removeItem(chave);
      return true;
    } catch {
      return false;
    }
  }

  ler(chave, padrao = null) {
    try {
      const bruto = this._disponivel
        ? window.localStorage.getItem(this.prefixo + chave)
        : this._memoria.get(chave) ?? null;
      if (bruto === null || bruto === undefined) return padrao;
      return JSON.parse(bruto);
    } catch {
      return padrao;
    }
  }

  gravar(chave, valor) {
    const bruto = JSON.stringify(valor);
    try {
      if (this._disponivel) window.localStorage.setItem(this.prefixo + chave, bruto);
      else this._memoria.set(chave, bruto);
    } catch {
      this._memoria.set(chave, bruto);
    }
    return valor;
  }

  apagar(chave) {
    try {
      if (this._disponivel) window.localStorage.removeItem(this.prefixo + chave);
    } catch { /* ignora */ }
    this._memoria.delete(chave);
  }
}
