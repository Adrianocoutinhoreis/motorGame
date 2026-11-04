# tutorialTela2 (tut02.wav)

**Status:** 🟡 TRANSCRITA POR MÁQUINA — Whisper (faster-whisper small, offline); falta um humano ouvir

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_domino/tut02.wav` |
| `id` no motor | `tutorialTela2` |
| Tipo | Narração — instrução de tutorial (passo 2 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **6,36 s** |
| SHA-256 (16 primeiros) | `74ac0897cbe593a7` |
| Origem | Arquivo fornecido pelo humano em 03/11/2026, colocado em `assets/audio/tutorial_domino/` — quem gravou/gerou e a licença **a confirmar**. |

## Texto esperado (o que a tela exibe)

> «Ache a pedra. Toque numa pedra que soma o mesmo total, como 5 e 4, e em PRONTO.»

Assim `TutorialScreen.mostrarPasso()` monta a fala: `titulo + '. ' + texto`. São 15 palavras em 6,36 s.

## Transcrição

Saída do Whisper em 04/11/2026, sem correção:

> «Ache a pedra, toque numa pedra que soma o mesmo total, como 5,4 e em pronto.»

Bate com o texto esperado ("como 5 e 4, e em PRONTO"; o "e" entre 5 e 4 sumiu na transcrição — conferir ouvindo).

## Como este status foi definido

Transcrito pelo Whisper em 04/11/2026: o arquivo é esta narração e diz o texto do passo. Nenhum humano ouviu ainda. O mapeamento arquivo → passo é inferência, apoiada no nome (`tut02` corresponde ao passo 2, `config.tutorial[1].fala`) e no formato. Se o texto do passo mudar, a gravação precisa ser refeita.

## Onde é usado no jogo

Canal `voice`, pela `fala` do passo 2 de `config.tutorial`: tocada pelo `TutorialScreen` no "COMO JOGAR" do menu e pelo `HelpScreen` (o botão de ajuda dentro da partida, regra RE-05).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha a transcrição acima. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
