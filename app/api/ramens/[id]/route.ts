import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// GET - 특정 라멘 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ramen = await prisma.ramen.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!ramen) {
      return NextResponse.json({ error: 'Ramen not found' }, { status: 404 })
    }

    return NextResponse.json(ramen)
  } catch (error) {
    console.error('Failed to fetch ramen:', error)
    return NextResponse.json({ error: 'Failed to fetch ramen' }, { status: 500 })
  }
}

// PUT - 라멘 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // 기존 라멘 확인
    const existingRamen = await prisma.ramen.findUnique({
      where: { id },
    })

    if (!existingRamen) {
      return NextResponse.json({ error: 'Ramen not found' }, { status: 404 })
    }

    // slug 생성 (제목이 변경된 경우)
    let slug = existingRamen.slug
    if (title !== existingRamen.title) {
      slug = slugify(title)
      let counter = 1
      while (await prisma.ramen.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${slugify(title)}-${counter}`
        counter++
      }
    }

    // 라멘 업데이트
    const ramen = await prisma.ramen.update({
      where: { id },
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

    // 기존 태그 삭제
    await prisma.ramenTag.deleteMany({
      where: { ramenId: id },
    })

    // 새 태그 추가
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

    return NextResponse.json(ramen)
  } catch (error) {
    console.error('Failed to update ramen:', error)
    return NextResponse.json({ error: 'Failed to update ramen' }, { status: 500 })
  }
}

// DELETE - 라멘 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.ramen.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete ramen:', error)
    return NextResponse.json({ error: 'Failed to delete ramen' }, { status: 500 })
  }
}
