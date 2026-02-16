'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  order: number
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return

    setAdding(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      })

      if (res.ok) {
        setNewCategoryName('')
        fetchCategories()
      } else {
        alert('카테고리 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to add category:', error)
      alert('카테고리 추가 중 오류가 발생했습니다.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchCategories()
      } else {
        alert('카테고리 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('카테고리 삭제 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">카테고리 관리</h1>
          <button
            onClick={() => router.back()}
            className="text-sm hover:text-gray-600"
          >
            ← 돌아가기
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* 새 카테고리 추가 */}
        <div className="bg-white p-6 border border-gray-200 mb-6">
          <h2 className="text-lg font-bold mb-4">새 카테고리 추가</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAdd()
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="카테고리 이름 (예: 돈코츠, 쇼유, 미소)"
            />
            <button
              onClick={handleAdd}
              disabled={adding}
              className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {adding ? '추가 중...' : '추가'}
            </button>
          </div>
        </div>

        {/* 카테고리 목록 */}
        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold">카테고리 목록 ({categories.length})</h2>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              아직 카테고리가 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium">{category.name}</span>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-600 text-white px-4 py-1.5 text-sm hover:bg-red-700 transition"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
