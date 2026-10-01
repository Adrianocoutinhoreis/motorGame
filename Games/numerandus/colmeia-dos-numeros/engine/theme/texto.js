/**
 * texto.js — a caixa das letras exibidas na tela.
 *
 * Regra RE-01 (`docs/REGRAS-EDUCACIONAIS.md`): num jogo para 4 a 7 anos, **todo
 * texto visível vai em caixa alta**, não só as letras que são o conteúdo. O
 * motivo é simples e decide a questão: nessa faixa a criança lê letra bastão
 * maiúscula — minúscula não é "mais confortável", é ilegível para ela.
 *
 * Por que é uma opção por jogo, e não algo fixo no motor: um jogo futuro
 * voltado a leitores já fluentes vai querer o contrário, e aí a caixa normal
 * volta a ser a escolha certa. A decisão fica no `config.js` de cada jogo
 * (`textoEmCaixaAlta`), aplicada aqui uma vez pelo `bootstrap`.
 *
 * Isto é estado global de apresentação, de propósito: a alternativa seria
 * passar a preferência por todos os construtores de texto do motor, e um único
 * lugar esquecido produziria uma tela em caixa mista — exatamente o que a regra
 * quer evitar.
 */

let emCaixaAlta = false;

/** Liga ou desliga a caixa alta global. Chamado pelo bootstrap a partir do config. */
export function definirCaixaAlta(valor) {
  emCaixaAlta = !!valor;
  return emCaixaAlta;
}

export function estaEmCaixaAlta() {
  return emCaixaAlta;
}

/**
 * Aplica a caixa configurada a um texto que será DESENHADO.
 *
 * Use em todo ponto que pinta texto para a criança — e em nenhum outro: id de
 * áudio, slug e nome de arquivo não passam por aqui.
 *
 * `toLocaleUpperCase('pt-BR')` em vez de `toUpperCase()` porque o texto tem
 * acento: "nível" precisa virar "NÍVEL", com o acento preservado.
 */
export function texto(valor) {
  const s = String(valor ?? '');
  return emCaixaAlta ? s.toLocaleUpperCase('pt-BR') : s;
}
