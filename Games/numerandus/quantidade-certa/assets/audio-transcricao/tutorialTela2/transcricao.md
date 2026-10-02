# tutorialTela2 (tela2.wav)

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial/tela2.wav` |
| `id` no motor | `tutorialTela2` |
| Tipo | Narração — instrução de tutorial (passo 2 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **9,56 s** |
| SHA-256 (16 primeiros) | `1f65b2b8660ba0b2` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. |

## Transcrição

> «Arraste a peça até o número certo. Puxe a peça de furos para perto do
> número — perto o bastante, ela é atraída e trava sozinha, como um
> quebra-cabeça de verdade.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tela2`) corresponde ao passo 2 do tutorial
   (`config.tutorial[1].fala`), na mesma ordem "tela1..tela3" que os três passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[1].titulo` e `.texto`, unidos por ". " — é assim que
   `TutorialScreen._exibirPasso()` monta o texto que passa para `audio.falar()`), e a
   duração (9,56 s para as 30 palavras do texto) dá **3,1 palavras/s** — ritmo pausado,
   coerente com locução infantil, e na mesma faixa dos outros dois passos deste jogo
   (2,8 a 3,1 palavras/s).

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA` — e, se o áudio disser algo diferente do texto na tela, decida ali se o
texto escrito é que deveria mudar para bater com a gravação (a gravação não deveria ser
regravada só para bater com um texto provisório).

## Onde é usado no jogo

Tela de tutorial, passo 2 de 3 (`config.tutorial[1].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos também serve à
AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
