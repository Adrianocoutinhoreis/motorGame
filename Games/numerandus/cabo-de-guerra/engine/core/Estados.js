/**
 * Estados — a máquina de estados canônica que TODO jogo do motor segue.
 *
 *   BOOT → CARREGANDO → MENU → (TUTORIAL | NIVEIS) → JOGANDO ⇄ PAUSADO
 *                                                        ↓
 *                                                    RESULTADO → (MENU | JOGANDO)
 *
 * A regra central, e a razão de os estados serem nomeados num lugar só:
 * **o AvaBridge dispara na ENTRADA em RESULTADO e re-arma na SAÍDA.**
 * Isso implementa a borda de subida/descida do METODO.md (B3.5): cada partida
 * levada ao fim conta exatamente uma vez, um replay genuíno conta de novo, e
 * ficar parado na tela de resultado nunca duplica o registro.
 *
 * Ver `docs/STATES.md` para o diagrama completo e as regras de transição.
 */
export const ESTADOS = Object.freeze({
  BOOT: 'boot',
  CARREGANDO: 'carregando',
  MENU: 'menu',
  TUTORIAL: 'tutorial',
  NIVEIS: 'niveis',
  JOGANDO: 'jogando',
  PAUSADO: 'pausado',
  RESULTADO: 'resultado',
});

/** Transições permitidas. Serve de documentação executável e de rede de segurança. */
export const TRANSICOES = Object.freeze({
  [ESTADOS.BOOT]: [ESTADOS.CARREGANDO],
  [ESTADOS.CARREGANDO]: [ESTADOS.MENU],
  [ESTADOS.MENU]: [ESTADOS.TUTORIAL, ESTADOS.NIVEIS, ESTADOS.JOGANDO],
  [ESTADOS.TUTORIAL]: [ESTADOS.MENU, ESTADOS.NIVEIS, ESTADOS.JOGANDO],
  [ESTADOS.NIVEIS]: [ESTADOS.MENU, ESTADOS.JOGANDO, ESTADOS.TUTORIAL],
  [ESTADOS.JOGANDO]: [ESTADOS.PAUSADO, ESTADOS.RESULTADO, ESTADOS.MENU],
  [ESTADOS.PAUSADO]: [ESTADOS.JOGANDO, ESTADOS.MENU, ESTADOS.NIVEIS],
  [ESTADOS.RESULTADO]: [ESTADOS.JOGANDO, ESTADOS.MENU, ESTADOS.NIVEIS],
});

/** A transição de `origem` para `destino` é permitida? */
export function transicaoValida(origem, destino) {
  if (!origem) return true;
  return (TRANSICOES[origem] ?? []).includes(destino);
}
