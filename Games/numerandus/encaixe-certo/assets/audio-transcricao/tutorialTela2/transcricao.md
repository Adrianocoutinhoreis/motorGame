# tutorialTela2 (tela2.wav)

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tela2.wav` |
| `id` no motor | `tutorialTela2` |
| Tipo | Narração — instrução de tutorial (passo 2 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **4,90 s** |
| SHA-256 (16 primeiros) | `2795ca577890a12a` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. |

## Transcrição

> «Arraste o número até encaixar. Puxe o número certo para perto da peça —
> perto o bastante, ele é atraído e trava sozinho, como um quebra-cabeça de
> verdade.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tela2`) corresponde ao passo 2 do tutorial
   (`config.tutorial[1].fala`), na mesma ordem "tela1..tela3" que os três passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[1].titulo` e `.texto`, unidos por ". " — é assim que
   `TutorialScreen.mostrarPasso()` monta o texto que passa para `audio.falar()`), e a duração
   (4,90 s para as 27 palavras do texto) dá **5,51 palavras/s** — na mesma faixa exata medida
   nos outros dois passos deste jogo (5,45 a 5,50 palavras/s), sugerindo um lote gravado de
   uma vez, no mesmo ritmo.

**Atenção especial neste arquivo:** durante esta mesma sessão, um arquivo `tela3.wav`
anterior (já substituído) tinha o **mesmo SHA-256 que este `tela2.wav`** — ou seja, em algum
momento os dois passos compartilharam, por engano, a mesma gravação. O humano corrigiu
substituindo o `tela3.wav` por um arquivo com hash diferente antes deste texto ser escrito, e
os três arquivos hoje têm hashes distintos entre si — mas vale ouvir este arquivo com atenção
redobrada para confirmar que ele fala mesmo o texto do PASSO 2 (arrastar), e não o do passo 3.

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
