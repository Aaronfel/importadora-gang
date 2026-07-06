import { motion } from 'framer-motion'
import { waLink, CATALOG_MESSAGE } from '../data/site.js'
import { scrollToSection } from '../scrollStore.js'
import { WhatsAppIcon } from './icons.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section id="hero" className="hero bg-hero">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.span className="hero-badge" variants={item}>
          Distribuidora mayorista · Golosinas importadas
        </motion.span>

        <motion.h1 className="hero-title" variants={item}>
          <span className="line-1">GUMMY</span>
          <span className="line-2">GANG</span>
        </motion.h1>

        <motion.p className="hero-tagline" variants={item}>
          Gomitas, crocantes y chicles importados que <strong>rotan solos en tu góndola</strong>.
          Variedad exclusiva, márgenes que rinden y stock con entrega inmediata.
        </motion.p>

        <motion.div className="hero-ctas" variants={item}>
          <a className="btn btn-primary" href={waLink(CATALOG_MESSAGE)} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={20} />
            Pedí el catálogo mayorista
          </a>
          <button type="button" className="btn btn-secondary" onClick={() => scrollToSection('productos')}>
            Ver productos
          </button>
        </motion.div>
      </motion.div>

      <div className="hero-scroll-hint" aria-hidden="true">
        Deslizá
      </div>
    </section>
  )
}
