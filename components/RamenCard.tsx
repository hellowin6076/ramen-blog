import Link from 'next/link'
import Image from 'next/image'

interface RamenCardProps {
  ramen: {
    id: string
    title: string
    slug: string
    coverImage: string | null
    category: string | null
    rating: number | null
    price: number
    visitDate: Date
    location: string
    tags: { tag: { name: string } }[]
  }
}

export default function RamenCard({ ramen }: RamenCardProps) {
  return (
    <Link href={`/ramen/${ramen.slug}`}>
      <article className="bg-white hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
        {ramen.coverImage && (
          <div className="relative w-full h-48 sm:h-64 bg-gray-100">
            <Image
              src={ramen.coverImage}
              alt={ramen.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="text-xl sm:text-2xl font-bold flex-1">{ramen.title}</h2>
            {ramen.rating && (
              <div className="flex items-center gap-1 text-sm font-semibold">
                <span className="text-yellow-500">★</span>
                <span>{ramen.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-start gap-2">
              <span>📍</span>
              <span className="flex-1">{ramen.location}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>💴 ¥{ramen.price}</span>
              <span>📅 {new Date(ramen.visitDate).toLocaleDateString('ko-KR')}</span>
            </div>
            {ramen.category && (
              <div className="inline-block bg-gray-100 px-3 py-1 text-xs font-medium">
                {ramen.category}
              </div>
            )}
          </div>

          {ramen.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ramen.tags.slice(0, 3).map((rt) => (
                <span
                  key={rt.tag.name}
                  className="text-xs bg-gray-50 px-2 py-1 border border-gray-200"
                >
                  #{rt.tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
