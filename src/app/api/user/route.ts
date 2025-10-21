import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, email, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "name, email and password are required" },
        { status: 400 }
      );
    }

    // Hash password before saving
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    // Remove password from response
    const { password: _p, ...safeUser } = user;

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error: any) {
    // เพิ่ม log แบบชัดเจน เพื่อดูสาเหตุจริงใน terminal / docker logs
    console.error("POST /api/user error:", error?.message ?? error, error?.stack ?? "");
    // ใน dev ให้ส่ง error message กลับ (เอาออกก่อน deploy)
    return NextResponse.json(
      { error: error?.message ?? "Failed to create user" },
      { status: 500 }
    );
  }
}
