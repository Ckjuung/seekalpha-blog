import { getPosts } from '@/lib/notion'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: '경제일반 | SeekAlpha88',
  description: '민간투자사업, 경제 정책, 재정 구조 등 경제 전반의 인사이트',
  keywords: ['경제일반', '민간투자사업', '경제정책', '재정'],
  robots: { index: true, follow: true },
  openGraph: {
    title: '경제일반 | SeekAlpha88',
    description: '민간투자사업, 경제 정책, 재정 구조 등 경제 전반의 인사이트',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'SeekAlpha88',
  },
  twitter: { card: 'summary', title: '경제일반 | SeekAlpha88', description: '민간투자사업, 경제 정책, 재정 구조 등 경제 전반의 인사이트' },
}

export default async function EconomyPage() {
  const posts = await getPosts('경제일반')
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-2 text-xs font-semibold tracking-widest text-stone-400 uppercase">Economy</div>
      <h1 className="text-3xl font-bold text-stone-900 mb-2">경제일반</h1>
      <p className="text-stone-500 mb-12">민간투자사업, 경제 정책, 재정 구조 등 경제 전반의 인사이트를 나눕니다.</p>
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
