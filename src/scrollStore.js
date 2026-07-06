// Shared bridge between the DOM overlay (nav, buttons) and drei's ScrollControls
// container, which owns the actual scrolling element.
export const scrollStore = {
  el: null,
}

export function scrollToSection(id) {
  const el = scrollStore.el
  const target = document.getElementById(id)
  if (!el || !target) return
  el.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
}
