import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestName, itemId, note } = body;

    // Validate required fields
    if (!guestName || !itemId) {
      return NextResponse.json(
        { error: 'Guest name and item ID are required' },
        { status: 400 }
      );
    }

    // Check if item exists and is available
    const item = await prisma.item.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    if (!item.available) {
      return NextResponse.json(
        { error: 'Item is not available' },
        { status: 400 }
      );
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        guestName,
        itemId,
        note,
      },
      include: {
        item: true
      }
    });

    revalidatePath("/orders");
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        item: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}