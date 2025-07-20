// src/app/api/admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const admins = await prisma.admin.findMany();
  return NextResponse.json(admins);
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  // Ovde dodaj validaciju i hashing ako hoćeš (za sada plain text)
  const newAdmin = await prisma.admin.create({
    data: { username, password },
  });

  return NextResponse.json(newAdmin);
}
