import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

// ─── CSS-in-JS styles ───────────────────────────────────────────────────────
const S = {
  root: {
    '--bg-color': '#f7f3f0',
    '--text-color': '#3d3434',
    '--secondary-color': '#938a84',
    '--hairline': '#e3deda',
    '--accent': '#b08a8a',
    '--font-main': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    '--font-mono': "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
    '--pad': '24px',
    backgroundColor: '#f7f3f0',
    color: '#3d3434',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    cursor: 'none',
    position: 'relative',
  },
  cursorDot: {
    position: 'fixed',
    top: 0,
    left: 0,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    zIndex: 9999,
    pointerEvents: 'none',
    mixBlendMode: 'multiply',
    width: 6,
    height: 6,
    backgroundColor: '#b08a8a',
  },
  cursorOutline: {
    position: 'fixed',
    top: 0,
    left: 0,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    zIndex: 9999,
    pointerEvents: 'none',
    mixBlendMode: 'multiply',
    width: 40,
    height: 40,
    border: '1px solid #b08a8a',
    transition: 'width 0.2s, height 0.2s',
  },
  cornerIndex: {
    position: 'fixed',
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontWeight: 500,
    fontSize: '2.5rem',
    lineHeight: 1,
    zIndex: 1000,
    color: '#3d3434',
    transition: 'color 0.3s ease',
    cursor: 'none',
    userSelect: 'none',
  },
  canvasZone: {
    position: 'relative',
    height: '70vh',
    width: '100%',
    overflow: 'hidden',
    borderBottom: '1px solid #e3deda',
    flexShrink: 0,
  },
  canvas: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
  heroText: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    pointerEvents: 'auto',
    cursor: 'none',
  },
  heroHeadline: {
    fontSize: '3rem',
    fontWeight: 400,
    letterSpacing: '-0.03em',
    marginBottom: 8,
    color: '#3d3434',
    lineHeight: 1.1,
  },
  heroSubline: {
    fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: '0.8rem',
    color: '#b08a8a',
  },
  panelZone: {
    height: '30vh',
    width: '100%',
    padding: 24,
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr',
    gap: 40,
    alignContent: 'start',
    fontSize: '0.85rem',
    lineHeight: 1.5,
    flexShrink: 0,
  },
  panelCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  metaLine: {
    display: 'flex',
    gap: 12,
    color: '#938a84',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  },
  bioText: {
    maxWidth: 400,
    color: '#3d3434',
    transition: 'font-family 0.1s, letter-spacing 0.1s, color 0.1s',
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  colophon: {
    marginTop: 24,
    color: '#938a84',
    fontSize: '0.75rem',
  },
  telemetry: {
    fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: '0.7rem',
    color: '#938a84',
    textAlign: 'right',
    marginTop: 'auto',
  },
  navOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(247, 243, 240, 0.96)',
    backdropFilter: 'blur(10px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.4s ease',
  },
  navContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    textAlign: 'center',
  },
  navItem: {
    fontSize: '3rem',
    fontWeight: 300,
    color: '#938a84',
    cursor: 'none',
    transition: 'color 0.3s',
    userSelect: 'none',
  },
}

// ─── Text Scramble ────────────────────────────────────────────────────────────
class TextScramble {
  constructor(el, onUpdate) {
    this.el = el
    this.onUpdate = onUpdate
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.originalText = el
    this.frameRequest = null
    this.frame = 0
    this.queue = []
  }

  setText(newText) {
    const oldText = this.currentText || this.originalText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => { this.resolve = resolve })

    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }

    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = []
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output.push({ type: 'text', val: to })
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output.push({ type: 'scramble', val: char })
      } else {
        output.push({ type: 'text', val: from })
      }
    }

    this.onUpdate(output)

    if (complete === this.queue.length) {
      this.resolve && this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update.bind(this))
      this.frame++
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }

  destroy() {
    cancelAnimationFrame(this.frameRequest)
  }
}

// ─── ScrambleText Component ───────────────────────────────────────────────────
function ScrambleText({ text, style }) {
  const [rendered, setRendered] = useState(null)
  const scrambleRef = useRef(null)

  useEffect(() => {
    scrambleRef.current = new TextScramble(text, setRendered)
    return () => scrambleRef.current?.destroy()
  }, [text])

  const handleMouseEnter = useCallback(() => {
    scrambleRef.current?.setText(text)
  }, [text])

  const handleMouseLeave = useCallback(() => {
    setTimeout(() => {
      scrambleRef.current?.setText(text)
    }, 200)
  }, [text])

  const renderOutput = (tokens) => {
    if (!tokens) return text
    return tokens.map((t, i) =>
      t.type === 'scramble'
        ? <span key={i} style={{ fontFamily: 'monospace', opacity: 0.5 }}>{t.val}</span>
        : t.val
    )
  }

  // Handle multiline text (contains \n or <br>)
  const lines = text.split('\n')

  return (
    <span style={style} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {rendered ? renderOutput(rendered) : lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </span>
  )
}

// ─── ASCII Canvas ─────────────────────────────────────────────────────────────
const DENSITY_CHARS = " .'`^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
const CHAR_SIZE = 12

function simpleNoise(x, y, t) {
  return Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t)
    + Math.sin(x * 0.01 - t) * Math.cos(y * 0.12) * 0.5
}

