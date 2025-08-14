import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: { url: string | URL; }) {
  try {
    // Extract the status query parameter from the URL
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build the where clause conditionally
    const whereClause = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where: whereClause,
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