'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../globals.css';

type ItemType = 'FOOD' | 'DRINK' | 'ACTIVITY';

type Item = {
  id: number;
  name: string;
  type: ItemType;
  available: boolean;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<ItemType>('FOOD');
  const [editId, setEditId] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchItems = async () => {
    const res = await fetch('/api/items', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }

    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    if (!token) router.push('/admin/login');
    else fetchItems();
  }, []);

  const handleSubmit = async () => {
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/api/items/${editId}` : '/api/items';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, type }),
    });

    setName('');
    setType('FOOD');
    setEditId(null);
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/items/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchItems();
  };

  const handleEdit = (item: Item) => {
    setName(item.name);
    setType(item.type);
    setEditId(item.id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-6">
          🛠️ Admin Dashboard
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Naziv stavke"
            className="flex-1 border border-purple-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <select
            value={type}
            onChange={e => setType(e.target.value as ItemType)}
            className="border border-purple-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="FOOD">FOOD</option>
            <option value="DRINK">DRINK</option>
            <option value="ACTIVITY">ACTIVITY</option>
          </select>
          <button
            onClick={handleSubmit}
            className="bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-pink-700 transition-all"
          >
            {editId ? 'Izmeni' : 'Dodaj'}
          </button>
        </div>

        <ul className="space-y-4">
          {items.map(item => (
            <li
              key={item.id}
              className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-4 shadow hover:shadow-md transition-all"
            >
              <div>
                <p className="text-lg font-semibold text-purple-800">{item.name}</p>
                <p className="text-sm text-gray-600 italic">{item.type}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-xl shadow hover:bg-yellow-500 transition-all"
                >
                  Izmeni
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition-all"
                >
                  Obriši
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
