export const WHATSAPP_MAIN = '5491149277904'
export const WHATSAPP_ALT = '5491144018494'
export const PHONE_MAIN_DISPLAY = '11 4927-7904'
export const PHONE_ALT_DISPLAY = '11 4401-8494'

export const waLink = (message) =>
  `https://wa.me/${WHATSAPP_MAIN}?text=${encodeURIComponent(message)}`

export const CATALOG_MESSAGE =
  'Hola Importadora Gang 👋 Tengo un comercio y quiero recibir el catálogo mayorista con precios.'

// Category chip palette for gallery cards. Keys must match products.category
// values from the shared Supabase DB (compared lowercased + trimmed). Colors
// reuse the --candy-* brand tokens defined in src/styles/global.css.
export const CATEGORY_PALETTE = {
  'golosinas': '#ff4f9a',
  'snacks': '#ff8a3c',
  'galletitas': '#ffc93c',
  'lácteos': '#57b8e4',
  'conservas': '#7cc024',
  'salsas y condimentos': '#e23a3a',
  'condimentos': '#e23a3a',
  'sopas y caldos': '#7b2d8e',
  'frutos secos': '#ff8a3c',
  'congelados': '#57b8e4',
  'vinos y licores': '#7b2d8e',
  'postres': '#ff4f9a',
  'mar': '#57b8e4',
  'bebidas': '#7cc024',
}

const FALLBACK_CHIP = '#7b2d8e'

export function paletteFor(category) {
  if (!category) return FALLBACK_CHIP
  return CATEGORY_PALETTE[category.trim().toLowerCase()] ?? FALLBACK_CHIP
}

export function categoryLabel(category) {
  if (!category) return ''
  return category
    .split(' ')
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ')
}

export const BRAND_LINES = [
  {
    name: 'Gummy Gang',
    tag: 'Gomitas escarchadas',
    desc: '10 variedades de gomitas importadas en bolsas de 100 g. La línea insignia que rota sola en el mostrador.',
    img: '/products/watermelon.webp',
    color: '#FF4F9A',
  },
  {
    name: 'Crunchy Gang',
    tag: 'Crocantes explosivos',
    desc: 'Bolitas crujientes por fuera y explosivas por dentro. Sandía, frambuesa y fruta en displays de 30 unidades.',
    img: '/flyers/crunchy-sandia.webp',
    color: '#7CC024',
  },
  {
    name: 'Gang Licorice',
    tag: 'Cintas y regaliz ácido',
    desc: 'Sour Ropes, Sour Belts y Sour Bricks: cintas ácidas frutales de colores que llaman y sabor que vende.',
    img: '/flyers/slicorices.webp',
    color: '#7B2D8E',
  },
  {
    name: 'Yaams',
    tag: 'Chicles y confitados',
    desc: 'Gum Tube en frutilla y uva + Fruity Yaams tipo skittles. Formato tubo llamativo, perfecto para compra por impulso.',
    img: '/flyers/gumtube-frutilla.webp',
    color: '#E23A3A',
  },
  {
    name: 'Happy Mum',
    tag: 'Salsas importadas',
    desc: 'Ketchup, sweet chilli, sriracha, barbecue y worcestershire. La línea salada que completa tu góndola.',
    img: '/flyers/hm-chilli.webp',
    color: '#F2B34C',
  },
]
