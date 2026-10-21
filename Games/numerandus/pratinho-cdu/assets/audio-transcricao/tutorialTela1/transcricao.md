# tutorialTela1 (tut001.wav)

**Status:** 🔴 NÃO VERIFICADA — não foi ouvido

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/tut001.wav` |
| `id` no motor | `tutorialTela1` |
| Tipo | Narração — instrução de tutorial (passo 1 de 4) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **10,32 s** |
| SHA-256 (16 primeiros) | `ab96b7b2465c8d68` |
| Origem | Arquivo fornecido pelo humano em 21/10/2026 (renomeado no mesmo dia para a ordem certa dos passos), colocado em `assets/audio/tutorial/` — quem gravou/gerou e a licença **a confirmar**. |

## Texto esperado (o que a tela exibe)

> «Toque em JOGAR. Os grãos caem no prato. Cada fatia é uma casa: C de centena, D de dezena, U de unidade.»

Assim `TutorialScreen.mostrarPasso()` monta a fala: `titulo + '. ' + texto`. São 21 palavras em 10,32 s.

## Transcrição

> _**A PREENCHER.** Ouça o arquivo e escreva aqui exatamente o que é dito — ou registre que não há fala, se o arquivo não for esta narração._

## Como este status foi definido

Este áudio **não foi ouvido** — o texto acima é o texto EXIBIDO pela tela de tutorial, não a transcrição do que o arquivo diz. O mapeamento arquivo → passo é inferência, apoiada no nome (`tut001` corresponde ao passo 1, `config.tutorial[0].fala`) e no formato, igual ao dos outros quatro do lote. Se o texto do passo mudar, a gravação precisa ser refeita.

## Onde é usado no jogo

Canal `voice`, pela `fala` do passo 1 de `config.tutorial`: tocada pelo `TutorialScreen` no "COMO JOGAR" do menu e pelo `HelpScreen` (o botão de ajuda dentro da partida, regra RE-05).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha a transcrição acima. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
