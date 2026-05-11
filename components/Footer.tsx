import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#0D0D0D', borderTop: '1px solid #1A1A1A',
      marginTop: '6rem', padding: '3rem 0 2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          {/* 소개 */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#F7F5F0', fontWeight: 700, marginBottom: '0.75rem' }}>
              SeekAlpha<span style={{ color: '#C9A84C' }}>88</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#666', lineHeight: 1.8, maxWidth: '280px' }}>
              데이터와 논문에 기반한 투자 인사이트. 주식, 부동산, 그리고 경제 전반을 탐구합니다.
            </p>
          </div>
          {/* 카테고리 */}
          {[
            { title: '주식', color: '#1A6B3C', links: ['/stock'] },
            { title: '부동산', color: '#8B4513', links: ['/realestate'] },
            { title: '경제일반', color: '#4A3882', links: ['/economy'] },
          ].map(({ title, color, links }) => (
            <div key={title}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', color, fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                {title}
              </div>
              <Link href={links[0]} style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#555', textDecoration: 'none', marginBottom: '0.4rem' }}>
                전체 보기 →
              </Link>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#444' }}>
            © 2026 SeekAlpha88. All rights reserved.
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#333' }}>
            투자는 본인 책임입니다. 본 블로그는 투자 권유가 아닙니다.
          </span>
        </div>
      </div>
    </footer>
  )
}
