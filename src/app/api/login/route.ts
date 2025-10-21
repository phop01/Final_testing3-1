import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password } = data;

    if (!email || !password) {
      return NextResponse.json({ error: "email and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT secret missing");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "7d" });

    // return token and user info (without password)
    const { password: _p, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, token });
  } catch (error) {
    console.error("POST /api/login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}