# tutorialTela4 (tela04.wav)

**Status:** 🔴 NÃO VERIFICADA — não foi ouvido

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/tela04.wav` |
| `id` no motor | `tutorialTela4` |
| Tipo | Narração — instrução de tutorial (passo 4 de 4) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **7,84 s** |
| SHA-256 (16 primeiros) | `47efca7899ddd48c` |
| Origem | Arquivo fornecido pelo humano em 14/10/2026, colocado em
  `assets/audio/tutorial/` — quem gravou/gerou e a licença **a confirmar**. |

## Texto esperado (o que a tela exibe)

> «Toque em PRONTO. Errou? O foguete volta e você tenta de novo. Depois, o laranja
> joga. Quem chegar primeiro ao fim ganha!»

Assim `TutorialScreen.mostrarPasso()` monta a fala: `titulo + '. ' + texto`
(engine/screens/TutorialScreen.js:321). São 22 palavras em 7,84 s = 2,81 palavras/s.

## Transcrição

> _**A PREENCHER.** Ouça o arquivo e escreva aqui exatamente o que é dito — ou registre
> que não há fala, se o arquivo não for esta narração._

## Como este status foi definido

Este áudio **não foi ouvido** — o texto acima é o texto EXIBIDO pela tela de tutorial,
não a transcrição do que o arquivo diz. O mapeamento arquivo → passo é inferência, apoiada
em dois indícios:

1. o nome (`tela04`) corresponde ao passo 4 do tutorial (`config.tutorial[3].fala`),
   na mesma ordem "tela01, tela002, tela003, tela04" dos quatro passos (o nome é
   irregular — foi mantido como recebido; o que vale é o que está em `config.assets`);
2. a duração (7,84 s para 22 palavras = 2,81 palavras/s) é a segunda do lote,
   coerente com o segundo passo mais longo — e o lote é homogêneo (todos WAV
   PCM 16 bits, 24 000 Hz, mono).

Ao ouvir: troque o Status para `✅ CONFIRMADA`, transcreva de verdade em "Transcrição" e,
se o áudio divergir do texto da tela, decida ali o que mudar (a gravação não se regrava
para bater com texto provisório).

## Onde é usado no jogo

Tela de tutorial, passo 4 de 4 (`config.tutorial[3].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos serve ao
COMO JOGAR do menu e à AJUDA dentro da partida (regra RE-05), então esta narração toca
também ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha a Transcrição. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
