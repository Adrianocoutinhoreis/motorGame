# tutorial_tela2.wav

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tutorial_tela2.wav` |
| `id` no motor | `tutorial_tela2` |
| Tipo | Narração — instrução de tutorial (passo 2 de 4) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **10,93 s** |
| SHA-256 (16 primeiros) | `88a125ab41e21a8f` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. |

## Transcrição

> «Resolva e marque na sua cartela. Calcule o resultado de cabeça e toque no número certo na
> sua cartela. Tocou errado? Toque de novo para desfazer, sem problema!»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tutorial_tela2`) corresponde ao passo 2 do tutorial
   (`config.tutorial[1].fala`);
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[1].titulo` e `.texto`, unidos por ". "), e a duração (10,93 s para as
   28 palavras do texto) dá **2,56 palavras/s** — consistente com o ritmo dos outros três
   passos (2,4 a 2,6 palavras/s).

**Ponto de atenção específico deste passo:** o texto tem duas frases com função diferente — a
instrução principal ("calcule e toque") e a correção do toque errado ("tocou errado? toque de
novo pra desfazer"). Ao ouvir, confirme que existe uma pausa audível entre as duas: sem pausa,
uma criança que ainda não errou pode não entender que a segunda frase é sobre uma situação
diferente (o erro), não uma continuação da primeira instrução.

Confiança razoável, mas **inferência não é verificação**. Ao ouvir, confirme e troque o status
para `✅ CONFIRMADA`.

## Onde é usado no jogo

Tela de tutorial, passo 2 de 4 (`config.tutorial[1].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos também serve à
AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
