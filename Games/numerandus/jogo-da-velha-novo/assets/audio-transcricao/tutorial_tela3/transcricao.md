# tutorial_tela3.wav

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_tela3.wav` |
| `id` no motor | `tutorial_tela3` |
| Tipo | Narração — instrução de tutorial (passo 3 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **10,80 s** |
| SHA-256 (16 primeiros) | `28a2331fc4b2b23b` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. Pendência anotada no README.md e no
  CHECKLIST.md deste jogo. |

## Transcrição

> «Três da mesma cor em linha vence. Três marcas da MESMA cor, em uma linha, coluna ou
> diagonal, vencem. Se o tabuleiro encher sem ninguém conseguir, é empate.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tutorial_tela3`) corresponde ao passo 3 do tutorial
   (`config.tutorial[2].fala`), na mesma ordem "tela1/tela2/tela3" que os três passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe escrito
   (`config.tutorial[2].titulo` e `.texto`), e a duração (10,80 s para 28 palavras) dá
   **2,59 palavras/s** — o mais lento dos três, coerente com ser o passo que explica a regra
   mais complexa (vitória por linha e empate) e por isso precisar do ritmo mais pausado.

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA`.

## Onde é usado no jogo

Tela de tutorial, passo 3 de 3 — o último (`config.tutorial[2].fala`). Tocado no canal
`speech` na entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos
também serve à AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
