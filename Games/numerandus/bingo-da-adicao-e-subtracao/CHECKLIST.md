# Checklist — Bingo da Adição e Subtração

> Passos para este jogo ser considerado **concluído**.
> Slug: `bingo-da-adicao-e-subtracao` · Criado em: 2026-09-04 · Motor: v1.3.5

---

## 1. Definição

- [x] Objetivo pedagógico: calcular mentalmente operações de adição e subtração e competir contra o computador para fazer BINGO primeiro.
- [x] Faixa etária: 5 a 8 anos (1º/2º ano).
- [x] Níveis definidos: **três** — Fácil (somas até 18, CPU 55%), Médio (somas e subtrações até 24, CPU 70%), Difícil (operações até 30, CPU 85%).
- [x] Condição de vitória: completar 4 números em linha (horizontal, vertical ou diagonal) ANTES do computador.
- [x] `src/config.js` preenchido por inteiro.
- [x] Regras educacionais conferidas (RE-01 a RE-05):
  - [x] RE-01 — todo texto em CAIXA ALTA.
  - [x] RE-02 — nota desconta erros na vitória, nunca na derrota.
  - [x] RE-03 — placar exibe a unidade ("10 PONTOS").
  - [x] RE-04 — estrelas gerenciadas pela tela de resultado.
  - [x] RE-05 — botão de ajuda no HUD abrindo tutorial sobreposto sem zerar estado.

## 2. Telas & Acessibilidade

- [x] **Menu** com JOGAR e COMO JOGAR, tema 'bingo' próprio e placa de título dedicada (`PlacaTituloBingo`).
- [x] **Tutorial** com 3 passos ilustrados: conta sorteada, marcação na cartela, competição com CPU.
- [x] **Seleção de Nível** (`LevelSelectScreen`) com 3 cartões táteis.
- [x] **Partida** com 2 cartelas (Jogador vs CPU), alvos tocáveis grandes (~68px), cartas de desafio com animação de flip.
- [x] **CPU Competindo** com delay variável e chance de acerto baseada no nível.
- [x] **Placar em tempo real** mostrando acertos do jogador vs acertos da CPU.
- [x] **Resultado** comemorativo com indicação de quem venceu (Jogador ou Computador).

## 3. Contrato do AVA

| Campo | Significado | Valor |
|---|---|---|
| `totalPerguntas` | Desafios sorteados | `13` (varia) |
| `acertos` | Acertos do jogador | `8` (varia) |
| `erros` | Acertos da CPU | `5` (varia) |
| `nivel` | Nível escolhido | `1`, `2` ou `3` |
| `jogo` | Slug estável | `bingo-da-adicao-e-subtracao` |

## 4. Competição vs CPU

- [x] CPU marca números na sua cartela (índice 1) com delay variável.
- [x] Chance de acerto da CPU configurável por nível (55%, 70%, 85%).
- [x] CPU pode fazer BINGO e vencer do jogador.
- [x] Animação de marcação na cartela da CPU (ficha vermelha).
- [x] Placar atualizado em tempo real durante a partida.
