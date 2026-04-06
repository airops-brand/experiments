import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ─── Font loading ──────────────────────────────────────────────────────────────
const fontStyles = `
  @font-face { font-family: 'Serrif VF-TRIAL'; src: url('/fonts-local/SerrifVF.ttf') format('truetype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: 'Saans'; src: url('/fonts-local/Saans-Regular.ttf') format('truetype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: 'Saans'; src: url('/fonts-local/Saans-Medium.ttf') format('truetype'); font-weight: 500; font-display: swap; }
  @font-face { font-family: 'Saans'; src: url('/fonts-local/Saans-Bold.ttf') format('truetype'); font-weight: 700; font-display: swap; }
  @font-face { font-family: 'Saans'; src: url('/fonts-local/Saans-RegularItalic.ttf') format('truetype'); font-weight: 400; font-style: italic; font-display: swap; }
  @font-face { font-family: 'Saans Mono'; src: url('/fonts-local/SaansMono-Medium.ttf') format('truetype'); font-weight: 500; font-display: swap; }
`

// ─── Brand team data ───────────────────────────────────────────────────────────
const teamMembers = [
  {
    name: 'Jess Rosenberg',
    role: 'Brand Lead',
    focus: 'Visual identity, design systems, brand expression across all touchpoints',
    color: '#fee7fd',
    textColor: '#3a092c',
    pillVariant: 'pink',
  },
  {
    name: 'Jordan Lee',
    role: 'Content Strategist',
    focus: 'Voice and tone, editorial standards, messaging frameworks',
    color: '#e5e5ff',
    textColor: '#0f0f57',
    pillVariant: 'indigo',
  },
  {
    name: 'Taylor Kim',
    role: 'Design Engineer',
    focus: 'Component library, design tokens, Figma-to-code workflows',
    color: '#EEFF8C',
    textColor: '#000d05',
    pillVariant: 'yellow',
  },
  {
    name: 'Sam Okafor',
    role: 'Creative Director',
    focus: 'Campaign art direction, illustration, motion and visual storytelling',
    color: '#c9ebf2',
    textColor: '#0a3945',
    pillVariant: 'teal',
  },
]

const principles = [
  {
    title: 'Craft over flash',
    body: 'Every design choice has a reason. We lead with clarity, not decoration.',
    icon: 'ri-quill-pen-line',
  },
  {
    title: 'System-first',
    body: 'Tokens, components, patterns. If it ships once, it ships as a system.',
    icon: 'ri-layout-grid-line',
  },
  {
    title: 'Green spectrum',
    body: 'Our palette anchors to green. Accent colors appear sparingly and never mix.',
    icon: 'ri-palette-line',
  },
  {
    title: 'Serif meets sans',
    body: 'The editorial contrast of Serrif VF paired with Saans creates our signature voice.',
    icon: 'ri-text',
  },
  {
    title: 'Sharp by default',
    body: 'No rounded corners, no drop shadows, no gradients. Clean, confident surfaces.',
    icon: 'ri-square-line',
  },
  {
    title: 'Data with clarity',
    body: 'Charts tell stories. Sharp bars, readable labels, zero chart junk.',
    icon: 'ri-bar-chart-2-line',
  },
]

const recentWork = [
  { label: 'Web Design System', status: 'SHIPPED', date: 'Q1 2026' },
  { label: 'Brand Kit v3', status: 'IN PROGRESS', date: 'Q2 2026' },
  { label: 'Research Report Templates', status: 'SHIPPED', date: 'Q1 2026' },
  { label: 'Event Visual Identity', status: 'IN PROGRESS', date: 'Q2 2026' },
  { label: 'Data Viz Component Library', status: 'SHIPPED', date: 'Q1 2026' },
  { label: 'Social Media Templates', status: 'PLANNING', date: 'Q3 2026' },
]

