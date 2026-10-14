# tutorialTela1 (tela01.wav)

**Status:** 🔴 NÃO VERIFICADA — não foi ouvido

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/tela01.wav` |
| `id` no motor | `tutorialTela1` |
| Tipo | Narração — instrução de tutorial (passo 1 de 4) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **8,08 s** |
| SHA-256 (16 primeiros) | `aef9a4763965ced7` |
| Origem | Arquivo fornecido pelo humano em 14/10/2026, colocado em
  `assets/audio/tutorial/` — quem gravou/gerou e a licença **a confirmar**. |

## Texto esperado (o que a tela exibe)

> «Toque em ROLAR. O dado diz quantas casas o foguete anda. No médio, junte os
> dados. No difícil, tire o menor do maior.»

Assim `TutorialScreen.mostrarPasso()` monta a fala: `titulo + '. ' + texto`
(engine/screens/TutorialScreen.js:321). São 23 palavras em 8,08 s = 2,85 palavras/s.

## Transcrição

> _**A PREENCHER.** Ouça o arquivo e escreva aqui exatamente o que é dito — ou registre
> que não há fala, se o arquivo não for esta narração._

## Como este status foi definido

Este áudio **não foi ouvido** — o texto acima é o texto EXIBIDO pela tela de tutorial,
não a transcrição do que o arquivo diz. O mapeamento arquivo → passo é inferência, apoiada
em dois indícios:

1. o nome (`tela01`) corresponde ao passo 1 do tutorial (`config.tutorial[0].fala`),
   na mesma ordem "tela01, tela002, tela003, tela04" dos quatro passos (o nome é
   irregular — foi mantido como recebido; o que vale é o que está em `config.assets`);
2. a duração (8,08 s para 23 palavras = 2,85 palavras/s) é a maior do lote, coerente
   com o passo mais longo dos quatro — e o lote é homogêneo (todos WAV PCM 16 bits,
   24 000 Hz, mono).

Ao ouvir: troque o Status para `✅ CONFIRMADA`, transcreva de verdade em "Transcrição" e,
se o áudio divergir do texto da tela, decida ali o que mudar (a gravação não se regrava
para bater com texto provisório).

## Onde é usado no jogo

Tela de tutorial, passo 1 de 4 (`config.tutorial[0].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos serve ao
COMO JOGAR do menu e à AJUDA dentro da partida (regra RE-05), então esta narração toca
também ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha a Transcrição. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
