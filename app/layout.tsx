import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    template: '%s | SeekAlpha88',
    default: 'SeekAlpha88 — 주식·부동산·삶의태도 인사이트',
  },
  description: '데이터와 논문에 기반한 투자 인사이트. 주식, 부동산, 그리고 삶의 태도를 깊이 있게 탐구합니다.',
  keywords: ['주식', '부동산', '투자', '청약', '재건축', '삶의태도'],
  openGraph: {
    siteName: 'SeekAlpha88',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
