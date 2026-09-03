# CHECKLIST-AUDIO.md — Jogo dos Blocos

Checklist do **áudio**, e só dele. O `CHECKLIST.md` cobre o jogo inteiro; este existe porque
neste jogo o áudio **é** o conteúdo pedagógico — a criança de 4 a 7 anos não lê, ela ouve — e
porque a maior parte do que pode dar errado com áudio não aparece na tela.

Estado em **21/08/2026**. Legenda: `[x]` feito · `[ ]` pendente.

**O que dá para verificar por script:**

```bash
node tools/audio-info.mjs jogo-dos-blocos    # inventário, formato, duração, hash, fichas
node tools/testes.mjs                        # entre eles: nenhuma síntese de voz no motor
node tools/verificar-independencia.mjs       # nenhum áudio vindo de fora da pasta
```

**O que só o ouvido verifica:** tudo na seção 3 e na 4. Nenhum script ouve por você, e é aí
que moram os erros que chegam ao aluno.

---

## 1. Inventário e integridade — *`audio-info.mjs`*

- [x] Todo arquivo de áudio está em `assets/audio/`, com caminho relativo — **26 arquivos**
- [x] Toda referência é local; nada vem de CDN ou de outro servidor
- [x] Nenhum arquivo ilegível ou corrompido — os 26 têm cabeçalho válido
- [x] Nenhum arquivo duplicado — os 26 SHA-256 são distintos
- [x] **Toda locução tem ficha de transcrição** — 26 fichas para 26 arquivos
- [x] Toda ficha registra o SHA-256 do arquivo que descreve
- [ ] **Nenhum hash divergente** — `abertura` está divergente **de propósito até ser ouvida**:
      o arquivo foi trocado (ver seção 3). A ficha já descreve o arquivo novo; o item fecha
      quando a transcrição for preenchida
- [x] Todo áudio declarado no `config.js` existe no disco — 24 de 24
- [x] Todo áudio no disco e **não** declarado é intencional — `facil.mp3` e `dificil.mp3`,
      rótulos de dificuldade do jogo de 2013 que esta refação não usa (os níveis são por
      habilidade, não por dificuldade)

## 2. Ligação no jogo — *lê-se no `config.js`*

- [x] Narração dos 15 símbolos ligada aos 3 níveis (`niveis[].sons`)
- [x] Música de fundo ligada (`audio.musica` → `somFundo`)
- [x] Som de erro ligado (`audio.erro` → `nao`)
- [x] Sons de fim ligados (`audio.vitoria` → `acertoSOS`, `audio.derrota` → `erroSOS`)
- [ ] Abertura do menu ligada (`audio.abertura`) — **desligada em 03/09/2026**: narrava
      sozinha assim que o menu abria, sem a criança pedir, e o conteúdo é o mesmo não
      verificado da seção 3. Volta a `'abertura'` quando alguém ouvir e confirmar a ficha
- [x] **Narração dos 3 passos do tutorial ligada** (`tutorial[].fala`) — feito em 21/08/2026
- [ ] Narração da tela de níveis ligada (`audio.escolhaNivel`) — **falta gravar**
- [ ] Narração de vitória ligada (`audio.falaVitoria`) — **falta gravar**
- [ ] Narração de derrota ligada (`audio.falaDerrota`) — **falta gravar**
- [x] Toda narração passa por `audio.falar()`, nunca por `tocar()` direto — senão as falas se
      atropelam, como nos jogos originais
- [x] Nenhum som é gerado em código: sem síntese de voz, sem oscilador — *travado por teste,
      estático e em execução*

## 3. Transcrição — **exige ouvir**

Ninguém revisa o que a atividade ensina sem saber o que ela diz. Hoje **0 de 26** foram
ouvidos: 22 têm transcrição inferida (confiança alta, não verificada), 3 estão em branco e
1 é música.

