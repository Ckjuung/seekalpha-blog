import { getAllPosts } from '@/lib/notion'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seekalphahahah86.vercel.app'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/stock`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/realestate`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/life`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  let postPages: any[] = []
  try {
    const posts = await getAllPosts()
    postPages = posts.map(post => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch (e) {}

  return [...staticPages, ...postPages]
}
