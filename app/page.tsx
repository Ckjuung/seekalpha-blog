import Link from 'next/link'
import { getFeaturedPosts, getAllPosts, Post } from '@/lib/notion'

const CATEGORY_CONFIG: Record<string, { href: string; color: string; bg: string; label: string }> = {
  '주식':    { href: '/stock',      color: '#1A6B3C', bg: '#1A6B3C15', label: 'STOCK' },
  '부동산':  { href: '/realestate', color: '#8B4513', bg: '#8B451315', label: 'REAL ESTATE' },
  '경제일반':{ href: '/economy',    color: '#4A3882', bg: '#4A388215', label: 'ECONOMY' },
  '교통':    { href: '/traffic',    color: '#1A5C8B', bg: '#1A5C8B15', label: 'TRAFFIC' },
}

function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const cfg = CATEGORY_CONFIG[post.category] ?? { href: '/realestate', color: '#8B4513', bg: '#8B451315', label: post.category.toUpperCase() }
  return (
    <Link href={`/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="post-card" style={{
        background: featured ? cfg.bg : 'white',
        border: `1px solid ${cfg.color}22`,
        borderRadius: 12,
        padding: featured ? '2rem' : '1.5rem',
        marginBottom: '1rem',
        transition: 'box-shadow 0.2s',
      }}>
        <div style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: cfg.color,
          marginBottom: '0.5rem',
        }}>
          {cfg.label}
        </div>
        <h2 style={{
          fontSize: featured ? '1.25rem' : '1rem',
          fontWeight: 700,
          color: '#1a1a1a',
          marginBottom: '0.5rem',
          lineHeight: 1.4,
        }}>
          {post.title}
        </h2>
        {post.summary && (
          <p style={{
            fontSize: '0.875rem',
            color: '#666',
            lineHeight: 1.6,
            marginBottom: '0.75rem',
          }}>
            {post.summary}
          </p>
        )}
        <div style={{ fontSize: '0.75rem', color: '#999', display: 'flex', gap: '1rem' }}>
          {post.publishedDate && <span>{post.publishedDate}</span>}
          <span style={{ color: cfg.color }}>읽기 →</span>
        </div>
      </article>
    </Link>
  )
}

export const revalidate = 60

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedPosts(), getAllPosts()])
  const recent = all.slice(0, 6)

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1rem' }}>
      {/* Hero */}
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#999', marginBottom: '0.5rem' }}>
          주식 · 부동산 · 교통 · 경제일반
        </p>
        <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.7 }}>
          데이터와 논문에 기반한 인사이트
        </p>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', color: '#999', marginBottom: '1rem' }}>
            FEATURED
          </h2>
          {featured.map(post => (
            <PostCard key={post.slug} post={post} featured />
          ))}
        </section>
      )}

      {/* Recent */}
      <section>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', color: '#999', marginBottom: '1rem' }}>
          RECENT
        </h2>
        {recent.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>

      {/* Category links */}
      <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {Object.entries(CATEGORY_CONFIG).map(([, cfg]) => (
          <Link key={cfg.href} href={cfg.href} style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: cfg.color,
            textDecoration: 'none',
            padding: '0.4rem 0.8rem',
            border: `1px solid ${cfg.color}44`,
            borderRadius: 6,
          }}>
            {cfg.label} →
          </Link>
        ))}
      </div>
    </main>
  )
}
