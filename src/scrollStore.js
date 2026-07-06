// Shared bridge between the DOM overlay (nav, buttons) and drei's ScrollControls
// container, which owns the actual scrolling element.
export const scrollStore = {
  el: null,
}

// Custom rAF scroll animation instead of native scrollTo({behavior:'smooth'}):
// Chrome cancels native smooth scrolls on any residual wheel/trackpad delta,
// which killed long jumps (through the 440vh chapter runway) midway.
let animId = 0

export function scrollToSection(id) {
  const el = scrollStore.el
  const target = document.getElementById(id)
  if (!el || !target) return

  const from = el.scrollTop
  const to = Math.min(target.offsetTop, el.scrollHeight - el.clientHeight)
  const dist = to - from
  if (Math.abs(dist) < 2) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.scrollTop = to
    return
  }

  const duration = Math.min(1400, 500 + Math.abs(dist) * 0.12)
  const start = performance.now()
  const myId = ++animId

  // Deliberate user takeover wins — but trackpads emit tiny residual wheel
  // deltas (even from the click itself), so only cancel on ACCUMULATED
  // intentional input, never on the first micro-event.
  let wheelAccum = 0
  const onWheel = (e) => {
    wheelAccum += Math.abs(e.deltaY)
    if (wheelAccum > 25) cancel()
  }
  const cancel = () => {
    animId += 1
    cleanup()
  }
  const cleanup = () => {
    el.removeEventListener('wheel', onWheel)
    el.removeEventListener('touchstart', cancel)
  }
  el.addEventListener('wheel', onWheel, { passive: true })
  el.addEventListener('touchstart', cancel, { passive: true })

  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

  const step = (now) => {
    if (animId !== myId) return
    const t = Math.min(1, (now - start) / duration)
    el.scrollTop = from + dist * easeInOutCubic(t)
    if (t < 1) requestAnimationFrame(step)
    else cleanup()
  }
  requestAnimationFrame(step)
}