- [ ] **`abertura` — PRIORIDADE 1.** Conteúdo desconhecido *e* arquivo trocado. É a primeira
      fala que a criança ouve. Se ainda descrever o jogo antigo ("fácil/difícil", "clique com
      o mouse"), está ensinando algo que não existe mais
- [ ] `acertoSOS` (4,55 s) — se disser "você acertou tudo", fica errado numa vitória **com**
      erros, que este jogo permite
- [ ] `erroSOS` (5,47 s) — se contiver fala repreensiva, contraria "errar não pode humilhar"
- [ ] `nao` (0,63 s) — está sendo usado como som de erro. Se é uma voz dizendo "não", o jogo
      diz "não" à criança até 3 vezes por partida. **Decisão a revisar, não só a transcrever**
- [ ] Os 3 novos do tutorial — transcrição inferida do texto que a tela exibe; confirmar que
      o áudio diz exatamente aquilo
- [ ] Os 15 símbolos — confirmar que cada um diz o símbolo certo. Um `tres.mp3` dizendo
      "quatro" ensina errado e passa despercebido para sempre
- [ ] Contagem atualizada em `assets/audio-transcricao/LEIA-ME.md` ao confirmar cada um

## 4. Conteúdo pedagógico — **exige ouvir, com a tela à frente**

- [ ] A narração do símbolo toca **a cada** encaixe, sem atropelar a anterior
- [ ] O símbolo falado é o símbolo desenhado no bloco — nos 3 níveis, nos 15 blocos
- [ ] O ritmo é lento o bastante para 4 anos. **Medido: 2,6 a 2,9 palavras/s no tutorial** —
      isso é fala adulta normal, não fala lenta. Avaliar ouvindo
- [ ] O passo 3 do tutorial tem pausa audível entre as duas ideias (a meta e o custo do erro);
      sem pausa, a segunda se perde
- [ ] A fala do passo 2 acompanha a mãozinha da ilustração — ouvir instrução sem ver o gesto
      não ensina o gesto
- [ ] Nenhuma fala repreende o erro
- [ ] Nenhuma fala pressupõe leitura, cor ou algo fora do que a tela mostra

## 5. Consistência sonora — **exige ouvir**

O jogo mistura **quatro lotes** de origem diferente. Desigualdade de volume ou de timbre entre
eles é o defeito de áudio mais perceptível para a criança, e o menos visível na revisão.

| Lote | Arquivos | Formato |
|---|---|---|
| Locução de 2014 | 17 | MPEG2, 40 kbps, 22 050 Hz, mono |
| Locução de 2026 | 4 | MPEG1, 128 kbps, 44 100 Hz, mono |
| Efeitos | 4 | WAV PCM 16 bits, 44 100 Hz, estéreo |
| Música | 1 | MPEG1, 56 kbps, 44 100 Hz, estéreo |

- [ ] O volume percebido é parecido entre os dois lotes de locução — 40 kbps/22 kHz e
      128 kbps/44 kHz vêm de ferramentas diferentes e raramente saem no mesmo nível
- [ ] As duas vozes convivem sem estranheza: ScanSoft Raquel (2014) nos símbolos e ElevenLabs
      (2026) no tutorial e na abertura. **Decisão em aberto:** uniformizar tudo na voz nova é
      possível — são 15 palavras curtas a regerar — e é o que faria o jogo soar como uma peça só
- [ ] Os efeitos WAV não estouram por cima da narração
- [ ] A música de fundo fica abaixo da fala (`volumeMusica` 0.25 contra `volumeFala` 1)

## 6. Peso do pacote

O pacote tem **3,4 MB**, dos quais **2,9 MB são áudio** — o áudio *é* o jogo, em bytes.

- [ ] **Os 4 efeitos WAV somam 1,9 MB**, mais da metade do pacote inteiro, sem compressão.
      Convertidos para MP3 na qualidade dos outros lotes cairiam para ~150 KB
- [ ] **O lote novo está a 128 kbps / 44 100 Hz** (556 KB nos 4 arquivos) para conteúdo que é
      só voz. Reencodar no formato do lote de 2014 (40 kbps, 22 050 Hz, mono) levaria a ~175 KB
- [ ] **As tags C2PA somam 66 KB** (16 648 bytes × 4). Ver a decisão na seção 9 — não é só peso
- [ ] Peso conferido em rede lenta: o jogo abre em tablet de escola sem esperar o áudio inteiro

## 7. Comportamento no jogo — **exige jogar**

- [ ] O áudio destrava no primeiro toque (política de autoplay dos navegadores)
- [ ] O botão de som desliga tudo — narração, efeito e música
- [ ] A preferência de som sobrevive a recarregar a página
- [ ] Trocar de aba pausa o áudio; voltar retoma
- [ ] Pular o tutorial no meio de uma fala **corta** a fala (`audio.calar()`), não a deixa
      terminar por cima da tela seguinte
- [ ] Voltar um passo do tutorial renarra o passo
- [ ] Sair da partida no meio não deixa narração órfã tocando
- [ ] **Console limpo de `[motor] narração ausente`** ao percorrer menu → tutorial → níveis →
      partida → resultado. Hoje aparecem **6**, uma por locução que falta

## 8. Acessibilidade

- [x] Nenhuma informação existe **só** no áudio — toda fala tem o texto correspondente na tela
- [x] O `texto` de cada fala está escrito no `config.js`, pronto para virar legenda
- [ ] Legenda do áudio narrado implementada — o motor já emite o evento `narracao` com
      `{ id, texto }`; falta a camada visual (`docs/STATES.md`, Planejado)
- [ ] O jogo é jogável **sem som** por uma criança que não lê — hoje o tutorial depende do
      texto escrito, o que aos 4 anos significa depender de um adulto

## 9. Proveniência e licença

- [x] Origem de cada arquivo registrada no `README.md`
- [x] **Nenhuma locução deste jogo é humana.** O lote de 2014 é TTS (`TextAloud: ScanSoft
      Raquel22`, criado em 09/01/2014) e o de 2026 é IA (ElevenLabs). A documentação chamava o
      primeiro de "locução original"; corrigido em 21/08/2026
- [x] Os 4 arquivos novos carregam **Content Credentials C2PA** assinados, declarando
      `digitalSourceType: trainedAlgorithmicMedia` — autor `Eleven Labs Inc.`
- [ ] **Decisão: manter ou remover o C2PA.** Manter é proveniência honesta — o manifesto diz,
      de forma verificável, que a voz é gerada; algumas instituições de ensino já pedem isso.
      Remover economiza 66 KB. **Não é uma decisão técnica**, e por isso não foi tomada aqui
- [ ] Licença de uso comercial/educacional da voz ElevenLabs conferida para material distribuído
      a alunos — depende do plano da conta que gerou os arquivos

## 10. O que ainda falta gravar

Três locuções, com o texto exato e a chave a preencher em
[`assets/audio-transcricao/A-GRAVAR.md`](assets/audio-transcricao/A-GRAVAR.md).

- [ ] `escolhaNivel` — «Escolha um nível.»
- [ ] `falaVitoria` — «Muito bem! Você conseguiu!»
- [ ] `falaDerrota` — «Quase! Vamos tentar de novo?»

Enquanto faltarem, essas telas ficam **em silêncio** — o motor não sintetiza voz para tapar o
buraco, e diz no console qual falta. Silêncio é uma falha visível; voz de tempo de execução,
que muda a cada navegador e não existe em parte dos tablets, é uma falha disfarçada.

---

## Resumo

| Seção | Fechados |
|---|---|
| 1. Inventário e integridade | 8 de 9 |
| 2. Ligação no jogo | 7 de 10 |
| 3. Transcrição (ouvir) | **0 de 7** |
| 4. Conteúdo pedagógico (ouvir) | **0 de 7** |
| 5. Consistência sonora (ouvir) | 0 de 4 |
| 6. Peso do pacote | 0 de 4 |
| 7. Comportamento (jogar) | 0 de 8 |
| 8. Acessibilidade | 2 de 4 |
| 9. Proveniência | 3 de 5 |
| 10. Falta gravar | 0 de 3 |

O que está fechado é o que script verifica. **O que falta é quase tudo o que exige ouvido** —
e é justamente aí que um erro chega ao aluno sem ninguém ver.
