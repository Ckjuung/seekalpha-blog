import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '부동산 | SeekAlpha88',
  description: '청약 분석, 재개발·재건축 투자, 세금 전략 등 부동산 인사이트',
}

export default function RealEstatePage() {
  return <CategoryPage category="realestate" />
}
