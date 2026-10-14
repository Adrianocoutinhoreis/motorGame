# Checklist — Corrida Espacial

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `corrida-espacial` · Criado em: 2026-10-14 · Motor: v1.3.6

---

> **Estado em 14/10/2026** (Claude, na implementação): marcado só o que foi verificado
> de fato — por captura renderizada, por eventos de ponteiro reais em navegador headless
> (`scratchpad/teste-ponteiro.js`, 10 de 10) ou pelas ferramentas do repositório.
> O que exige ouvir, jogar com uma criança ou um tablet real ficou em aberto.

## 1. Definição

- [x] Objetivo pedagógico escrito em uma frase (o que a criança aprende ou treina)
- [x] Faixa etária confirmada e coerente com o design (alvos, leitura, ritmo)
- [x] Mecânica descrita em até 3 frases
- [x] Níveis definidos: quantos, o que muda entre eles, o que cada um treina
- [x] Condição de **vitória** definida e mensurável
- [x] Condição de **derrota** definida (ou registrado que não existe derrota)
- [x] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [x] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [x] RE-01 — toda letra apresentada como conteúdo está em **CAIXA ALTA**
        (frases de instrução seguem em caixa normal)
  - [x] RE-02 — a nota da partida desconta o erro **na vitória**, nunca na derrota
        (nada a fazer se a cena usa `placar.paraAva()`; confira que usa)
  - [x] RE-03 — o placar do fim de partida diz a **unidade** ("7 PONTOS"), não "7 de 10"
  - [x] RE-04 — a cena **não** passa `estrelas` em `irPara('resultado', …)`; a fileira é da tela

## 2. Assets

- [x] Arte produzida (SVG/vetorial ou desenhada no canvas) e coerente com o design system
- [ ] Áudio de narração presente para **todo** conteúdo falado do jogo — **parcial**: os 4
      passos do tutorial chegaram (`assets/audio/tutorial/`, 14/10/2026, declarados em
      `config.assets`); números `numero1`–`numero20`, `mais`/`menos` e as frases curtas
      continuam sem gravação (lista de ids no README)
- [x] Efeitos de acerto, erro e clique presentes
- [x] Todo asset está dentro de `assets/`, com caminho **relativo**
- [x] Nenhuma fonte, imagem ou som vindo da internet
- [x] Origem/licença de cada asset registrada no `README.md`
- [x] Ficha de transcrição criada para **cada** áudio, em `assets/audio-transcricao/<nome>/transcricao.md`
- [ ] Transcrições **confirmadas ouvindo** — `somErro` e as 4 narrações do tutorial seguem
      🔴 não ouvidas (o áudio é conteúdo pedagógico: um arquivo trocado ou trocado de
      ordem passa despercebido sem isso — as fichas do tutorial trazem o mapeamento
      arquivo→passo ainda como INFERIDO)
- [x] Pendências de áudio ainda não gravado listadas explicitamente no `README.md`

## 3. Telas

- [x] **Menu** com JOGAR e COMO JOGAR
- [x] **Tutorial** com passos narrados, ilustrados e puláveis
- [x] **Seleção de nível** (se houver mais de um nível)
- [x] **Partida** com HUD legível (progresso, vidas/tempo, pausa)
- [x] **Pausa** com continuar / recomeçar / sair
- [x] **Ajuda** na partida (regra RE-05): o botão do HUD abre o tutorial POR CIMA do jogo,
      a partida continua atrás e voltar a devolve intacta — placar, tempo e tabuleiro
  - [x] O tempo NÃO corre enquanto a ajuda está aberta (a partida tem de pausar de verdade)
  - [x] Os passos do `config.tutorial` fazem sentido para quem JÁ está jogando e travou, não
        só para quem nunca viu o jogo — são os mesmos passos nas duas telas
- [x] **Resultado** para vitória **e** para derrota
- [x] Nenhum beco sem saída: de toda tela dá para voltar ao menu

## 4. Mecânica

