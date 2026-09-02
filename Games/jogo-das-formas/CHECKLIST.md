# Checklist — Jogo das Formas

> Passos para este jogo ser considerado **concluído**. Marque conforme avança.
> Um item que não se aplica deve ser **riscado com a justificativa**, nunca marcado por engano.
>
> Slug: `jogo-das-formas` · Criado em: 2026-08-24 · Motor: v1.3.0

---

## 1. Definição

- [ ] Objetivo pedagógico escrito em uma frase (o que a criança aprende ou treina)
- [ ] Faixa etária confirmada e coerente com o design (alvos, leitura, ritmo)
- [ ] Mecânica descrita em até 3 frases
- [ ] Níveis definidos: quantos, o que muda entre eles, o que cada um treina
- [ ] Condição de **vitória** definida e mensurável
- [ ] Condição de **derrota** definida (ou registrado que não existe derrota)
- [ ] `src/config.js` preenchido por inteiro (sem texto de exemplo sobrando)
- [ ] **Regras educacionais conferidas** (`docs/REGRAS-EDUCACIONAIS.md`), uma a uma:
  - [ ] RE-01 — toda letra apresentada como conteúdo está em **CAIXA ALTA**
        (frases de instrução seguem em caixa normal)

## 2. Assets

- [ ] Arte produzida (SVG/vetorial ou desenhada no canvas) e coerente com o design system
- [ ] Áudio de narração presente para **todo** conteúdo falado do jogo
- [ ] Efeitos de acerto, erro e clique presentes
- [ ] Todo asset está dentro de `assets/`, com caminho **relativo**
- [ ] Nenhuma fonte, imagem ou som vindo da internet
- [ ] Origem/licença de cada asset registrada no `README.md`
- [ ] Ficha de transcrição criada para **cada** áudio, em `assets/audio-transcricao/<nome>/transcricao.md`
- [ ] Transcrições **confirmadas ouvindo** (o áudio é conteúdo pedagógico: um arquivo trocado passa despercebido sem isso)
- [ ] Pendências de áudio ainda não gravado listadas explicitamente no `README.md`

## 3. Telas

- [ ] **Menu** com JOGAR e COMO JOGAR
- [ ] **Tutorial** com passos narrados, ilustrados e puláveis
- [ ] **Seleção de nível** (se houver mais de um nível)
- [ ] **Partida** com HUD legível (progresso, vidas/tempo, pausa)
- [ ] **Pausa** com continuar / recomeçar / sair
- [ ] **Ajuda** na partida (regra RE-05): o botão do HUD abre o tutorial POR CIMA do jogo,
      a partida continua atrás e voltar a devolve intacta — placar, tempo e tabuleiro
  - [ ] O tempo NÃO corre enquanto a ajuda está aberta (a partida tem de pausar de verdade)
  - [ ] Os passos do `config.tutorial` fazem sentido para quem JÁ está jogando e travou, não
        só para quem nunca viu o jogo — são os mesmos passos nas duas telas
- [ ] **Resultado** para vitória **e** para derrota
- [ ] Nenhum beco sem saída: de toda tela dá para voltar ao menu

## 4. Mecânica

- [ ] Regras implementadas conforme a definição
- [ ] Feedback **imediato** de acerto (visual + som)
- [ ] Feedback **imediato** de erro (visual + som), sem tom punitivo
- [ ] Dificuldade dos níveis testada de verdade (não só configurada)
- [ ] Nenhum estado travado: sempre dá para agir ou a partida termina
- [ ] Reiniciar limpa **todo** o estado da partida anterior

## 5. Contrato do AVA

> Referência: `docs/CONTRATO-AVA.md` e `Aulas para Refazer/MD/METODO.md` (Parte A).

Mapeamento semântico **deste** jogo (preencha):

| Campo | Significado aqui | Valor típico |
|---|---|---|
| `totalPerguntas` | | |
| `acertos` | | |
| `erros` | | |
| `nivel` | | |
| `jogo` | slug estável | `jogo-das-formas` |

- [ ] Existe **um único** ponto de fim de partida (`irPara('resultado', { resultado })`)
- [ ] `type` é exatamente `"JOGO_CONCLUIDO"`
- [ ] `acertos`/`erros` são da **partida inteira**, não da última jogada
- [ ] `totalPerguntas` reflete a meta real do nível jogado
- [ ] `nivel` é sempre enviado, nunca nulo
- [ ] `jogo` usa o slug estável
- [ ] Os três números vão como `number`
- [ ] `postMessage` vai para `window.parent` com `"*"`, protegido por `window.parent !== window`
- [ ] Nenhum dado de aluno / `lo_id` / `activity_id` / turma / XP / nota é enviado
- [ ] Derrota também registra (ou está documentado o motivo de não registrar)

## 6. Acessibilidade

- [ ] Todo alvo tocável tem no mínimo 64×64 px lógicos
- [ ] Espaço suficiente entre alvos (não dá para errar o dedo)
- [ ] Contraste de texto e de elementos essenciais em nível AA
- [ ] Cor **nunca** é o único portador de significado (sempre com ícone ou forma)
- [ ] Nenhuma ação exige saber ler: tudo tem ícone e narração
- [ ] Som pode ser desligado, e a preferência é lembrada
- [ ] Nada pisca de forma rápida ou repetitiva

## 7. Validação (no navegador — não dá para automatizar)

- [ ] `node tools/testes.mjs` passa
- [ ] `node tools/verificar-independencia.mjs jogo-das-formas` **aprovado**
- [ ] `node tools/teste-entrega-avulsa.mjs jogo-das-formas` **aprovado** (simula a publicação)
- [ ] Jogo abre por `node tools/serve.mjs` sem **nenhuma** requisição externa (aba Network)
- [ ] Fluxo completo de telas percorrido, sem travar
- [ ] **Vitória:** console mostra `[AVA] JOGO_CONCLUIDO` com os números batendo com o jogado
- [ ] **Derrota:** também registra, com os acertos parciais corretos
- [ ] **Replay:** 2 partidas sem recarregar geram exatamente 2 mensagens
- [ ] **Sem duplicata:** ficar parado na tela de resultado não gera mensagem extra
- [ ] `tools/ava-teste.html`: a mensagem **chega ao pai** e passa em todas as regras
- [ ] Testado em iframe pequeno, médio e grande sem cortar nem deformar
- [ ] Testado com **toque** (emulador de dispositivo ou tablet real)
- [ ] Testado após trocar de aba e voltar (o jogo pausa e retoma corretamente)

## 8. Entrega

- [ ] `README.md` do jogo atualizado (o que é, como rodar, assets, pendências)
- [ ] Este checklist com todos os itens fechados ou justificados
- [ ] `node tools/build.mjs jogo-das-formas` rodado por último (motor atualizado na cópia)
- [ ] Versão do motor conferida em `engine/version.json` dentro da pasta do jogo
- [ ] Pasta copiada para **fora** do projeto, servida de uma subpasta qualquer e testada
      (`node tools/teste-entrega-avulsa.mjs jogo-das-formas` faz isso automaticamente)
- [ ] Zip gerado só com a pasta do jogo e aberto uma última vez antes de enviar
