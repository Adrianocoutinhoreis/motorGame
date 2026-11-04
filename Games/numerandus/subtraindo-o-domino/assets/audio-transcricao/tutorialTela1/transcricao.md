# tutorialTela1 (tut01.wav)

**Status:** 🟡 TRANSCRITA POR MÁQUINA — Whisper (faster-whisper small, offline); falta um humano ouvir

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_domino/tut01.wav` |
| `id` no motor | `tutorialTela1` |
| Tipo | Narração — instrução de tutorial (passo 1 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **5,80 s** |
| SHA-256 (16 primeiros) | `76368ee7d70d4295` |
| Origem | Arquivo fornecido pelo humano em 03/11/2026, colocado em `assets/audio/tutorial_domino/` — quem gravou/gerou e a licença **a confirmar**. |

## Texto esperado (o que a tela exibe)

> «Toque nos dados. Eles mostram um total. Some os pontos: 6 e 3 dão 9.»

Assim `TutorialScreen.mostrarPasso()` monta a fala: `titulo + '. ' + texto`. São 14 palavras em 5,80 s.

## Transcrição

Saída do Whisper em 04/11/2026, sem correção:

> «Toque nos dados. Eles mostram um total. Some os pontos. 6 e 3, dá um 9.»

Bate com o texto esperado; o Whisper ouviu "dá um 9" onde a tela escreve "dão 9" — conferir ouvindo.

## Como este status foi definido

Transcrito pelo Whisper em 04/11/2026: o arquivo é esta narração e diz o texto do passo. Nenhum humano ouviu ainda. O mapeamento arquivo → passo é inferência, apoiada no nome (`tut01` corresponde ao passo 1, `config.tutorial[0].fala`) e no formato. Se o texto do passo mudar, a gravação precisa ser refeita.

## Onde é usado no jogo

Canal `voice`, pela `fala` do passo 1 de `config.tutorial`: tocada pelo `TutorialScreen` no "COMO JOGAR" do menu e pelo `HelpScreen` (o botão de ajuda dentro da partida, regra RE-05).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha a transcrição acima. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
