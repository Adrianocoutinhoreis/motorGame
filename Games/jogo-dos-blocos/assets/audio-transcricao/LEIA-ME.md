# Transcrições dos áudios — Jogo dos Blocos

Uma pasta por arquivo de áudio, cada uma com a ficha `transcricao.md`: o que é falado, o
formato real do arquivo, onde ele é usado no jogo e o que ainda precisa ser conferido.

**Por que isso existe:** o áudio é o conteúdo pedagógico deste jogo — a criança aprende
ouvindo. Sem transcrição, ninguém consegue revisar o que a atividade ensina sem abrir 23
arquivos num player, e um áudio trocado (o bloco "3" dizendo "quatro") passaria despercebido.
A transcrição também é a base para legendas, para revisão pedagógica e para decidir o que
precisa ser regravado.

> **Aviso importante sobre a origem destas fichas.**
> Elas foram montadas **sem que nenhum áudio fosse ouvido** — quem as gerou não tem essa
> capacidade, e não havia ferramenta de transcrição disponível no sistema (`ffmpeg`, `whisper`
> e similares não estão instalados). O que é dado medido está marcado como tal; o que é
> dedução está marcado como dedução; e o que não se sabe está **em branco**, de propósito.
> Uma transcrição inventada seria pior que um campo vazio, porque pareceria informação.

---

## Situação atual

| Status | Quantos | O que significa |
|---|---|---|
| ✅ Confirmada | **0** | Alguém ouviu e conferiu |
| 🟡 Inferida | **19** | Texto deduzido do nome do arquivo + código original + duração. Confiança alta, mas **não verificado** |
| 🔴 Não verificada | **3** | Conteúdo falado desconhecido. Precisa ser ouvido e preenchido |
| ⚪ Sem fala | **1** | Música de fundo, nada a transcrever |

### O que precisa ser ouvido primeiro

| Arquivo | Duração | Por que é prioritário |
|---|---|---|
| [`abertura`](abertura/transcricao.md) | 11,15 s | É uma instrução falada inteira. Se descrever o jogo **antigo** (níveis "fácil/difícil", clique de mouse), está desatualizada e precisa ser regravada |
| [`erroSOS`](erroSOS/transcricao.md) | 5,47 s | Se contiver fala repreensiva, contraria a diretriz "errar não pode humilhar" |
| [`acertoSOS`](acertoSOS/transcricao.md) | 4,55 s | Se disser algo como "você acertou tudo", fica errado numa vitória com erros — que o jogo permite |
| [`nao`](nao/transcricao.md) | 0,63 s | Está sendo usado como **som de erro**: se é uma voz dizendo "não", o jogo diz "não" à criança até 3 vezes por partida. Decisão a revisar |

---

## Índice

### Narração dos números — nível 1 (Números 1 a 5)

| Pasta | Transcrição | Duração | Status |
|---|---|---|---|
| [`um`](um/transcricao.md) | «um» | 0,39 s | 🟡 |
| [`dois`](dois/transcricao.md) | «dois» | 0,63 s | 🟡 |
| [`tres`](tres/transcricao.md) | «três» | 0,52 s | 🟡 |
| [`quatro`](quatro/transcricao.md) | «quatro» | 0,65 s | 🟡 |
| [`cinco`](cinco/transcricao.md) | «cinco» | 0,65 s | 🟡 |

### Narração dos números — nível 2 (Números 6 a 10)

| Pasta | Transcrição | Duração | Status |
|---|---|---|---|
| [`seis`](seis/transcricao.md) | «seis» | 0,65 s | 🟡 |
| [`sete`](sete/transcricao.md) | «sete» | 0,63 s | 🟡 |
| [`oito`](oito/transcricao.md) | «oito» | 0,57 s | 🟡 |
| [`nove`](nove/transcricao.md) | «nove» | 0,60 s | 🟡 |
| [`dez`](dez/transcricao.md) | «dez» | 0,47 s | 🟡 |

> Estes cinco **existiam na pasta da aula original e nunca eram carregados** pelo código
> antigo, que só usava 1 a 5. Foi o que permitiu criar o nível 2 sem gravar nada.

