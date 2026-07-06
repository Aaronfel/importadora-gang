import { motion } from 'framer-motion'

// SplitType-style heading: per-letter staggered reveal with a springy
// overshoot that reads as a gummy jiggle. Respects reduced motion via
// the app-level <MotionConfig reducedMotion="user"> (falls back to fade).

const letterVariants = {
  hidden: { y: '0.55em', opacity: 0, scaleY: 1.35, scaleX: 0.75 },
  show: {
    y: 0,
    opacity: 1,
    scaleY: 1,
    scaleX: 1,
    transition: { type: 'spring', stiffness: 380, damping: 13, mass: 0.9 },
  },
}

export default function SplitTitle({
  text,
  Tag = 'h2',
  className = '',
  colors,
  animateOnMount = false,
  hoverJiggle = false,
  delay = 0,
}) {
  const MTag = motion[Tag] ?? motion.h2
  const words = text.split(' ')
  let letterIndex = 0

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.035, delayChildren: delay } },
  }

  return (
    <MTag
      className={`split-title ${className}`}
      variants={container}
      initial="hidden"
      {...(animateOnMount
        ? { animate: 'show' }
        : { whileInView: 'show', viewport: { once: true, amount: 0.5 } })}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span className="st-word" key={wi} aria-hidden="true">
          {[...word].map((ch, ci) => {
            const i = letterIndex
            letterIndex += 1
            return (
              <motion.span
                className="st-letter"
                key={ci}
                variants={letterVariants}
                style={colors ? { color: colors[i % colors.length] } : undefined}
                whileHover={
                  hoverJiggle
                    ? { scaleY: 0.72, scaleX: 1.18, transition: { type: 'spring', stiffness: 500, damping: 10 } }
                    : undefined
                }
              >
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </MTag>
  )
}
