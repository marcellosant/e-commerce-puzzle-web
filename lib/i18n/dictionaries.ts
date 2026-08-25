export type Locale = "en" | "pt";

export interface Dictionary {
  nav: {
    home: string;
    categories: string;
    favorites: string;
    profile: string;
    cart: string;
  };
  home: {
    heroTitle: string;
    heroCta: string;
    shopByCategory: string;
    curatedFrames: string;
    viewAll: string;
  };
  collection: {
    title: string;
    results: (count: number) => string;
    resultsFor: (count: number, query: string) => string;
    categoryLabel: string;
    all: string;
    frameShapeLabel: string;
    colorLabel: string;
    materialLabel: string;
    loadMore: string;
  };
  search: {
    placeholder: string;
    label: string;
  };
  product: {
    color: string;
    specifications: string;
    addToBag: string;
    addedToBag: string;
    soldOut: string;
    addToFavorites: string;
    removeFromFavorites: string;
    specLabels: {
      material: string;
      lenses: string;
      hardware: string;
      origin: string;
    };
  };
  checkout: {
    title: string;
    steps: { contact: string; address: string; payment: string };
    contact: { heading: string; email: string; phone: string };
    address: {
      heading: string;
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    payment: {
      heading: string;
      nameOnCard: string;
      cardNumber: string;
      expiry: string;
      cvc: string;
      demoNotice: string;
    };
    errors: {
      email: string;
      phone: string;
      required: string;
      cardNumber: string;
      expiry: string;
      cvc: string;
    };
    back: string;
    continue: string;
    placeOrder: string;
    emptyBagTitle: string;
    continueShopping: string;
    orderConfirmedTitle: string;
    orderNumberLabel: string;
    orderConfirmedBody: (email: string) => string;
    yourEmail: string;
    orderSummary: string;
    bagEmpty: string;
    subtotal: string;
    shipping: string;
    total: string;
  };
  favorites: {
    title: string;
    empty: string;
  };
  profile: {
    title: string;
    comingSoon: string;
  };
  badges: {
    New: string;
    Bestseller: string;
    "Sold Out": string;
  };
  a11y: {
    skipToContent: string;
  };
}

const en: Dictionary = {
  nav: {
    home: "Home",
    categories: "Categories",
    favorites: "Favorites",
    profile: "Profile",
    cart: "Cart",
  },
  home: {
    heroTitle: "See the World in Focus",
    heroCta: "Shop the Collection",
    shopByCategory: "Shop by Category",
    curatedFrames: "Curated Frames",
    viewAll: "View All",
  },
  collection: {
    title: "Collection",
    results: (count) => `${count} ${count === 1 ? "result" : "results"}`,
    resultsFor: (count, query) =>
      `${count} ${count === 1 ? "result" : "results"} for "${query}"`,
    categoryLabel: "Category",
    all: "All",
    frameShapeLabel: "Frame Shape",
    colorLabel: "Color",
    materialLabel: "Material",
    loadMore: "Load More",
  },
  search: {
    placeholder: "Search frames...",
    label: "Search",
  },
  product: {
    color: "Color",
    specifications: "Specifications",
    addToBag: "Add to Bag",
    addedToBag: "Added to Bag",
    soldOut: "Sold Out",
    addToFavorites: "Add to favorites",
    removeFromFavorites: "Remove from favorites",
    specLabels: {
      material: "Material",
      lenses: "Lenses",
      hardware: "Hardware",
      origin: "Origin",
    },
  },
  checkout: {
    title: "Checkout",
    steps: { contact: "Contact", address: "Address", payment: "Payment" },
    contact: { heading: "Contact", email: "Email", phone: "Phone" },
    address: {
      heading: "Address",
      firstName: "First Name",
      lastName: "Last Name",
      street: "Street Address",
      city: "City",
      state: "State",
      zip: "ZIP Code",
      country: "Country",
    },
    payment: {
      heading: "Payment",
      nameOnCard: "Name on Card",
      cardNumber: "Card Number",
      expiry: "Expiry",
      cvc: "CVC",
      demoNotice: "This is a demo checkout — no real payment is processed.",
    },
    errors: {
      email: "Enter a valid email address",
      phone: "Enter a valid phone number",
      required: "This field is required",
      cardNumber: "Enter a valid card number",
      expiry: "Use MM/YY format",
      cvc: "Enter a valid CVC",
    },
    back: "Back",
    continue: "Continue",
    placeOrder: "Place Order",
    emptyBagTitle: "Your bag is empty",
    continueShopping: "Continue Shopping",
    orderConfirmedTitle: "Order Confirmed",
    orderNumberLabel: "Order number",
    orderConfirmedBody: (email) =>
      `Thank you for your order. A confirmation has been sent to ${email}.`,
    yourEmail: "your email",
    orderSummary: "Order Summary",
    bagEmpty: "Your bag is empty.",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
  },
  favorites: {
    title: "Favorites",
    empty: "You haven't saved any frames yet.",
  },
  profile: {
    title: "Profile",
    comingSoon: "Account management is coming soon.",
  },
  badges: {
    New: "New",
    Bestseller: "Bestseller",
    "Sold Out": "Sold Out",
  },
  a11y: {
    skipToContent: "Skip to content",
  },
};

const pt: Dictionary = {
  nav: {
    home: "Início",
    categories: "Categorias",
    favorites: "Favoritos",
    profile: "Perfil",
    cart: "Carrinho",
  },
  home: {
    heroTitle: "Veja o Mundo em Foco",
    heroCta: "Ver a Coleção",
    shopByCategory: "Compre por Categoria",
    curatedFrames: "Armações em Destaque",
    viewAll: "Ver Tudo",
  },
  collection: {
    title: "Coleção",
    results: (count) => `${count} ${count === 1 ? "resultado" : "resultados"}`,
    resultsFor: (count, query) =>
      `${count} ${count === 1 ? "resultado" : "resultados"} para "${query}"`,
    categoryLabel: "Categoria",
    all: "Todos",
    frameShapeLabel: "Formato da Armação",
    colorLabel: "Cor",
    materialLabel: "Material",
    loadMore: "Carregar Mais",
  },
  search: {
    placeholder: "Buscar armações...",
    label: "Buscar",
  },
  product: {
    color: "Cor",
    specifications: "Especificações",
    addToBag: "Adicionar à Sacola",
    addedToBag: "Adicionado à Sacola",
    soldOut: "Esgotado",
    addToFavorites: "Adicionar aos favoritos",
    removeFromFavorites: "Remover dos favoritos",
    specLabels: {
      material: "Material",
      lenses: "Lentes",
      hardware: "Ferragem",
      origin: "Origem",
    },
  },
  checkout: {
    title: "Finalizar Compra",
    steps: { contact: "Contato", address: "Endereço", payment: "Pagamento" },
    contact: { heading: "Contato", email: "E-mail", phone: "Telefone" },
    address: {
      heading: "Endereço",
      firstName: "Nome",
      lastName: "Sobrenome",
      street: "Endereço",
      city: "Cidade",
      state: "Estado",
      zip: "CEP",
      country: "País",
    },
    payment: {
      heading: "Pagamento",
      nameOnCard: "Nome no Cartão",
      cardNumber: "Número do Cartão",
      expiry: "Validade",
      cvc: "CVC",
      demoNotice: "Este é um checkout de demonstração — nenhum pagamento real é processado.",
    },
    errors: {
      email: "Digite um e-mail válido",
      phone: "Digite um telefone válido",
      required: "Este campo é obrigatório",
      cardNumber: "Digite um número de cartão válido",
      expiry: "Use o formato MM/AA",
      cvc: "Digite um CVC válido",
    },
    back: "Voltar",
    continue: "Continuar",
    placeOrder: "Finalizar Pedido",
    emptyBagTitle: "Sua sacola está vazia",
    continueShopping: "Continuar Comprando",
    orderConfirmedTitle: "Pedido Confirmado",
    orderNumberLabel: "Número do pedido",
    orderConfirmedBody: (email) =>
      `Obrigado pelo seu pedido. Uma confirmação foi enviada para ${email}.`,
    yourEmail: "seu e-mail",
    orderSummary: "Resumo do Pedido",
    bagEmpty: "Sua sacola está vazia.",
    subtotal: "Subtotal",
    shipping: "Frete",
    total: "Total",
  },
  favorites: {
    title: "Favoritos",
    empty: "Você ainda não salvou nenhuma armação.",
  },
  profile: {
    title: "Perfil",
    comingSoon: "Gerenciamento de conta em breve.",
  },
  badges: {
    New: "Novo",
    Bestseller: "Mais Vendido",
    "Sold Out": "Esgotado",
  },
  a11y: {
    skipToContent: "Pular para o conteúdo",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, pt };
