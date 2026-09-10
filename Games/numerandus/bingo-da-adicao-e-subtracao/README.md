# Bingo da Adição e Subtração

Atividade educativa construída com o **Motor Educandus**, na coleção **Numerandus**.
Esta pasta é **autossuficiente**: pode ser enviada sozinha para o AVA.

- **Slug (campo `jogo` do AVA):** `bingo-da-adicao-e-subtracao`
- **Faixa etária:** 5 a 8 anos (1º/2º ano)
- **Criado em:** 2026-09-04
- **Pasta:** `Games/numerandus/bingo-da-adicao-e-subtracao/`

## O que é

Jogo de Bingo competitivo onde a criança calcula mentalmente operações de adição e subtração e compete contra o computador para ver quem faz BINGO primeiro.

O jogo possui **dois jogadores**:
- **Jogador** (cartela azul) — controlado pela criança
- **Computador** (cartela ardósia/cinza-azulado) — IA controlada pelo jogo; a cartela dele
  começa sempre virada ("?"), e só é revelada quando o aluno pede (botão ESPIAR CARTELA)

**Regra de vitória:** Complete 4 fichas em linha (horizontal, vertical ou diagonal) na sua cartela antes do computador fazer o mesmo.

O jogo possui **três níveis de dificuldade**:
- **Nível 1 (Fácil):** Adições simples até 18. CPU com 55% de chance de acerto.
- **Nível 2 (Médio):** Adição e subtração misturadas até 24. CPU com 70% de chance.
- **Nível 3 (Difícil):** Operações com números até 30. CPU com 85% de chance.

O design é voltado para crianças e público neurodivergente:
- Sem pressão de tempo ou cronômetro punitivo.
- Alvos de toque grandes e acessíveis.
- Cores harmoniosas de alto contraste e feedback multissensorial calmo e acolhedor.

## Como rodar localmente

```bash
node tools/serve.mjs
```

Abra: `http://localhost:8080/Games/numerandus/bingo-da-adicao-e-subtracao/`

## Registro no AVA

Ao concluir a partida, o jogo emite:

```js
{
  type: "JOGO_CONCLUIDO",
  acertos: 8,            // acertos REAIS do jogador (bruto, sem desconto de erro — ver CHECKLIST.md, RE-02)
  erros: 1,              // erros REAIS do jogador (marca errada não corrigida até o fim da rodada)
  totalPerguntas: 13,    // total de desafios sorteados
  nivel: 1,
  jogo: "bingo-da-adicao-e-subtracao",
  vitoria: true,
  tempoSegundos: 45,
  ajuda: 0,
  acertosJogador: 8,     // extra — igual a `acertos`, pra clareza do relatório
  acertosCpu: 5          // extra — acertos da CPU (não confundir com `erros`, que é só do aluno)
}
```

A tela final mostra "N ACERTOS" (não "N PONTOS") — palavra customizada via
`config.unidadePlacar`, sem mudar o valor enviado ao AVA.
