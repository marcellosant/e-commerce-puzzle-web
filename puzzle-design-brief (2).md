# Puzzle — Design Brief

Documento de referência extraído do Figma ("Puzzle", arquivo `zFV7eNk0QAWwysx9HtrH2k`) para usar como contexto ao construir o projeto no Claude Code — tanto a versão web quanto o app nativo em Swift.

---

## 1. Identidade visual

Estética **editorial / fashion-lifestyle**, minimalista, monocromática. Bordas retas (sem arredondamento), muito espaço em branco, contraste alto preto/branco.

### Cores
| Token | Valor | Uso |
|---|---|---|
| `black` | `#000000` | texto principal, bordas, botões primários |
| `white` | `#FFFFFF` | fundo principal, texto sobre botão preto |
| `surface-muted` | `#F2F2F2` | fundo de imagens/categorias (placeholder) |
| `surface-header` | `#F9F9F9` | fundo do header/bottom nav |
| `text-secondary` | `#5D5F5F` | texto secundário (descrições, variação de produto) |

### Tipografia
- **Títulos / labels / botões:** `Archivo Narrow`, bold ou semibold, **uppercase**, tracking largo (0.48px–2.4px conforme o tamanho — quanto menor o texto, maior o tracking proporcional)
- **Corpo de texto (descrições, preços em prosa):** `Source Serif 4`, regular — dá o contraste serifada/sans que reforça o tom editorial
- Tamanhos observados: 12px (labels/nav), 14px (botões), 16px (corpo), 24px (subtítulos), 32–36px (títulos H1)

### Bordas e formas
- Todas as bordas são **sólidas, 1px, pretas** — sem sombra, sem arredondamento (border-radius: 0) exceto em swatches de cor (círculos) e algumas imagens de produto (`rounded`)
- Separadores: linha 1px preta simples

---

## 2. Estrutura de telas

Cada tela existe em versão **mobile (390px)** e **desktop (1280px)**, todas com o mesmo design system.

| Tela | Elementos principais |
|---|---|
| **Home** | Hero com imagem + overlay de texto + CTA; Grid de categorias (Sunglasses, Prescription, Contact Lenses, Accessories); Seção "Curated Frames" com produtos em destaque; TopAppBar; BottomNavBar (mobile) / TopNavBar (desktop) |
| **Collection** | Header + filtros (Frame Shape, Color, Material — sidebar no desktop, chips no mobile); Grid de produtos (2 colunas mobile / 4 colunas desktop) com badge, favorito, nome, variação, preço; botão "Load More" |
| **Product Detail** | Galeria de imagens (carrossel mobile / scroll vertical desktop); nome + preço; descrição; seletor de variação (swatches de cor); especificações (material, lentes, hardware, origem); botão de compra fixo |
| **Checkout** | Formulário em 3 passos (Contato, Endereço, Pagamento); resumo do pedido com totais (sidebar fixa no desktop, abaixo no mobile) |

Navegação inferior (mobile): **Home, Categories, Favorites, Profile**
Header (desktop): busca, links de navegação, favoritos, sacola — logo "PUZZLE" centralizado

---

## 3. Correções identificadas (aplicar na implementação)

1. **Labels de categoria** ("Sunglasses", "Prescription" etc.) não podem ficar com opacidade zero/invisíveis sobre a foto — garantir contraste de leitura (o Figma original tinha esse bug)
2. **Padding do CTA "View All"** deve ser simétrico, não desalinhado
3. **Componente de navegação inferior** deve ser único e reutilizado entre todas as telas (não duplicado com nomes/estruturas diferentes)

---

## 4. Decisões técnicas já tomadas

- **Plataformas:** site (web) primeiro, depois app nativo iOS em **Swift/SwiftUI**
- **Stack web:** React / Next.js (em vez de HTML/CSS/JS puro) — melhor pra gerenciar estado de carrinho, favoritos e filtros, e mais próximo conceitualmente do SwiftUI (ambos componentizados e reativos)
- Mesma identidade visual nas duas plataformas
- Nome do produto: **Puzzle**

> ⚠️ **Não iniciar o projeto mobile/Swift ainda.** A prioridade é finalizar o web por completo primeiro. Só começar o SwiftUI depois que o site estiver pronto.

---

## 5. Assets

As imagens de produto/categoria do Figma foram exportadas como URLs temporárias (expiram em 7 dias) — **não usar direto em produção**. Ao montar o projeto no Claude Code, usar imagens placeholder próprias ou re-exportar os assets definitivos do Figma antes de expirar.

---

## 6. Prompt sugerido para abrir no Claude Code

```
Este é o projeto "Puzzle", um e-commerce de óculos. Anexei o design-brief.md
com o design system completo (cores, tipografia, estrutura de telas) extraído
do Figma. Quero começar pela versão web em React/Next.js, implementando
primeiro a Home, depois Collection, Product Detail e Checkout — seguindo
fielmente o design system descrito, incluindo as 3 correções listadas na
seção 3. Não iniciar nada do app mobile/SwiftUI ainda — isso só começa
depois que o web estiver 100% finalizado.
```
