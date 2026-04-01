import { Link } from 'react-router-dom'

const styles = {
  page: {
    background: '#f7f3f0',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: '#3d3434',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '80px',
  },
  wordmark: {
    fontSize: '2.5rem',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    lineHeight: 1,
    color: '#3d3434',
  },
  meta: {
    fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: '0.7rem',
    color: '#938a84',
    textAlign: 'right',
  },
  sectionLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#938a84',
    marginBottom: '32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1px',
    background: '#e3deda',
  },
  card: {
    background: '#f7f3f0',
    padding: '32px',
    textDecoration: 'none',
    color: '#3d3434',
    display: 'block',
    transition: 'background 0.2s',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    marginBottom: '8px',
  },
  cardDesc: {
    fontSize: '0.8rem',
    color: '#938a84',
    lineHeight: 1.5,
  },
  cardTag: {
    marginTop: '24px',
    fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
    fontSize: '0.65rem',
    color: '#b08a8a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
}

const experiments = [
  {
    slug: '/ascii',
    title: 'ASCII',
    description: 'Generative ASCII canvas with cursor-distortion and noise-driven typography displacement.',
    tag: 'canvas / generative',
  },
]

export default function Home() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.wordmark}>Experiments</div>
        <div style={styles.meta}>
          airops-brand<br />
          brand.team / lab
        </div>
      </header>

      <div style={styles.sectionLabel}>— Index</div>

      <div style={styles.grid}>
        {experiments.map((exp) => (
          <Link
            key={exp.slug}
            to={exp.slug}
            style={styles.card}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f0ebe6' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f7f3f0' }}
          >
            <div style={styles.cardTitle}>{exp.title}</div>
            <div style={styles.cardDesc}>{exp.description}</div>
            <div style={styles.cardTag}>{exp.tag}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
