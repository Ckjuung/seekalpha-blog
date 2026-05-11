import { getPostBySlug, getPostContent, getAllPosts } from '@/lib/notion'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

const CATEGORY_CONFIG: Record<string, { href: string; color: string; label: string }> = {
  '주식':    { href: '/stock',      color: '#1A6B3C', label: 'STOCK' },
  '부동산':  { href: '/realestate', color: '#8B4513', label: 'REAL ESTATE' },
  '경제일반':{ href: '/economy',    color: '#4A3882', label: 'ECONOMY' },
  '교통':    { href: '/traffic',    color: '#1A4F8B', label: 'TRAFFIC' },
}

const KR = "'Noto Sans KR', sans-serif"
const MONO = "'JetBrains Mono', monospace"

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts()
    return posts.map(p => ({ slug: p.slug }))
  } catch { return [] }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | SeekAlpha88`,
    description: post.summary,
    keywords: post.keywords,
    openGraph: { title: post.title, description: post.summary, type: 'article', publishedTime: post.publishedDate },
  }
}

// ─── 노션 표(HTML 태그) → 반응형 HTML 표 변환 ───
function convertNotionTables(md: string, color: string): string {
  // 노션 MCP가 내보내는 <table header-row="true"> 태그 처리
  return md.replace(
    /<table[^>]*>([\s\S]*?)<\/table>/gi,
    (_, inner) => {
      const rows: string[][] = []
      const rowMatches = inner.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)
      for (const rowMatch of rowMatches) {
        const cells: string[] = []
        const cellMatches = rowMatch[1].matchAll(/<td>([\s\S]*?)<\/td>/gi)
        for (const cell of cellMatches) {
          cells.push(cell[1].trim())
        }
        if (cells.length) rows.push(cells)
      }
      if (!rows.length) return ''

      const headers = rows[0]
      const bodyRows = rows.slice(1)

      const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`
      const tbody = `<tbody>${bodyRows.map(row =>
        `<tr>${row.map((cell, i) =>
          `<td data-label="${headers[i] ?? ''}">${cell}</td>`
        ).join('')}</tr>`
      ).join('')}</tbody>`

      return `<div class="table-wrap"><table>${thead}${tbody}</table></div>`
    }
  )
}

