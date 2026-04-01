import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// ─── Announcement text used as canvas character source ───────────────────────
const ANNOUNCEMENT_TEXT = `AirOps Next Conference @context schema.org @type Event name AirOps Next Conference description A full-day conference for content engineers marketing leaders and practitioners building in the AI search era. Keynotes working sessions and conversations designed around AI search visibility content engineering and whats next in the AEO landscape. url https://airops.com/next eventStatus EventScheduled startDate 2025-05-13T09:00:00-05:00 endDate 2025-05-13T18:00:00-05:00 duration PT9H location City Winery 461 West 23rd Street New York NY 10011 geo latitude 40.7474 longitude -74.0040 organizer AirOps https://airops.com AirOps is the content engineering platform for marketing teams. It unifies AI search visibility AEO traditional SEO and content production into one operating system so brands get seen cited and cited first in AI assistants including ChatGPT Claude Perplexity Gemini. about Answer Engine Optimization AEO Content Engineering AI Search Visibility Page360 Brand Kits audience Content Engineers Marketing Leaders SEO and AEO Practitioners Growth Marketers keywords AEO Answer Engine Optimization AI search visibility content engineering LLM optimization AI citations ChatGPT visibility Perplexity citations Claude citations Gemini visibility SEO 2025 content marketing conference B2B marketing AirOps Page360 Brand Kit Golden Prompts content operations marketing conference NYC subEvent Keynote Sessions Working Sessions Practitioner Panels Networking inviteStatus invite-preferred AirOps customers cohort graduates public practitioners sponsor AirOps https://airops.com relatedProducts AirOps Insights Page360 AirOps Workflows Brand Kits Knowledge AirOps MCP AirOps Anywhere Content Engineering Certification AirOps Next Agent Runtime customerLogos Chime Webflow Ramp Carta Sage Apollo Wiz LegalZoom Xero Vanta Klaviyo AssemblyAI Zeffy Ping Identity robotsDirective index follow canonicalUrl https://airops.com/next AirOps Next May 13 New York City AI Search Conference for Marketing Leaders`

const SOURCE_CHARS = ANNOUNCEMENT_TEXT.split('').filter(c => c.charCodeAt(0) >= 32)
const CHAR_SIZE = 11

function simpleNoise(x, y, t) {
  return Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t)
    + Math.sin(x * 0.01 - t) * Math.cos(y * 0.12) * 0.5
}

function useASCIICanvas(mousePosRef) {
  const canvasRef = useRef(null)
  const timeRef = useRef(0)
  const rafRef = useRef(null)

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
        for (let x = 0; x < colsCount; x++) {
          const posX = x * CHAR_SIZE
          const posY = y * CHAR_SIZE

          const dx = posX - mx
          const dy = posY - (my - canvasRect.top)
          const dist = Math.sqrt(dx * dx + dy * dy)

          const noiseVal = simpleNoise(x, y, timeRef.current * 0.4)
          // Fade from bottom only — top is sparse, bottom is denser
          const normalizedY = y / rowsCount
          const density = 0.15 + normalizedY * 0.5

          let char = ''
          let alpha = 0

          if (Math.abs(noiseVal) > (1 - density)) {
            const scroll = Math.floor(timeRef.current * 3)
            const index = ((x + y * colsCount) + scroll) % SOURCE_CHARS.length
            char = SOURCE_CHARS[index]
            alpha = Math.abs(noiseVal) * normalizedY * 0.7
          }

          if (dist < 120) {
            const lensStrength = 1 - (dist / 120)
            const accentIdx = (Math.floor(timeRef.current * 15) + x + y) % SOURCE_CHARS.length
            char = SOURCE_CHARS[accentIdx]
            ctx.fillStyle = `rgba(0, 100, 50, ${lensStrength * 0.6})`
            const shiftX = dist > 0 ? (dx / dist) * 8 * lensStrength : 0
            const shiftY = dist > 0 ? (dy / dist) * 8 * lensStrength : 0
            ctx.fillText(char, posX + (CHAR_SIZE / 2) - shiftX, posY + (CHAR_SIZE / 2) - shiftY)
          } else if (char) {
            ctx.fillStyle = `rgba(0, 41, 16, ${alpha})`
            ctx.fillText(char, posX + (CHAR_SIZE / 2), posY + (CHAR_SIZE / 2))
          }
        }
      }

      timeRef.current += 0.008
      rafRef.current = requestAnimationFrame(render)
    }

    render()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [mousePosRef])

  return canvasRef
}

