# Checklist — Bingo da Adição e Subtração

> Passos para este jogo ser considerado **concluído**.
> Slug: `bingo-da-adicao-e-subtracao` · Criado em: 2026-09-04 · Motor: v1.3.5
> **Atualizado em: 2026-09-10** — esta versão substitui a de 04/09, que descrevia o jogo
> antes de quase todo o trabalho abaixo (contrato do AVA, cores, mecânica de erro, som,
> feedback de fim de jogo). Se algo aqui divergir do código, o código manda.

---

## 1. Definição

- [x] Objetivo pedagógico: calcular mentalmente operações de adição e subtração e competir contra o computador para fazer BINGO primeiro.
- [x] Faixa etária: 5 a 8 anos (1º/2º ano).
- [x] Níveis definidos: **três** — Fácil (somas até 18, CPU 55%), Médio (somas e subtrações até 24, CPU 70%), Difícil (operações até 30, CPU 85%).
- [x] Condição de vitória: completar 4 números em linha (horizontal, vertical ou diagonal) ANTES do computador.
- [x] `src/config.js` preenchido por inteiro.
- [ ] Regras educacionais conferidas (RE-01 a RE-05):
  - [x] RE-01 — todo texto em CAIXA ALTA (`textoEmCaixaAlta: true`).
  - [ ] **RE-02 — pendente.** A regra pede que a vitória desconte os erros reais do aluno
        (`acertos - erros`) e a derrota fique sem desconto. Hoje o jogo manda `acertos` bruto
        (`this._acertosJogador`) nos dois casos, sem descontar `_errosJogador` na vitória —
        não conferido ainda, próximo item de melhoria identificado.
  - [x] RE-03 — placar exibe a UNIDADE ("8 ACERTOS", não "8 de 13") — palavra customizada via
        `config.unidadePlacar: { singular: 'acerto', plural: 'acertos' }` (recurso novo no
        motor, opcional, os outros jogos continuam dizendo "pontos").
  - [x] RE-04 — estrelas calculadas pela `ResultScreen` a partir de `acertos`/`totalPerguntas`
        reais (sem escala artificial — já foi tentado multiplicar por 10 só a exibição e
        descartado, porque estourava sempre em 5 estrelas).
  - [x] RE-05 — ajuda/pausa não custam a partida: o relógio da rodada e a decisão da CPU são
        movidos a quadro (`GameScene.atualizar`) e travam por completo (`_pausadoProfundo`)
        enquanto a Pausa ou a Ajuda estão abertas — nada avança por baixo do véu (corrigido
        em 10/09; antes disso o `setTimeout` da rodada corria em tempo real e podia expirar
        com a tela pausada).

## 2. Telas & Layout

- [x] **Menu** com JOGAR e COMO JOGAR, tema 'bingo' próprio.
- [x] **Tutorial** com **4 passos** ilustrados: conta sorteada, marcação na cartela (cartela do
      CPU já mostrada oculta), espiar a cartela do CPU, e a condição de BINGO — cada um com
      narração gravada (`tutorial_tela1..4.wav`, fichas em `assets/audio-transcricao/`, status
      ainda 🟡 inferido — ninguém ouviu pra confirmar).
- [x] **Seleção de Nível** (`LevelSelectScreen`) com 3 cartões táteis.
- [x] **Partida**, layout em 3 colunas: desafio + controle (esquerda), cartela do jogador
      ampliada e centralizada (meio), cartela do CPU + selo (direita).
- [x] **Fundo estendido até o letterbox** (`pintarSangria`): em telas mais largas que 16:9, o
      cenário continua até a borda real da tela, sem barras sólidas nas laterais.
- [x] **Pausa** enxuta: só CONTINUAR / COMEÇAR DE NOVO / SAIR — os ícones de ajuda e som
      (redundantes com o HUD, sempre visível atrás do véu) foram tirados de dentro do painel
      (`mostrarSom: false`, recurso novo e opcional no `PauseScreen` do motor).
- [x] **Resultado** com estrelas + "N ACERTOS" (ver RE-03, acima).

## 3. Cartela do CPU — "virada até responder"

- [x] A cartela do CPU começa **virada** (verso, "?") a cada rodada — nunca visível de graça.
- [x] Botão dedicado **ESPIAR CARTELA**, com barra de tempo visível: o aluno decide quando
      espiar, vê quanto tempo falta, e ela volta a virar sozinha (ou ao tocar de novo).
- [x] Clicar PRÓXIMA sempre vira a cartela de volta, mesmo se ainda estivesse espiada.
- [x] Sem revelação automática por tempo — a antiga versão esperava a "reação" inteira da CPU
      (até 4,5s) só pra revelar; hoje a próxima pergunta aparece quase na hora (~600ms), e a
      CPU decide em paralelo, sem travar o aluno.

## 4. Erros — provisórios, não punitivos

