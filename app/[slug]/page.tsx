import { getPostBySlug, getPostContent, getAllSlugs } from '@/lib/notion'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'

// ISR: 60초마다 자동으로 최신 글 확인
export const revalidate = 60

// 빌드 타임에 알려진 slug만 미리 생성, 나머지는 런타임에 생성
export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}

  const categoryPath = getCategoryPath(post.category)

  return {
    title: `${post.title} | SeekAlpha88`,
    description: post.summary,
    keywords: post.keywords ? post.keywords.split(',').map((k) => k.trim()) : [],
    robots: { index: true, follow: true },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedDate,
      locale: 'ko_KR',
      siteName: 'SeekAlpha88',
    },
    twitter: { card: 'summary', title: post.title, description: post.summary },
  }
}

function getCategoryPath(category: string): string {
  const map: Record<string, string> = {
    '주식': 'stock',
    '부동산': 'realestate',
    '삶의태도': 'life',
    '교통': 'life',
  }
  return map[category] ?? 'realestate'
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    '주식': 'STOCK',
    '부동산': 'REAL ESTATE',
    '삶의태도': 'LIFE',
    '교통': 'LIFE',
  }
  return map[category] ?? category.toUpperCase()
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const content = await getPostContent(post.id)
  const categoryPath = getCategoryPath(post.category)
  const categoryLabel = getCategoryLabel(post.category)

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-400 mb-8">
        <Link href="/" className="hover:text-stone-600">Home</Link>
        <span>/</span>
        <Link href={`/${categoryPath}`} className="hover:text-stone-600 uppercase">{categoryLabel}</Link>
      </div>

      {/* Header */}
      <div className="mb-2 text-xs font-semibold tracking-widest text-stone-400 uppercase">{categoryLabel}</div>
      <h1 className="text-3xl font-bold text-stone-900 mb-3 leading-snug">{post.title}</h1>
      {post.summary && <p className="text-stone-500 mb-4 leading-relaxed">{post.summary}</p>}

      <div className="flex flex-wrap gap-3 text-xs text-stone-400 mb-10">
        {post.publishedDate && <span>📅 {post.publishedDate}</span>}
        {post.keywords && <span>🔑 {post.keywords}</span>}
      </div>

      <hr className="border-stone-100 mb-10" />

      {/* Content */}
      <article className="prose prose-stone prose-sm max-w-none
        prose-headings:font-bold prose-headings:text-stone-900
        prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-stone-700 prose-p:leading-relaxed
        prose-strong:text-stone-900
        prose-blockquote:border-stone-300 prose-blockquote:text-stone-500
        prose-table:text-sm prose-th:bg-stone-50
        prose-a:text-stone-700 prose-a:underline
        prose-hr:border-stone-100">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>

      {/* References */}
      {post.references && (
        <div className="mt-12 pt-6 border-t border-stone-100">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">References</p>
          <p className="text-xs text-stone-400">{post.references}</p>
        </div>
      )}

      <div className="mt-6">
        <p className="text-xs text-stone-400">본 포스트는 정보 제공 목적으로 작성되었으며 투자 권유가 아닙니다. 투자 결정은 본인 책임 하에 이루어져야 합니다.</p>
      </div>

      {/* Back link */}
      <div className="mt-10">
        <Link href={`/${categoryPath}`} className="text-sm text-stone-400 hover:text-stone-700">
          ← {categoryLabel === 'REAL ESTATE' ? '부동산' : categoryLabel === 'STOCK' ? '주식' : '삶의태도'} 목록으로
        </Link>
      </div>
    </main>
  )
}
