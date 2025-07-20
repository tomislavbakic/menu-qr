import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const authHeader = request.headers.get('authorization');
  
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
  
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  
    const id = parseInt(params.id, 10);
    const { name, available, type } = await request.json();
  
    try {
      const updatedItem = await prisma.item.update({
        where: { id },
        data: { name, available, type },
      });
      return NextResponse.json(updatedItem);
    } catch (error) {
      return NextResponse.json({ error: 'Item not found or could not be updated' }, { status: 404 });
    }
  }

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const authHeader = request.headers.get('authorization');
  
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
  
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  
    const id = parseInt(params.id, 10);
  
    try {
      await prisma.item.delete({
        where: { id },
      });
      return NextResponse.json({ message: 'Item deleted' });
    } catch (error) {
      return NextResponse.json({ error: 'Item not found or could not be deleted' }, { status: 404 });
    }
  }