// ─── 마크다운 → HTML 변환 ───
function renderMarkdown(raw: string, color: string): string {
  // 1) 노션 표 태그 먼저 변환
  let html = convertNotionTables(raw, color)

  // 2) 일반 마크다운 표 (| col | col |) 변환
  html = html.replace(/((?:\|.+\|\n?)+)/g, (match) => {
    const lines = match.trim().split('\n')
    const hasSep = lines.some(l => /^\|[\s\-:|]+\|$/.test(l.trim()))
    if (!hasSep || lines.length < 3) return match
    const parse = (l: string) => l.split('|').slice(1, -1).map(c => c.trim())
    const headers = parse(lines[0])
    const bodyRows = lines.slice(2).map(parse)
    const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`
    const tbody = `<tbody>${bodyRows.map(r =>
      `<tr>${r.map((c, i) => `<td data-label="${headers[i] ?? ''}">${c}</td>`).join('')}</tr>`
    ).join('')}</tbody>`
    return `<div class="table-wrap"><table>${thead}${tbody}</table></div>`
  })

  // 3) 나머지 마크다운 변환
  return html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, `<code style="font-family:${MONO};font-size:0.875em;background:#EEEBE3;padding:0.15em 0.4em;border-radius:3px;">$1</code>`)
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^\d+\. (.+)$/gm, '<li style="margin-bottom:0.4em">$1</li>')
    .replace(/^[-*] (.+)$/gm, '<li style="margin-bottom:0.4em">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul style="padding-left:1.5rem;margin:1rem 0">${m}</ul>`)
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #EEEBE3;margin:2.5rem 0"/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" style="color:${color};text-decoration:underline;text-underline-offset:2px">$1</a>`)
    .replace(/\n\n/g, '</p><p style="margin-bottom:1.5em">')
    .replace(/^(?!<[a-z])(.+)$/gm, '<p style="margin-bottom:1.5em">$1</p>')
    .replace(/<p[^>]*>\s*<\/p>/g, '')
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const content = await getPostContent(post.id)
  const cfg = CATEGORY_CONFIG[post.category] ?? CATEGORY_CONFIG['부동산']
  const html = renderMarkdown(content, cfg.color)

  return (
    <div style={{ background: '#F7F5F0', minHeight: '100vh' }}>
      <style>{`
        .table-wrap {
          width: 100%;
          overflow-x: auto;
          margin: 2rem 0;
          border-radius: 6px;
          border: 1px solid #E8E4DC;
        }
        .table-wrap table {
          width: 100%;
          border-collapse: collapse;
          font-family: ${KR};
          font-size: 0.925rem;
        }
        .table-wrap thead { background: #0D0D0D; }
        .table-wrap th {
          color: #F7F5F0;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.8rem;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .table-wrap td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #EEEBE3;
          color: #1A1A1A;
          vertical-align: top;
        }
        .table-wrap tr:last-child td { border-bottom: none; }
        .table-wrap tr:hover td { background: rgba(0,0,0,0.02); }

        /* 모바일 카드형 테이블 */
        @media (max-width: 640px) {
          .table-wrap { border: none; background: transparent; box-shadow: none; }
          .table-wrap table { display: block; }
          .table-wrap thead { display: none; }
          .table-wrap tbody { display: flex; flex-direction: column; gap: 0.75rem; }
          .table-wrap tr {
            display: block;
            background: #fff;
            border: 1px solid #E8E4DC;
            border-radius: 8px;
            padding: 1rem;
            border-left: 3px solid ${cfg.color};
          }
          .table-wrap td {
            display: flex;
            flex-direction: column;
            padding: 0.35rem 0;
            border-bottom: 1px dashed #EEEBE3;
            font-size: 0.875rem;
          }
          .table-wrap td:last-child { border-bottom: none; }
          .table-wrap td[data-label]::before {
            content: attr(data-label);
            font-size: 0.68rem;
            font-weight: 700;
            color: ${cfg.color};
            margin-bottom: 0.15rem;
            letter-spacing: 0.02em;
          }
        }

        blockquote {
          border-left: 3px solid ${cfg.color};
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          color: #3E3E3E;
          background: ${cfg.color}0D;
          border-radius: 0 4px 4px 0;
        }
        h2 { font-size: 1.4rem; font-weight: 700; margin: 2.5rem 0 0.75rem; color: #0D0D0D; letter-spacing: -0.02em; }
        h3 { font-size: 1.15rem; font-weight: 700; margin: 2rem 0 0.5rem; color: #0D0D0D; }
      `}</style>

      {/* 포스트 헤더 */}
      <div style={{ background: '#0D0D0D', padding: '4rem 0 3rem', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            <Link href="/" style={{ fontFamily: MONO, fontSize: '0.7rem', color: '#555', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#333', fontSize: '0.7rem' }}>/</span>
            <Link href={cfg.href} style={{ fontFamily: MONO, fontSize: '0.7rem', color: cfg.color, textDecoration: 'none' }}>{cfg.label}</Link>
          </div>
          <div style={{ display: 'inline-block', border: `1px solid ${cfg.color}60`, padding: '0.2rem 0.75rem', borderRadius: '2px', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: MONO, fontSize: '0.65rem', color: cfg.color, letterSpacing: '0.1em' }}>{cfg.label}</span>
          </div>
          <h1 style={{ fontFamily: KR, fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: '#F7F5F0', lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
            {post.title}
          </h1>
          {post.summary && (
            <p style={{ fontFamily: KR, fontSize: '1rem', color: '#888', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 300 }}>
              {post.summary}
            </p>
          )}
          <div style={{ fontFamily: MONO, fontSize: '0.7rem', color: '#444' }}>
            {post.publishedDate}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div
          style={{ fontFamily: KR, fontSize: '1.05rem', lineHeight: 1.9, color: '#1A1A1A', wordBreak: 'keep-all' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {post.references && (
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #EEEBE3' }}>
            <div style={{ fontFamily: MONO, fontSize: '0.7rem', color: '#888', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>REFERENCES</div>
            <p style={{ fontFamily: KR, fontSize: '0.875rem', color: '#666', lineHeight: 1.7 }}>{post.references}</p>
          </div>
        )}

        <p style={{ fontFamily: KR, fontSize: '0.8rem', color: '#999', marginTop: '2rem', lineHeight: 1.7 }}>
          본 포스트는 정보 제공 목적으로 작성되었으며 투자 권유가 아닙니다. 투자 결정은 본인 책임 하에 이루어져야 합니다.
        </p>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href={cfg.href} style={{ fontFamily: KR, fontSize: '0.9rem', fontWeight: 500, color: cfg.color, textDecoration: 'none', border: `1px solid ${cfg.color}`, padding: '0.75rem 2rem', borderRadius: '4px', display: 'inline-block' }}>
            ← {post.category} 목록으로
          </Link>
        </div>
      </article>
    </div>
  )
}