- [x] Regras implementadas conforme a definição
- [x] Feedback **imediato** de acerto (visual + som)
- [x] Feedback **imediato** de erro (visual + som), sem tom punitivo
- [ ] Dificuldade dos níveis testada de verdade (não só configurada) — só por simulação (4.000 corridas por nível, no protótipo); falta criança jogando
- [x] Nenhum estado travado: sempre dá para agir ou a partida termina
  - [x] Se a partida tem uma fase em que o toque é ignorado de propósito (`travado`, `fase`,
        `movendo`…), ela tem um **`Watchdog`** ligado no `atualizar(dt)`, depois do desvio da
        pausa. Sem ele, uma exceção engolida por `Tween.chamar` deixa o jogo animando e surdo
        para sempre — ver `docs/COMPONENTES.md`
  - [x] A invariante do `vivo` foi **conferida durante** a fase travada, não só depois: um
        predicado olhando para o alvo errado provoca resgate em falso, que é pior que não ter rede
        — conferido em 14/10/2026: 348 amostras a cada 30 ms numa vez do computador, 0 sem tween vivo
- [x] Reiniciar limpa **todo** o estado da partida anterior (a cena é recriada a cada `irPara('jogando')`)

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md` e `Aulas para Refazer/MD/METODO.md` (Parte A).

Mapeamento semântico **deste** jogo (preencha):

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | a casa 20 (a meta da corrida) | `20` |
| `acertos` | vitória: 20 − erros (RE-02); derrota: a casa alcançada pelo foguete azul | `17`, `11` |
| `erros` | toques em PRONTO com o foguete na casa errada | `0`–`4` |
| `nivel` | 1 = 1 dado, 2 = soma, 3 = diferença | `1` |
| `jogo` | slug estável | `corrida-espacial` |

- [x] Existe **um único** ponto de fim de partida (`irPara('resultado', { resultado })`)
- [x] `type` é exatamente `"JOGO_CONCLUIDO"`
- [x] `acertos`/`erros` são da **partida inteira**, não da última jogada
- [x] `totalPerguntas` reflete a meta real do nível jogado
- [x] `nivel` é sempre enviado, nunca nulo
- [x] `jogo` usa o slug estável
- [x] Os três números vão como `number`
- [x] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window`
- [x] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [x] Derrota também registra (ou está documentado o motivo de não registrar)

## 6. Acessibilidade

- [x] Todo alvo tocável tem no mínimo 64×64 px lógicos
- [x] Espaço suficiente entre alvos (não dá para errar o dedo)
- [ ] Contraste de texto e de elementos essenciais em nível AA
- [x] Cor **nunca** é o único portador de significado (sempre com ícone ou forma)
- [ ] Nenhuma ação exige saber ler: tudo tem ícone e narração — ícones sim; narração pendente
- [x] Som pode ser desligado, e a preferência é lembrada
- [x] Nada pisca de forma rápida ou repetitiva

## 7. Validação (no navegador — não dá para automatizar)

- [x] `node tools/testes.mjs` passa
- [x] `node tools/verificar-independencia.mjs corrida-espacial` **aprovado**
- [x] `node tools/teste-entrega-avulsa.mjs corrida-espacial` **aprovado** (simula a publicação)
- [x] Jogo abre por `node tools/serve.mjs` sem **nenhuma** requisição externa (aba Network)
- [x] Fluxo completo de telas percorrido, sem travar
- [x] **Vitória:** console mostra `[AVA] JOGO_CONCLUIDO` com os números batendo com o jogado
- [x] **Derrota:** também registra, com os acertos parciais corretos
- [x] **Replay:** 2 partidas sem recarregar geram exatamente 2 mensagens
- [x] **Sem duplicata:** ficar parado na tela de resultado não gera mensagem extra
- [ ] `tools/ava-teste.html`: a mensagem **chega ao pai** e passa em todas as regras
- [ ] Testado em iframe pequeno, médio e grande sem cortar nem deformar
- [ ] Testado com **toque** (emulador de dispositivo ou tablet real)
- [ ] Testado após trocar de aba e voltar (o jogo pausa e retoma corretamente)

## 8. Entrega

- [x] `README.md` do jogo atualizado (o que é, como rodar, assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados
- [x] `node tools/build.mjs corrida-espacial` rodado por último (motor atualizado na cópia)
- [x] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo
- [x] Pasta copiada para **fora** do projeto, servida de uma subpasta qualquer e testada
      (`node tools/teste-entrega-avulsa.mjs corrida-espacial` faz isso automaticamente)
- [ ] Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar
