'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'

interface RamenFormProps {
  ramenId?: string
}

interface Category {
  id: string
  name: string
  order: number
}

export default function RamenForm({ ramenId }: RamenFormProps) {
  const router = useRouter()
  const isEditMode = !!ramenId

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // 동적 카테고리
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [googleMapsUrl, setGoogleMapsUrl] = useState('')
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState<number | ''>('')
  const [review, setReview] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [visitDate, setVisitDate] = useState('')
  const [notes, setNotes] = useState('')
  const [coverImage, setCoverImage] = useState('')
  
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // 카테고리 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }
    
    fetchCategories()
  }, [])

  // 수정 모드일 때 데이터 불러오기
  useEffect(() => {
    if (isEditMode && ramenId) {
      setFetching(true)
      fetch(`/api/ramens/${ramenId}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title)
          setLocation(data.location)
          setGoogleMapsUrl(data.googleMapsUrl || '')
          setCategory(data.category || '')
          setRating(data.rating || '')
          setReview(data.review || '')
          setPrice(data.price)
          setVisitDate(data.visitDate ? data.visitDate.split('T')[0] : '')
          setNotes(data.notes || '')
          setCoverImage(data.coverImage || '')
          setTags(data.tags.map((rt: any) => rt.tag.name))
        })
        .catch((error) => {
          console.error('Failed to fetch ramen:', error)
          alert('라멘 정보를 불러오는데 실패했습니다.')
        })
        .finally(() => setFetching(false))
    }
  }, [isEditMode, ramenId])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // 이미지 압축
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }
      const compressedFile = await imageCompression(file, options)

      // Vercel Blob에 업로드
      const response = await fetch(`/api/upload?filename=${compressedFile.name}`, {
        method: 'POST',
        body: compressedFile,
      })

      const data = await response.json()
      if (data.url) {
        setCoverImage(data.url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      alert('가게 이름을 입력해주세요.')
      return
    }
    if (!location.trim()) {
      alert('주소를 입력해주세요.')
      return
    }
    if (!price) {
      alert('가격을 입력해주세요.')
      return
    }
    if (!visitDate) {
      alert('방문일을 선택해주세요.')
      return
    }

    setLoading(true)

    const payload = {
      title: title.trim(),
      location: location.trim(),
      googleMapsUrl: googleMapsUrl.trim() || null,
      category: category || null,
      rating: rating ? Number(rating) : null,
      review: review.trim() || null,
      price: Number(price),
      visitDate: new Date(visitDate).toISOString(),
      notes: notes.trim() || null,
      coverImage: coverImage || null,
      tags,
    }

    try {
      const url = isEditMode ? `/api/ramens/${ramenId}` : '/api/ramens'
      const method = isEditMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert(isEditMode ? '수정되었습니다.' : '저장되었습니다.')
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || '저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('Submit failed:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching || loadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white space-y-6">
      {/* 가게 이름 */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          가게 이름 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="이치란 난바점"
          required
        />
      </div>

      {/* 주소 */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          주소 <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="오사카부 오사카시 주오구 난바 3-4-11"
          required
        />
      </div>

      {/* 구글맵 링크 */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          구글맵 링크 (선택)
        </label>
        <input
          type="url"
          value={googleMapsUrl}
          onChange={(e) => setGoogleMapsUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="https://maps.app.goo.gl/xxxxx"
        />
        <p className="text-xs text-gray-500 mt-2">
          💡 <strong>복사 방법:</strong> 구글맵에서 가게 찾기 → 공유 → 링크 복사 → 여기 붙여넣기
        </p>
        {googleMapsUrl && (
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
          >
            링크 확인하기 →
          </a>
        )}
      </div>

      {/* 카테고리 */}
      <div>
        <label className="block text-sm font-semibold mb-2">카테고리</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">선택 안함</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 평점 */}
      <div>
        <label className="block text-sm font-semibold mb-2">평점 (0-5)</label>
        <input
          type="number"
          step="0.5"
          min="0"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value ? Number(e.target.value) : '')}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="4.5"
        />
      </div>

      {/* 가격 */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          가격 (엔) <span className="text-red-600">*</span>
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="1280"
          required
        />
      </div>

      {/* 방문일 */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          방문일 <span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          required
        />
      </div>

      {/* 맛 평가 */}
      <div>
        <label className="block text-sm font-semibold mb-2">맛 평가</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="국물, 면, 토핑 등 맛에 대한 평가를 자유롭게 작성하세요..."
        />
      </div>

      {/* 추가 메모 */}
      <div>
        <label className="block text-sm font-semibold mb-2">추가 메모</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="재방문 의사, 추천 메뉴 등..."
        />
      </div>

      {/* 커버 이미지 */}
      <div>
        <label className="block text-sm font-semibold mb-2">커버 이미지</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
        />
        {uploading && <p className="text-sm text-gray-500 mt-2">업로드 중...</p>}
        {coverImage && (
          <div className="mt-4">
            <img src={coverImage} alt="Preview" className="w-full max-w-md h-auto" />
          </div>
        )}
      </div>

      {/* 태그 */}
      <div>
        <label className="block text-sm font-semibold mb-2">태그</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="태그 입력 후 Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-gray-600 text-white px-4 py-2 hover:bg-gray-700 transition"
          >
            추가
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 text-sm border border-gray-200 flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white py-3 font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
        >
          {loading ? '저장 중...' : isEditMode ? '수정하기' : '저장하기'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 bg-gray-200 text-gray-800 py-3 font-semibold hover:bg-gray-300 transition"
        >
          취소
        </button>
      </div>
    </form>
  )
}