// ─── Logo SVG ──────────────────────────────────────────────────────────────────
function AirOpsLogo({ width = 100, color = '#002910' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} viewBox="0 0 100 32" fill="none" aria-label="AirOps" style={{ color, display: 'block' }}>
      <path d="M14.2683 8.35377V11.2588C12.9587 9.16447 10.9253 7.88086 8.40935 7.88086C3.03288 7.88086 0 11.833 0 17.1364C0 22.4735 3.06735 26.5608 8.47828 26.5608C10.9942 26.5608 12.9931 25.2772 14.2683 23.1829V26.0879H18.473V8.35377H14.2683ZM9.30543 23.0478C6.23809 23.0478 4.48039 20.2441 4.48039 17.1364C4.48039 14.0963 6.20362 11.4277 9.37436 11.4277C11.9937 11.4277 14.2339 13.2856 14.2339 17.0688C14.2339 20.7846 12.0971 23.0478 9.30543 23.0478Z" fill="currentColor"/>
      <path d="M22.0938 8.35547V26.0896H26.5741V8.35547H22.0938Z" fill="currentColor"/>
      <path d="M34.832 12.7461V8.3548H30.3516V26.0889H34.832V15.9551C34.832 13.3541 36.6586 12.307 38.3818 12.307C39.3813 12.307 40.4152 12.5772 40.9666 12.7799V8.05078C38.0372 8.05078 35.6246 9.77353 34.832 12.7461Z" fill="currentColor"/>
      <path d="M42.0625 13.7594C42.0625 19.2655 45.9225 23.1839 51.4713 23.1839C57.0546 23.1839 60.8804 19.2655 60.8804 13.7594C60.8804 8.35475 57.0546 4.50391 51.4713 4.50391C45.9225 4.50391 42.0625 8.35475 42.0625 13.7594ZM56.3998 13.7594C56.3998 17.2049 54.5042 19.6708 51.4713 19.6708C48.404 19.6708 46.5429 17.2049 46.5429 13.7594C46.5429 10.4491 48.404 8.05073 51.4713 8.05073C54.5042 8.05073 56.3998 10.4491 56.3998 13.7594Z" fill="currentColor"/>
      <path d="M73.3738 7.88086C70.7545 7.88086 68.6177 9.40093 67.4804 11.833V8.35377H63V31.9993H67.4804V22.9127C68.7556 25.1083 71.1336 26.5608 73.6496 26.5608C78.5435 26.5608 81.9555 22.8113 81.9555 17.4404C81.9555 11.7993 78.4057 7.88086 73.3738 7.88086ZM72.5811 23.2505C69.5827 23.2505 67.4804 20.7846 67.4804 17.2715C67.4804 13.6571 69.5827 11.1237 72.5811 11.1237C75.4417 11.1237 77.4751 13.7247 77.4751 17.4066C77.4751 20.8521 75.4417 23.2505 72.5811 23.2505Z" fill="currentColor"/>
      <path d="M83.3906 19.9401C83.3906 23.1491 86.2856 26.5608 92.0757 26.5608C97.9002 26.5608 100.003 23.2167 100.003 20.6157C100.003 16.6297 95.212 15.9203 92.0068 15.3123C89.8355 14.9407 88.4569 14.6367 88.4569 13.4207C88.4569 12.0357 90.0078 11.1575 91.6621 11.1575C93.9023 11.1575 94.7639 12.6775 94.8329 14.2989H99.3133C99.3133 11.6641 97.4177 7.88086 91.5587 7.88086C86.4924 7.88086 83.9765 10.6845 83.9765 13.6909C83.9765 17.9809 88.836 18.42 92.0412 19.028C93.9023 19.3658 95.5221 19.7712 95.5221 21.0886C95.5221 22.406 93.9368 23.2842 92.248 23.2842C90.6626 23.2842 87.871 22.406 87.871 19.9401H83.3906Z" fill="currentColor"/>
      <path d="M24.4093 6.19288C22.5697 6.19288 21.25 4.89943 21.25 3.13563C21.25 1.37184 22.5697 0 24.4093 0C26.1688 0 27.5685 1.37184 27.5685 3.13563C27.5685 4.89943 26.1688 6.19288 24.4093 6.19288Z" fill="currentColor"/>
    </svg>
  )
}

// ─── Pill component ────────────────────────────────────────────────────────────
const pillColors = {
  green: { background: '#eef9f3', borderColor: '#057a28', color: '#057a28' },
  pink: { background: '#fee7fd', borderColor: '#c54b9b', color: '#3a092c' },
  indigo: { background: '#e5e5ff', borderColor: '#1b1b8f', color: '#0f0f57' },
  yellow: { background: '#EEFF8C', borderColor: '#d4e87a', color: '#000d05' },
  teal: { background: '#c9ebf2', borderColor: '#1b1b8f', color: '#0f0f57' },
  dark: { background: '#000d05', borderColor: 'transparent', color: '#00ff64' },
}

function Pill({ children, variant = 'green' }) {
  const colors = pillColors[variant] || pillColors.green
  return (
    <span style={{
      fontFamily: "'Saans Mono', 'DM Mono', monospace",
      fontSize: 14,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.84px',
      lineHeight: 1.3,
      padding: '8px 16px',
      border: '1px solid',
      borderRadius: 5,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'fit-content',
      ...colors,
    }}>
      {children}
    </span>
  )
}

