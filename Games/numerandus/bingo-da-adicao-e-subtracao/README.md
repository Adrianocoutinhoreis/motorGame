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
- **Computador** (cartela vermelha) — IA controlada pelo jogo

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
  acertos: 8,           // acertos do jogador
  erros: 5,             // acertos da CPU (erros do jogador)
  totalPerguntas: 13,   // total de desafios sorteados
  nivel: 1,
  jogo: "bingo-da-adicao-e-subtracao",
  vitoria: true,
  tempoSegundos: 45,
  ajuda: 0
}
```
