import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 모든 태그 조회
export async function GET() {
  try {
    const tags = await prisma.ramenTagMaster.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return NextResponse.json(tags)
  } catch (error) {
    console.error('Failed to fetch tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}