- [x] Um toque errado marca a célula em âmbar (estado `errado`), **reversível**: tocar de novo
      na mesma célula desfaz, e acertar a célula certa também perdoa a tentativa anterior.
- [x] Só vira erro CONTADO (`_errosJogador`) se ainda estiver marcada quando a rodada terminar
      (clique em PRÓXIMA ou tempo esgotado) — nunca por um toque isolado.
- [x] Bug de célula "andando" fora de posição (tremor acumulando deslocamento em toques
      repetidos) corrigido: o tremor sempre parte/retorna de uma posição de repouso fixa
      (`xBase`), nunca do `x` momentâneo.

## 5. Feedback de fim de jogo

- [x] **Vitória do aluno:** confete saindo da linha vencedora, brilho dourado pulsante na
      cartela, selo "🎉 VOCÊ VENCEU! 🎉" em destaque, som (`acertoSOS`, reaproveitado de
      Formas/Blocos/Cores).
- [x] **Vitória da CPU:** cartela dela ampliada e centralizada, fundo borrado (blur real, não
      só um véu escuro), título "O COMPUTADOR VENCEU" + "CONTINUE TENTANDO!" em branco (alto
      contraste), brilho ardósia — mesma intensidade do dourado, sem confete, sem tom de
      punição nem de festa. Som `erroSOS` (mesma origem dos outros jogos).
- [x] Trava contra reentrada (`_celebracaoIniciada`): sem ela, um segundo toque certo do aluno
      (ou uma segunda checagem da CPU) na janela de ~5s antes de `_terminar()` repetia a
      comemoração inteira, e o som soava "duplicado".
- [x] O som de fim de partida toca no canal `music` (não `sfx`): sobrevive à troca de cena até
      a tela de resultado sem cortar nem repetir, e para sozinho se o aluno sair da tela de
      resultado antes dele acabar (ouvinte no `Game`, não um timer).

## 6. Som

- [x] `acertoSOS` / `erroSOS` — fim de partida, mutuamente exclusivos com o próprio disparo da
      `ResultScreen` (ela fica com `config.audio.vitoria/derrota: null` de propósito, pra não
      dobrar o som).
- [x] `cliqueCartela` — toca só quando o aluno ACERTA um número na própria cartela
      (`config.audio.acerto`). Mutuamente exclusivo com o erro (nunca os dois juntos).
- [x] `erroCartela` — toca só na PRIMEIRA tentativa errada de cada número novo
      (`config.audio.erro`); não repete ao desfazer.
- [x] A CPU marca em silêncio — nenhum efeito de acerto toca pela jogada dela.
- [ ] **Origem/licença pendente**: `cliqueCartela` (`discord_ping_sound_effect.mp3`) e
      `erroCartela` (`error.mp3`) foram fornecidos prontos nesta sessão, com nomes genéricos e
      sem procedência documentada — confirmar antes de publicar para alunos (ver as fichas de
      transcrição de cada um).

## 7. Contrato do AVA

| Campo | Significado | Observação |
|---|---|---|
| `acertos` | Acertos REAIS do jogador (bruto) | Não descontado por erros — ver RE-02, pendente |
| `erros` | Erros REAIS do jogador | Marca errada ainda não corrigida quando a rodada termina — NÃO é mais "acertos da CPU" |
| `totalPerguntas` | Desafios sorteados | Valor real, sem escala |
| `nivel` | Nível escolhido | `1`, `2` ou `3` |
| `jogo` | Slug estável | `bingo-da-adicao-e-subtracao` |
| `vitoria` | Quem venceu | `true` = aluno, `false` = CPU |
| `extras.acertosJogador` | Igual a `acertos` | Redundante, pra clareza do relatório |
| `extras.acertosCpu` | Acertos da CPU | Campo NOVO — separado de `erros`, que agora é só do aluno |

## 8. Competição vs CPU

- [x] CPU marca números na própria cartela (índice 1) com delay variável, decidido em paralelo
      (não trava o avanço da pergunta).
- [x] Chance de acerto da CPU configurável por nível (55%, 70%, 85%).
- [x] CPU pode fazer BINGO e vencer do jogador — feedback dedicado, ver seção 5.
- [x] Tema visual da CPU é **ardósia/neutro** (`#64748B`), não vermelho — decisão de
      acessibilidade (vermelho lido como alarme).

## Melhorias identificadas, ainda não feitas

1. **RE-02** (seção 1) — descontar erros reais do aluno da pontuação na vitória.
2. Origem/licença dos áudios `cliqueCartela`/`erroCartela` (seção 6).
3. Narrações do tutorial ainda não confirmadas de ouvido (seção 2).
4. Números do nível (`LevelSelectScreen`, motor compartilhado) visivelmente fora do centro do
   emblema — identificado, não corrigido (afeta todos os jogos, não só o Bingo).
