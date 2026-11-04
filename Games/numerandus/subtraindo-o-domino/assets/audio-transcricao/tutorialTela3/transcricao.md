# tutorialTela3 (tut03.wav)

**Status:** 🟡 TRANSCRITA POR MÁQUINA — Whisper (faster-whisper small, offline); falta um humano ouvir

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_domino/tut03.wav` |
| `id` no motor | `tutorialTela3` |
| Tipo | Narração — instrução de tutorial (passo 3 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **5,56 s** |
| SHA-256 (16 primeiros) | `de4db8382c89281b` |
| Origem | Arquivo fornecido pelo humano em 03/11/2026, colocado em `assets/audio/tutorial_domino/` — quem gravou/gerou e a licença **a confirmar**. |

## Texto esperado (o que a tela exibe)

> «Junte pedras. Depois o computador joga. Quem juntar mais pedras ganha!»

Assim `TutorialScreen.mostrarPasso()` monta a fala: `titulo + '. ' + texto`. São 11 palavras em 5,56 s.

## Transcrição

Saída do Whisper em 04/11/2026, sem correção:

> «Junte pedras. Depois o computador joga. Quem junta mais pedras ganha!»

Bate com o texto esperado; o Whisper ouviu "junta" onde a tela escreve "juntar".

## Como este status foi definido

Transcrito pelo Whisper em 04/11/2026: o arquivo é esta narração e diz o texto do passo. Nenhum humano ouviu ainda. O mapeamento arquivo → passo é inferência, apoiada no nome (`tut03` corresponde ao passo 3, `config.tutorial[2].fala`) e no formato. Se o texto do passo mudar, a gravação precisa ser refeita.

## Onde é usado no jogo

Canal `voice`, pela `fala` do passo 3 de `config.tutorial`: tocada pelo `TutorialScreen` no "COMO JOGAR" do menu e pelo `HelpScreen` (o botão de ajuda dentro da partida, regra RE-05).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha a transcrição acima. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
