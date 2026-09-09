# tutorial_tela1.wav

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_tela1.wav` |
| `id` no motor | `tutorial_tela1` |
| Tipo | Narração — instrução de tutorial (passo 1 de 4) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **7,37 s** |
| SHA-256 (16 primeiros) | `70359d2f6cefd886` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. |

## Transcrição

> «Veja a conta sorteada. A cada rodada, uma carta é sorteada com uma conta de adição ou subtração.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tutorial_tela1`) corresponde ao passo 1 do tutorial
   (`config.tutorial[0].fala`), na mesma ordem "tela1..tela4" que os quatro passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[0].titulo` e `.texto`, unidos por ". " — é assim que
   `TutorialScreen.mostrarPasso()` monta o texto que passa para `audio.falar()`), e a duração
   (7,37 s para as 18 palavras do texto) dá **2,44 palavras/s**, ritmo de fala pausada
   compatível com locução infantil — e consistente com o ritmo medido nos outros três passos
   (2,4 a 2,6 palavras/s), o que sugere um lote gravado de uma vez, no mesmo tom.

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA` — e, se o áudio disser algo diferente do texto na tela, decida ali se o
texto escrito é que deveria mudar para bater com a gravação (a gravação não deveria ser
regravada só para bater com um texto provisório).

## Onde é usado no jogo

Tela de tutorial, passo 1 de 4 (`config.tutorial[0].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos também serve à
AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
