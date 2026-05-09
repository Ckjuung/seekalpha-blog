import { getPosts } from '@/lib/notion'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60 // 60초마다 자동 갱신

export const metadata: Metadata = {
  title: '부동산 | SeekAlpha88',
  description: '청약 분석, 재개발·재건축 투자, 세금 전략 등 부동산 인사이트',
  keywords: ['주식', '부동산', '투자', '청약', '재건축', '삶의태도'],
  robots: { index: true, follow: true },
  openGraph: {
    title: '부동산 | SeekAlpha88',
    description: '청약 분석, 재개발·재건축 투자, 세금 전략 등 부동산 인사이트',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'SeekAlpha88',
  },
  twitter: { card: 'summary', title: '부동산 | SeekAlpha88', description: '청약 분석, 재개발·재건축 투자, 세금 전략 등 부동산 인사이트' },
}

export default async function RealEstatePage() {
  const posts = await getPosts('부동산')

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-2 text-xs font-semibold tracking-widest text-stone-400 uppercase">Real Estate</div>
      <h1 className="text-3xl font-bold text-stone-900 mb-2">부동산</h1>
      <p className="text-stone-500 mb-12">청약 분석, 재개발·재건축 투자, 세금 전략 등 부동산 인사이트를 제공합니다.</p>
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
