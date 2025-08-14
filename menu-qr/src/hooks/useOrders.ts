import { useEffect, useState } from "react";

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


export function useOrders(status?: string) {
    const [orders, setOrders] = useState<SerializedOrderWithItem[]>([])
    const [completingOrders, setCompletingOrders] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const url = status 
        ? `/api/orders?status=${encodeURIComponent(status)}`
        : '/api/orders';

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err: unknown) {
      console.error('Error completing order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]); // Re-fetch when status changes

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

  return {
    orders,
    loading,
    handleCompleteOrder,
    completingOrders
  }
}