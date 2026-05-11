'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/stock',       label: '주식',     en: 'STOCK',        color: '#1A6B3C' },
  { href: '/realestate',  label: '부동산',   en: 'REAL ESTATE',  color: '#8B4513' },
  { href: '/economy',     label: '경제일반', en: 'ECONOMY',      color: '#4A3882' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header style={{ background: '#0D0D0D', borderBottom: '1px solid #1A1A1A' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 0', borderBottom: '1px solid #1A1A1A',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div>
              <div style={{
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: '1.6rem', fontWeight: 700,
                color: '#F7F5F0', letterSpacing: '-0.03em', lineHeight: 1,
              }}>
                SeekAlpha<span style={{ color: '#C9A84C' }}>88</span>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem', color: '#555',
                letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '3px',
              }}>
                데이터 기반 인사이트
              </div>
            </div>
          </Link>

          <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            {NAV.map(({ href, label, en, color }) => {
              const active = pathname.startsWith(href)
              return (
                <Link key={href} href={href} style={{
                  textDecoration: 'none', padding: '0.5rem 1.25rem',
                  borderRadius: '4px',
                  border: `1px solid ${active ? color : 'transparent'}`,
                  background: active ? `${color}22` : 'transparent',
                  transition: 'all 0.15s ease',
                }}>
                  <span style={{
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 400,
                    color: active ? color : '#AAA',
                    display: 'block',
                  }}>
                    {label}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.55rem', color: active ? color : '#444',
                    letterSpacing: '0.1em', display: 'block', opacity: 0.8,
                  }}>
                    {en}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div style={{
          padding: '0.6rem 0',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem', color: '#333',
          letterSpacing: '0.08em', display: 'flex', gap: '2rem',
        }}>
          <span style={{ color: '#444' }}>주식 · 부동산 · 경제일반</span>
          <span style={{ color: '#C9A84C' }}>데이터와 논문에 기반한 인사이트</span>
        </div>
      </div>
    </header>
  )
}
