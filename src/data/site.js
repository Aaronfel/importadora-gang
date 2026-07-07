export const WHATSAPP_MAIN = '5491149277904'
export const WHATSAPP_ALT = '5491144018494'
export const PHONE_MAIN_DISPLAY = '11 4927-7904'
export const PHONE_ALT_DISPLAY = '11 4401-8494'

export const waLink = (message) =>
  `https://wa.me/${WHATSAPP_MAIN}?text=${encodeURIComponent(message)}`

export const CATALOG_MESSAGE =
  'Hola Importadora Gang 👋 Tengo un comercio y quiero recibir el catálogo mayorista con precios.'

export const PRODUCTS = [
  { slug: 'watermelon', name: 'Watermelon', flavor: 'Sandía escarchada', color: '#57B8E4' },
  { slug: 'sour-shark', name: 'Sour Shark', flavor: 'Tiburones ácidos', color: '#D9333F' },
  { slug: 'strawberry', name: 'Strawberry', flavor: 'Frutilla', color: '#E4326B' },
  { slug: 'bear', name: 'Bear', flavor: 'Ositos frutales', color: '#F79A3E' },
  { slug: 'banana', name: 'Sweet Banana', flavor: 'Banana dulce', color: '#F5C63C' },
  { slug: 'teeth', name: 'Teeth', flavor: 'Dientes gomosos', color: '#F58AB6' },
  { slug: 'fried-egg', name: 'Fried Egg', flavor: 'Huevo frito', color: '#F2B34C' },
  { slug: 'cherry', name: 'Cherry', flavor: 'Cereza intensa', color: '#C4265E' },
  { slug: 'sour-donut', name: 'Sour Donut', flavor: 'Donas ácidas', color: '#EDA33C' },
  { slug: 'sweet-heat', name: 'Sweet Heat', flavor: 'Dulce picante', color: '#E85A4F' },
]

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
