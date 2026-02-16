import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// GET - 모든 라멘 조회
export async function GET() {
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
    return NextResponse.json(ramens)
  } catch (error) {
    console.error('Failed to fetch ramens:', error)
    return NextResponse.json({ error: 'Failed to fetch ramens' }, { status: 500 })
  }
}

// POST - 새 라멘 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      location,
      googleMapsUrl,
      category,
      rating,
      review,
      price,
      visitDate,
      notes,
      coverImage,
      tags,
    } = body

    // slug 생성
    let slug = slugify(title)
    let counter = 1
    while (await prisma.ramen.findUnique({ where: { slug } })) {
      slug = `${slugify(title)}-${counter}`
      counter++
    }

    // 라멘 생성
    const ramen = await prisma.ramen.create({
      data: {
        title,
        slug,
        location,
        googleMapsUrl,
        category,
        rating,
        review,
        price: parseInt(price),
        visitDate: new Date(visitDate),
        notes,
        coverImage,
      },
    })

    // 태그 처리
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let tag = await prisma.ramenTagMaster.findUnique({
          where: { name: tagName },
        })

        if (!tag) {
          tag = await prisma.ramenTagMaster.create({
            data: { name: tagName },
          })
        }

        await prisma.ramenTag.create({
          data: {
            ramenId: ramen.id,
            tagId: tag.id,
          },
        })
      }
    }

    return NextResponse.json(ramen, { status: 201 })
  } catch (error) {
    console.error('Failed to create ramen:', error)
    return NextResponse.json({ error: 'Failed to create ramen' }, { status: 500 })
  }
}
