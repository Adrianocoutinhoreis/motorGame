# tutorial_tela3.wav

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_tela3.wav` |
| `id` no motor | `tutorial_tela3` |
| Tipo | Narração — instrução de tutorial (passo 3 de 4) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **10,01 s** |
| SHA-256 (16 primeiros) | `f112ec18e856d0ae` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. |

## Transcrição

> «Espie a cartela do computador. A cartela do computador fica escondida. Depois de responder,
> toque em espiar cartela para ver como ele está indo.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tutorial_tela3`) corresponde ao passo 3 do tutorial
   (`config.tutorial[2].fala`) — o passo mais novo, que explica a mecânica de espiar a cartela
   do computador (adicionada depois dos 3 passos originais);
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[2].titulo` e `.texto`, unidos por ". "), e a duração (10,01 s para as
   24 palavras do texto) dá **2,40 palavras/s** — consistente com o ritmo dos outros três
   passos.

**Ponto de atenção específico deste passo:** o botão citado na fala é "ESPIAR CARTELA" — o
mesmo rótulo exato do botão em jogo (`chipCpu`, em `GameScene.js`). Ao ouvir, confirme que a
locução diz esse nome tal como está escrito no botão, e não uma variação ("olhar a cartela",
"ver o computador") que confundiria quem está ouvindo e olhando a tela ao mesmo tempo.

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA`.

## Onde é usado no jogo

Tela de tutorial, passo 3 de 4 (`config.tutorial[2].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos também serve à
AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
