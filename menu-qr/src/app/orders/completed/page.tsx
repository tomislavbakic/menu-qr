import { prisma } from '@/lib/prisma';
import '../../globals.css';
export const dynamic = "force-dynamic"; 

export default async function CompletedOrdersPage() {
  const completedOrders = await prisma.order.findMany({
    where: {
      status: 'COMPLETED'
    },
    include: {
      item: true
    },
    orderBy: {
      updatedAt: 'desc' // Sort by completion time
    }
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'FOOD':
        return 'Hrana';
      case 'DRINK':
        return 'Piće';
      case 'ACTIVITY':
        return 'Aktivnost';
      default:
        return type;
    }
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'FOOD':
        return '🍽️';
      case 'DRINK':
        return '🥤';
      case 'ACTIVITY':
        return '🎯';
      default:
        return '📋';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-green-600">
            ✅ Završene Narudžbe
          </h1>
          <div className="flex gap-3">
            <a
              href="/orders"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
            >
              Aktivne narudžbe
            </a>
            <a
              href="/menu"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium shadow-md"
            >
              ← Nazad na meni
            </a>
          </div>
        </div>

        {completedOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📋</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Nema završenih narudžbi</h2>
            <p className="text-gray-500 text-lg">Završene narudžbe će se pojaviti ovde.</p>
            <div className="mt-6">
              <a
                href="/orders"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Vidi aktivne narudžbe
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{completedOrders.length}</div>
                <div className="text-sm text-green-600">Završene narudžbe</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {new Set(completedOrders.map(order => order.guestName)).size}
                </div>
                <div className="text-sm text-blue-600">Različitih gostiju</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {new Set(completedOrders.map(order => order.itemId)).size}
                </div>
                <div className="text-sm text-purple-600">Različitih stavki</div>
              </div>
            </div>

            {/* Completed Orders list */}
            <div className="space-y-4">
              {completedOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm opacity-75"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Main order info */}
                    <div className="flex-1 space-y-3">
                      {/* Header with guest name and order number */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            ✓
                          </div>
                          <h3 className="text-xl font-bold text-green-800">
                            {order.guestName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            Narudžba #{order.id}
                          </span>
                        </div>
                      </div>
                      
                      {/* Item details */}
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl opacity-60">
                            {getItemTypeIcon(order.item.type)}
                          </div>
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h4 className="text-lg font-semibold text-gray-700">
                                {order.item.name}
                              </h4>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {getItemTypeLabel(order.item.type)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Završeno:</span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✅ Završeno
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Note if exists */}
                      {order.note && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 opacity-75">
                          <div className="flex items-start gap-2">
                            <span className="text-yellow-600 text-sm font-medium flex-shrink-0">💬 Napomena:</span>
                            <p className="text-sm text-gray-600 italic">
                              "{order.note}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp info */}
                    <div className="lg:text-right space-y-2">
                      <div className="text-sm text-gray-500">
                        <div className="font-medium">Naručeno:</div>
                        <div>{formatDate(order.createdAt)}</div>
                      </div>
                      <div className="text-sm text-green-600">
                        <div className="font-medium">Završeno:</div>
                        <div>{formatDate(order.updatedAt)}</div>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✅ Završeno
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer info */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              Poslednja završena narudžba: {completedOrders[0] && formatDate(completedOrders[0].updatedAt)}
            </div>
          </>
        )}
      </div>
    </main>
  );
}