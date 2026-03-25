'use client'

import { useEffect, useRef } from 'react'

// ── WebGL fragment shader: animated FBM noise nebula ─────────────────────────
const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;
uniform float u_t;
uniform vec2  u_res;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.1;
    a *= 0.48;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float t  = u_t * 0.06;

  /* domain-warped FBM — organic flowing shapes */
  vec2 q = vec2(fbm(uv + vec2(0.0, t)), fbm(uv + vec2(5.2, t + 1.3)));
  vec2 r = vec2(fbm(uv + 4.0*q + vec2(1.7, t*0.5)), fbm(uv + 4.0*q + vec2(9.2, t*0.3)));
  float f = fbm(uv + 4.0 * r);

  /* dark indigo / deep-purple palette — very subtle */
  vec3 col = mix(
    vec3(0.020, 0.018, 0.055),   /* near-black indigo */
    mix(
      vec3(0.075, 0.055, 0.175), /* dark indigo */
      vec3(0.120, 0.035, 0.200), /* dark violet */
      clamp(f * 2.0 - 0.4, 0.0, 1.0)
    ),
    clamp(f * 1.6 - 0.1, 0.0, 1.0)
  );

  /* add a faint teal streak for depth */
  col += vec3(0.0, 0.04, 0.06) * clamp(fbm(uv * 2.0 + vec2(3.0, t*0.2)) - 0.45, 0.0, 1.0);

  /* vignette */
  float vig = 1.0 - smoothstep(0.3, 1.1, length((uv - 0.5) * 1.7));
  col *= 0.35 + 0.65 * vig;

  gl_FragColor = vec4(col, 1.0);
}
`

export default function BackgroundFX() {
  const wglRef   = useRef<HTMLCanvasElement>(null)
  const grainRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // ── WebGL nebula shader ─────────────────────────────────────────────────
    const wgl = wglRef.current
    const gl  = wgl?.getContext('webgl', { antialias: false, alpha: false })

    let wglRaf = 0
    let grainRaf = 0

    if (wgl && gl) {
      const makeShader = (type: number, src: string) => {
        const s = gl.createShader(type)!
        gl.shaderSource(s, src)
        gl.compileShader(s)
        return s
      }

      const prog = gl.createProgram()!
      gl.attachShader(prog, makeShader(gl.VERTEX_SHADER,   VERT))
      gl.attachShader(prog, makeShader(gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      gl.useProgram(prog)

      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

      const aPos = gl.getAttribLocation(prog, 'a_pos')
      gl.enableVertexAttribArray(aPos)
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

      const uT   = gl.getUniformLocation(prog, 'u_t')
      const uRes = gl.getUniformLocation(prog, 'u_res')

      const resize = () => {
        // Render at half resolution for performance, CSS scales it up
        wgl.width  = Math.ceil(window.innerWidth  / 2)
        wgl.height = Math.ceil(window.innerHeight / 2)
        gl.viewport(0, 0, wgl.width, wgl.height)
      }
      window.addEventListener('resize', resize)
      resize()

      const start = performance.now()
      const render = () => {
        gl.uniform1f(uT,  (performance.now() - start) / 1000)
        gl.uniform2f(uRes, wgl.width, wgl.height)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        wglRaf = requestAnimationFrame(render)
      }
      render()

      // cleanup
      const cleanWgl = () => {
        cancelAnimationFrame(wglRaf)
        window.removeEventListener('resize', resize)
      }
      ;(wgl as HTMLCanvasElement & { _cleanup?: () => void })._cleanup = cleanWgl
    }

    // ── Film grain canvas ──────────────────────────────────────────────────
    const grain = grainRef.current
    const ctx   = grain?.getContext('2d')

    if (grain && ctx) {
      const resizeGrain = () => {
        grain.width  = Math.ceil(window.innerWidth  / 1.5)
        grain.height = Math.ceil(window.innerHeight / 1.5)
      }
      window.addEventListener('resize', resizeGrain)
      resizeGrain()

      let tick = 0
      const paint = () => {
        if (tick % 2 === 0) {
          const { width, height } = grain
          if (width === 0 || height === 0) { tick++; grainRaf = requestAnimationFrame(paint); return }
          const img = ctx.createImageData(width, height)
          const d   = img.data
          for (let i = 0; i < d.length; i += 4) {
            const v = (Math.random() * 255) | 0
            d[i] = d[i+1] = d[i+2] = v
            d[i+3] = (Math.random() * 22) | 0
          }
          ctx.putImageData(img, 0, 0)
        }
        tick++
        grainRaf = requestAnimationFrame(paint)
      }
      paint()

      return () => {
        cancelAnimationFrame(grainRaf)
        window.removeEventListener('resize', resizeGrain)
        ;(wgl as HTMLCanvasElement & { _cleanup?: () => void })?._cleanup?.()
      }
    }

    return () => {
      cancelAnimationFrame(wglRaf)
      cancelAnimationFrame(grainRaf)
    }
  }, [])

  return (
    <>
      {/* WebGL animated nebula — full-screen background */}
      <canvas
        ref={wglRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          imageRendering: 'auto',   // blur the low-res canvas — looks like soft glow
        }}
      />
      {/* Film grain overlay */}
      <canvas
        ref={grainRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 3,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          opacity: 0.55,
          imageRendering: 'auto',
        }}
      />
    </>
  )
}
