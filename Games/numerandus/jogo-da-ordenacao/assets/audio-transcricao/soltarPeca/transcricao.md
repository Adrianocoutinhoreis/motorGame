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
| Origem | **A confirmar** — arquivo fornecido pronto pelo humano especificamente
  para este jogo, com o nome original `soltar_peca.mp3`. Confirmar que pode ser
  distribuído com o jogo antes de publicar para alunos. |

## Transcrição

> *(sem fala)*

Não é locução. Nada a transcrever — mas a ORIGEM/licença ainda precisa ser
confirmada (ver acima).

## Como este status foi definido

O arquivo não contém fala: é um efeito curto de encaixe. O status de transcrição
é confirmado por natureza — não há palavra que possa estar errada. Isso NÃO cobre
a pendência de origem/licença, que é uma questão separada.

## Onde é usado no jogo

Canal `sfx`, via `config.audio.soltar` — toca quando o aluno solta uma ficha numa
célula vizinha vazia e o movimento é ACEITO (`GameScene._tentarMover`). Não toca
quando a ficha só volta pro lugar (movimento inválido: célula ocupada, não vizinha,
ou a mesma de onde saiu) — soltar sem completar uma jogada não é um evento sonoro,
é só o gesto não tendo dado em nada. Este é o som que antes era o `cliqueFicha`
reaproveitado (ver a transcrição dele) — agora separado, porque o clique de botão
e o encaixe de peça são gestos diferentes.

---

<!-- Ao confirmar origem/licença: preencha abaixo. -->
<!-- Origem confirmada por: ________________________  em ____/____/______ -->
