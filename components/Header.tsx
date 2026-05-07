'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '/stock',       label: '주식',     en: 'Stock',       color: '#1A6B3C' },
  { href: '/realestate',  label: '부동산',   en: 'Real Estate', color: '#8B4513' },
  { href: '/life',        label: '삶의태도', en: 'Life',        color: '#4A3882' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ background: '#0D0D0D', borderBottom: '1px solid #1A1A1A' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* 상단 바 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 0', borderBottom: '1px solid #1A1A1A'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.75rem',
                fontWeight: 700, color: '#F7F5F0', letterSpacing: '-0.02em',
                lineHeight: 1
              }}>
                SeekAlpha<span style={{ color: '#C9A84C' }}>88</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase',
                marginTop: '2px'
              }}>
                데이터 기반 인사이트
              </div>
            </div>
          </Link>

          {/* 데스크탑 nav */}
          <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            {NAV.map(({ href, label, en, color }) => {
              const active = pathname.startsWith(href)
              return (
                <Link key={href} href={href} style={{
                  textDecoration: 'none',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '4px',
                  border: `1px solid ${active ? color : 'transparent'}`,
                  background: active ? `${color}22` : 'transparent',
                  transition: 'all 0.15s ease',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? color : '#AAA',
                  }}>
                    {label}
                  </span>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem', color: active ? color : '#555',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    opacity: 0.8,
                  }}>
                    {en}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* 하단 태그라인 */}
        <div style={{
          padding: '0.6rem 0',
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          color: '#444', letterSpacing: '0.08em',
          display: 'flex', gap: '2rem',
        }}>
          <span>주식 · 부동산 · 삶의태도</span>
          <span style={{ color: '#C9A84C' }}>데이터와 논문에 기반한 인사이트</span>
        </div>
      </div>
    </header>
  )
}
