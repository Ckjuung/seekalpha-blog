import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '주식 | SeekAlpha88',
  description: '데이터와 논문에 기반한 주식 시장 분석, 종목 리뷰, 투자 전략',
}

export default function StockPage() {
  return <CategoryPage category="stock" />
}
