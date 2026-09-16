# erro (error.MP3)

**Status:** 🔴 NÃO VERIFICADA — não foi ouvido

| | |
|---|---|
| Arquivo | `assets/audio/error.MP3` |
| `id` no motor | `erro` |
| Tipo | Feedback — usado como som de erro (par que não combina) |
| Formato | MP3 MPEG1 Layer III, 192 kbps, 44 100 Hz, joint stereo |
| Duração | **0,34 s** |
| SHA-256 (12 primeiros) | `a4eef0130419` |
| Origem | Desconhecida — arquivo fornecido pelo humano nesta sessão. Confirmado por hash que
  não é cópia de nenhum outro áudio já usado na coleção (não é o `nao.mp3` do Jogo dos
  Blocos nem o `erroSOS` de nenhum outro jogo). |

## Transcrição

> _**A PREENCHER.** Ouça o arquivo e escreva aqui exatamente o que é dito — ou registre que
> não há fala, se for um efeito._

## Como este status foi definido

Este áudio não foi ouvido — quem montou esta ficha não tem essa capacidade, e não há
ferramenta de transcrição instalada neste ambiente (`ffmpeg`, `whisper` e afins). O que se
tem:

1. o nome do arquivo, `error.MP3`, sugere que é o som pretendido para feedback de erro;
2. duração de 0,34 s — curta o bastante para um efeito (bipe, "clunk") ou para uma única
   sílaba/palavra curta;
3. nada mais: sem tag ID3, sem manifesto de proveniência, sem arquivo anterior que ele
   substitui.

**Não dá para saber sem ouvir** se é um efeito neutro ou uma voz — e, se for voz, o que ela
diz. Escrever qualquer coisa aqui seria inventar.

## Onde é usado no jogo

Som de erro (`config.audio.erro`), tocado no canal `sfx` em `GameScene._avaliarPar` quando a
criança vira duas cartas que **não combinam**. Diferente do Jogo dos Blocos, aqui errar nunca
encerra a partida nem desconta nada (RE-02, `registrarDerrota: false` — o jogo sempre termina
em vitória, só demora mais): é feedback do momento, não punição.

## Observações

- ⚠️ **Mesma decisão em aberto do `nao.mp3` no Jogo dos Blocos.** Se este arquivo for uma voz
  reprovadora (ex.: dizendo "errou" ou "não"), contraria a diretriz "errar não pode humilhar"
  (`docs/DESIGN.md`) — e aqui ainda mais, porque o jogo inteiro é desenhado para nunca punir.
  Se for um efeito neutro, a questão está resolvida ao ouvir e é só atualizar esta ficha.
- Precisa ser ouvido antes deste jogo sair de "🚧 jogável, pendências declaradas".

---

<!-- Ao confirmar ouvindo: troque o Status no topo e preencha abaixo. -->
<!-- Confirmada por: ________________________  em ____/____/______ -->
