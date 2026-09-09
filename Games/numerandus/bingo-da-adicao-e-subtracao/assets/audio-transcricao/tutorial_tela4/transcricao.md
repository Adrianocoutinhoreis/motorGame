# tutorial_tela4.wav

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_tela4.wav` |
| `id` no motor | `tutorial_tela4` |
| Tipo | Narração — instrução de tutorial (passo 4 de 4) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **10,85 s** |
| SHA-256 (16 primeiros) | `a1ca10d765a5e446` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. |

## Transcrição

> «Complete quatro em linha e vença! Marque quatro números seguidos — em linha, coluna ou
> diagonal — e faça bingo! Quem conseguir primeiro, você ou o computador, vence o jogo.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tutorial_tela4`) corresponde ao último passo do tutorial
   (`config.tutorial[3].fala`);
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[3].titulo` e `.texto`, unidos por ". " — os dígitos "4" escritos no texto
   viram por extenso "quatro" na fala, como é natural em locução), e a duração (10,85 s para
   as 28 palavras do texto) dá **2,58 palavras/s** — consistente com o ritmo dos outros três
   passos.

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA`.

## Onde é usado no jogo

Tela de tutorial, passo 4 de 4, o último (`config.tutorial[3].fala`). Tocado no canal `speech`
na entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos também serve
à AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
