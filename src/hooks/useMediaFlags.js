import { useSyncExternalStore } from 'react'

function subscribe(query) {
  return (callback) => {
    const mql = window.matchMedia(query)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
  }
}

export function useIsMobile() {
  return useSyncExternalStore(
    subscribe('(max-width: 768px), (pointer: coarse)'),
    () => window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
  )
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe('(prefers-reduced-motion: reduce)'),
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
