# Importadora Gang — Landing Mayorista 3D

Landing page de una sola página para **Importadora Gang**, distribuidora mayorista de golosinas importadas (Gummy Gang es su línea insignia de gomitas). Objetivo: conversión B2B — que un comercio pida el catálogo mayorista por WhatsApp.

## Correr el proyecto

```bash
npm install
npm run dev        # abre http://localhost:5173
```

Build de producción:

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente
```

Requiere Node 18+.

## Stack

- **Vite 8 + React 19**
- **React Three Fiber + drei** — escena 3D con `ScrollControls`/`useScroll`: campo de golosinas 3D modeladas procedural según el catálogo real (gusanos gomita con anillos y gradiente bicolor, ositos, bananas escarchadas, huevos fritos, gajos de sandía, cerezas, corazones sweet-heat, frutillas, cintas ácidas arcoíris, dentaduras, donas, gumballs) en 3 capas de parallax, cámara con dolly + sway por puntero, `Environment` procedural con `Lightformer` (sin fetch externo). Formas en `src/three/candyShapes.jsx`.
- **Framer Motion** — reveals por sección (`whileInView`), stagger del hero, tilt 3D de las cards de producto.
- **@fontsource** Nunito (títulos) + DM Sans (cuerpo) — tipografías bundleadas, funciona offline.

## Estructura

```
src/
  data/site.js          ← productos, marcas, teléfonos WhatsApp, mensajes
  scrollStore.js        ← puente entre nav DOM y el scroller de drei
  hooks/useMediaFlags.js← isMobile + prefers-reduced-motion
  three/
    Experience.jsx      ← Canvas + ScrollControls (pages medido del DOM real)
    CandyScene.jsx      ← capas de caramelos, luces, cámara
  ui/                   ← Hero, ValueProps, Gallery, Brands, HowToBuy, Footer, Nav
  styles/global.css     ← design tokens + estilos
public/
  products/*.webp       ← fotos de bolsas Gummy Gang (gallery)
  flyers/*.webp         ← flyers de líneas (Crunchy, Licorice, Yaams, Happy Mum)
assets/
  fotos-originales/     ← JPEGs fuente (WhatsApp); la app no los usa, son la materia prima de los WebP
```

## Datos editables (src/data/site.js)

- `WHATSAPP_MAIN` / `WHATSAPP_ALT` — números de WhatsApp (formato internacional).
- `CATALOG_MESSAGE` — mensaje prellenado del CTA.
- `PRODUCTS` — cards de la galería (slug = nombre del webp en `public/products`).
- `BRAND_LINES` — cards de marcas.

El formulario de "Cómo comprar" no usa backend: arma un mensaje y abre WhatsApp con `wa.me`.

## Performance / responsive

- Mobile (`max-width:768px` o pointer coarse): menos caramelos 3D (15 vs 27), `dpr` limitado a 1.5, menos partículas.
- `prefers-reduced-motion`: animaciones framer desactivadas (`MotionConfig reducedMotion="user"`), escena 3D estática, `frameloop="demand"`.
- Imágenes en WebP (~40-60 KB c/u), `loading="lazy"`, dimensiones declaradas (sin CLS).
- Paleta derivada de los colores de las golosinas: rojo #E23A3A, rosa #FF4F9A, violeta #7B2D8E, celeste #57B8E4, verde #7CC024, amarillo #FFC93C, naranja #FF8A3C.

## Referencias de diseño usadas

- **La Revoltosa** — https://larevoltosa.es — sitio 3D de snacks: colores candy + producto 3D flotando.
- **Oatside** — https://oatside.com — marca de comida playful: voz de marca divertida + reveals escalonados.
- **Hungry Tiger** — https://www.eathungrytiger.com — food brand con 3D: hero bold con comida 3D.
- **Opal Tadpole (Awwwards SOTD)** — https://www.awwwards.com/sites/opal-tadpole — storytelling de producto guiado por scroll con cámara.
- **Wawa Sensei — Scroll Animations** — https://wawasensei.dev/tuto/react-three-fiber-tutorial-scroll-animations — técnica base de ScrollControls + useScroll.
