// Shared bridge between the DOM overlay (nav, buttons) and drei's ScrollControls
// container, which owns the actual scrolling element.
export const scrollStore = {
  el: null,
}

// drei's ScrollControls scroller contains a sticky viewport-sized div that
// adds one extra viewport of scrollable area: the html content translates by
// scrollTop * (pages-1)/pages, NOT 1:1. To land content position `y` at the
// top of the screen, scrollTop must be scaled by the inverse factor.
//   content travel  = scrollHeight - 2*clientHeight   // (pages-1) * vh
//   scroll threshold = scrollHeight - clientHeight    // pages * vh (max scrollTop)
export function contentToScrollTop(el, y) {
  const travel = el.scrollHeight - 2 * el.clientHeight
  const threshold = el.scrollHeight - el.clientHeight
  if (travel <= 0) return y
  return (y * threshold) / travel
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
  const to = Math.min(contentToScrollTop(el, target.offsetTop), el.scrollHeight - el.clientHeight)
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
