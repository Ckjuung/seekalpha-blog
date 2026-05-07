import { getPostBySlug, getPostContent, getAllPosts } from '@/lib/notion'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const CATEGORY_CONFIG: Record<string, { href: string; color: string; label: string }> = {
  '주식':    { href: '/stock',      color: '#1A6B3C', label: 'STOCK' },
  '부동산':  { href: '/realestate', color: '#8B4513', label: 'REAL ESTATE' },
  '삶의태도':{ href: '/life',       color: '#4A3882', label: 'LIFE' },
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts()
    return posts.map(p => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedDate,
    },
  }
}

// 마크다운을 간단한 HTML로 변환
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #E8E4DC;margin:2rem 0">')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:inherit;text-decoration:underline;text-underline-offset:3px">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|b|e|c|a|p|u|o|l|t|s|h|i|d])/gm, '')
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  let content = ''
  try {
    content = await getPostContent(post.id)
  } catch (e) {}

  const cfg = CATEGORY_CONFIG[post.category] ?? { href: '/', color: '#888', label: post.category }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)' }}>
      {/* 헤더 영역 */}
      <div style={{ background: '#0D0D0D', padding: '4rem 0 3rem', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          {/* 브레드크럼 */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#555', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ color: '#333', fontSize: '0.7rem' }}>/</span>
            <Link href={cfg.href} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: cfg.color, textDecoration: 'none' }}>
              {cfg.label}
            </Link>
          </div>

          {/* 카테고리 뱃지 */}
          <div style={{
            display: 'inline-block', border: `1px solid ${cfg.color}60`,
            padding: '0.2rem 0.75rem', borderRadius: '2px', marginBottom: '1.5rem',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: cfg.color, letterSpacing: '0.15em' }}>
              {cfg.label}
            </span>
          </div>

          {/* 제목 */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 700, color: '#F7F5F0', lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: '1.5rem',
          }}>
            {post.title}
          </h1>

          {/* 요약 */}
          {post.summary && (
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1.1rem',
              color: '#888', lineHeight: 1.7, marginBottom: '2rem',
              fontStyle: 'italic',
            }}>
              {post.summary}
            </p>
          )}

          {/* 메타 */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {post.publishedDate && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#555' }}>
                📅 {post.publishedDate}
              </span>
            )}
            {post.keywords && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#555' }}>
                🔑 {post.keywords}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(content)}</p>` }}
        />

        {/* 참고문헌 */}
        {post.references && (
          <div style={{
            marginTop: '4rem', padding: '1.5rem 2rem',
            background: '#fff', border: '1px solid #E8E4DC', borderRadius: '4px',
            borderLeft: `3px solid ${cfg.color}`,
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#AAA', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              REFERENCES
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#666', lineHeight: 1.7, margin: 0 }}>
              {post.references}
            </p>
          </div>
        )}

        {/* 면책 */}
        <div style={{
          marginTop: '3rem', padding: '1rem 1.5rem',
          background: '#F7F5F0', border: '1px solid #E8E4DC', borderRadius: '4px',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#999', lineHeight: 1.6, margin: 0 }}>
            본 포스트는 정보 제공 목적으로 작성되었으며 투자 권유가 아닙니다. 투자 결정은 본인 책임 하에 이루어져야 합니다.
          </p>
        </div>

        {/* 뒤로가기 */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href={cfg.href} style={{
            fontFamily: 'var(--font-display)', fontSize: '0.95rem',
            color: cfg.color, textDecoration: 'none',
            border: `1px solid ${cfg.color}`,
            padding: '0.75rem 2rem', borderRadius: '4px',
            display: 'inline-block', transition: 'all 0.15s ease',
          }}>
            ← {post.category} 목록으로
          </Link>
        </div>
      </article>
    </div>
  )
}
