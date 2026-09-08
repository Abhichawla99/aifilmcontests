// Light-theme background: two ultra-soft pastel washes on the paper ground.
// (Replaced the WebGL nebula + animated film grain from the dark theme —
// zero canvases, zero animation frames, just colour.)
export default function BackgroundFX() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(900px 600px at 85% -5%, rgba(250,235,221,0.55), transparent 65%),
          radial-gradient(800px 560px at -10% 30%, rgba(231,241,248,0.6), transparent 60%),
          radial-gradient(700px 500px at 60% 110%, rgba(243,240,249,0.5), transparent 60%)
        `,
      }}
    />
  )
}
