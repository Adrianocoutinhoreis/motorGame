# tutorial_tela2.wav

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_tela2.wav` |
| `id` no motor | `tutorial_tela2` |
| Tipo | Narração — instrução de tutorial (passo 2 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **6,20 s** |
| SHA-256 (16 primeiros) | `97df530a6ba725ed` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. Pendência anotada no README.md e no
  CHECKLIST.md deste jogo. |

## Transcrição

> «O computador joga com a outra cor. Depois da sua vez, o computador pensa um pouquinho e
> marca uma casa com a cor dele.»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tutorial_tela2`) corresponde ao passo 2 do tutorial
   (`config.tutorial[1].fala`), na mesma ordem "tela1/tela2/tela3" que os três passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe escrito
   (`config.tutorial[1].titulo` e `.texto`), e a duração (6,20 s para 24 palavras) dá
   **3,87 palavras/s** — mais rápido que o passo 1, mas ainda dentro da faixa de fala
   pausada; os três arquivos formam um lote coerente (mesmo formato, mesma origem provável).

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA`.

## Onde é usado no jogo

Tela de tutorial, passo 2 de 3 (`config.tutorial[1].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos também serve à
AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
