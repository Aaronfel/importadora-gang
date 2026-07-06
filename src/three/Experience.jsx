import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
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

// measures the real DOM height so `pages` always matches the content,
// no matter how sections reflow across breakpoints
function PageContent({ onHeight, children }) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const measure = () => onHeight(el.getBoundingClientRect().height)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
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

  const handleHeight = useCallback((height) => {
    setPages(Math.max(1, height / window.innerHeight))
  }, [])

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
      <ScrollControls pages={pages} damping={reduced ? 0 : 0.12}>
        <ScrollBridge />
        <CandyScene isMobile={isMobile} reduced={reduced} />
        <Scroll html style={{ width: '100%' }}>
          <PageContent onHeight={handleHeight}>{children}</PageContent>
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}
