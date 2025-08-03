import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await context.params;
    const orderId = parseInt(idParam, 10);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Check if order exists and is still pending
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (existingOrder.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order is already completed' },
        { status: 400 }
      );
    }

    // Update order status to COMPLETED
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date()
      },
      include: {
        item: true
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error completing order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}