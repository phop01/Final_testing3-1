import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, context: any) {
  try {
    const idParam = context?.params?.id
    if (!idParam) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const numericId = Number(idParam)
    const where = isNaN(numericId) ? { id: idParam } : { id: numericId }

    const user = await prisma.user.findUnique({ where })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json(user)
  } catch (error) {
    console.error('GET /api/user/:id error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}