function useASCIICanvas(mousePosRef) {
  const canvasRef = useRef(null)
  const timeRef = useRef(0)
  const rafRef = useRef(null)
  const renderMsRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width, height

    const resize = () => {
      width = canvas.parentElement.clientWidth
      height = canvas.parentElement.clientHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
    }

    window.addEventListener('resize', resize)
    resize()

    const render = () => {
      const start = performance.now()
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${CHAR_SIZE}px monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const colsCount = Math.ceil(width / CHAR_SIZE)
      const rowsCount = Math.ceil(height / CHAR_SIZE)
      const canvasRect = canvas.getBoundingClientRect()
      const mx = mousePosRef.current.x
      const my = mousePosRef.current.y

      for (let y = 0; y < rowsCount; y++) {
        if (y < rowsCount * 0.4) continue

        for (let x = 0; x < colsCount; x++) {
          const posX = x * CHAR_SIZE
          const posY = y * CHAR_SIZE

          const dx = posX - mx
          const dy = posY - (my - canvasRect.top)
          const dist = Math.sqrt(dx * dx + dy * dy)

          const normalizedY = (rowsCount - y) / rowsCount
          const noiseVal = simpleNoise(x, y, timeRef.current * 0.5)
          const mountainHeight = 0.3 + (Math.sin(x * 0.05 + timeRef.current * 0.1) * 0.1) + (Math.cos(x * 0.2) * 0.05)

          let char = ''
          let alpha = 0

          if (normalizedY < mountainHeight + (noiseVal * 0.1)) {
            const index = Math.floor(Math.abs(noiseVal) * DENSITY_CHARS.length)
            char = DENSITY_CHARS[index % DENSITY_CHARS.length]
            alpha = 1 - (normalizedY * 2)
          }

          if (dist < 150) {
            const lensStrength = 1 - (dist / 150)
            if (Math.random() > 0.5) {
              char = Math.random() > 0.5 ? '0' : '1'
              ctx.fillStyle = `rgba(176, 138, 138, ${lensStrength})`
            } else {
              ctx.fillStyle = `rgba(147, 138, 132, ${alpha})`
            }
            const shiftX = dist > 0 ? (dx / dist) * 10 * lensStrength : 0
            const shiftY = dist > 0 ? (dy / dist) * 10 * lensStrength : 0
            ctx.fillText(char, posX + (CHAR_SIZE / 2) - shiftX, posY + (CHAR_SIZE / 2) - shiftY)
          } else if (char) {
            ctx.fillStyle = `rgba(147, 138, 132, ${alpha})`
            ctx.fillText(char, posX + (CHAR_SIZE / 2), posY + (CHAR_SIZE / 2))
          }
        }
      }

      timeRef.current += 0.01
      const duration = performance.now() - start
      if (renderMsRef.current) {
        renderMsRef.current.textContent = duration.toFixed(1)
      }
      rafRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [mousePosRef])

  return { canvasRef, renderMsRef }
}

