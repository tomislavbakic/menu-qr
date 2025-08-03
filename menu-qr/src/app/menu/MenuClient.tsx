'use client';

import { useState } from 'react';

type Item = {
  id: number;
  name: string;
  type: string; // or a more specific union if you want: 'FOOD' | 'DRINK' etc.
  available: boolean;
  createdAt: string; // Dates from API often come as ISO strings
};

type OrderFormProps = {
  item: Item;
  onClose: () => void;
  onSuccess: () => void;
};

// Order form component
function OrderForm({ item, onClose, onSuccess }: OrderFormProps) {
  const [guestName, setGuestName] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestName: guestName.trim(),
          itemId: item.id,
          note: note.trim() || null,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setGuestName('');
        setNote('');
      } else {
        alert('Greška pri slanju narudžbe');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Greška pri slanju narudžbe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          Naruči: {item.name}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">
              Ime gosta *
            </label>
            <input
              type="text"
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Unesite vaše ime"
              required
            />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
              Napomena (opciono)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Dodatne napomene..."
              rows={3}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !guestName.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Šalje...' : 'Naruči'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Menu item component
type MenuItemProps = {
  item: Item;
  onOrder: (item: Item) => void;
};

function MenuItem({ item, onOrder }: MenuItemProps) {
  return (
    <li className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-4 shadow hover:shadow-md transition-all">
      <div className="flex-1">
        <p className="text-lg font-semibold text-purple-800">{item.name}</p>
        <p className="text-sm text-gray-600 italic">{item.type}</p>
      </div>
      <div className="flex items-center gap-3">
        {!item.available && (
          <span className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
            Nedostupno
          </span>
        )}
        {item.available && (
          <button
            onClick={() => onOrder(item)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Naruči
          </button>
        )}
      </div>
    </li>
  );
}

// Main menu client component
export default function MenuClient({ initialItems }: { initialItems: Item[] }) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOrder = (item: Item) => {
    setSelectedItem(item);
  };

  const handleOrderSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-pink-600">
              🍽️ Kućni Meni
            </h1>
            <a
              href="/orders"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Pregledaj narudžbe
            </a>
          </div>
          
          {showSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ Narudžba je uspešno poslata!
            </div>
          )}

          {initialItems.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">Nema stavki u meniju.</p>
          ) : (
            <ul className="space-y-4">
              {initialItems.map(item => (
                <MenuItem key={item.id} item={item} onOrder={handleOrder} />
              ))}
            </ul>
          )}
        </div>
      </main>

      {selectedItem && (
        <OrderForm
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </>
  );
}