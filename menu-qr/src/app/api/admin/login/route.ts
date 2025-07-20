import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateJwtToken } from '@/lib/auth';


export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin || admin.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateJwtToken(admin);
  console.log('Generated JWT Token:', token);
  return NextResponse.json({ token });
}

