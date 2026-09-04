# Guia e Método de Criação — Jogos da Série Numerandus

> **Documento de referência para IAs e desenvolvedores.**
> Este guia estabelece o processo padrão para analisar materiais de referência (vídeos/projetos Remotion) e criar jogos educativos da **Série Numerandus** integrados ao **Motor Educandus** (`motorGame`).

---

## 1. Onde Encontrar as Referências Locais

Os materiais de referência da série Numerandus estão organizados na máquina em:

1. **Projetos de Vídeo / Código Fonte (Remotion/React)**:
   - Caminho: `C:\Users\ricoa\OneDrive\Desktop\numerandus\Videos_Numerandus\<nome_do_jogo>\`
   - Contém: `src/Composition.tsx`, `src/BingoCard.tsx`, etc., onde estão as regras matemáticas, sequências de animação, cores, timings e lógica pedagógica original.
2. **Assets e Mídias de Apoio**:
   - Caminho: `C:\Users\ricoa\OneDrive\Desktop\numerandus\Videos_Numerandus\<nome_do_jogo>_assets\`
   - Contém: Imagens PNG/SVG, gravações de áudio WAV/MP3 e vídeos de apoio.
3. **Vídeos Renderizados e Legendados**:
   - Caminho: `C:\Users\ricoa\OneDrive\Desktop\numerandus\finalizados\1ano\<nome_do_jogo>\`
   - Contém: Vídeos finais em `.mp4` e trilhas `.mp3` demonstrando a dinâmica completa da aula/jogo.

---

## 2. Inventário de Jogos da Série Numerandus (1º Ano)

| Jogo | Pasta de Referência | Slug no motorGame | Tema / Mecânica Central |
|---|---|---|---|
| **Bingo da Adição e Subtração** | `video_bingo_adicao_subtracao` | `bingo-da-adicao-e-subtracao` | Cartela 4x4, sorteio de contas de + e -, marcação de fichas e fechamento de linha. |
| **Jogo da Velha** | `Jogo_da_velha` | `jogo-da-velha-novo` | Tabuleiro 3x3 contra a CPU, escolha de cor e estratégia de fechamento. |
| **Jogo da Memória** | `Jogo_da_memoria` | `jogo-da-memoria` | Pares de cartas com números, quantidades ou operações correspondentes. |
| **Encaixe Certo** | `encaixe_certo` | `encaixe-certo` | Encaixe de peças geométricas, silhuetas ou contagens numéricas. |
| **Jogo da Ordenação** | `jogo_ordenacao` | `jogo-da-ordenacao` | Ordenação de números em sequência crescente/decrescente ou reta numérica. |
| **Material Dourado** | `material_dourado` | `material-dourado` | Contagem e composição de unidades, dezenas e centenas com cubinhos e barras. |
| **Chave Mágica** | `video_chave_magica` | `chave-magica` | Resolução de enigmas matemáticos para destravar baús/portas mágicas. |

---

## 3. Diretrizes de Design: Infantil & Neurodivergência

Todo jogo da Numerandus deve ser projetado com empatia para o público infantil (4 a 8 anos) e com acessibilidade cognitiva para alunos neurodivergentes (TEA, TDAH, discalculia leve):

### A. Previsibilidade e Baixa Carga Cognitiva
- Layout estável e limpo, sem elementos piscando ou flashes estroboscópicos.
- Linhas vencedoras, seleções e destaques devem possuir brilho contínuo (*glow* estável), nunca oscilações rápidas.
- Sem poluição visual: elementos de fundo devem ter baixa opacidade (0.08 a 0.15) e balanço suave.

### B. Ambiente Não Punitivo
- **Nunca use cronômetro regressivo estressante.** A criança deve ter tempo para pensar e calcular no próprio ritmo.
- Toques incorretos nunca causam "Game Over" direto; acionam apenas uma oscilação suave de feedback e incentivo calmo ("TENTE DE NOVO!").

### C. Alvos de Toque e Ergonomia (WCAG 2.5.5)
- Botões principais do menu com no mínimo 136px a 156px de altura.
- Células, cartas e botões interativos da partida sempre acima de 64x64px (idealmente 78px a 120px) com espaçamento mínimo de 12px para evitar toques acidentais.

### D. Identidade Visual Temática Exclusiva
- Cada jogo tem seu próprio tema visual (background, placa de título e cores) referente ao seu assunto:
  - Exemplos: Tema `'quadro'` para Jogo da Velha, Tema `'bingo'` para Bingo, etc.
- Todas as mensagens de instrução e conteúdo devem seguir a **Regra RE-01** (texto em **CAIXA ALTA**).

---

## 4. Estrutura Padrão de Arquitetura no motorGame

Cada jogo vive em `Games/numerandus/<slug>/`:

```
Games/numerandus/<slug>/
├── engine/               # Cópia do motor (gerada por `node tools/build.mjs`)
├── src/
│   ├── config.js         # Configurações, 3 níveis, tutorial e metadados
│   ├── main.js           # Ponto de entrada e registro de cenas
│   └── scenes/
│       ├── GameScene.js  # Mecânica central do jogo
│       └── ...           # Telas auxiliares (ex: EscolhaCorScreen, EscolhaCartelaScreen)
├── index.html            # HTML autônomo com viewport responsivo e tokens.css
├── README.md             # Documentação do jogo e metadados pedagógicos
└── CHECKLIST.md          # Checklist de verificação de qualidade
```

### Regras dos 3 Níveis de Dificuldade
Cada jogo deve declarar exatamente 3 níveis em `src/config.js`:
- **Nível 1 (Fácil)**: Fixação do conceito fundamental com números/formas menores e menor complexidade.
- **Nível 2 (Médio)**: Desafio intermediário misturando elementos (ex: adição + subtração, mais peças).
- **Nível 3 (Difícil)**: Desafio avançado para consolidar o raciocínio matemático.

### Tutorial e Ajuda na Partida (Regra RE-05)
- O array `tutorial` em `config.js` deve conter 3 passos com a propriedade `desenho: (ctx, l, a, t) => ...` animando o gesto ou a mecânica em canvas.
- O mesmo tutorial serve tanto ao botão "COMO JOGAR" do Menu quanto ao botão de "AJUDA" do HUD durante a partida (via `HelpScreen`), sem zerar o estado da partida.

### Contrato com o AVA (docs/CONTRATO-AVA.md)
A cena deve usar `ScoreSystem` como fonte única de pontuação e disparar ao terminar:
```js
this.irPara('resultado', {
  nivel: this.nivel,
  resultado: this.placar.paraAva(venceu),
});
```

---

## 5. Passo a Passo para a IA Criar os Próximos Jogos

Quando for solicitado criar um novo jogo da série Numerandus:

1. **Investigar o Projeto de Vídeo de Referência**:
   - Inspecione `C:\Users\ricoa\OneDrive\Desktop\numerandus\Videos_Numerandus\<nome_do_jogo>` e leia o código `Composition.tsx` ou scripts auxiliares para mapear valores, cartelas e regras.
2. **Definir Tema Visual**:
   - Se o jogo exigir um background ou placa de título novos, adicione o tema em `engine/ui/Background.js` e `engine/screens/MenuScreen.js` (mantendo sangria contínua).
3. **Criar a Pasta do Jogo em `Games/numerandus/<slug>/`**:
   - Crie `index.html`, `src/config.js`, `src/main.js`, `src/scenes/GameScene.js`, `README.md` e `CHECKLIST.md`.
4. **Construir e Sincronizar o Motor**:
   ```bash
   node tools/build.mjs numerandus/<slug>
   ```
5. **Validar Independência e Testes**:
   ```bash
   node tools/verificar-independencia.mjs numerandus/<slug>
   node tools/teste-entrega-avulsa.mjs numerandus/<slug>
   node tools/testes.mjs
   ```
6. **Apresentar o Jogo**:
   - Forneça o link local para execução via `node tools/serve.mjs`.
