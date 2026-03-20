'use client'

import { useEffect, useRef } from 'react'

// Parallax orbs that gently drift toward the cursor — adds depth to the shader BG
export default function MouseOrbs() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let tx = 0, ty = 0
    let cx = 0, cy = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }

    // Smooth lerp loop
    const loop = () => {
      cx += (tx - cx) * 0.04
      cy += (ty - cy) * 0.04

      if (ref.current) {
        const children = ref.current.children
        const factors = [40, 22, 16, 30]
        for (let i = 0; i < children.length; i++) {
          const f = factors[i] ?? 20
          ;(children[i] as HTMLElement).style.transform =
            `translate(${cx * f}px, ${cy * f}px)`
        }
      }

      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* Orb 1 — main indigo, top-left */}
      <div style={{
        position: 'absolute', width: 900, height: 900, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, rgba(79,70,229,0.06) 40%, transparent 70%)',
        top: -300, left: -250,
        animation: 'orb1 22s ease-in-out infinite',
        filter: 'blur(1px)',
        willChange: 'transform',
      }} />

      {/* Orb 2 — purple, upper-right */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)',
        top: 50, right: -150,
        animation: 'orb2 28s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* Orb 3 — teal, lower-center */}
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 65%)',
        bottom: '20%', left: '40%',
        animation: 'orb3 20s ease-in-out infinite',
        willChange: 'transform',
      }} />

      {/* Orb 4 — rose accent */}
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
        top: '30%', left: '55%',
        animation: 'orb1 16s ease-in-out infinite reverse',
        willChange: 'transform',
      }} />
    </div>
  )
}
