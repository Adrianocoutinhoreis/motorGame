# tutorialTela1 (tela1.wav)

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tela1.wav` |
| `id` no motor | `tutorialTela1` |
| Tipo | Narração — instrução de tutorial (passo 1 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **3,48 s** |
| SHA-256 (16 primeiros) | `b70567cd1e80f8ef` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. |

## Transcrição

> «Cada peça mostra uma quantidade. Conte os bichinhos ou frutinhas da peça
> fixa — nunca vem o número escrito ali.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tela1`) corresponde ao passo 1 do tutorial
   (`config.tutorial[0].fala`), na mesma ordem "tela1..tela3" que os três passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[0].titulo` e `.texto`, unidos por ". " — é assim que
   `TutorialScreen.mostrarPasso()` monta o texto que passa para `audio.falar()`), e a duração
   (3,48 s para as 19 palavras do texto) dá **5,46 palavras/s** — rápido para locução infantil,
   mas na mesma faixa exata medida nos outros dois passos deste jogo (5,45 a 5,50 palavras/s),
   sugerindo um lote gravado de uma vez, no mesmo ritmo (mais acelerado que o lote equivalente
   do Jogo da Ordenação, que fica em 2,55 a 3,1 palavras/s — narradores/tomadas diferentes).

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA` — e, se o áudio disser algo diferente do texto na tela, decida ali se o
texto escrito é que deveria mudar para bater com a gravação (a gravação não deveria ser
regravada só para bater com um texto provisório).

## Onde é usado no jogo

Tela de tutorial, passo 1 de 3 (`config.tutorial[0].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos também serve à
AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
