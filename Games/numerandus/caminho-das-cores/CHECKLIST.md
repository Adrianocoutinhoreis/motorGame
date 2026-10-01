# Checklist — Caminho das Cores

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `caminho-das-cores` · Criado em: 2026-10-01 · Motor: v1.3.6

---

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase — comparar formato e cor com uma cartela
      de referência e reproduzir a mesma sequência em cada trilha, na ordem certa
- [x] Faixa etária confirmada e coerente com o design (6-7 anos, 1º ano — alvos grandes,
      sem leitura obrigatória, ritmo livre sem cronômetro regressivo)
- [x] Mecânica descrita em até 3 frases (ver README, seção "O que é")
- [x] Níveis definidos: 3 (Fácil/Médio/Difícil), o eixo é "trilhas × peças por trilha"
      (3×2, 4×3, 5×4) — mais trilhas pra comparar E sequência mais longa pra acertar
- [x] Condição de **vitória** definida e mensurável — todas as trilhas viram cópia fiel
      da cartela (`ScoreSystem` com `total = nivel.trilhas`)
- [x] Condição de **derrota** definida (ou registrado que não existe derrota) — **não
      existe**: sem vidas, sem cronômetro regressivo, errar só demora mais (mesma decisão
      do Encaixe Certo/Quantidade Certa)
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — `textoEmCaixaAlta: true`; textos de tutorial/HUD passam pelo motor, que
        já caixa-alta sozinho
  - [x] RE-02 — a cena nunca chama `placar.errar()`; tentativa errada só incrementa
        `_tentativasErradas`, somado manualmente no `resultado` do `_terminar` — nunca
        desconta acerto nem estrela
  - [x] RE-03 — `unidadePlacar: { singular: 'trilha', plural: 'trilhas' }` — o placar
        mostra "N TRILHAS"
  - [x] RE-04 — `_terminar` não passa `estrelas` em `irPara('resultado', …)`

## 2. Assets

- [x] Arte produzida — nenhuma imagem: círculo/quadrado/triângulo/pentágono desenhados
      por `Path2D`/arcos direto no canvas (mesmo padrão do Encaixe Certo/Quantidade Certa)
- [ ] Áudio de narração presente para **todo** conteúdo falado do jogo — **pendente**:
      os 3 passos do tutorial não têm `fala:` (nenhuma locução gravada ainda pra este jogo)
- [x] Efeitos de acerto e erro presentes (`soltarPeca`/`somErro`, reaproveitados da coleção)
- [ ] ~~Efeito de clique~~ — decisão deliberada, sem som de clique genérico (mesmo padrão
      do Encaixe Certo/Jogo da Ordenação/Quantidade Certa): `config.audio.clique: null`
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [x] Ficha de transcrição criada para os 3 áudios existentes
- [ ] Transcrições **confirmadas ouvindo** — só 2 dos 3 áudios são "confirmado por
      natureza" (sem fala); `error.MP3` ainda precisa ser ouvido (mesma pendência
      compartilhada com Geométrico/Memória/Chave Mágica/Quantidade Certa, mesma cópia)
- [x] Pendências de áudio ainda não gravado/ouvido listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR (de fábrica, via `templates/jogo-base`)
- [x] **Tutorial** com 3 passos ilustrados e puláveis — narração ainda pendente (ver seção 2)
- [x] **Seleção de nível** (3 níveis)
- [x] **Partida** com HUD legível (pausa, ajuda, som, cronômetro ao vivo — sem vidas)
- [x] **Pausa** com continuar / recomeçar / sair
- [x] **Ajuda** na partida (regra RE-05): `HelpScreen` abre por cima, `Tween.pausarTodos()`
      + `this.pausada = true` param o jogo atrás, `_cancelarArrastoEmCurso()` devolve
      qualquer peça em arrasto pra bandeja antes de abrir
  - [x] O tempo NÃO corre enquanto a ajuda está aberta (`atualizar(dt)` retorna cedo
        quando `pausada`, só atualiza pausa/ajuda)
  - [x] Os mesmos 3 passos do `config.tutorial` servem tanto ao "como jogar" do menu
        quanto à ajuda dentro da partida (nenhum conteúdo duplicado)
- [ ] ~~Resultado para derrota~~ — este jogo nunca tem derrota (`registrarDerrota: false`);
      só existe a tela de vitória
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu

## 4. Mecânica

- [x] Regras implementadas conforme a definição (cartela fixa + trilhas que só aceitam
      a próxima peça da sequência, formato E cor, nessa ordem — testado via CDP, ver seção 7)
- [x] Feedback **imediato** de acerto (visual: peça aparece na trilha + pulinho na
      trilha via `_celebrarSlot`; som: `config.audio.acerto`)
- [x] Feedback **imediato** de erro (visual: tremor da peça via `_tremerEVoltar`; som:
      `config.audio.erro`), sem tom punitivo — nunca custa vida nem tempo
- [x] Dificuldade dos níveis testada de verdade — capturas de tela dos 3 níveis conferidas
      (ver histórico da sessão): tabuleiro cabe sem cortar nem no Difícil (22 peças,
      5 trilhas × 4 + 2 distratoras)
- [x] Nenhum estado travado: a única "fase" é arrastar; sem fase de animação bloqueante
      que precisasse de `Watchdog` (ao contrário do Quantidade Certa, que tem a chuva de
      continhas) — N/A, justificado
