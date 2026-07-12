import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Reveal from './Reveal.jsx'
import SplitTitle from './SplitTitle.jsx'
import { waLink, CATALOG_MESSAGE, paletteFor, categoryLabel } from '../data/site.js'
import { useImporterProducts } from '../hooks/useImporterProducts.js'
import { WhatsAppIcon } from './icons.jsx'

function TiltCard({ product, index }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-11, 11]), { stiffness: 200, damping: 20 })

  const handleMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const chipColor = paletteFor(product.category)
  const chipText = categoryLabel(product.category)

  return (
    <motion.figure
      ref={ref}
      className="product-card"
      style={{ rotateX, rotateY, perspective: 900 }}
      initial={{ opacity: 0, y: 50, rotateZ: index % 2 === 0 ? -3 : 3 }}
      whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: (index % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03 }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      <img
        src={product.image}
        alt={`Importadora Gang · ${product.name}`}
        loading="lazy"
        width="600"
        height="900"
      />
      <figcaption>
        <span className="p-name">{product.name}</span>
        {chipText && (
          <span className="p-flavor" style={{ background: chipColor }}>
            {chipText}
          </span>
        )}
      </figcaption>
    </motion.figure>
  )
}

export default function Gallery() {
  const { products, loading, error } = useImporterProducts()
  const showEmptyState = !loading && (error || products.length === 0)

  return (
    <section id="productos" className="section bg-gallery">
      <div className="section-inner">
        <div className="section-head">
          <Reveal>
            <span className="section-kicker" style={{ color: '#e23a3a', background: 'rgba(226,58,58,0.1)' }}>
              Catálogo
            </span>
          </Reveal>
          <SplitTitle text="Se venden solas" className="section-title section-title-xxl title-bleed" />
          <Reveal delay={0.3}>
            <p className="section-sub">
              Un vistazo a lo que rota fuerte en góndola. Esto es solo una parte del catálogo completo.
            </p>
          </Reveal>
        </div>

        {loading && (
          <p className="section-sub" style={{ textAlign: 'center' }}>
            Cargando catálogo…
          </p>
        )}

        {showEmptyState && (
          <p className="section-sub" style={{ textAlign: 'center' }}>
            Estamos actualizando el catálogo. Escribinos por WhatsApp y te lo pasamos completo.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="gallery-grid">
            {products.map((product, i) => (
              <TiltCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <Reveal className="gallery-cta" delay={0.1}>
          <a className="btn btn-whatsapp" href={waLink(CATALOG_MESSAGE)} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={20} />
            Quiero el catálogo completo con precios
          </a>
        </Reveal>
      </div>
    </section>
  )
}
