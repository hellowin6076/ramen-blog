import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import DisqusComments from '@/components/DisqusComments'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getRamen(slug: string) {
  try {
    const ramen = await prisma.ramen.findUnique({
      where: { slug },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
    return ramen
  } catch (error) {
    console.error('Failed to fetch ramen:', error)
    return null
  }
}

export default async function RamenDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const ramen = await getRamen(slug)

  if (!ramen) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const pageUrl = `${baseUrl}/ramen/${ramen.slug}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Title and Rating */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold flex-1">
              {ramen.title}
            </h1>
            {ramen.rating && (
              <div className="flex items-center gap-2 text-xl font-bold">
                <span className="text-yellow-500">★</span>
                <span>{ramen.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span>📅 {new Date(ramen.visitDate).toLocaleDateString('ko-KR')}</span>
            <span>💴 ¥{ramen.price}</span>
            {ramen.category && (
              <span className="bg-gray-100 px-3 py-1 font-medium">
                {ramen.category}
              </span>
            )}
          </div>

          {/* Location with Google Maps */}
          <div className="flex items-start gap-2 text-gray-700 bg-white p-4 border border-gray-200">
            <span className="text-xl">📍</span>
            <div className="flex-1">
              <p className="mb-2">{ramen.location}</p>
              {ramen.googleMapsUrl && (
                <a 
                  href={ramen.googleMapsUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm font-medium inline-flex items-center gap-1"
                >
                  구글맵에서 보기 →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {ramen.coverImage && (
          <div className="relative w-full h-64 sm:h-96 mb-8 bg-gray-100">
            <Image
              src={ramen.coverImage}
              alt={ramen.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Review */}
        {ramen.review && (
          <div className="bg-white p-6 sm:p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">맛 평가</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {ramen.review}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {ramen.notes && (
          <div className="bg-white p-6 sm:p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">추가 메모</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {ramen.notes}
              </p>
            </div>
          </div>
        )}

        {/* Tags */}
        {ramen.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {ramen.tags.map((rt) => (
              <span
                key={rt.tag.name}
                className="bg-gray-100 px-3 py-1.5 text-sm border border-gray-200"
              >
                #{rt.tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Disqus Comments */}
        <div className="bg-white p-6 sm:p-8 border border-gray-200">
          <DisqusComments
            identifier={ramen.id}
            title={ramen.title}
            url={pageUrl}
          />
        </div>
      </article>
    </div>
  )
}
