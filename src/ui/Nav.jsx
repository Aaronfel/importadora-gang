import { scrollToSection } from '../scrollStore.js'
import { waLink, CATALOG_MESSAGE } from '../data/site.js'
import { WhatsAppIcon } from './icons.jsx'

const LINKS = [
  { id: 'propuesta', label: 'Por qué elegirnos' },
  { id: 'productos', label: 'Productos' },
  { id: 'marcas', label: 'Marcas' },
  { id: 'comprar', label: 'Cómo comprar' },
]

export default function Nav() {
  return (
    <nav className="nav" aria-label="Navegación principal">
      <button type="button" className="nav-logo" onClick={() => scrollToSection('hero')} aria-label="Ir al inicio">
        <span className="g1">IMPORTADORA</span> <span className="g2">GANG</span>
      </button>

      <ul className="nav-links">
        {LINKS.map((link) => (
          <li key={link.id}>
            <button type="button" onClick={() => scrollToSection(link.id)}>
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      <a className="btn btn-primary" href={waLink(CATALOG_MESSAGE)} target="_blank" rel="noreferrer">
        <WhatsAppIcon size={18} />
        Pedir catálogo
      </a>
    </nav>
  )
}

export function WaFab() {
  return (
    <a
      className="wa-fab"
      href={waLink(CATALOG_MESSAGE)}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribinos por WhatsApp"
    >
      <span style={{ color: '#fff', display: 'flex' }}>
        <WhatsAppIcon size={30} />
      </span>
    </a>
  )
}
