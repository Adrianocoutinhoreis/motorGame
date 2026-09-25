# tutorialTela1 (tela1.wav)

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/tela1.wav` |
| `id` no motor | `tutorialTela1` |
| Tipo | Narração — instrução de tutorial (passo 1 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **7,00 s** |
| SHA-256 (16 primeiros) | `50290b5a52ff32f0` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. |

## Transcrição

> «Cada chave tem um formato só dela. Olhe bem a cabeça e os dentinhos de cada
> chave — nunca tem duas iguais.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tela1`) corresponde ao passo 1 do tutorial
   (`config.tutorial[0].fala`), na mesma ordem "tela1..tela3" que os três passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[0].titulo` e `.texto`, unidos por ". " — é assim que
   `TutorialScreen._exibirPasso()` monta o texto que passa para `audio.falar()`), e a
   duração (7,00 s para as 21 palavras do texto) dá **3,0 palavras/s** — ritmo pausado,
   coerente com locução infantil, e na mesma faixa dos outros dois passos deste jogo
   (2,5 a 2,9 palavras/s).

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
