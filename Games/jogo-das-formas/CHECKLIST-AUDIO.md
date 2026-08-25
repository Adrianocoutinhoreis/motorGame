# CHECKLIST-AUDIO.md — Jogo das Formas

Checklist do **áudio**, e só dele. O `CHECKLIST.md` cobre o jogo inteiro; este existe porque
neste jogo o áudio **é** o conteúdo pedagógico — a criança de 4 a 7 anos não lê o nome da
forma, ela ouve — e porque a maior parte do que pode dar errado com áudio não aparece na tela.

Estado em **24/08/2026**. Legenda: `[x]` feito · `[ ]` pendente.

**O que dá para verificar por script:**

```bash
node tools/audio-info.mjs jogo-das-formas    # inventário, formato, duração, hash, fichas
node tools/testes.mjs                        # entre eles: nenhuma síntese de voz no motor
node tools/verificar-independencia.mjs       # nenhum áudio vindo de fora da pasta
```

**O que só o ouvido verifica:** tudo na seção 3. Nenhum script ouve por você, e é aí que
moram os erros que chegam ao aluno.

---

## 1. Inventário e integridade — *`audio-info.mjs`*

- [x] Todo arquivo de áudio está em `assets/audio/`, com caminho relativo — **11 arquivos**
- [x] Toda referência é local; nada vem de CDN ou de outro servidor
- [x] Nenhum arquivo ilegível ou corrompido — os 11 têm cabeçalho válido
- [x] Nenhum arquivo duplicado — os 11 SHA-256 são distintos
- [x] **Toda locução tem ficha de transcrição** — 11 fichas para 11 arquivos
- [x] Toda ficha registra o SHA-256 do arquivo que descreve
- [x] Nenhum hash divergente
- [x] Todo áudio declarado no `config.js` existe no disco — 11 de 11
- [x] Nenhum áudio no disco fica sem declaração — 11 de 11 declarados

> `node tools/audio-info.mjs jogo-das-formas` fecha **APROVADO** em 25/08/2026.

## 2. Ligação no jogo — *lê-se no `config.js`*

- [x] Narração das 4 formas ligada (`formas[].som` → `circulo`, `quadrado`, `triangulo`, `retangulo`)
- [x] A narração toca no instante em que o combo é eliminado (canal `speech`)
- [x] A narração também toca ao tocar a linha da forma no painel lateral
- [x] Música de fundo ligada (`audio.musica` → `somFundo`)
- [x] Som de erro ligado (`audio.erro` → `nao`) — usado no ciclo sem combo
- [x] Sons de fim ligados (`audio.vitoria` → `acertoSOS`, `audio.derrota` → `erroSOS`)
- [ ] **Abertura do menu** (`audio.abertura`) — `null`, gravação não existe
- [x] **Narração dos 3 passos do tutorial** (`tutorial[].fala`) — os 3 arquivos (`TOQUE_EM_UMA_COLUNA.mp3`, `JUNTE_TRES_FORMAS_IGUAIS.mp3`, `CUIDADO_A_PILHA_SOBE.mp3`) integrados e com fichas de transcrição.

## 3. O que só o ouvido verifica

Nenhuma das oito transcrições foi confirmada ouvindo. Todas as fichas estão com status
`🟡 INFERIDA`, apoiadas em nome do arquivo, no mapeamento do código de 2013 e na duração.
**Inferência não é verificação.**

- [ ] `circulo.mp3` diz "círculo"
- [ ] `quadrado.mp3` diz "quadrado"
- [ ] `triangulo.mp3` diz "triângulo"
- [ ] `retangulo.mp3` diz "retângulo"
- [ ] **Nenhuma narração está trocada com outra** — o risco real: o bloco círculo dizendo
      "quadrado" passa batido em qualquer teste automático, e ensina a forma errada
- [ ] A pronúncia é pt-BR e está clara para uma criança de 4 anos
- [ ] O volume das quatro narrações é parecido entre si
- [ ] A música de fundo **não abafa** a narração da forma
- [ ] `acertoSOS.wav` (4,55 s) e `erroSOS.wav` (5,47 s) não atropelam a tela de resultado
- [ ] **`nao.wav` é efeito ou é a palavra "não"?** Se for a palavra, decidir se ela cabe:
      dizê-la a uma criança que apenas deixou um ciclo passar sem combo é retorno errado
      para a semântica deste jogo, e o certo é trocar por um efeito neutro

Ao confirmar cada uma, trocar o status na ficha
(`assets/audio-transcricao/<id>/transcricao.md`) para `✅ CONFIRMADA` e assinar no rodapé.

## 4. A gravar

| Id | O que a locução deve dizer | Onde entra |
|---|---|---|
| `abertura` | boas-vindas do menu | `MenuScreen`, ao entrar |
| `tutorial_pegar` | "Toque numa coluna para a garra descer e pegar os blocos de cima." | tutorial, passo 1 |
| `tutorial_combo` | "Três ou mais formas iguais que se toquem desaparecem. Não precisa ser em fila!" | tutorial, passo 2 |
| `tutorial_pilha` | "De vez em quando nasce uma linha nova por baixo. Se a pilha chegar no teto, acabou." | tutorial, passo 3 |
| `linha_subindo` | *(opcional)* aviso de pilha perto do teto | decisão em aberto |

Cada arquivo novo precisa de ficha de transcrição com o SHA-256, ou o
`audio-info.mjs` reprova.

## 5. A regra que o motor trava por teste

**Todo som sai de arquivo.** O motor não sintetiza voz e não gera tom: faltando a gravação, a
tela fica em **silêncio** e o console nomeia o arquivo e o que ele deveria dizer. O silêncio é
de propósito — uma voz robótica esconderia a lacuna e entregaria à criança uma pronúncia que
ninguém revisou.

Isso está travado em `tools/testes.mjs` ("Áudio — o motor não gera som, só toca arquivo") e
verificado em navegador ("nenhuma fala foi sintetizada pelo navegador").
