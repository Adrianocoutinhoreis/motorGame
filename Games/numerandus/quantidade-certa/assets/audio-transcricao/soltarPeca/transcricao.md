# soltarPeca (soltar_peca.mp3)

**Status:** ✅ CONFIRMADA — não há fala a transcrever

| | |
|---|---|
| Arquivo | `assets/audio/soltar_peca.mp3` |
| `id` no motor | `soltarPeca` |
| Tipo | Efeito curto de soltar/encaixar — sem fala |
| Formato | MP3 MPEG1 Layer III, 256 kbps, 48 000 Hz, joint stereo |
| Duração | **0,72 s** |
| SHA-256 (16 primeiros) | `bb343a49535045ee` |
| Origem | **A confirmar** — mesmo arquivo (mesmo SHA-256) já usado como `soltarPeca`
  no Jogo da Ordenação, Material Dourado, Quebra-Cabeça Dino, Chave Mágica e Encaixe
  Certo (de onde foi copiado aqui). A pendência de origem/licença é a MESMA de lá:
  arquivo fornecido pronto pelo humano, com o nome original `soltar_peca.mp3`.
  Confirmar que pode ser distribuído com o jogo antes de publicar para alunos (a
  confirmação vale para todos os jogos que usam este arquivo de uma vez, é a mesma
  cópia). |

## Transcrição

> *(sem fala)*

Não é locução. Nada a transcrever — mas a ORIGEM/licença ainda precisa ser
confirmada (ver acima).

## Como este status foi definido

O arquivo não contém fala: é um efeito curto de encaixe. O status de transcrição
é confirmado por natureza — não há palavra que possa estar errada. Isso NÃO cobre
a pendência de origem/licença, que é uma questão separada.

## Onde é usado no jogo

Canal `sfx`, via `config.audio.soltar` — toca em DOIS gestos diferentes, ambos
"encaixar algo num lugar vazio": quando a peça de quantidade trava no número certo
(`GameScene._soltarArrastoPeca`) e quando uma continha entra num furo vazio
(`GameScene._soltarArrastoContinha`). Não toca em nenhuma tentativa errada — essas usam
`somErro` (peça) ou não têm som nenhum (continha, que nunca tem "furo errado").

---

<!-- Ao confirmar origem/licença: preencha abaixo. -->
<!-- Origem confirmada por: ________________________  em ____/____/______ -->
