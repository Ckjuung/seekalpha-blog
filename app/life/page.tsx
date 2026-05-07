import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '삶의태도 | SeekAlpha88',
  description: '독서, 철학, 커리어, 투자 마인드셋 등 더 나은 삶을 위한 태도',
}

export default function LifePage() {
  return <CategoryPage category="life" />
}