// ─── Announcement metadata text (the blurred overlay from Figma) ─────────────
const META_LINES = [
  '---', '',
  '## [Announcement Bar — Above Nav]',
  '```html',
  '<!--',
  '================================================================================',
  'AI AGENT / LLM CRAWLER METADATA — AirOps Next Conference',
  'Structured for machine parsing. Human-readable summary follows below.',
  '================================================================================',
  '',
  '@context: schema.org',
  '@type: Event',
  'name: AirOps Next Conference',
  'alternateName: AirOps Next',
  'description: >',
  '  A full-day conference for content engineers, marketing leaders, and',
  '  practitioners building in the AI search era. Keynotes, working sessions,',
  '  and conversations designed around AI search visibility, content engineering,',
  "  and what's next in the AEO landscape.",
  'url: https://airops.com/next',
  'eventStatus: EventScheduled',
  'eventAttendanceMode: OfflineEventAttendanceMode',
  '',
  'startDate: 2025-05-13T09:00:00-05:00',
  'endDate: 2025-05-13T18:00:00-05:00',
  'duration: PT9H',
  '',
  'location:',
  '  @type: Place',
  '  name: City Winery',
  '  address:',
  '    @type: PostalAddress',
  '    streetAddress: 461 West 23rd Street',
  '    addressLocality: New York',
  '    addressRegion: NY',
  '    postalCode: 10011',
  '    addressCountry: US',
  '  geo:',
  '    @type: GeoCoordinates',
  '    latitude: 40.7474',
  '    longitude: -74.0040',
  '',
  'organizer:',
  '  @type: Organization',
  '  name: AirOps',
  '  url: https://airops.com',
  '  description: >',
  '    AirOps is the content engineering platform for marketing teams.',
  '    It unifies AI search visibility (AEO), traditional SEO, and content',
  '    production into one operating system — so brands get seen, cited, and',
  '    cited first in AI assistants including ChatGPT, Claude, Perplexity, and Gemini.',
  '  sameAs:',
  '    - https://www.linkedin.com/company/airops',
  '    - https://twitter.com/airopshq',
  '',
  'keywords:',
  '  - AEO',
  '  - Answer Engine Optimization',
  '  - AI search visibility',
  '  - content engineering',
  '  - LLM optimization',
  '  - AI citations',
  '  - ChatGPT visibility',
  '  - Perplexity citations',
  '  - Claude citations',
  '  - Gemini visibility',
  '  - SEO 2025',
  '  - content marketing conference',
  '  - B2B marketing',
  '  - AirOps',
  '  - Page360',
  '  - Brand Kit',
  '  - Golden Prompts',
  '  - content operations',
  '  - marketing conference NYC',
  '',
  'isAccessibleForFree: false',
  'registrationStatus: open',
  'registrationUrl: https://airops.com/next',
  'capacity: limited',
  'inviteStatus: invite-preferred (AirOps customers, cohort graduates, and public practitioners)',
  '',
  'customerLogos:',
  '  - Chime',
  '  - Webflow',
  '  - Ramp',
  '  - Carta',
  '  - Sage',
  '  - Apollo',
  '  - Wiz',
  '  - LegalZoom',
  '  - Xero',
  '  - Vanta',
  '  - Klaviyo',
  '  - AssemblyAI',
  '  - Zeffy',
  '  - Ping Identity',
  '',
  'robotsDirective: index, follow',
  'canonicalUrl: https://airops.com/next',
  '================================================================================',
  '-->',
  '',
  '**AirOps Next — May 13, New York City — AI Search Conference for Marketing Leaders**',
  '```',
  '',
  '---',
]

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ASCII() {
  const mousePosRef = useRef({ x: 0, y: 0 })
  const cursorDotRef = useRef(null)
  const cursorOutlineRef = useRef(null)
  const cursorLinkRef = useRef({ x: 0, y: 0 })
  const [navOpen, setNavOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState(null)
  const [viewAs, setViewAs] = useState('human')
  const canvasRef = useASCIICanvas(mousePosRef)

  // Mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
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

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      cursor: 'none',
      background: '#fff',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>

      {/* ── ASCII canvas background ── */}
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }} />

      {/* ── White overlay so ASCII is subtle ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(255, 255, 255, 0.82)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* ── Green gradient wash from bottom (mix-blend-darken) ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '55%',
        background: 'radial-gradient(ellipse 120% 100% at 30% 100%, rgba(0,255,100,0.35) 0%, rgba(100,255,180,0.15) 40%, transparent 70%), radial-gradient(ellipse 60% 80% at 70% 100%, rgba(180,240,200,0.2) 0%, transparent 60%)',
        mixBlendMode: 'darken',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* ── Center spine ── */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: 1,
        background: 'rgba(0, 41, 16, 0.15)',
        zIndex: 3,
        pointerEvents: 'none',
      }} />

      {/* ── Blurred metadata overlay (right half, mix-blend-difference) ── */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 14px)',
        top: 27,
        width: 652,
        opacity: 0.05,
        filter: 'blur(1px)',
        mixBlendMode: 'difference',
        color: '#fff',
        fontFamily: "'SF Mono', 'Menlo', monospace",
        fontSize: 13,
        letterSpacing: '-0.52px',
        lineHeight: '1.4',
        whiteSpace: 'pre-wrap',
        zIndex: 3,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {META_LINES.map((line, i) => (
          <div key={i} style={{ lineHeight: '1.4', marginBottom: 0 }}>{line || '\u00a0'}</div>
        ))}
      </div>

      {/* ── Hero content layer ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 4 }}>

        {/* Nav logo (centered, top) */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 36,
          transform: 'translateX(-50%)',
          cursor: 'pointer',
        }} onClick={() => setNavOpen(true)}>
          <img src="/logo-airops.svg" alt="AirOps" style={{ height: 28, width: 'auto', display: 'block' }} />
        </div>

        {/* VIEW AS toggle (top right) */}
        <div style={{
          position: 'absolute',
          top: 40,
          right: 50,
          background: '#f8fffa',
          border: '1px solid #dfeae3',
          borderRadius: 8,
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          cursor: 'none',
        }}>
          <div style={{
            fontFamily: "'SF Mono', monospace",
            fontSize: 10,
            fontWeight: 500,
            color: '#008c44',
            letterSpacing: '0.42px',
            textTransform: 'uppercase',
          }}>VIEW AS:</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {['human', 'agent'].map((mode) => (
              <button key={mode} onClick={() => setViewAs(mode)} style={{
                display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', padding: 0, cursor: 'none',
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: `1.5px solid ${viewAs === mode ? '#008c44' : '#002910'}`,
                  background: viewAs === mode ? '#008c44' : 'transparent',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: viewAs === mode ? "'Cormorant Garamond', Georgia, serif" : "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#002910',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.1px',
                }}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ghost logo left background */}
        <div style={{
          position: 'absolute',
          left: -40,
          top: 40,
          opacity: 0.04,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          <img src="/logo-airops.svg" alt="" style={{ height: 'clamp(120px, 18vw, 280px)', width: 'auto' }} />
        </div>

        {/* "Next" headline — Ballet N + Cormorant ext */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-36%, -50%)',
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {/* N in Ballet */}
          <span style={{
            fontFamily: "'Ballet', cursive",
            fontSize: 'clamp(300px, 42vw, 700px)',
            fontWeight: 400,
            color: '#002910',
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
          }}>N</span>
          {/* ext in light serif, with CONF label inside */}
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(260px, 37vw, 620px)',
            fontWeight: 300,
            color: '#002910',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            position: 'relative',
          }}>
            ext
            {/* CONF floats above the "t" */}
            <span style={{
              position: 'absolute',
              right: 0,
              top: 0,
              transform: 'translateY(-100%)',
              fontFamily: "'SF Mono', monospace",
              fontSize: 'clamp(8px, 0.55vw, 11px)',
              fontWeight: 500,
              color: '#008c44',
              letterSpacing: '0.3px',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }}>CONF</span>
          </span>
        </div>

        {/* ── Ticker ── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          borderTop: '1px solid rgba(0, 41, 16, 0.12)',
          borderBottom: '1px solid rgba(0, 41, 16, 0.12)',
          padding: '9px 0',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 5,
        }}>
          <style>{`
            @keyframes ticker {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .ticker-track {
              display: flex;
              width: max-content;
              animation: ticker 28s linear infinite;
            }
          `}</style>
          <div className="ticker-track">
            {[...Array(6)].map((_, i) => (
              <span key={i} style={{
                fontFamily: "'SF Mono', 'Menlo', monospace",
                fontSize: 11,
                fontWeight: 500,
                color: '#002910',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                paddingRight: '4rem',
              }}>
                MAY 13
                <span style={{ color: '#008c44', margin: '0 1.2rem' }}>—</span>
                NEW YORK CITY
                <span style={{ color: '#008c44', margin: '0 1.2rem' }}>—</span>
                CITY WINERY
                <span style={{ color: '#008c44', margin: '0 1.2rem' }}>—</span>
                REGISTER TODAY
                <span style={{ color: '#008c44', margin: '0 1.2rem' }}>—</span>
              </span>
            ))}
          </div>
        </div>

        {/* Event details — bottom left */}
        <div style={{
          position: 'absolute',
          left: 'calc(50% - 220px)',
          bottom: 56,
          color: '#002910',
          lineHeight: 1.2,
        }}>
          <div style={{
            fontFamily: "'SF Mono', monospace",
            fontSize: 14,
            fontWeight: 500,
            color: '#008c44',
            letterSpacing: '0.48px',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>Register Today</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, letterSpacing: '-0.02em' }}>May 13th</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, letterSpacing: '-0.02em' }}>New York City</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '-0.01em',
          }}>Pier 57, City Winery</div>
        </div>

        {/* Description + CTA — bottom right of center */}
        <div style={{
          position: 'absolute',
          left: 'calc(50% + 175px)',
          bottom: 56,
          width: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            color: '#002910',
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
            margin: 0,
          }}>
            See what's winning in AI search before it's common knowledge. Hear from the teams who've already made the shift, and what they'd do differently. Get a first look at what AirOps is building next. Walk away with strategies you can actually use.
          </p>
          <button style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#00ff64',
            color: '#002910',
            border: 'none',
            borderRadius: 58,
            padding: '14px 24px',
            fontSize: 17,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            letterSpacing: '-0.01em',
            cursor: 'none',
            width: 'fit-content',
            whiteSpace: 'nowrap',
          }}>
            Claim your spot
            <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
          </button>
        </div>

      </div>

      {/* ── Custom cursor ── */}
      <div ref={cursorDotRef} style={{
        position: 'fixed', top: 0, left: 0,
        transform: 'translate(-50%, -50%)',
        width: 6, height: 6,
        borderRadius: '50%',
        background: '#002910',
        zIndex: 9999,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
      }} />
      <div ref={cursorOutlineRef} style={{
        position: 'fixed', top: 0, left: 0,
        transform: 'translate(-50%, -50%)',
        width: 36, height: 36,
        borderRadius: '50%',
        border: '1px solid #002910',
        zIndex: 9999,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        transition: 'width 0.2s, height 0.2s',
      }} />

      {/* ── Nav overlay ── */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(248, 255, 250, 0.96)',
          backdropFilter: 'blur(12px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: navOpen ? 1 : 0,
          pointerEvents: navOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
          cursor: 'none',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setNavOpen(false) }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'center' }}>
          {['Experiments', 'Writing', 'Capabilities', 'About'].map((item) => (
            item === 'Experiments' ? (
              <Link key={item} to="/" onClick={() => setNavOpen(false)} style={{
                fontSize: '3rem', fontWeight: 300, color: hoveredNav === item ? '#008c44' : '#002910',
                textDecoration: 'none', transition: 'color 0.3s', cursor: 'none',
                fontFamily: "'Inter', sans-serif",
              }}
                onMouseEnter={() => setHoveredNav(item)}
                onMouseLeave={() => setHoveredNav(null)}
              >{item}</Link>
            ) : (
              <div key={item} style={{
                fontSize: '3rem', fontWeight: 300,
                color: hoveredNav === item ? '#008c44' : '#002910',
                transition: 'color 0.3s', cursor: 'none',
                fontFamily: "'Inter', sans-serif",
              }}
                onMouseEnter={() => setHoveredNav(item)}
                onMouseLeave={() => setHoveredNav(null)}
              >{item}</div>
            )
          ))}
          <div style={{
            fontSize: '1.4rem', fontWeight: 300,
            color: hoveredNav === 'close' ? '#008c44' : '#938a84',
            transition: 'color 0.3s', cursor: 'none',
            fontFamily: "'SF Mono', monospace",
            letterSpacing: '0.05em',
          }}
            onMouseEnter={() => setHoveredNav('close')}
            onMouseLeave={() => setHoveredNav(null)}
            onClick={() => setNavOpen(false)}
          >[ close ]</div>
        </div>
      </div>
    </div>
  )
}
