import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? ''

export type Post = {
  id: string
  title: string
  slug: string
  summary: string
  category: '주식' | '부동산' | '삶의태도'
  status: 'Draft' | 'Review' | 'Published' | 'Archived'
  keywords: string
  references: string
  publishedDate: string
  featured: boolean
  url: string
}

export async function getAllPosts(category?: string): Promise<Post[]> {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) return []
  try {
    const filters: any[] = [
      { property: 'Status', select: { equals: 'Published' } },
    ]
    if (category) {
      filters.push({ property: 'Category', select: { equals: category } })
    }
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: filters.length === 1 ? filters[0] : { and: filters },
      sorts: [{ property: 'Published Date', direction: 'descending' }],
    })
    return response.results.map((page: any) => mapPageToPost(page))
  } catch (e) {
    console.error('getAllPosts error:', e)
    return []
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) return []
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          { property: 'Status', select: { equals: 'Published' } },
          { property: 'Featured', checkbox: { equals: true } },
        ],
      },
      sorts: [{ property: 'Published Date', direction: 'descending' }],
      page_size: 6,
    })
    return response.results.map((page: any) => mapPageToPost(page))
  } catch (e) {
    console.error('getFeaturedPosts error:', e)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!process.env.NOTION_TOKEN || !DATABASE_ID) return null
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: { property: 'Slug', rich_text: { equals: slug } },
    })
    if (response.results.length === 0) return null
    return mapPageToPost(response.results[0] as any)
  } catch (e) {
    console.error('getPostBySlug error:', e)
    return null
  }
}

export async function getPostContent(pageId: string): Promise<string> {
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId)
    const mdString = n2m.toMarkdownString(mdBlocks)
    return mdString.parent
  } catch (e) {
    console.error('getPostContent error:', e)
    return ''
  }
}

function mapPageToPost(page: any): Post {
  const props = page.properties
  return {
    id: page.id,
    title: props.Title?.title?.[0]?.plain_text ?? '제목 없음',
    slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
    summary: props.Summary?.rich_text?.[0]?.plain_text ?? '',
    category: props.Category?.select?.name ?? '주식',
    status: props.Status?.select?.name ?? 'Draft',
    keywords: props.Keywords?.rich_text?.[0]?.plain_text ?? '',
    references: props.References?.rich_text?.[0]?.plain_text ?? '',
    publishedDate: props['Published Date']?.date?.start ?? '',
    featured: props.Featured?.checkbox ?? false,
    url: page.url,
  }
}
