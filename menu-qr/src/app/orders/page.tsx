import { prisma } from '@/lib/prisma';
import OrdersClient from './OrdersClient';

export default async function OrdersPage() {
  console.log('OrdersPage component is rendering...');
  try {
    console.log('Fetching pending orders...');
    // Only fetch PENDING orders (not completed ones)
    const orders = await prisma.order.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        item: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(`Fetched ${orders.length} pending orders`);
    // Serialize the data to avoid hydration issues
    const serializedOrders = orders.map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      item: {
        ...order.item,
        createdAt: order.item.createdAt.toISOString()
      }
    }));

    return <OrdersClient initialOrders={serializedOrders} />;
  } catch (error) {
    console.log('Error fetching orders:', error);
    
    // Fallback UI in case of database error
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-4xl font-extrabold text-red-600 mb-6">
            ⚠️ Greška
          </h1>
          <p className="text-gray-700">
            Došlo je do greške pri učitavanju narudžbi. Molimo pokušajte ponovo.
          </p>
          <div className="mt-6">
            <a
              href="/menu"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
            >
              Nazad na meni
            </a>
          </div>
        </div>
      </main>
    );
  }
}