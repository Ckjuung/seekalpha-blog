import Link from 'next/link'
import { getAllPosts, Post } from '@/lib/notion'

type CategoryConfig = {
  name: string
  notionKey: '주식' | '부동산' | '삶의태도'
  color: string
  bg: string
  label: string
  description: string
}

const CONFIGS: Record<string, CategoryConfig> = {
  stock: {
    name: '주식',
    notionKey: '주식',
    color: '#1A6B3C',
    bg: '#1A6B3C12',
    label: 'STOCK',
    description: '데이터와 논문에 기반한 주식 시장 분석, 종목 리뷰, 투자 전략을 다룹니다.',
  },
  realestate: {
    name: '부동산',
    notionKey: '부동산',
    color: '#8B4513',
    bg: '#8B451312',
    label: 'REAL ESTATE',
    description: '청약 분석, 재개발·재건축 투자, 세금 전략 등 부동산 인사이트를 제공합니다.',
  },
  life: {
    name: '삶의태도',
    notionKey: '삶의태도',
    color: '#4A3882',
    bg: '#4A388212',
    label: 'LIFE',
    description: '독서, 철학, 커리어, 투자 마인드셋 등 더 나은 삶을 위한 태도를 탐구합니다.',
  },
}

export default async function CategoryPage({ category }: { category: string }) {
  const cfg = CONFIGS[category]
  if (!cfg) return null

  let posts: Post[] = []
  try {
    posts = await getAllPosts(cfg.notionKey)
  } catch (e) {}

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* 카테고리 헤더 */}
      <section style={{ background: '#0D0D0D', padding: '4rem 0 3rem', borderBottom: `3px solid ${cfg.color}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: cfg.color, letterSpacing: '0.2em', marginBottom: '1rem' }}>
            {cfg.label}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700, color: '#F7F5F0', letterSpacing: '-0.02em',
            lineHeight: 1.1, marginBottom: '1rem',
          }}>
            {cfg.name}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: '#888', maxWidth: '480px', lineHeight: 1.7 }}>
            {cfg.description}
          </p>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#444', marginTop: '1.5rem' }}>
            총 {posts.length}개의 글
          </div>
        </div>
      </section>

      {/* 포스트 목록 */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#CCC', marginBottom: '1rem' }}>
              준비 중입니다
            </div>
            <p style={{ fontFamily: 'var(--font-body)', color: '#AAA' }}>곧 첫 번째 글이 올라올 예정입니다.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            {posts.map(post => (
              <Link key={post.id} href={`/${post.slug}`} style={{ textDecoration: 'none' }}>
                <article className="post-card" style={{
                  background: '#fff', border: '1px solid #E8E4DC',
                  borderTop: `3px solid ${cfg.color}`,
                  borderRadius: '4px', padding: '2rem', height: '100%',
                }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.2rem',
                    fontWeight: 600, color: '#0D0D0D', lineHeight: 1.3,
                    letterSpacing: '-0.01em', marginBottom: '0.75rem',
                  }}>
                    {post.title}
                  </h2>
                  {post.summary && (
                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                      color: '#888', lineHeight: 1.7, marginBottom: '1.25rem',
                      display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {post.summary}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#BBB' }}>
                      {post.publishedDate}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: cfg.color }}>
                      읽기 →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
