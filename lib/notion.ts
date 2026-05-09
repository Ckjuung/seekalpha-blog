import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

const DATABASE_ID = process.env.NOTION_DATABASE_ID!

export interface Post {
  id: string
  title: string
  slug: string
  summary: string
  category: string
  status: string
  publishedDate: string
  keywords: string
  references: string
  featured: boolean
}

// ISR 호환: cache: 'no-store' 제거, Next.js revalidate로 제어
export async function getPosts(category?: string): Promise<Post[]> {
  const filters: any[] = [
    {
      property: 'Status',
      select: { equals: 'Published' },
    },
  ]

  if (category) {
    filters.push({
      property: 'Category',
      select: { equals: category },
    })
  }

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: filters,
    },
    sorts: [
      {
        property: 'Published Date',
        direction: 'descending',
      },
    ],
  })

  return response.results.map((page: any) => {
    const props = page.properties
    return {
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text ?? '',
      slug: props.Slug?.rich_text?.[0]?.plain_text ?? '',
      summary: props.Summary?.rich_text?.[0]?.plain_text ?? '',
      category: props.Category?.select?.name ?? '',
      status: props.Status?.select?.name ?? '',
      publishedDate: props['Published Date']?.date?.start ?? '',
      keywords: props.Keywords?.rich_text?.[0]?.plain_text ?? '',
      references: props.References?.rich_text?.[0]?.plain_text ?? '',
      featured: props.Featured?.checkbox ?? false,
    }
  })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: 'Slug',
          rich_text: { equals: slug },
        },
        {
          property: 'Status',
          select: { equals: 'Published' },
        },
      ],
    },
  })

  if (response.results.length === 0) return null

  const page: any = response.results[0]
  const props = page.properties

  return {
    id: page.id,
    title: props.Title?.title?.[0]?.plain_text ?? '',
    slug: props.Slug?.rich_text?.[0]?.plain_text ?? '',
    summary: props.Summary?.rich_text?.[0]?.plain_text ?? '',
    category: props.Category?.select?.name ?? '',
    status: props.Status?.select?.name ?? '',
    publishedDate: props['Published Date']?.date?.start ?? '',
    keywords: props.Keywords?.rich_text?.[0]?.plain_text ?? '',
    references: props.References?.rich_text?.[0]?.plain_text ?? '',
    featured: props.Featured?.checkbox ?? false,
  }
}

export async function getPostContent(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId)
  const mdString = n2m.toMarkdownString(mdBlocks)
  return mdString.parent
}

export async function getAllSlugs(): Promise<string[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Status',
      select: { equals: 'Published' },
    },
  })

  return response.results
    .map((page: any) => page.properties.Slug?.rich_text?.[0]?.plain_text ?? '')
    .filter(Boolean)
}
