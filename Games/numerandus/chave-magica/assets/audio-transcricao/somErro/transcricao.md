# somErro (error.MP3)

**Status:** 🔴 NÃO VERIFICADA — não foi ouvido

| | |
|---|---|
| Arquivo | `assets/audio/error.MP3` |
| `id` no motor | `somErro` |
| Tipo | Feedback — usado como som de erro (formato que não combina) |
| Formato | MP3 MPEG1 Layer III, 192 kbps, 44 100 Hz, joint stereo |
| Duração | **0,34 s** |
| SHA-256 (12 primeiros) | `a4eef0130419` |
| Origem | Desconhecida — mesmo arquivo já usado no Jogo da Memória e no Quebra-Cabeça
  Geométrico. Confirmado por hash que é sempre a mesma cópia. |

## Transcrição

> _**A PREENCHER.** Ouça o arquivo e escreva aqui exatamente o que é dito — ou registre que
> não há fala, se for um efeito._

## Como este status foi definido

Este áudio não foi ouvido — quem montou esta ficha não tem essa capacidade, e não há
ferramenta de transcrição instalada neste ambiente. Duração de 0,34 s sugere um efeito
curto (bipe/clunk), mas isso é inferência, não confirmação.

## Onde é usado no jogo

Som de erro (`config.audio.erro`), tocado no canal `sfx` em `GameScene._soltarArrasto`
quando a criança solta uma chave numa fechadura errada. **Diferente do Jogo da Memória**
(onde errar nunca custa nada), aqui a tentativa errada TAMBÉM desconta uma vida
(`placar.errar(1)`, `config.registrarDerrota: true`) — o Chave Mágica é o primeiro jogo
Numerandus com derrota de verdade. O contorno pisca âmbar (nunca vermelho), mas o som
precisa ser ouvido com atenção redobrada: aqui ele acompanha uma punição real, não só um
"tente de novo" sem custo.

## Observações

- ⚠️ Mesma pendência já registrada no Geométrico e no Jogo da Memória — precisa ser ouvido
  antes deste jogo sair de "🚧 jogável, pendências declaradas".
- Se for uma voz reprovadora, o problema é maior aqui do que nos outros jogos que reusam
  este arquivo, porque a derrota de verdade já é, por si, uma experiência mais dura —
  um som punitivo em cima disso pode pesar demais para 6-7 anos.

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
