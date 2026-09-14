# acertoSOS.wav

**Status:** ✅ CONFIRMADA — não há fala a transcrever

| | |
|---|---|
| Arquivo | `assets/audio/acertoSOS.wav` |
| `id` no motor | `acertoSOS` |
| Tipo | Efeito de fim de partida — sem fala |
| Formato | WAV PCM 16 bits, 1411 kbps, 44 100 Hz, estéreo |
| Duração | **4,55 s** |
| SHA-256 (16 primeiros) | `121d8ebfc52fdf8a` |
| Origem | Aula original 870298 — Educandus |

## Transcrição

> *(sem fala)*

Não é locução. Nada a transcrever, e nada a revisar por ouvido além de o arquivo
tocar e o volume estar equilibrado com a narração.

## Como este status foi definido

O arquivo não contém fala: é música/efeito. O status é confirmado por natureza — não
há palavra que possa estar errada.

Este é o **mesmo arquivo** (mesmo SHA-256) já usado como `audio.vitoria` no Jogo das
Formas, no Jogo dos Blocos, no Jogo das Cores, no Bingo da Adição e Subtração, no
Jogo da Velha e no Jogo da Ordenação — reaproveitado aqui de propósito: por não ter
fala, o mesmo efeito serve a qualquer jogo da coleção.

## Onde é usado no jogo

Canal `music` (não `sfx`), via `config.audio.vitoria`, disparado pela `ResultScreen`
do motor ao entrar na tela de resultado — este jogo nunca tem derrota (quebra-cabeça
solo, sempre termina em vitória), então `audio.derrota` continua `null` e `erroSOS`
não é usado aqui.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
