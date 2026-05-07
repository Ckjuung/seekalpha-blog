import Link from 'next/link'
import { getFeaturedPosts, getAllPosts, Post } from '@/lib/notion'

const CATEGORY_CONFIG = {
  '주식':    { href: '/stock',      color: '#1A6B3C', bg: '#1A6B3C15', label: 'STOCK' },
  '부동산':  { href: '/realestate', color: '#8B4513', bg: '#8B451315', label: 'REAL ESTATE' },
  '삶의태도':{ href: '/life',       color: '#4A3882', bg: '#4A388215', label: 'LIFE' },
}

function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const cfg = CATEGORY_CONFIG[post.category]
  return (
    <Link href={`/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="post-card" style={{
        background: '#fff', border: '1px solid #E8E4DC',
        borderRadius: '4px', overflow: 'hidden', height: '100%',
        padding: featured ? '2.5rem' : '1.75rem',
      }}>
        {/* 카테고리 뱃지 */}
        <div style={{
          display: 'inline-block', background: cfg.bg,
          border: `1px solid ${cfg.color}40`,
          padding: '0.2rem 0.6rem', borderRadius: '2px', marginBottom: '1rem'
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: cfg.color, letterSpacing: '0.12em' }}>
            {cfg.label}
          </span>
        </div>

        {/* 제목 */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: featured ? '1.75rem' : '1.2rem',
          fontWeight: 600, color: '#0D0D0D',
          lineHeight: 1.25, letterSpacing: '-0.01em',
          marginBottom: '1rem',
        }}>
          {post.title}
        </h2>

        {/* 요약 */}
        {post.summary && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            color: '#666', lineHeight: 1.7, marginBottom: '1.25rem',
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {post.summary}
          </p>
        )}

        {/* 날짜 + 읽기 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#AAA' }}>
            {post.publishedDate}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: cfg.color }}>
            읽기 →
          </span>
        </div>
      </article>
    </Link>
  )
}

export default async function HomePage() {
  let featured: Post[] = []
  let recent: Post[] = []

  try {
    [featured, recent] = await Promise.all([
      getFeaturedPosts(),
      getAllPosts(),
    ])
  } catch (e) {
    // 노션 연결 전 빈 배열로 처리
  }

  const heroPost = featured[0]
  const subFeatured = featured.slice(1, 3)
  const latestPosts = recent.slice(0, 6)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* 히어로 배너 */}
      <section style={{
        background: '#0D0D0D',
        borderBottom: '1px solid #1A1A1A',
        padding: '5rem 0 4rem',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: '#C9A84C', letterSpacing: '0.2em', marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}>
              데이터 기반 인사이트 블로그
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700, color: '#F7F5F0', lineHeight: 1.05,
              letterSpacing: '-0.03em', marginBottom: '1.5rem',
            }}>
              시장을 읽는 눈,<br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>데이터로 갈고닦다.</em>
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1.1rem',
              color: '#888', lineHeight: 1.8, maxWidth: '500px',
            }}>
              주식, 부동산, 삶의 태도를 논문과 데이터에 기반해 분석합니다.
            </p>
          </div>

          {/* 카테고리 퀵링크 */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            {Object.entries(CATEGORY_CONFIG).map(([name, cfg]) => (
              <Link key={name} href={cfg.href} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                border: `1px solid ${cfg.color}60`,
                borderRadius: '4px', textDecoration: 'none',
                background: cfg.bg, transition: 'all 0.15s ease',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: cfg.color, fontWeight: 600 }}>
                  {name}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: cfg.color, opacity: 0.7, letterSpacing: '0.1em' }}>
                  {cfg.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 메인 컨텐츠 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Featured 포스트 */}
        {heroPost && (
          <section style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#C9A84C', letterSpacing: '0.2em' }}>
                FEATURED
              </span>
              <div style={{ flex: 1, height: '1px', background: '#E8E4DC' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <PostCard post={heroPost} featured />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {subFeatured.map(p => <PostCard key={p.id} post={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* 최신 포스트 */}
        {latestPosts.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#888', letterSpacing: '0.2em' }}>
                LATEST
              </span>
              <div style={{ flex: 1, height: '1px', background: '#E8E4DC' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {latestPosts.map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </section>
        )}

        {/* 포스트 없을 때 */}
        {latestPosts.length === 0 && !heroPost && (
          <div style={{ textAlign: 'center', padding: '8rem 0', color: '#888' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem', color: '#CCC' }}>
              Coming Soon
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#AAA' }}>
              곧 첫 번째 인사이트가 업로드됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
