import { getPosts } from '@/lib/notion'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: '교통 | SeekAlpha88',
  description: '교통 정책, 도시 교통 분석, 모빌리티 인사이트',
  keywords: ['교통', '모빌리티', '도시교통', '교통정책'],
  robots: { index: true, follow: true },
  openGraph: {
    title: '교통 | SeekAlpha88',
    description: '교통 정책, 도시 교통 분석, 모빌리티 인사이트',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'SeekAlpha88',
  },
  twitter: { card: 'summary', title: '교통 | SeekAlpha88', description: '교통 정책, 도시 교통 분석, 모빌리티 인사이트' },
}

export default async function TrafficPage() {
  const posts = await getPosts('교통')

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-2 text-xs font-semibold tracking-widest text-stone-400 uppercase">Traffic</div>
      <h1 className="text-3xl font-bold text-stone-900 mb-2">교통</h1>
      <p className="text-stone-500 mb-12">교통 정책, 도시 교통 분석, 모빌리티 인사이트를 제공합니다.</p>
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
