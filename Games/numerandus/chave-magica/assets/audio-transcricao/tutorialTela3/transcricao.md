# tutorialTela3 (tela3.wav)

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/tela3.wav` |
| `id` no motor | `tutorialTela3` |
| Tipo | Narração — instrução de tutorial (passo 3 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **8,84 s** |
| SHA-256 (16 primeiros) | `290c916f44d12290` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. |

## Transcrição

> «Cuidado: são só 3 vidas e o tempo corre. Errar o formato custa uma vida.
> Encaixe todas as chaves antes do tempo (e das vidas) acabarem!»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tela3`) corresponde ao passo 3 do tutorial
   (`config.tutorial[2].fala`), na mesma ordem "tela1..tela3" que os três passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[2].titulo` e `.texto`, unidos por ". " — é assim que
   `TutorialScreen._exibirPasso()` monta o texto que passa para `audio.falar()`), e a
   duração (8,84 s para as 26 palavras do texto) dá **2,9 palavras/s** — na mesma faixa
   pausada dos outros dois passos deste jogo (2,5 a 3,0 palavras/s), coerente com o mesmo
   narrador/lote.

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA` — e, se o áudio disser algo diferente do texto na tela, decida ali se o
texto escrito é que deveria mudar para bater com a gravação (a gravação não deveria ser
regravada só para bater com um texto provisório).

## Onde é usado no jogo

Tela de tutorial, passo 3 de 3 (`config.tutorial[2].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos também serve à
AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
