import Reveal from './Reveal.jsx'
import { SparkleIcon, TrendIcon, TruckIcon } from './icons.jsx'

const PROPS = [
  {
    icon: <SparkleIcon />,
    bg: 'linear-gradient(135deg, #ff4f9a, #e23a3a)',
    title: 'Variedad importada exclusiva',
    text: 'Gomitas, crocantes, cintas ácidas, chicles y salsas que no vas a encontrar en cualquier distribuidor. Productos que llaman la atención en el mostrador y diferencian tu comercio.',
  },
  {
    icon: <TrendIcon />,
    bg: 'linear-gradient(135deg, #7b2d8e, #57b8e4)',
    title: 'Márgenes que rinden',
    text: 'Alta rotación comprobada: producto que se vende solo, ideal para kioscos, supermercados y reventa. Compra por impulso pura, con precios mayoristas pensados para que ganes.',
  },
  {
    icon: <TruckIcon />,
    bg: 'linear-gradient(135deg, #7cc024, #ffc93c)',
    title: 'Logística sin vueltas',
    text: 'Stock disponible y entrega inmediata. Displays listos para mostrador, formatos prácticos y fáciles de exhibir. Pedís hoy, vendés mañana.',
  },
]

export function Marquee() {
  const items = ['Producto importado', 'Alta rotación', 'Entrega inmediata', 'Stock disponible', 'Displays listos para mostrador', 'Precios mayoristas']
  const row = items.map((t) => `${t} ✦ `).join('')
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <span>{row}</span>
        <span>{row}</span>
      </div>
    </div>
  )
}

export default function ValueProps() {
  return (
    <section id="propuesta" className="section bg-props">
      <div className="section-inner">
        <div className="section-head">
          <Reveal>
            <span className="section-kicker" style={{ color: '#7b2d8e', background: 'rgba(123,45,142,0.1)' }}>
              Para tu comercio
            </span>
            <h2 className="section-title">¿Por qué sumar Gummy Gang a tu góndola?</h2>
            <p className="section-sub">
              Somos distribuidora mayorista de golosinas importadas. Trabajamos con kioscos,
              supermercados, distribuidores y revendedores de todo el país.
            </p>
          </Reveal>
        </div>

        <div className="props-grid">
          {PROPS.map((prop, i) => (
            <Reveal key={prop.title} delay={i * 0.12}>
              <article className="prop-card">
                <div className="prop-icon" style={{ background: prop.bg }}>
                  {prop.icon}
                </div>
                <h3>{prop.title}</h3>
                <p>{prop.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
