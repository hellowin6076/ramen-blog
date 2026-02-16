import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getRamens() {
  try {
    const ramens = await prisma.ramen.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return ramens
  } catch (error) {
    console.error('Failed to fetch ramens:', error)
    return []
  }
}

async function deleteRamen(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  try {
    await prisma.ramen.delete({ where: { id } })
  } catch (error) {
    console.error('Failed to delete ramen:', error)
  }
}

export default async function AdminPage() {
  const ramens = await getRamens()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">관리자 대시보드</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-sm hover:text-gray-600">
              블로그 보기
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="text-sm text-red-600 hover:text-red-800">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            href="/admin/ramen/new"
            className="bg-black text-white px-6 py-2.5 hover:bg-gray-800 transition font-semibold"
          >
            + 새 라멘 추가
          </Link>
          <Link
            href="/admin/categories"
            className="bg-gray-600 text-white px-6 py-2.5 hover:bg-gray-700 transition font-semibold"
          >
            카테고리 관리
          </Link>
        </div>

        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">라멘 목록 ({ramens.length})</h2>
          </div>

          {ramens.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              아직 라멘이 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {ramens.map((ramen) => (
                <div key={ramen.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{ramen.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{ramen.location}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(ramen.visitDate).toLocaleDateString('ko-KR')} · ¥{ramen.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/ramen/${ramen.id}`}
                      className="bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition"
                    >
                      수정
                    </Link>
                    <form action={deleteRamen}>
                      <input type="hidden" name="id" value={ramen.id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!confirm('정말 삭제하시겠습니까?')) {
                            e.preventDefault()
                          }
                        }}
                        className="bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700 transition"
                      >
                        삭제
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
