# soltarPeca (soltar_peca.mp3)

**Status:** ✅ CONFIRMADA — não há fala a transcrever

| | |
|---|---|
| Arquivo | `assets/audio/soltar_peca.mp3` |
| `id` no motor | `soltarPeca` |
| Tipo | Efeito curto de encaixe — sem fala |
| Formato | MP3 MPEG1 Layer III, 256 kbps, 48 000 Hz, joint stereo |
| Duração | **0,72 s** |
| SHA-256 (16 primeiros) | `bb343a49535045ee` |
| Origem | **A confirmar** — mesma pendência já registrada no Jogo da Ordenação e no
  Encaixe Certo (é o mesmo arquivo nos três): fornecido pronto pelo humano, sem
  procedência documentada. Confirmar que pode ser distribuído com o jogo antes de
  publicar para alunos. |

## Transcrição

> *(sem fala)*

Não é locução. Nada a transcrever — mas a ORIGEM/licença ainda precisa ser
confirmada (ver acima), igual nos outros dois jogos que já usam este arquivo.

## Como este status foi definido

O arquivo não contém fala: é um efeito curto de encaixe. O status de transcrição
é confirmado por natureza — não há palavra que possa estar errada. Isso NÃO cobre
a pendência de origem/licença, que é uma questão separada.

Este é o **mesmo arquivo** (mesmo SHA-256) usado como `audio.clique` no Material
Dourado e como `soltarPeca` no Jogo da Ordenação — copiado de
`Games/numerandus/material-dourado/assets/audio/soltar_peca.mp3` a pedido do
humano ("o mesmo som do Material Dourado").

## Onde é usado no jogo

Canal `sfx`, via `config.audio.acerto`, tocado em `GameScene._soltarArrasto()` no
instante em que uma peça é solta NO lugar certo E na ordem certa — o próprio
momento do encaixe visual (a peça anima até o contorno pontilhado e assenta).
Diferente do Material Dourado (onde este som é o `clique` genérico de qualquer
toque em peça/botão), aqui ele marca especificamente o ENCAIXE bem-sucedido —
soltar fora de ordem ou fora do lugar não toca este som (ver `config.audio.erro`,
ainda `null`).

---

<!-- Ao confirmar a origem/licença: preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
