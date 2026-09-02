# DESIGN.md — o design system do Motor Educandus

Público: **Educação Infantil e 1º ano (4 a 7 anos)**.
Direção visual: **flat moderno com ilustração vetorial** — formas geométricas limpas, cantos
arredondados, cores vivas em paleta controlada, sombras suaves e micro-animações.

Fonte única dos valores: `engine/theme/tokens.js`, publicado também como variáveis CSS por
`aplicarTokensNoCSS()`. **Nenhum valor de cor, espaço ou tempo deve ser escrito solto numa
tela.** Se falta um token, o certo é criar o token.

---

## 1. As cinco regras que governam tudo

Elas vêm da faixa etária, não de gosto:

1. **Nada exige leitura.** Toda ação tem ícone e narração. Texto é apoio para quem já lê.
2. **Alvo grande.** Mínimo de **64×64 px lógicos**, com pelo menos 16 px entre alvos.
   Garantido no construtor do `Button` — não dá para violar por descuido.
3. **Cor nunca é o único portador de significado.** Acerto tem ícone de certo; erro tem
   ícone de errado; nível tem número. Serve ao daltônico e ao projetor ruim da sala.
4. **Movimento curto e previsível.** Nada pisca. Nada se move sem motivo. Animação existe
   para dizer "isto mudou" ou "é a sua vez".
5. **Errar não pode humilhar.** A derrota mostra o quanto o aluno avançou, não o quanto
   falhou. "Quase lá!" e "7 pontos", nunca "você perdeu" — e nunca a conta do que faltou.
   O placar do fim de partida diz a unidade, não uma fração da meta (regra RE-03).

---

## 2. Cor

### Interface
| Token | Valor | Uso |
|---|---|---|
| `primaria` | `#2563EB` | Ação principal (JOGAR, continuar) |
| `primariaEscura` | `#1D4ED8` | Base sólida do botão, contorno de título |
| `secundaria` | `#7C3AED` | Ação secundária (tutorial, níveis) |
| `tinta` | `#111827` | Texto principal |
| `tintaSuave` | `#4B5563` | Texto de apoio |
| `superficie` | `#FFFFFF` | Cartões e painéis |
| `linha` | `#E5E7EB` | Bordas e trilhos |
| `letterbox` | `#0B1220` | Barras fora da área do jogo |

### Semânticas
| Token | Valor | Regra |
|---|---|---|
| `acerto` | `#16A34A` | **Sempre** com ícone `certo` ou com a narração de acerto |
| `erro` | `#DC2626` | **Sempre** com ícone `errado`; nunca sozinho |
| `atencao` | `#F59E0B` | Estrelas, tempo acabando |

### Paleta lúdica (peças dos jogos)
`vermelho #EF4444` · `laranja #F97316` · `amarelo #FACC15` · `verde #22C55E` ·
`turquesa #14B8A6` · `azul #3B82F6` · `roxo #8B5CF6` · `rosa #EC4899` · `marrom #A16207`

Escolhidas para serem distinguíveis entre si e legíveis sobre branco e sobre `tinta`.
**No Jogo das Cores, onde a cor É o conteúdo, a regra 3 pede um canal além da cor** — e, desde
02/09/2026, esse jogo **não o tem**: a peça é chapada, por decisão de acessibilidade do humano
que abriu mão do canal redundante (textura) para não criar "forma = cor" fixo, o que
contradiria o Jogo das Formas. É a única exceção conhecida à regra 3, feita de olhos abertos
para o custo — ver `REGRAS-JOGO-DAS-CORES.md`, seção 3.2, para a medição e o motivo completo.

### Cenário
`madeira #B45309` · `madeiraEscura #7C2D12` · `folha #4ADE80` · `ceu #BAE6FD` ·
`ceuProfundo #7DD3FC` — herdados do contexto natureza/madeira das aulas originais.

---

## 3. Tipografia

Fonte do sistema (`system-ui`), por decisão explícita: carregar uma fonte externa violaria
a independência do jogo, e embutir um arquivo de fonte custa mais do que entrega numa
interface com pouquíssimo texto.

| Token | px | Uso |
|---|---|---|
| `gigante` | 64 | Número dentro de peça, destaque único |
| `titulo` | 48 | Título de tela |
| `subtitulo` | 34 | Cabeçalho de painel |
| `corpo` | 28 | Rótulo de botão, texto do tutorial |
| `apoio` | 22 | Legenda, contador |

Pesos: `600` (normal) e `800` (forte). Textos sobre cenário usam **contorno**
(`TextNode.contorno`) em vez de sombra fraca — garante contraste sobre nuvem, sol ou colina.

> **Caixa das letras:** por decisão pedagógica (regra RE-01 em
> [`REGRAS-EDUCACIONAIS.md`](REGRAS-EDUCACIONAIS.md)), todo texto exibido vai em **caixa
> alta** nos jogos para 4–7 anos. Escreva os textos normalmente no `config.js` — o motor
> converte na hora de desenhar, preservando acentos. Controlado por `textoEmCaixaAlta`.

