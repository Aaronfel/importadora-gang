import { motion } from 'framer-motion'
import { waLink, CATALOG_MESSAGE } from '../data/site.js'
import { scrollToSection } from '../scrollStore.js'
import { WhatsAppIcon } from './icons.jsx'
import SplitTitle from './SplitTitle.jsx'

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

        <h1 className="hero-title" aria-label="Importadora Gang">
          <SplitTitle
            Tag="span"
            text="IMPORTADORA"
            className="line-1"
            colors={['#ff4f9a', '#e23a3a', '#ff8a3c', '#ffc93c', '#7cc024', '#57b8e4', '#7b2d8e']}
            animateOnMount
            hoverJiggle
            delay={0.25}
          />
          <SplitTitle
            Tag="span"
            text="GANG"
            className="line-2"
            colors={['#7b2d8e', '#57b8e4', '#7cc024', '#ff4f9a']}
            animateOnMount
            hoverJiggle
            delay={0.55}
          />
        </h1>

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
