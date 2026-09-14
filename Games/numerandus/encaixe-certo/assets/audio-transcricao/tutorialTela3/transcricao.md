# tutorialTela3 (tela3.wav)

**Status:** 🟡 INFERIDA — não foi ouvida

| | |
|---|---|
| Arquivo | `assets/audio/tela3.wav` |
| `id` no motor | `tutorialTela3` |
| Tipo | Narração — instrução de tutorial (passo 3 de 3) |
| Formato | WAV PCM 16 bits, 24 000 Hz, mono |
| Duração | **3,12 s** |
| SHA-256 (16 primeiros) | `64b15dd251a49eff` |
| Origem | **A confirmar** — o humano forneceu o arquivo já pronto nesta sessão, sem
  registrar quem gravou/gerou nem a licença. Este é um arquivo de SUBSTITUIÇÃO: uma versão
  anterior deste `tela3.wav` era, por engano, byte-a-byte idêntica ao `tela2.wav` (mesmo
  SHA-256) — o humano trocou pelo arquivo atual, com hash próprio, antes desta transcrição
  ser escrita. |

## Transcrição

> «Encaixe todos os pares para vencer. Quando todo mundo estiver encaixado, o
> tabuleiro inteiro comemora com você!»

## Como este status foi definido

**Este áudio não foi ouvido** — a transcrição acima é inferência, apoiada em dois indícios:

1. o nome do arquivo (`tela3`) corresponde ao passo 3 do tutorial
   (`config.tutorial[2].fala`), na mesma ordem "tela1..tela3" que os três passos;
2. o texto acima é exatamente o título + o corpo que a tela exibe
   (`config.tutorial[2].titulo` e `.texto`, unidos por ". " — é assim que
   `TutorialScreen.mostrarPasso()` monta o texto que passa para `audio.falar()`), e a duração
   (3,12 s para as 17 palavras do texto) dá **5,45 palavras/s** — na mesma faixa exata medida
   nos outros dois passos deste jogo (5,46 a 5,51 palavras/s), sugerindo um lote gravado de
   uma vez, no mesmo ritmo.

Confiança razoável, mas **inferência não é verificação** — e este arquivo em particular já
teve um problema real de troca (ver Origem, acima), então vale ouvir com atenção redobrada
para confirmar que fala mesmo o texto do PASSO 3, e não uma repetição do passo 2. Ao ouvir,
confirme e troque o status para `✅ CONFIRMADA` — e, se o áudio disser algo diferente do texto
na tela, decida ali se o texto escrito é que deveria mudar para bater com a gravação (a
gravação não deveria ser regravada só para bater com um texto provisório).

## Onde é usado no jogo

Tela de tutorial, passo 3 de 3 (`config.tutorial[2].fala`). Tocado no canal `speech` na
entrada do passo, e renarrado se o aluno voltar a ele. A mesma lista de passos também serve à
AJUDA dentro da partida (regra RE-05), então esta narração também toca ali.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
