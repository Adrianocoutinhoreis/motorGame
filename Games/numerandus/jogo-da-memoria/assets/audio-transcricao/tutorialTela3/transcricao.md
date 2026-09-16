# tela3.wav

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tela3.wav` |
| `id` no motor | `tutorialTela3` |
| Tipo | Narração — instrução de tutorial (passo 3 de 3) |
| Formato | WAV PCM 16 bits, 384 kbps, 24 000 Hz, mono |
| Duração | **8,52 s** |
| SHA-256 (12 primeiros) | `c71b2e2f41c7` |
| Origem | **A confirmar** — mesma pendência do `tela1.wav` (ver ficha). |

## Transcrição

> «Errou? Sem problema! Se as cartas não combinarem, elas viram de volta com calma. Tente
> de novo até achar todos os pares.»

## Como este status foi definido

Mesmo método das fichas do `tela1.wav`/`tela2.wav`:

1. o nome do arquivo (`tela3.wav`) corresponde ao passo 3 do tutorial
   (`config.tutorial[2].fala`);
2. o texto acima é o título + o corpo da tela, unidos por ". ", e a duração (8,52 s para as
   22 palavras) dá **2,58 palavras/s** — a mais devagar das três, consistente com a frase
   mais longa e com o tom tranquilizador do conteúdo ("sem problema", "com calma").

**Não foi ouvido.** Este é o passo com o conteúdo mais sensível a checar por ouvido: o
`docs/DESIGN.md` exige que "errar não pode humilhar" — se a locução soar impaciente ou
repreensiva em vez de tranquilizadora, isso pesa mais do que nos outros dois passos.
Prioridade pra ouvir primeiro, entre os três.

## Onde é usado no jogo

Tela de tutorial, passo 3 de 3 (`config.tutorial[2].fala`) — o passo que explica o erro sem
punição (mesma regra RE-02 que já vale pro placar: errar nunca desconta a nota aqui).
Tocado no canal `speech` na entrada do passo; também toca na AJUDA dentro da partida
(regra RE-05).

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
