# tutorialTela2 (02corrida_tut.wav)

**Status:** 🟡 TRANSCRITA POR MÁQUINA — Whisper (faster-whisper small, offline); falta um humano ouvir

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/02corrida_tut.wav` |
| `id` no motor | `tutorialTela2` |
| Tipo | Narração — passo 2 do tutorial |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono (pcm_s16le) |
| Duração | **5,08 s** |
| SHA-256 (16 primeiros) | `b212b19869942519` |
| Origem | Gravação própria do Cabo de Guerra, fornecida pelo humano em 10/11/2026 na pasta `assets/audio/tutorial/`. Quem gravou/gerou e a licença **a confirmar**. Mesmo formato (24 000 Hz, mono, 16 bits) das falas de 2026 da coleção. |

## Texto esperado (o que o tutorial pede)

O motor fala `titulo + '. ' + texto` do passo 2 (`src/config.js`):

> «Responda a carta. Acertou, a ficha anda. Errou, ela fica parada.»

São 11 palavras em 5,08 s.

## Transcrição

Saída do Whisper em 10/11/2026, sem correção:

> «Responda à carta. Acertou? A ficha anda. Errou? Ela fica parada.»

Confere com o texto esperado (diferenças só de pontuação e de como o Whisper separa as frases).

## Onde é usado no jogo

Canal `speech`, pelo id `tutorialTela2`: o passo 2 do "COMO JOGAR" do menu e da AJUDA na partida (`TutorialScreen` do motor).

## Observações

- O Whisper marcou as pausas como "Acertou? … Errou? …" (a fala tem entonação de pergunta); o texto é o mesmo do tutorial.

---
