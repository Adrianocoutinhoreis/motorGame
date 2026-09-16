# tela1.wav

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tela1.wav` |
| `id` no motor | `tutorialTela1` |
| Tipo | Narração — instrução de tutorial (passo 1 de 3) |
| Formato | WAV PCM 16 bits, 384 kbps, 24 000 Hz, mono |
| Duração | **5,16 s** |
| SHA-256 (12 primeiros) | `13b7007bf774` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. Mesma pendência que os outros jogos da
  coleção já têm pros áudios de tutorial deles. |

## Transcrição

> «Cada carta esconde uma surpresa. Toque numa carta virada pra baixo pra ver o que tem
> nela.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios
(mesmo método já usado nas fichas `tutorial_tela1/2/3` do Jogo da Velha):

1. o nome do arquivo (`tela1.wav`) corresponde ao passo 1 do tutorial
   (`config.tutorial[0].fala`), na mesma ordem "tela1/tela2/tela3" que os três passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe, unidos por ". " (é assim
   que `TutorialScreen.mostrarPasso()` monta o texto que passa para `audio.falar()`), e a
   duração (5,16 s para as 17 palavras do texto) dá **3,29 palavras/s** — praticamente o
   mesmo ritmo (~3,25 palavras/s) medido no `tutorial_tela1.wav` do Jogo da Velha, compatível
   com locução pausada infantil.

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o
status para `✅ CONFIRMADA` — e, se o áudio disser algo diferente do texto na tela, decida
ali se o texto escrito é que deveria mudar para bater com a gravação.

## Onde é usado no jogo

Tela de tutorial, passo 1 de 3 (`config.tutorial[0].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se a criança voltar a ele. A mesma lista de passos também
serve à AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