- [x] Reiniciar limpa todo o estado — `_construirRodada()` roda do zero a cada
      `irPara('jogando', …)`, e o motor recria a cena inteira nesse ponto

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md` e `Aulas para Refazer/MD/METODO.md` (Parte A).

Mapeamento semântico **deste** jogo:

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | número de trilhas da rodada (`nivel.trilhas`) | 3, 4 ou 5 |
| `acertos` | trilhas completadas por inteiro (sequência inteira certa, na ordem) | 0 a `totalPerguntas` |
| `erros` | tentativas de soltar peça errada OU certa fora de ordem (nunca desconta) | 0+ |
| `nivel` | `nivel.id` do config | 1, 2 ou 3 |
| `jogo` | slug estável | `caminho-das-cores` |

- [x] Existe um único ponto de fim de partida (`_terminar` → `irPara('resultado', { resultado })`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"` (verificado via `tools/ava-teste.html`, ver seção 7)
- [x] `acertos`/`erros` são da partida inteira, não da última jogada
- [x] `totalPerguntas` reflete a meta real do nível jogado
- [x] `nivel` é sempre enviado, nunca nulo
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number` (confirmado no payload capturado via ava-teste.html)
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window`
      (mesmo mecanismo genérico do motor — `teste-entrega-avulsa.mjs` confirma que fora de
      iframe o jogo não envia nada)
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [ ] ~~Derrota também registra~~ — não existe derrota neste jogo (ver seção 1)

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos — peças calculadas entre 56 e
      120px lógicos conforme o nível (`_calcularLayout`), nunca abaixo do piso
- [x] Espaço suficiente entre alvos (`gapBandeja`/`gapTrilha` fixos, nunca comprimidos
      a zero pelo algoritmo de ajuste)
- [x] Contraste de texto e de elementos essenciais em nível AA (texto do motor já
      segue o design system; peças têm contorno escuro próprio, não dependem só da cor
      de fundo)
- [ ] Cor **nunca** é o único portador de significado — **pendência real**: a
      comparação é formato **e** cor juntos (não só cor), o que já ajuda, mas o jogo
      não tem um segundo canal (textura/ícone) pra quem não distingue bem as 6 cores do
      banco — mesma pendência de acessibilidade já registrada no Jogo das Cores,
      herdada aqui por usar um banco de cores parecido
- [x] Nenhuma ação exige saber ler: tutorial 100% ilustrado, narração é a única
      pendência (texto de apoio nunca é a única via)
- [x] Som pode ser desligado (`SoundToggle` no HUD), preferência é do motor (`AudioBus`)
- [x] Nada pisca de forma rápida ou repetitiva (tremor e pulinho são curtos, ~150-220ms,
      sem repetição em loop)

## 7. Validação (no navegador — não dá para automatizar)

- [x] `node tools/testes.mjs` passa (154/0, suíte do motor — não específica deste jogo)
- [x] `node tools/verificar-independencia.mjs numerandus/caminho-das-cores` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs numerandus/caminho-das-cores` **aprovado**
      (11/11 — jogo serve de fora do projeto, 3 áudios carregam, sem postMessage fora de iframe)
- [x] Jogo abre por `node tools/serve.mjs` sem nenhuma requisição externa (confirmado
      pela `teste-entrega-avulsa.mjs`: 50 requisições, todas locais à pasta)
- [x] Fluxo completo de telas percorrido, sem travar (menu → tutorial → nível → partida
      → resultado, nos 3 níveis, via captura-cena.mjs)
- [x] **Vitória:** testado via CDP direto na cena (`_soltarArrasto` chamado pra completar
      todas as trilhas) — `placar.acertos === placar.total`, `encerrado === true`; e via
      `tools/ava-teste.html`, mensagem chega com os números corretos (acertos=3,
      erros=0, totalPerguntas=3, nivel=1, jogo="caminho-das-cores", vitoria=true)
- [ ] ~~Derrota~~ — não existe (ver seção 1/5)
- [x] **Replay:** 2 partidas sem recarregar geram exatamente 2 mensagens (testado via
      `tools/ava-teste.html`: 1 mensagem após a 1ª vitória, 2 após a 2ª, sem duplicata)
- [x] **Sem duplicata:** nenhuma mensagem extra observada entre a 1ª e a 2ª vitória
- [x] `tools/ava-teste.html`: a mensagem chega ao pai e passa em **todas** as regras do
      validador embutido (0 regras com falha)
- [ ] Testado em iframe pequeno, médio e grande sem cortar nem deformar — **pendente**,
      só testado no tamanho padrão do `captura-cena.mjs`/`ava-teste.html`
- [x] Testado com **toque**: chamada direta aos métodos da cena E `PointerEvent` sintético
      de verdade (`pointerdown`/`pointermove`/`pointerup`, `pointerType: 'touch'`) disparado
      no `<canvas>`, convertendo coordenada lógica→tela via `stage.escala`/`deslocX`/`deslocY`
      — nenhum toque de dedo real num tablet ainda
- [x] **Pausa cancela arrasto em curso:** testado via CDP — peça em arrasto some do
      estado `_arrastando`, perde o flag `arrastando` e volta pra posição da bandeja ao
      chamar `_pausar()` no meio de um drag
- [ ] Testado após trocar de aba e voltar — **pendente**; mecanismo é genérico do motor
      (mesma pausa automática usada em toda a coleção), não testado isoladamente aqui

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como foi definido, como rodar, contrato,
      assets, pendências)
- [x] Este checklist com todos os itens fechados ou justificados
- [x] `node tools/build.mjs numerandus/caminho-das-cores` rodado por último (motor
      atualizado na cópia)
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo (v1.3.6,
      igual à raiz)
- [x] Pasta copiada para fora do projeto, servida de uma subpasta qualquer e testada
      (`node tools/teste-entrega-avulsa.mjs numerandus/caminho-das-cores`)
- [ ] Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar — **pendente**
