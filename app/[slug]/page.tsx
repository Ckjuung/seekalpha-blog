import { getPostBySlug, getPostContent, getAllPosts } from '@/lib/notion'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const CATEGORY_CONFIG: Record<string, { href: string; color: string; label: string }> = {
  '주식':    { href: '/stock',      color: '#1A6B3C', label: 'STOCK' },
  '부동산':  { href: '/realestate', color: '#8B4513', label: 'REAL ESTATE' },
  '삶의태도':{ href: '/life',       color: '#4A3882', label: 'LIFE' },
}

const KR = "'Noto Sans KR', sans-serif"
const MONO = "'JetBrains Mono', monospace"

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
    <div style={{ minHeight: '100vh', background: '#F7F5F0' }}>
      {/* 헤더 */}
      <div style={{ background: '#0D0D0D', padding: '4rem 0 3rem', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 2rem' }}>
          {/* 브레드크럼 */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            <Link href="/" style={{ fontFamily: MONO, fontSize: '0.7rem', color: '#555', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#333', fontSize: '0.7rem' }}>/</span>
            <Link href={cfg.href} style={{ fontFamily: MONO, fontSize: '0.7rem', color: cfg.color, textDecoration: 'none' }}>{cfg.label}</Link>
          </div>

          {/* 카테고리 뱃지 */}
          <div style={{
            display: 'inline-block',
            border: `1px solid ${cfg.color}60`,
            padding: '0.2rem 0.75rem', borderRadius: '2px', marginBottom: '1.5rem',
          }}>
            <span style={{ fontFamily: MONO, fontSize: '0.65rem', color: cfg.color, letterSpacing: '0.15em' }}>
              {cfg.label}
            </span>
          </div>

          {/* 제목 */}
          <h1 style={{
            fontFamily: KR,
            fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
            fontWeight: 700, color: '#F7F5F0',
            lineHeight: 1.3, letterSpacing: '-0.02em',
            marginBottom: '1.25rem', wordBreak: 'keep-all',
          }}>
            {post.title}
          </h1>

          {/* 요약 */}
          {post.summary && (
            <p style={{
              fontFamily: KR, fontSize: '1rem',
              color: '#888', lineHeight: 1.8,
              marginBottom: '2rem', fontWeight: 300,
              wordBreak: 'keep-all',
            }}>
              {post.summary}
            </p>
          )}

          {/* 메타 */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {post.publishedDate && (
              <span style={{ fontFamily: MONO, fontSize: '0.7rem', color: '#555' }}>
                📅 {post.publishedDate}
              </span>
            )}
            {post.keywords && (
              <span style={{ fontFamily: MONO, fontSize: '0.7rem', color: '#555' }}>
                🔑 {post.keywords}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '4rem 2rem' }}>
        <style>{`
          .post-body { font-family: 'Noto Sans KR', sans-serif; font-size: 1.05rem; line-height: 1.95; color: #1A1A1A; word-break: keep-all; }
          .post-body h1, .post-body h2, .post-body h3 { font-family: 'Noto Sans KR', sans-serif; font-weight: 700; letter-spacing: -0.02em; margin-top: 2.5em; margin-bottom: 0.75em; }
          .post-body h1 { font-size: 1.75rem; }
          .post-body h2 { font-size: 1.4rem; border-bottom: 1px solid #E8E4DC; padding-bottom: 0.5rem; }
          .post-body h3 { font-size: 1.15rem; }
          .post-body p { margin-bottom: 1.5em; }
          .post-body blockquote { border-left: 3px solid #C9A84C; padding: 1rem 1.5rem; margin: 2rem 0; font-weight: 300; color: #3E3E3E; background: rgba(201,168,76,0.06); border-radius: 0 4px 4px 0; }
          .post-body strong { font-weight: 700; }
          .post-body em { font-style: italic; }
          .post-body table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.9rem; }
          .post-body th { background: #0D0D0D; color: #F7F5F0; padding: 0.75rem 1rem; text-align: left; font-weight: 500; font-size: 0.8rem; letter-spacing: 0.03em; }
          .post-body td { padding: 0.75rem 1rem; border-bottom: 1px solid #EEEBE3; }
          .post-body tr:hover td { background: rgba(0,0,0,0.02); }
          .post-body code { font-family: 'JetBrains Mono', monospace; font-size: 0.875em; background: #EEEBE3; padding: 0.15em 0.4em; border-radius: 3px; }
          .post-body hr { border: none; border-top: 1px solid #E8E4DC; margin: 2.5rem 0; }
        `}</style>

        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(content)}</p>` }}
        />

        {/* 참고문헌 */}
        {post.references && (
          <div style={{
            marginTop: '4rem', padding: '1.5rem 2rem',
            background: '#fff', border: '1px solid #E8E4DC',
            borderRadius: '4px', borderLeft: `3px solid ${cfg.color}`,
          }}>
            <div style={{ fontFamily: MONO, fontSize: '0.65rem', color: '#AAA', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              REFERENCES
            </div>
            <p style={{ fontFamily: KR, fontSize: '0.875rem', color: '#666', lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
              {post.references}
            </p>
          </div>
        )}

        {/* 면책 */}
        <div style={{
          marginTop: '3rem', padding: '1rem 1.5rem',
          background: '#F7F5F0', border: '1px solid #E8E4DC', borderRadius: '4px',
        }}>
          <p style={{ fontFamily: KR, fontSize: '0.75rem', color: '#999', lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
            본 포스트는 정보 제공 목적으로 작성되었으며 투자 권유가 아닙니다. 투자 결정은 본인 책임 하에 이루어져야 합니다.
          </p>
        </div>

        {/* 뒤로가기 */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href={cfg.href} style={{
            fontFamily: KR, fontSize: '0.9rem', fontWeight: 500,
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
