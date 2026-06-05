import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'SeekAlpha88 — 주식·부동산·경제일반 인사이트',
  description: '데이터와 논문에 기반한 투자 인사이트. 주식, 부동산, 그리고 삶의 태도를 깊이 있게 탐구합니다.',
  keywords: ['주식', '부동산', '투자', '청약', '재건축', '경제일반'],
  robots: { index: true, follow: true },
  verification: {
    google: '2QUcjp3HkPCg_xVmUvNup1MqYefo_fg1qBZvxooAaGI',
  },
  openGraph: {
    title: 'SeekAlpha88 — 주식·부동산·경제일반 인사이트',
    description: '데이터와 논문에 기반한 투자 인사이트. 주식, 부동산, 그리고 삶의 태도를 깊이 있게 탐구합니다.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'SeekAlpha88',
  },
  twitter: {
    card: 'summary',
    title: 'SeekAlpha88 — 주식·부동산·경제일반 인사이트',
    description: '데이터와 논문에 기반한 투자 인사이트. 주식, 부동산, 그리고 삶의 태도를 깊이 있게 탐구합니다.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-stone-900 tracking-tight text-lg">
              SeekAlpha88
              <span className="text-xs text-stone-400 font-normal ml-1">데이터 기반 인사이트</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/stock" className="text-stone-500 hover:text-stone-900 transition-colors">
                주식<span className="text-[10px] text-stone-300 ml-0.5 tracking-widest">STOCK</span>
              </Link>
              <Link href="/realestate" className="text-stone-500 hover:text-stone-900 transition-colors">
                부동산<span className="text-[10px] text-stone-300 ml-0.5 tracking-widest">REAL ESTATE</span>
              </Link>
              <Link href="/traffic" className="text-stone-500 hover:text-stone-900 transition-colors">
                교통<span className="text-[10px] text-stone-300 ml-0.5 tracking-widest">TRAFFIC</span>
              </Link>
              <Link href="/economy" className="text-stone-500 hover:text-stone-900 transition-colors">
                경제일반<span className="text-[10px] text-stone-300 ml-0.5 tracking-widest">ECONOMY</span>
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-stone-200 mt-24 py-12 bg-stone-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">주식</div>
                <Link href="/stock" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">전체 보기 →</Link>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">부동산</div>
                <Link href="/realestate" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">전체 보기 →</Link>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">교통</div>
                <Link href="/traffic" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">전체 보기 →</Link>
              </div>
              <div>
                <div className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">경제일반</div>
                <Link href="/economy" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">전체 보기 →</Link>
              </div>
            </div>
            <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-2">
              <div className="font-bold text-stone-900">SeekAlpha88</div>
              <div className="text-xs text-stone-400 text-center">
                데이터와 논문에 기반한 투자 인사이트. 주식, 부동산, 그리고 더 나은 삶의 태도를 탐구합니다.
              </div>
              <div className="text-xs text-stone-400">
                © 2026 SeekAlpha88. All rights reserved.<br/>
                <span>투자는 본인 책임입니다. 본 블로그는 투자 권유가 아닙니다.</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
