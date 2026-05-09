import { getPosts } from '@/lib/notion'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: '삶의태도 | SeekAlpha88',
  description: '독서, 철학, 커리어, 일상의 통찰',
  keywords: ['삶의태도', '독서', '철학', '커리어'],
  robots: { index: true, follow: true },
  openGraph: {
    title: '삶의태도 | SeekAlpha88',
    description: '독서, 철학, 커리어, 일상의 통찰',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'SeekAlpha88',
  },
  twitter: { card: 'summary', title: '삶의태도 | SeekAlpha88', description: '독서, 철학, 커리어, 일상의 통찰' },
}

export default async function LifePage() {
  const posts = await getPosts('삶의태도')

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-2 text-xs font-semibold tracking-widest text-stone-400 uppercase">Life</div>
      <h1 className="text-3xl font-bold text-stone-900 mb-2">삶의태도</h1>
      <p className="text-stone-500 mb-12">독서, 철학, 커리어, 일상의 통찰을 나눕니다.</p>
      <p className="text-sm text-stone-400 mb-8">총 {posts.length}개의 글</p>
      <div className="divide-y divide-stone-100">
        {posts.map((post) => (
          <article key={post.slug} className="py-8">
            <Link href={`/${post.slug}`} className="group">
              <h2 className="text-xl font-semibold text-stone-900 group-hover:text-stone-600 transition-colors mb-2">
                {post.title}
              </h2>
              {post.summary && (
                <p className="text-stone-500 text-sm mb-3 leading-relaxed">{post.summary}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-stone-400">
                {post.publishedDate && <span>{post.publishedDate}</span>}
                <span className="text-stone-300">읽기 →</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
