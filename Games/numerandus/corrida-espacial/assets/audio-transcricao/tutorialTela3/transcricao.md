# tutorialTela3 (tela003.wav)

**Status:** 🔴 NÃO VERIFICADA — não foi ouvido

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/tela003.wav` |
| `id` no motor | `tutorialTela3` |
| Tipo | Narração — instrução de tutorial (passo 3 de 4) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **3,88 s** |
| SHA-256 (16 primeiros) | `cf77cc2cdbd472fa` |
| Origem | Arquivo fornecido pelo humano em 14/10/2026, colocado em
  `assets/audio/tutorial/` — quem gravou/gerou e a licença **a confirmar**. |

## Texto esperado (o que a tela exibe)

> «Ou pule direto. Já sabe a conta? Arraste o foguete até a casa certa.»

Assim `TutorialScreen.mostrarPasso()` monta a fala: `titulo + '. ' + texto`
(engine/screens/TutorialScreen.js:321). São 14 palavras em 3,88 s = 3,61 palavras/s
(o mais curto dos quatro — frase curta falada mais rápido).

## Transcrição

> _**A PREENCHER.** Ouça o arquivo e escreva aqui exatamente o que é dito — ou registre
> que não há fala, se o arquivo não for esta narração._

## Como este status foi definido

Este áudio **não foi ouvido** — o texto acima é o texto EXIBIDO pela tela de tutorial,
não a transcrição do que o arquivo diz. O mapeamento arquivo → passo é inferência, apoiada
em dois indícios:

1. o nome (`tela003`) corresponde ao passo 3 do tutorial (`config.tutorial[2].fala`),
   na mesma ordem "tela01, tela002, tela003, tela04" dos quatro passos (o nome é
   irregular — foi mantido como recebido; o que vale é o que está em `config.assets`);
2. a duração (3,88 s) é a menor do lote, coerente com o passo de menos palavras (14) —
   e o lote é homogêneo (todos WAV PCM 16 bits, 24 000 Hz, mono).

Ao ouvir: troque o Status para `✅ CONFIRMADA`, transcreva de verdade em "Transcrição" e,
se o áudio divergir do texto da tela, decida ali o que mudar (a gravação não se regrava
para bater com texto provisório).

## Onde é usado no jogo

Tela de tutorial, passo 3 de 4 (`config.tutorial[2].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos serve ao
COMO JOGAR do menu e à AJUDA dentro da partida (regra RE-05), então esta narração toca
também ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha a Transcrição. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
