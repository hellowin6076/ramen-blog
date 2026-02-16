import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const ramens = await prisma.ramen.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const ramenUrls = ramens.map((ramen) => ({
    url: `${baseUrl}/ramen/${ramen.slug}`,
    lastModified: ramen.updatedAt,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    ...ramenUrls,
  ]
}