---

## 4. Espaço, raio e sombra

Espaço: `xs 8` · `sm 12` · `md 20` · `lg 32` · `xl 48` · `xxl 72`.
Raio: `sm 10` · `md 16` · `lg 24` · `pilula 999`.

Sombras (todas suaves, nunca duras):
- `cartao` — desfoque 18, y 8: painéis flutuantes
- `botao` — desfoque 12, y 5: botões
- `suave` — desfoque 10, y 3: ícones e elementos pequenos

O botão tem ainda uma **base sólida** (a cor escura 6 px abaixo) que some quando pressionado.
É o que dá o volume "de brinquedo" sem gradiente pesado — e comunica o toque fisicamente.

---

## 5. Movimento

| Token | ms | Uso |
|---|---|---|
| `rapido` | 140 | Pressionar um botão |
| `padrao` | 240 | Trocar valor, abrir painel |
| `lento` | 420 | Entrada de tela |
| `entrada` | 520 | Sequência escalonada |

Curvas com intenção:
- `costasSaida` — passa do alvo e volta: dá peso a botão e cartão que chega
- `quicarSaida` — quica ao chegar: peça que assenta
- `suaveEntrada` — acelera: queda por gravidade
- `elasticaSaida` — comemoração; usar com parcimônia

**Entrada escalonada:** elementos de escolha entram em sequência (80–120 ms entre eles), não
todos de uma vez. Dá tempo de a criança perceber que há mais de uma opção.

`tokens.css` respeita `prefers-reduced-motion` e praticamente zera as transições do DOM
para quem pediu menos animação no sistema.

---

## 6. Ícones

Caixa de 24×24, traço 2.2, cantos e pontas arredondados, desenhados como caminho vetorial
em `icons.js`. Sem arquivo externo, nítidos em qualquer escala.

`jogar` · `pausa` · `tutorial` · `som` · `semSom` · `casa` · `reiniciar` · `estrela` ·
`coracao` · `setaEsquerda` · `setaDireita` · `fechar` · `certo` · `errado` · `pular`

Ao acrescentar um ícone: mesma caixa, mesmo peso de traço, e ele precisa ser reconhecível
em 32 px — o menor tamanho em que aparece.

---

## 7. O mascote

O mascote não é decoração: é o canal de comunicação com quem não lê. Estados:

| Estado | Quando |
|---|---|
| `feliz` | Menu, convite a jogar |
| `pensando` | Tutorial, explicação |
| `comemorando` | Vitória |
| `triste` | Derrota — acolhendo, nunca repreendendo |
| `neutro` | Repouso |

O componente funciona de dois modos:

- **Imagem do jogo** — o jogo declara `config.mascote.asset` apontando para uma arte em
  `assets/`. É o caso do Jogo dos Blocos, que usa um **operário de obra** (`worker.webp`),
  coerente com o guindaste e os blocos. A imagem é escalada pela **altura**, preservando a
  proporção: uma figura de corpo inteiro é alta e estreita, e forçá-la num quadrado a
  deformaria.
- **Coruja vetorial** — o padrão do motor, desenhada em código. Um jogo novo nasce com um
  mascote funcionando sem depender de nenhum arquivo de arte.

> **Limite do modo imagem:** uma figura estática não troca de rosto. Os estados continuam
> visíveis como **linguagem corporal** — pulo ao acertar, inclinação ao comemorar, encolher
> ao lamentar — mas não mudam a feição. Para expressão facial de verdade seria preciso uma
> imagem por estado (`imagensPorExpressao`). Na coruja, a emoção é lida pelas sobrancelhas
> e pela pupila.

Em ambos os modos o mascote respira (balanço suave) para dar presença sem competir com o
conteúdo.

---

## 8. Layout e responsividade

- Área lógica **1280×720**. Tudo é escrito nessas coordenadas.
- O `Stage` escala por proporção e centraliza, com letterbox. Nunca corta, nunca deforma.
- **Nada de conteúdo essencial nos 40 px das bordas** — em iframe estreito, é o primeiro
  lugar a apertar.
- HUD no topo: progresso à esquerda, vidas ao lado, título ao centro, pausa à direita.
- Validado em 400×700 (celular em pé), 640×480 e 1280×720.

---

## 9. Como conferir uma tela nova

- [ ] Todo alvo tem 64 px ou mais, com folga entre eles
- [ ] Toda ação tem ícone; nenhuma depende de ler
- [ ] Toda instrução é narrada
- [ ] Nenhuma informação depende só da cor
- [ ] Nenhum valor cru: tudo vem de token
- [ ] Texto sobre cenário tem contorno
- [ ] Existe caminho de volta (nada de beco sem saída)
- [ ] Testado nos três tamanhos de iframe
- [ ] Nada pisca; nada se move sem motivo