### Narração das vogais — nível 3

| Pasta | Transcrição | Duração | Status |
|---|---|---|---|
| [`a`](a/transcricao.md) | «a» | 0,63 s | 🟡 |
| [`e`](e/transcricao.md) | «e» | 0,39 s | 🟡 |
| [`i`](i/transcricao.md) | «i» | 0,37 s | 🟡 |
| [`o`](o/transcricao.md) | «o» | 0,52 s | 🟡 |
| [`u`](u/transcricao.md) | «u» | 0,39 s | 🟡 |

### Ambiente e feedback

| Pasta | Transcrição | Duração | Status | Usado hoje? |
|---|---|---|---|---|
| [`abertura`](abertura/transcricao.md) | — | 11,15 s | 🔴 | Sim, no menu |
| [`somFundo`](somFundo/transcricao.md) | (música) | 32,73 s | ⚪ | Sim, em laço |
| [`acertoSOS`](acertoSOS/transcricao.md) | — | 4,55 s | 🔴 | Sim, na vitória |
| [`erroSOS`](erroSOS/transcricao.md) | — | 5,47 s | 🔴 | Sim, na derrota |
| [`nao`](nao/transcricao.md) | «não» | 0,63 s | 🟡 | Sim, som de erro |
| [`sim`](sim/transcricao.md) | «sim» | 0,63 s | 🟡 | Não |
| [`facil`](facil/transcricao.md) | «fácil» | 0,76 s | 🟡 | Não |
| [`dificil`](dificil/transcricao.md) | «difícil» | 0,78 s | 🟡 | Não |

---

## O que foi realmente medido (e é confiável)

Estes dados vieram da leitura dos **cabeçalhos dos arquivos** — cadeia de frames MP3 e chunks
RIFF do WAV — e não de suposição:

- **A locução é toda de um mesmo lote:** MP3 MPEG2 Layer III, 40 kbps, 22 050 Hz, **mono**.
  Os 19 arquivos de fala compartilham exatamente esse formato.
- **`somFundo` é de outro lote:** MPEG1, 56 kbps, 44 100 Hz, estéreo.
- **Os efeitos são WAV PCM** 44 100 Hz, estéreo, 16 bits — sem compressão, daí os 783 KB e
  941 KB. Juntos são **1,7 MB dos 2,5 MB do jogo**.
- **Nenhum arquivo é duplicado.** Havia suspeita: `um`, `u` e `e` têm exatamente 6 183 bytes,
  e `a`, `dois` e `sete` têm 7 359. A comparação por SHA-256 mostrou que **todos os 23 são
  distintos** — os tamanhos iguais são consequência de bitrate constante com o mesmo número de
  frames. Cada ficha registra o hash, para detectar troca de arquivo no futuro.

## Como preencher uma ficha

1. Ouça o arquivo em `assets/audio/<nome>`.
2. Abra `<nome>/transcricao.md`.
3. Escreva na seção **Transcrição** exatamente o que é dito — palavra por palavra, com a
   pontuação que reflete a fala. Não resuma nem corrija o que foi gravado.
4. Troque o **Status** no topo para `✅ CONFIRMADA`.
5. Preencha quem confirmou e a data, no rodapé da ficha.
6. Atualize a contagem na tabela **Situação atual** deste arquivo.

Se a transcrição inferida estiver **errada**, corrija e registre o que era esperado — isso
indica arquivo trocado, e vale conferir os vizinhos.

## Convenções

- A transcrição vai em **caixa normal**, com acentuação correta. A regra RE-01
  (`docs/REGRAS-EDUCACIONAIS.md`) manda caixa alta no texto **exibido à criança**; estas fichas
  são documentação para adultos.
- Transcrição entre `«guillemets»` para deixar claro onde a fala começa e termina, incluindo
  pausas e hesitações se existirem.
- Nome da pasta = nome do arquivo sem extensão, exatamente como aparece no `id` do motor —
  é o que liga a ficha ao `config.js`.
- Esta pasta é **documentação**: o jogo não a carrega. Ela viaja no pacote publicado porque
  pertence ao material da atividade, e ocupa alguns KB.
