import { NextResponse } from 'next/server'

const ALLOWED = [
  process.env.FRONT_ORIGIN,        // เช่น https://your-frontend.vercel.app
  process.env.FRONT_ORIGIN_2,      // ถ้ามีโดเมนเพิ่ม
].filter(Boolean) as string[]

export function middleware(req: Request) {
  const origin = req.headers.get('origin') || ''
  const res = NextResponse.next()

  // allow เฉพาะ origin ที่กำหนด
  if (ALLOWED.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin)
  }

  res.headers.set('Vary', 'Origin')
  res.headers.set('Access-Control-Allow-Credentials', 'true')
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // ตอบ preflight
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers })
  }

  return res
}

// ให้มีผลเฉพาะเส้นทาง /api/*
export const config = {
  matcher: ['/api/:path*'],
}