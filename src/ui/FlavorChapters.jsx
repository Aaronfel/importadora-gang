import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { scrollStore } from '../scrollStore.js'

// The pinned flavor chapter: a tall scroll runway in the page flow while
// the visuals (giant 3D gummy + this fixed overlay) stay on screen.
export const CHAPTERS = [
  {
    key: 'sandia',
    chip: 'Sabor sandía',
    title: 'WATERMELON',
    line: 'Escarchada y jugosa. La que más rota en el mostrador.',
    bg: '#9edcf3',
  },
  {
    key: 'cherry',
    chip: 'Sabor cereza',
    title: 'CHERRY',
    line: 'Intensa y brillante. La que desaparece primero de la caja.',
    bg: '#b9ecc9',
  },
  {
    key: 'teeth',
    chip: 'Dientes gomosos',
    title: 'TEETH',
    line: 'El ícono divertido del kiosco: nadie agarra una sola.',
    bg: '#ffc0d7',
  },
  {
    key: 'strawberry',
    chip: 'Sabor frutilla',
    title: 'STRAWBERRY',
    line: 'La clásica que nunca falla, con escarchado que brilla en góndola.',
    bg: '#ffedb2',
  },
]

// progress of the pinned section: 0..1 across the runway, or null outside
export function chapterProgress() {
  const el = scrollStore.el
  const sec = document.getElementById('sabores')
  if (!el || !sec) return null
  const denom = el.scrollHeight - el.clientHeight
  if (denom <= 0) return null
  const start = sec.offsetTop / denom
  const end = (sec.offsetTop + sec.offsetHeight - el.clientHeight) / denom
  const offset = el.scrollTop / denom
  if (offset < start - 0.03 || offset > end + 0.03) return null
  return Math.min(1, Math.max(0, (offset - start) / (end - start)))
}

export function chapterIndex(p) {
  return Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length))
}

export function ChapterRunway() {
  return (
    <section id="sabores" className="chapter-runway" aria-label="Sabores destacados">
      <p className="sr-only">
        Sabores destacados de la línea Gummy Gang: Watermelon (sandía escarchada), Cherry
        (cereza), Teeth (dientes gomosos) y Strawberry (frutilla).
      </p>
    </section>
  )
}

export function FlavorOverlay() {
  const [state, setState] = useState({ active: false, ci: 0 })
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    let raf
    const loop = () => {
      const p = chapterProgress()
      const next = p === null ? { active: false, ci: stateRef.current.ci } : { active: true, ci: chapterIndex(p) }
      if (next.active !== stateRef.current.active || next.ci !== stateRef.current.ci) setState(next)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const chapter = CHAPTERS[state.ci]

  return (
    <>
      <motion.div
        className="chapter-bg"
        initial={false}
        animate={{ opacity: state.active ? 1 : 0, backgroundColor: chapter.bg }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        aria-hidden="true"
      />
      <div className="chapter-stage" aria-hidden="true">
        <AnimatePresence mode="wait">
          {state.active && (
            <motion.div
              key={chapter.key}
              className="chapter-copy"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="chapter-chip">{chapter.chip}</span>
              <h3 className="chapter-title">{chapter.title}</h3>
              <p className="chapter-line">{chapter.line}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {state.active && (
          <div className="chapter-dots">
            {CHAPTERS.map((c, i) => (
              <span key={c.key} className={i === state.ci ? 'dot dot-on' : 'dot'} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
