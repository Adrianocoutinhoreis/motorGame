# tutorialTela1 (01.wav)

**Status:** 🟡 TRANSCRITA POR MÁQUINA — Whisper (faster-whisper small, offline); falta um humano ouvir

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/01.wav` |
| `id` no motor | `tutorialTela1` |
| Tipo | Narração — passo 1 do tutorial |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono (pcm_s16le) |
| Duração | **5,08 s** |
| SHA-256 (16 primeiros) | `92ca37a0313c86c0` |
| Origem | Gravação própria da Corrida Maluca, fornecida pelo humano em 03/11/2026 na pasta `assets/audio/tutorial/`. Quem gravou/gerou e a licença **a confirmar**. Mesmo formato (24 000 Hz, mono, 16 bits) das falas de 2026 da coleção. |

## Texto esperado (o que o tutorial pede)

O motor fala `titulo + '. ' + texto` do passo 1 (`src/config.js`):

> «Jogue o dado. Toque no dado. A ficha anda sozinha, contando as casas.»

São 13 palavras em 5,08 s.

## Transcrição

Saída do Whisper em 04/11/2026, sem correção:

> «Jogue o dado, toque no dado, afixa a anda sozinha, contando as casas.»

Bate com o texto esperado.

## Onde é usado no jogo

Canal `speech`, pelo id `tutorialTela1`: o passo 1 do "COMO JOGAR" do menu e da AJUDA na partida (`TutorialScreen` do motor).

## Observações

- "afixa a anda" é o Whisper ouvindo mal "a ficha anda" — conferir ouvindo.

---

<!-- Ao confirmar ouvindo: troque o Status no topo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
