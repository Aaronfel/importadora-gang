import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import CandyScene from './CandyScene.jsx'
import { scrollStore } from '../scrollStore.js'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMediaFlags.js'

// exposes drei's internal scroll container to the DOM overlay (nav, CTAs)
function ScrollBridge() {
  const scroll = useScroll()
  useEffect(() => {
    scrollStore.el = scroll.el
    // R3F sets pointer-events:none on the whole canvas wrapper when eventSource
    // is used; drei's scroll container inherits it and wheel/touch/clicks die.
    // Re-enable them here — R3F still gets pointer data via the #root eventSource.
    scroll.el.style.pointerEvents = 'auto'
    return () => {
      if (scrollStore.el === scroll.el) scrollStore.el = null
    }
  }, [scroll])
  return null
}

// nudges a frame when the tab comes back from background (app switch,
// WhatsApp round-trip) so the canvas never sits stale after a resume
function ResumeGuard() {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    const kick = () => invalidate()
    document.addEventListener('visibilitychange', kick)
    window.addEventListener('pageshow', kick)
    window.addEventListener('focus', kick)
    return () => {
      document.removeEventListener('visibilitychange', kick)
      window.removeEventListener('pageshow', kick)
      window.removeEventListener('focus', kick)
    }
  }, [invalidate])
  return null
}

// measures the real DOM height so `pages` always matches the content.
// Content-only on purpose: the ResizeObserver already fires on any reflow.
// A window `resize` listener here would also fire on mobile URL-bar
// show/hide, which must NOT recompute pages (see Experience below).
function PageContent({ onHeight, children }) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const measure = () => onHeight(el.getBoundingClientRect().height)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    measure()
    return () => ro.disconnect()
  }, [onHeight])

  return (
    <main className="page" ref={ref}>
      {children}
    </main>
  )
}

export default function Experience({ children }) {
  const [pages, setPages] = useState(1)
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()

  const contentH = useRef(0)
  // Stable viewport height. Mobile browsers fire `resize` every time the URL
  // bar collapses/expands while scrolling; recomputing pages from the new
  // innerHeight makes drei's ScrollControls re-init and reset scrollTop to 1
  // mid-scroll (teleport to top). Only refresh it when the WIDTH changes
  // (rotation or a real window resize).
  const viewportH = useRef(window.innerHeight)
  const savedScroll = useRef(0)

  const recompute = useCallback(() => {
    if (!contentH.current) return
    const next = Math.max(1, contentH.current / viewportH.current)
    setPages((prev) => {
      if (Math.abs(next - prev) < 0.005) return prev
      // save position as a RATIO: the scroll range is about to change size
      const el = scrollStore.el
      const denom = el ? el.scrollHeight - el.clientHeight : 0
      savedScroll.current = el && denom > 0 ? el.scrollTop / denom : 0
      return next
    })
  }, [])

  const handleHeight = useCallback(
    (height) => {
      contentH.current = height
      recompute()
    },
    [recompute]
  )

  useEffect(() => {
    let lastW = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === lastW) return // height-only change: URL bar
      lastW = window.innerWidth
      viewportH.current = window.innerHeight
      recompute()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [recompute])

  // drei re-inits its scroller when `pages` changes and resets scrollTop to 1.
  // Its effect lives in R3F's own reconciler root, so it runs AFTER this DOM
  // effect — restore must be deferred past it (double rAF) to win the race.
  useEffect(() => {
    const ratio = savedScroll.current
    savedScroll.current = 0
    if (ratio <= 0) return undefined
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = scrollStore.el
        if (!el) return
        el.scrollTop = ratio * (el.scrollHeight - el.clientHeight)
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2) cancelAnimationFrame(raf2)
    }
  }, [pages])

  return (
    <Canvas
      className="experience-canvas"
      camera={{ position: [0, 0, 9], fov: 42 }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
    >
      <ScrollControls pages={pages} damping={reduced ? 0 : isMobile ? 0.05 : 0.12}>
        <ScrollBridge />
        <ResumeGuard />
        <CandyScene isMobile={isMobile} reduced={reduced} />
        <Scroll html style={{ width: '100%' }}>
          <PageContent onHeight={handleHeight}>{children}</PageContent>
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}
