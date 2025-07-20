'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


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
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Menu CRUD</h1>

      <div className="mb-4 space-x-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Item name"
          className="border p-2"
        />
        <select value={type} onChange={e => setType(e.target.value as ItemType)} className="border p-2">
          <option value="FOOD">FOOD</option>
          <option value="DRINK">DRINK</option>
          <option value="ACTIVITY">ACTIVITY</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? 'Update' : 'Add'}
        </button>
      </div>

      <ul>
        {items.map(item => (
          <li
            key={item.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{item.name} ({item.type})</span>
            <div>
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-500 text-white px-2 py-1 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
