# Dra. Vanessa Dias — Landing Page

Landing page institucional da **Dra. Vanessa Dias**, Cirurgiã-Dentista especialista em Ortodontia e Ortopedia Facial (CRO/PR 21.095), em Apucarana — PR.

Feita em **HTML + CSS + JavaScript puro**, sem frameworks e sem build step — basta abrir no navegador ou servir com qualquer HTTP estático (GitHub Pages, Netlify, Vercel, etc.).

## Estrutura

```
.
├── index.html          # Home com hero animado, serviços, sobre, galeria destaque, CTA
├── sobre.html          # Página Sobre (história, valores, equipe)
├── galeria.html        # Galeria (fotos por categoria + aba de vídeos, lightbox)
├── contato.html        # Contato (WhatsApp, Instagram, Threads, endereço, mapa)
├── assets/
│   ├── css/style.css   # Estilos globais
│   └── js/
│       ├── config.js   # Configurações de contato (WhatsApp, endereço, redes)
│       ├── manifest.js # Lista de mídias por categoria (gerado por script)
│       └── main.js     # Navbar, tabs, filtros, lightbox, animações
├── scripts/
│   └── build-manifest.sh  # Regenera assets/js/manifest.js varrendo as pastas de mídia
└── ... pastas de mídias (Dr Vanessa, Sobre, Resultados, Lentes, Clareamento, Kids, Videos, ...)
```

## Como rodar localmente

```bash
python3 -m http.server 8000
# ou:  npx serve .
```
Abra http://localhost:8000 no navegador.

## Trocar informações de contato

Edite **[assets/js/config.js](assets/js/config.js)**:

```js
window.SITE_CONFIG = {
  whatsappNumber: "5543999999999", // só dígitos (55 + DDD + número)
  whatsappDisplay: "(43) 99999-9999",
  whatsappMessage: "Olá! Gostaria de agendar uma avaliação...",
  addressLine1: "Rua ..., nº ...",
  addressLine2: "Bairro — Apucarana / PR",
  mapQuery: "Rua ..., Apucarana, PR",
};
```

## Atualizar a galeria

Depois de adicionar novas fotos/vídeos dentro das pastas (`Resultados/`, `Lentes/`, `Videos/`, etc.), rode:

```bash
bash scripts/build-manifest.sh
```

Isso regenera `assets/js/manifest.js` com todos os arquivos encontrados.

## Paleta & Tipografia

- **Fundo**: `#faf7f2` (nude) e `#f2ebe0` (nude soft)
- **Texto principal**: `#2b2b2b`
- **Destaque dourado/bronze**: `#c8a876`
- **Marinho profundo**: `#1b2432`

- **Assinatura**: Parisienne
- **Títulos**: Cormorant Garamond
- **Texto**: Inter

## Deploy (GitHub Pages — gratuito)

1. Repositório → *Settings* → *Pages*
2. Em **Source**, selecione a branch (`main` após o merge) e a pasta `/` (root)
3. Em alguns segundos o site estará em `https://ferdsud1.github.io/vanessadias/`

## Crédito

© Dra. Vanessa Dias — Cirurgiã-Dentista — CRO/PR 21.095
