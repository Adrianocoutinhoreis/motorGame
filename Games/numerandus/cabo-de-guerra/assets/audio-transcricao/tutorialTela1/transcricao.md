# tutorialTela1 (01corrida_tut.wav)

**Status:** 🟡 TRANSCRITA POR MÁQUINA — Whisper (faster-whisper small, offline); falta um humano ouvir

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/01corrida_tut.wav` |
| `id` no motor | `tutorialTela1` |
| Tipo | Narração — passo 1 do tutorial |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono (pcm_s16le) |
| Duração | **4,56 s** |
| SHA-256 (16 primeiros) | `d29a0a9951b8b42d` |
| Origem | Gravação própria do Cabo de Guerra, fornecida pelo humano em 10/11/2026 na pasta `assets/audio/tutorial/`. Quem gravou/gerou e a licença **a confirmar**. Mesmo formato (24 000 Hz, mono, 16 bits) das falas de 2026 da coleção. |

## Texto esperado (o que o tutorial pede)

O motor fala `titulo + '. ' + texto` do passo 1 (`src/config.js`):

> «Jogue o dado. Toque no dado. Ele diz quantas casas você pode puxar.»

São 13 palavras em 4,56 s.

## Transcrição

Saída do Whisper em 10/11/2026, sem correção:

> «Jogue dado, toque no dado, ele diz quantas caças você pode puxar.»

Confere com o texto esperado (diferenças só de pontuação e de como o Whisper separa as frases).

## Onde é usado no jogo

Canal `speech`, pelo id `tutorialTela1`: o passo 1 do "COMO JOGAR" do menu e da AJUDA na partida (`TutorialScreen` do motor).

## Observações

- O Whisper ouviu "Jogue dado" (sem o "o") e "caças" no lugar de "casas": são erros dele, não necessariamente da gravação. Conferir ouvindo.

---
