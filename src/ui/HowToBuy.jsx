import { useState } from 'react'
import Reveal from './Reveal.jsx'
import SplitTitle from './SplitTitle.jsx'
import { WHATSAPP_MAIN } from '../data/site.js'
import { WhatsAppIcon, ChatIcon, BoxIcon, TrendIcon } from './icons.jsx'

const STEPS = [
  {
    icon: <ChatIcon size={22} />,
    bg: 'linear-gradient(135deg, #ff4f9a, #e23a3a)',
    title: 'Escribinos por WhatsApp',
    text: 'Contanos qué tipo de comercio tenés y en qué zona estás. Te respondemos en el día.',
  },
  {
    icon: <BoxIcon size={22} />,
    bg: 'linear-gradient(135deg, #7b2d8e, #57b8e4)',
    title: 'Recibí el catálogo y armá tu pedido',
    text: 'Te mandamos el catálogo completo con precios mayoristas y mínimos de compra. Armamos el pedido juntos.',
  },
  {
    icon: <TrendIcon size={22} />,
    bg: 'linear-gradient(135deg, #7cc024, #ffc93c)',
    title: 'Vendé y reponé',
    text: 'Entrega inmediata con stock disponible. Cuando el producto rote —y va a rotar— reponés con un mensaje.',
  },
]

export default function HowToBuy() {
  const [form, setForm] = useState({ nombre: '', negocio: '', zona: '', interes: 'Golosinas', mensaje: '' })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const lines = [
      `Hola Importadora Gang 👋 Soy ${form.nombre || '...'}`,
      `Tengo un comercio: ${form.negocio || '...'}`,
      `Zona: ${form.zona || '...'}`,
      `Me interesa: ${form.interes}`,
      form.mensaje ? `Mensaje: ${form.mensaje}` : null,
      'Quiero recibir el catálogo mayorista con precios.',
    ].filter(Boolean)
    window.open(`https://wa.me/${WHATSAPP_MAIN}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener')
  }

  return (
    <section id="comprar" className="section bg-howto">
      <div className="section-inner">
        <div className="section-head">
          <Reveal>
            <span className="section-kicker" style={{ color: '#e23a3a', background: 'rgba(255,138,60,0.14)' }}>
              Compra mayorista
            </span>
          </Reveal>
          <SplitTitle text="Comprar es simple" className="section-title section-title-xxl title-bleed" />
          <Reveal delay={0.3}>
            <p className="section-sub">
              Sin registros ni plataformas raras: hablás con una persona, recibís precios claros
              y tu pedido sale con entrega inmediata.
            </p>
          </Reveal>
        </div>

        <div className="howto">
          <ol className="steps">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.12}>
                <li className="step">
                  <span className="step-num" style={{ background: step.bg }} aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.2}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Pedí el catálogo mayorista</h3>

              <div className="field">
                <label htmlFor="f-nombre">Tu nombre *</label>
                <input id="f-nombre" type="text" required autoComplete="name" value={form.nombre} onChange={update('nombre')} />
              </div>

              <div className="field">
                <label htmlFor="f-negocio">Tu comercio (kiosco, súper, reventa…) *</label>
                <input id="f-negocio" type="text" required value={form.negocio} onChange={update('negocio')} />
              </div>

              <div className="field">
                <label htmlFor="f-zona">Zona / localidad *</label>
                <input id="f-zona" type="text" required autoComplete="address-level2" value={form.zona} onChange={update('zona')} />
              </div>

              <div className="field">
                <label htmlFor="f-interes">¿Qué te interesa?</label>
                <select id="f-interes" value={form.interes} onChange={update('interes')}>
                  <option>Golosinas</option>
                  <option>Salsas</option>
                  <option>Todo el catálogo</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="f-mensaje">Mensaje (opcional)</label>
                <textarea id="f-mensaje" rows="3" value={form.mensaje} onChange={update('mensaje')} />
              </div>

              <button type="submit" className="btn btn-whatsapp">
                <WhatsAppIcon size={20} />
                Enviar por WhatsApp
              </button>
              <p className="form-note">
                Se abre WhatsApp con tu mensaje ya escrito. Sin spam, sin vueltas.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
