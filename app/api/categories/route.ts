import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 모든 카테고리 조회
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        order: 'asc',
      },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST - 새 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    // 중복 체크
    const existing = await prisma.category.findUnique({
      where: { name: name.trim() },
    })

    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
    }

    // 다음 order 값 계산
    const lastCategory = await prisma.category.findFirst({
      orderBy: { order: 'desc' },
    })
    const nextOrder = lastCategory ? lastCategory.order + 1 : 1

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        order: nextOrder,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
