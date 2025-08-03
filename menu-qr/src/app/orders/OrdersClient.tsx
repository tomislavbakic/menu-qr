'use client';

import { useState } from 'react';

type SerializedOrderWithItem = {
  id: number;
  guestName: string;
  itemId: number;
  note: string | null;
  status: string;
  createdAt: string; // Serialized as string
  updatedAt: string; // Serialized as string
  item: {
    id: number;
    name: string;
    type: string;
    available: boolean;
    createdAt: string; // Serialized as string
  };
};

interface OrdersClientProps {
  initialOrders: SerializedOrderWithItem[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState<SerializedOrderWithItem[]>(initialOrders);
  const [completingOrders, setCompletingOrders] = useState<Set<number>>(new Set());

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
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

  const handleCompleteOrder = async (orderId: number) => {
    if (completingOrders.has(orderId)) return;

    setCompletingOrders(prev => new Set(prev).add(orderId));

    try {
      const response = await fetch(`/api/orders/${orderId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the completed order from the list
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      } else {
        alert('Greška pri označavanju narudžbe kao završene');
      }
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Greška pri označavanju narudžbe kao završene');
    } finally {
      setCompletingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-indigo-600">
            📋 Aktivne Narudžbe
          </h1>
          <div className="flex gap-3">
            <a
              href="/orders/completed"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md"
            >
              Završene narudžbe
            </a>
            <a
              href="/menu"
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium shadow-md"
            >
              ← Nazad na meni
            </a>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">✅</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Nema aktivnih narudžbi</h2>
            <p className="text-gray-500 text-lg">Sve narudžbe su završene ili nema novih narudžbi.</p>
            <div className="mt-6 flex justify-center gap-4">
              <a
                href="/menu"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Idi na meni
              </a>
              <a
                href="/orders/completed"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Završene narudžbe
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{orders.length}</div>
                <div className="text-sm text-blue-600">Aktivne narudžbe</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-700">
                  {new Set(orders.map(order => order.guestName)).size}
                </div>
                <div className="text-sm text-green-600">Različitih gostiju</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {new Set(orders.map(order => order.itemId)).size}
                </div>
                <div className="text-sm text-purple-600">Različitih stavki</div>
              </div>
            </div>

            {/* Orders list */}
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Main order info */}
                    <div className="flex-1 space-y-3">
                      {/* Header with guest name and order number */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <h3 className="text-xl font-bold text-indigo-800">
                            {order.guestName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                            Narudžba #{order.id}
                          </span>
                        </div>
                      </div>
                      
                      {/* Item details */}
                      <div className="bg-white rounded-lg p-4 border border-indigo-100">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">
                            {getItemTypeIcon(order.item.type)}
                          </div>
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h4 className="text-lg font-semibold text-purple-700">
                                {order.item.name}
                              </h4>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {getItemTypeLabel(order.item.type)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Status:</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                order.item.available 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {order.item.available ? '✅ Dostupno' : '❌ Nedostupno'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Note if exists */}
                      {order.note && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <span className="text-yellow-600 text-sm font-medium flex-shrink-0">💬 Napomena:</span>
                            <p className="text-sm text-gray-700 italic">
                              "{order.note}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp and actions */}
                    <div className="lg:text-right space-y-3">
                      <div className="text-sm text-gray-500">
                        <div className="font-medium">Naručeno:</div>
                        <div>{formatDate(order.createdAt)}</div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            ⏳ Na čekanju
                          </span>
                        </div>
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          disabled={completingOrders.has(order.id)}
                          className="w-full lg:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          {completingOrders.has(order.id) ? 'Završava...' : '✅ Završi narudžbu'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer info */}
            {orders.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                Poslednja narudžba: {formatDate(orders[0].createdAt)}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}