// ─── Main ASCII Page ──────────────────────────────────────────────────────────
export default function ASCII() {
  const mousePosRef = useRef({ x: 0, y: 0 })
  const cursorDotRef = useRef(null)
  const cursorOutlineRef = useRef(null)
  const cursorLinkRef = useRef({ x: 0, y: 0 })
  const mouseXRef = useRef(null)
  const mouseYRef = useRef(null)
  const [navOpen, setNavOpen] = useState(false)
  const [time, setTime] = useState('--:--:--')
  const [hoveredNav, setHoveredNav] = useState(null)
  const [hoveredCorner, setHoveredCorner] = useState(null)
  const [bioHovered, setBioHovered] = useState(false)
  const { canvasRef, renderMsRef } = useASCIICanvas(mousePosRef)

  // Mouse tracking + custom cursor
  useEffect(() => {
    const onMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      if (mouseXRef.current) mouseXRef.current.textContent = e.clientX
      if (mouseYRef.current) mouseYRef.current.textContent = e.clientY
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`
        cursorDotRef.current.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Lagged cursor outline
  useEffect(() => {
    let rafId
    const loop = () => {
      const dx = mousePosRef.current.x - cursorLinkRef.current.x
      const dy = mousePosRef.current.y - cursorLinkRef.current.y
      cursorLinkRef.current.x += dx * 0.15
      cursorLinkRef.current.y += dy * 0.15
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.left = `${cursorLinkRef.current.x}px`
        cursorOutlineRef.current.style.top = `${cursorLinkRef.current.y}px`
      }
      rafId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC+4')
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const corners = [
    { pos: { top: 24, left: 24 }, label: 'S' },
    { pos: { top: 24, right: 24 }, label: 'K' },
    { pos: { bottom: 24, left: 24 }, label: '0' },
    { pos: { bottom: 24, right: 24 }, label: '1' },
  ]

  const navItems = ['Experiments', 'Writing', 'Capabilities', 'About']

  return (
    <div style={S.root}>
      {/* Custom cursor */}
      <div ref={cursorDotRef} style={S.cursorDot} />
      <div ref={cursorOutlineRef} style={S.cursorOutline} />

      {/* Corner indices */}
      {corners.map(({ pos, label }) => (
        <div
          key={label}
          style={{
            ...S.cornerIndex,
            ...pos,
            color: hoveredCorner === label ? '#b08a8a' : '#3d3434',
          }}
          onClick={() => setNavOpen(true)}
          onMouseEnter={() => setHoveredCorner(label)}
          onMouseLeave={() => setHoveredCorner(null)}
        >
          {label}
        </div>
      ))}

      {/* Nav overlay */}
      <div
        style={{
          ...S.navOverlay,
          opacity: navOpen ? 1 : 0,
          pointerEvents: navOpen ? 'auto' : 'none',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setNavOpen(false) }}
      >
        <div style={S.navContent}>
          {navItems.map((item) => (
            item === 'Experiments'
              ? (
                <Link
                  key={item}
                  to="/"
                  style={{
                    ...S.navItem,
                    color: hoveredNav === item ? '#b08a8a' : '#938a84',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={() => setHoveredNav(item)}
                  onMouseLeave={() => setHoveredNav(null)}
                  onClick={() => setNavOpen(false)}
                >
                  {item}
                </Link>
              )
              : (
                <div
                  key={item}
                  style={{
                    ...S.navItem,
                    color: hoveredNav === item ? '#b08a8a' : '#938a84',
                  }}
                  onMouseEnter={() => setHoveredNav(item)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {item}
                </div>
              )
          ))}
          <div
            style={{
              ...S.navItem,
              color: hoveredNav === 'close' ? '#b08a8a' : '#938a84',
              fontSize: '1.5rem',
            }}
            onMouseEnter={() => setHoveredNav('close')}
            onMouseLeave={() => setHoveredNav(null)}
            onClick={() => setNavOpen(false)}
          >
            Close
          </div>
        </div>
      </div>

      {/* Canvas zone */}
      <div style={S.canvasZone}>
        <canvas ref={canvasRef} style={S.canvas} />
        <div style={S.heroText}>
          <div style={S.heroHeadline}>
            <ScrambleText text={'System Architecture &\nVisual Displacement'} />
          </div>
          <div style={S.heroSubline}>Exploring the delta between signal and noise.</div>
        </div>
      </div>

      {/* Info panel */}
      <div style={S.panelZone}>
        {/* Col 1 */}
        <div style={S.panelCol}>
          <div>
            <div style={S.metaLine}>
              <span>Sandro Kozmanishvili</span>
              <span>{time}</span>
            </div>
            <p
              style={{
                ...S.bioText,
                fontFamily: bioHovered
                  ? "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace"
                  : "'Inter', -apple-system, sans-serif",
                letterSpacing: bioHovered ? '-0.5px' : 'normal',
                color: bioHovered ? '#b08a8a' : '#3d3434',
              }}
              onMouseEnter={() => setBioHovered(true)}
              onMouseLeave={() => setBioHovered(false)}
            >
              Multidisciplinary designer based in Tbilisi. Focusing on the intersection of generative visuals and functional interfaces.
            </p>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#938a84', marginTop: 'auto' }}>
            Currently building visual video sound and digital products.
          </div>
        </div>

        {/* Col 2 */}
        <div style={S.panelCol}>
          <LinkList />
          <div style={S.colophon}>
            Built with Vite, React, Vercel.<br />
            Typeface: Inter &amp; SF Mono.
          </div>
        </div>

        {/* Col 3 */}
        <div style={{ ...S.panelCol, textAlign: 'right', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.75rem' }}>© 2025</div>
          <div style={S.telemetry}>
            RENDER: <span ref={renderMsRef}>0.0</span>ms<br />
            X: <span ref={mouseXRef}>0</span> Y: <span ref={mouseYRef}>0</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── LinkList ────────────────────────────────────────────────────────────────
function LinkList() {
  const [hovered, setHovered] = useState(null)
  const links = ['Email', 'Are.na', 'GitHub', 'Instagram']

  return (
    <ul style={S.linkList}>
      {links.map((label) => (
        <li key={label}>
          <a
            href="#"
            style={{
              textDecoration: 'none',
              color: hovered === label ? '#b08a8a' : '#3d3434',
              position: 'relative',
              display: 'inline-block',
              width: 'fit-content',
              cursor: 'none',
            }}
            onMouseEnter={() => setHovered(label)}
            onMouseLeave={() => setHovered(null)}
          >
            {label}
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: 1,
              background: '#b08a8a',
              transform: hovered === label ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: hovered === label ? 'left' : 'right',
              transition: 'transform 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
              display: 'block',
            }} />
          </a>
        </li>
      ))}
    </ul>
  )
}
