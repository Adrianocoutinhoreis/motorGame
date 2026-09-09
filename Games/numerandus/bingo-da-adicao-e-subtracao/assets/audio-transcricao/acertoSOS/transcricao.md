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
Formas, no Jogo dos Blocos e no Jogo das Cores — reaproveitado aqui de propósito, não
copiado às cegas: por não ter fala, o mesmo efeito serve a qualquer jogo da coleção sem
precisar dizer "bingo" ou "blocos".

## Onde é usado no jogo

Tocado por `GameScene._tocarSomFimEPersistirAteResultado()`, chamado de
`_comemorarBingoJogador()` no instante em que o jogador faz BINGO — junto com o
confete, o brilho dourado na cartela e o selo "VOCÊ VENCEU!" (ver
`src/scenes/GameScene.js`).

Diferente dos outros jogos da coleção, aqui `config.audio.vitoria` fica **null** e
quem dispara o som é o próprio `GameScene`, no canal `music` (não `sfx`): assim o som
sobrevive à troca de cena para a tela de resultado, em vez de cortar e a
`ResultScreen` tocar de novo por cima (o efeito antes se repetia — uma vez na tela do
jogo, outra na tela de resultado). Um ouvinte no `Game` para o som assim que o aluno
sair da tela de resultado, pra não seguir tocando no menu.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
