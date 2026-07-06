import Reveal from './Reveal.jsx'
import { BRAND_LINES } from '../data/site.js'

export default function Brands() {
  return (
    <section id="marcas" className="section bg-brands">
      <div className="section-inner">
        <div className="section-head">
          <Reveal>
            <span className="section-kicker" style={{ color: '#1f8a4c', background: 'rgba(124,192,36,0.14)' }}>
              Nuestras líneas
            </span>
            <h2 className="section-title">Marcas que distribuimos</h2>
            <p className="section-sub">
              Cinco líneas importadas que cubren toda la góndola dulce (y un toque de la salada):
              gomitas, crocantes, regaliz ácido, chicles y salsas.
            </p>
          </Reveal>
        </div>

        <div className="brands-grid">
          {BRAND_LINES.map((brand, i) => (
            <Reveal key={brand.name} delay={i * 0.1}>
              <article className="brand-card">
                <img src={brand.img} alt={`Línea ${brand.name}`} loading="lazy" width="86" height="112" />
                <div>
                  <h3>{brand.name}</h3>
                  <span className="brand-tag" style={{ background: brand.color }}>
                    {brand.tag}
                  </span>
                  <p>{brand.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="origins-strip">
            Producto <strong>importado de calidad premium</strong> — traído directo de fábricas
            en Asia y Medio Oriente, con stock permanente en Buenos Aires.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