// ─── Floralia S pattern SVG (recreated from Figma node 2774:74707) ──────────
// A massive decorative "S" letterform in #f8fffb overlays the dot grid,
// masking dots where the organic curves are to create a subtle botanical pattern.
function FloraliaPattern() {
  return (
    <svg
      viewBox="0 0 1440 1232"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
      }}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Organic curves mimicking the Floralia "S" glyph, rotated 180deg, offset upper-left */}
      <g fill="#f8fffb">
        {/* Upper-left large sweeping arc */}
        <path d="M-80 520 C-80 520, 60 -80, 380 -40 C700 0, 520 380, 340 480 C160 580, -20 440, -80 520Z" />
        {/* Top center flowing petal */}
        <path d="M280 -60 C280 -60, 480 120, 620 60 C760 0, 740 -100, 900 -80 C1060 -60, 960 160, 820 220 C680 280, 460 180, 280 -60Z" />
        {/* Upper-right large curve */}
        <path d="M780 -100 C780 -100, 1020 80, 1160 20 C1300 -40, 1380 -120, 1520 -60 C1660 0, 1480 240, 1280 280 C1080 320, 920 140, 780 -100Z" />
        {/* Right side descending curve */}
        <path d="M1200 120 C1200 120, 1440 260, 1520 420 C1600 580, 1400 520, 1300 400 C1200 280, 1160 200, 1200 120Z" />
        {/* Center-right organic tendril */}
        <path d="M640 180 C640 180, 800 320, 940 280 C1080 240, 1020 140, 1120 180 C1220 220, 1180 380, 1040 420 C900 460, 720 340, 640 180Z" />
        {/* Left side mid-height curve */}
        <path d="M-40 300 C-40 300, 120 220, 260 280 C400 340, 340 460, 200 500 C60 540, -80 420, -40 300Z" />
        {/* Center crossing curve */}
        <path d="M320 360 C320 360, 500 260, 660 340 C820 420, 700 540, 540 520 C380 500, 300 420, 320 360Z" />
        {/* Lower flowing shape */}
        <path d="M440 480 C440 480, 600 420, 760 480 C920 540, 860 640, 720 660 C580 680, 420 580, 440 480Z" />
        {/* Upper-left secondary petal */}
        <path d="M100 -40 C100 -40, 240 80, 200 200 C160 320, 40 280, 0 180 C-40 80, 60 -20, 100 -40Z" />
        {/* Top arch connecting curves */}
        <path d="M500 -20 C500 -20, 580 100, 520 180 C460 260, 380 200, 400 120 C420 40, 480 0, 500 -20Z" />
        {/* Right side upper leaf */}
        <path d="M1040 -40 C1040 -40, 1200 80, 1140 200 C1080 320, 960 260, 980 140 C1000 20, 1020 -20, 1040 -40Z" />
        {/* Far right flowing tail */}
        <path d="M1340 200 C1340 200, 1500 320, 1540 480 C1580 640, 1440 600, 1380 480 C1320 360, 1300 260, 1340 200Z" />
      </g>
    </svg>
  )
}

