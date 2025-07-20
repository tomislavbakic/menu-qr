import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth'; // Pretpostavljam da imaš funkciju za verifikaciju tokena
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
  
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  
    // Ako je token validan
    const items = await prisma.item.findMany();
    return NextResponse.json(items);
  }
  
  export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
  
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
  
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  
    const { name, available, type } = await request.json();
  
    const newItem = await prisma.item.create({
      data: {
        name,
        available,
        type,
      },
    });
  
    return NextResponse.json(newItem);
  }