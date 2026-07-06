import {
  waLink,
  CATALOG_MESSAGE,
  WHATSAPP_ALT,
  PHONE_MAIN_DISPLAY,
  PHONE_ALT_DISPLAY,
} from '../data/site.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <span className="nav-logo" aria-hidden="true">
            <span className="g1" style={{ color: '#ff4f9a' }}>GUMMY</span>{' '}
            <span className="g2" style={{ color: '#ffc93c' }}>GANG</span>
          </span>
          <p>
            Distribuidora mayorista de golosinas y alimentos importados. Kioscos, supermercados,
            distribuidores y reventa. Buenos Aires, Argentina.
          </p>
        </div>

        <div>
          <h4>Contacto</h4>
          <ul>
            <li>
              <a href={waLink(CATALOG_MESSAGE)} target="_blank" rel="noreferrer">
                WhatsApp {PHONE_MAIN_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${WHATSAPP_ALT}`} target="_blank" rel="noreferrer">
                WhatsApp {PHONE_ALT_DISPLAY}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Redes</h4>
          <ul>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Gummy Gang. Todos los derechos reservados.</span>
        <span>Pedidos mayoristas: {PHONE_MAIN_DISPLAY} · {PHONE_ALT_DISPLAY}</span>
      </div>
    </footer>
  )
}