// ─── Animate on scroll hook ────────────────────────────────────────────────────
function useReveal(threshold = 0.3) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function BrandTeam() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [heroRef, heroVisible] = useReveal(0.2)
  const [teamRef, teamVisible] = useReveal(0.2)
  const [principlesRef, principlesVisible] = useReveal(0.2)
  const [workRef, workVisible] = useReveal(0.2)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = fontStyles
    document.head.appendChild(style)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css'
    document.head.appendChild(link)
    return () => { style.remove(); link.remove() }
  }, [])

  return (
    <div style={{ background: '#F8FFFA', minHeight: '100vh' }}>

      {/* ── Header (Nav + Hero with Floralia S pattern) ─────────────────────── */}
      <div style={{
        position: 'relative',
        background: '#f8fffb',
        backgroundImage: 'radial-gradient(#d4e8da 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        overflow: 'hidden',
      }}>
        <FloraliaPattern />

        {/* Nav */}
        <nav style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 48px', maxWidth: 1440, margin: '0 auto',
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <AirOpsLogo width={100} />
          </Link>
          <Pill variant="green">BRAND TEAM</Pill>
        </nav>

        {/* Hero content */}
        <section ref={heroRef} style={{
          position: 'relative', zIndex: 1,
          padding: '144px 48px',
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        }}>
          <Pill variant="green">THE TEAM BEHIND THE BRAND</Pill>
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.8s ease-out',
          }}>
            <h1 style={{
              fontFamily: "'Serrif VF-TRIAL', Georgia, serif",
              fontSize: 72, fontWeight: 400, letterSpacing: '-2.16px',
              lineHeight: 1.0, color: '#002910', margin: 0,
              background: '#f8fffb', display: 'inline-block', padding: '4px 8px 12px',
            }}>
              We build the system
            </h1>
            <br />
            <h1 style={{
              fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
              fontSize: 72, fontWeight: 400, letterSpacing: '-1.44px',
              lineHeight: 1.0, color: '#002910', margin: 0,
              background: '#f8fffb', display: 'inline-block', padding: '4px 8px 12px',
            }}>
              that builds the brand
            </h1>
          </div>
          <p style={{
            fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
            fontSize: 18, lineHeight: 1.5, letterSpacing: '0.18px',
            color: '#01200d', maxWidth: 694, margin: '0 auto',
            background: '#f8fffb', padding: '4px 8px',
            opacity: heroVisible ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.3s',
          }}>
            The AirOps brand team owns visual identity, design systems, content voice,
            and every touchpoint where the brand meets the world. From tokens to campaigns,
            we make sure AirOps looks, sounds, and feels like AirOps.
          </p>
        </section>
      </div>

      {/* ── Team cards ──────────────────────────────────────────────────────── */}
      <section ref={teamRef} style={{
        padding: '120px 48px', maxWidth: 1440, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <Pill variant="green">MEET THE TEAM</Pill>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {teamMembers.map((member, i) => {
            const isVisible = teamVisible
            return (
              <div
                key={member.name}
                style={{
                  background: member.color,
                  padding: 48,
                  display: 'flex', flexDirection: 'column', gap: 24,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
                  transition: `all 0.6s ease-out ${i * 150}ms`,
                }}
              >
                <Pill variant={member.pillVariant}>{member.role}</Pill>
                <div>
                  <h3 style={{
                    fontFamily: "'Serrif VF-TRIAL', Georgia, serif",
                    fontSize: 40, fontWeight: 400, letterSpacing: '-0.8px',
                    lineHeight: 1.2, color: member.textColor, margin: 0,
                  }}>
                    {member.name.split(' ')[0]}
                  </h3>
                  <h3 style={{
                    fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
                    fontSize: 40, fontWeight: 400, letterSpacing: '-0.8px',
                    lineHeight: 1.2, color: member.textColor, margin: 0,
                  }}>
                    {member.name.split(' ')[1]}
                  </h3>
                </div>
                <p style={{
                  fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
                  fontSize: 18, lineHeight: 1.5, letterSpacing: '0.18px',
                  color: member.textColor,
                  margin: 0,
                }}>
                  {member.focus}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Brand Principles (Dark style) ───────────────────────────────────── */}
      <section style={{
        background: '#00250e', border: '1px solid #057a28',
        margin: '0 48px',
      }}>
        <div ref={principlesRef} style={{
          padding: '120px 48px',
          maxWidth: 1344, margin: '0 auto',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Pill variant="dark">OUR PRINCIPLES</Pill>
            <h2 style={{
              fontFamily: "'Serrif VF-TRIAL', Georgia, serif",
              fontSize: 72, fontWeight: 400, letterSpacing: '-2.16px',
              lineHeight: 1.0, color: '#f8fffa', margin: 0,
            }}>
              What guides us
            </h2>
            <h2 style={{
              fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
              fontSize: 72, fontWeight: 400, letterSpacing: '-1.44px',
              lineHeight: 1.0, color: '#f8fffa', margin: 0,
            }}>
              every single day
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 24,
          }}>
            {principles.map((p, i) => (
              <div
                key={p.title}
                style={{
                  background: '#004319', border: '1px solid #005e1f',
                  padding: 40, display: 'flex', flexDirection: 'column', gap: 16,
                  opacity: principlesVisible ? 1 : 0,
                  transform: principlesVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `all 0.6s ease-out ${i * 150}ms`,
                }}
              >
                <i className={p.icon} style={{ fontSize: 28, color: '#00ff64' }} />
                <h4 style={{
                  fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
                  fontSize: 28, fontWeight: 400, letterSpacing: '-0.56px',
                  lineHeight: 1.2, color: '#f8fffa', margin: 0,
                }}>
                  {p.title}
                </h4>
                <p style={{
                  fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
                  fontSize: 18, lineHeight: 1.5, letterSpacing: '0.18px',
                  color: '#f8fffa', margin: 0, opacity: 0.8,
                }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent work (Light style) ───────────────────────────────────────── */}
      <section ref={workRef} style={{
        padding: '120px 48px', maxWidth: 1440, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <Pill variant="green">RECENT WORK</Pill>
          <h2 style={{
            fontFamily: "'Serrif VF-TRIAL', Georgia, serif",
            fontSize: 72, fontWeight: 400, letterSpacing: '-2.16px',
            lineHeight: 1.0, color: '#002910', margin: 0,
          }}>
            What we have been
          </h2>
          <h2 style={{
            fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
            fontSize: 72, fontWeight: 400, letterSpacing: '-1.44px',
            lineHeight: 1.0, color: '#002910', margin: 0,
          }}>
            shipping lately
          </h2>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {recentWork.map((item, i) => {
            const statusColors = {
              SHIPPED: { bg: '#eef9f3', border: '#057a28', text: '#057a28' },
              'IN PROGRESS': { bg: '#EEFF8C', border: '#d4e87a', text: '#000d05' },
              PLANNING: { bg: '#e5e5ff', border: '#1b1b8f', text: '#0f0f57' },
            }
            const sc = statusColors[item.status] || statusColors.SHIPPED
            return (
              <div
                key={item.label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '24px 0',
                  borderBottom: '1px solid #d4e8da',
                  opacity: workVisible ? 1 : 0,
                  transform: workVisible ? 'translateX(0)' : 'translateX(-24px)',
                  transition: `all 0.5s ease-out ${i * 100}ms`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <span style={{
                    fontFamily: "'Saans Mono', 'DM Mono', monospace",
                    fontSize: 14, fontWeight: 500, color: '#a5aab6',
                    letterSpacing: '0.84px', width: 24,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
                    fontSize: 24, fontWeight: 400, letterSpacing: 0,
                    lineHeight: 1.3, color: '#002910',
                  }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{
                    fontFamily: "'Saans Mono', 'DM Mono', monospace",
                    fontSize: 14, fontWeight: 500, textTransform: 'uppercase',
                    letterSpacing: '0.84px', lineHeight: 1.3,
                    padding: '8px 16px', border: '1px solid',
                    borderRadius: 5, display: 'inline-flex',
                    background: sc.bg, borderColor: sc.border, color: sc.text,
                  }}>
                    {item.status}
                  </span>
                  <span style={{
                    fontFamily: "'Saans Mono', 'DM Mono', monospace",
                    fontSize: 14, fontWeight: 500, color: '#a5aab6',
                    letterSpacing: '0.84px',
                  }}>
                    {item.date}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA (Indigo style) ──────────────────────────────────────────────── */}
      <section style={{
        background: '#1b1b8f', padding: '120px 48px',
        textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 24,
      }}>
        <Pill variant="indigo">JOIN US</Pill>
        <h2 style={{
          fontFamily: "'Serrif VF-TRIAL', Georgia, serif",
          fontSize: 72, fontWeight: 400, letterSpacing: '-2.16px',
          lineHeight: 1.0, color: '#f8fffa', margin: 0,
        }}>
          Want to shape
        </h2>
        <h2 style={{
          fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
          fontSize: 72, fontWeight: 400, letterSpacing: '-1.44px',
          lineHeight: 1.0, color: '#f8fffa', margin: 0,
        }}>
          how AirOps feels?
        </h2>
        <p style={{
          fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
          fontSize: 18, lineHeight: 1.5, letterSpacing: '0.18px',
          color: '#f8fffa', maxWidth: 694, margin: '0 auto', opacity: 0.8,
        }}>
          We are always looking for people who care about craft, systems thinking,
          and building brands that earn trust over time.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{
            fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
            fontWeight: 500, fontSize: 20, lineHeight: 1.0,
            background: '#00ff64', color: '#002910',
            border: 'none', borderRadius: 58, padding: 16,
            cursor: 'pointer',
          }}>
            See open roles <i className="ri-arrow-right-line" style={{ fontSize: 24, verticalAlign: 'middle', marginLeft: 4 }} />
          </button>
          <button style={{
            fontFamily: "'Saans', 'Helvetica Neue', sans-serif",
            fontWeight: 500, fontSize: 19,
            background: 'rgba(0,0,0,0.3)', color: '#f8fffa',
            border: 'none', borderRadius: 0, padding: 16,
            cursor: 'pointer', height: 56,
          }}>
            Meet the team <i className="ri-arrow-right-line" style={{ fontSize: 24, verticalAlign: 'middle', marginLeft: 4 }} />
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{
        background: '#00250e', padding: '64px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <AirOpsLogo width={100} color="#f8fffa" />
        <span style={{
          fontFamily: "'Saans Mono', 'DM Mono', monospace",
          fontSize: 14, fontWeight: 500, textTransform: 'uppercase',
          letterSpacing: '0.84px', color: '#008c44',
        }}>
          Brand Team &middot; 2026
        </span>
      </footer>
    </div>
  )
}
