import Header from '@/components/Header'
import RamenCard from '@/components/RamenCard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getRamens() {
  try {
    const ramens = await prisma.ramen.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return ramens
  } catch (error) {
    console.error('Failed to fetch ramens:', error)
    return []
  }
}

export default async function BlogPage() {
  const ramens = await getRamens()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 tracking-wide">
          ALL RAMENS
        </h1>

        {ramens.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">아직 라멘 기록이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ramens.map((ramen) => (
              <RamenCard key={ramen.id} ramen={ramen} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
