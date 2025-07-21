'use client';

import React, { useEffect, useState } from 'react';
import '../globals.css';

type Admin = {
  id: number;
  username: string;
  password: string;
};

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);

  async function fetchAdmins() {
    const res = await fetch('/api/admin');
    const data = await res.json();
    setAdmins(data);
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function handleAdd() {
    if (!username || !password) return alert('Fill username and password');

    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setUsername('');
      setPassword('');
      fetchAdmins();
    }
  }

  async function handleUpdate() {
    if (!username || !password || editingAdminId === null) return;

    const res = await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingAdminId, username, password }),
    });

    if (res.ok) {
      setUsername('');
      setPassword('');
      setEditingAdminId(null);
      fetchAdmins();
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    const res = await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchAdmins();
    }
  }

  function startEdit(admin: Admin) {
    setUsername(admin.username);
    setPassword(admin.password);
    setEditingAdminId(admin.id);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-6">
          👤 Admin CRUD
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 border border-purple-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="flex-1 border border-purple-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {editingAdminId === null ? (
            <button
              onClick={handleAdd}
              className="bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-pink-700 transition-all"
            >
              Dodaj
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-yellow-600 transition-all"
              >
                Izmeni
              </button>
              <button
                onClick={() => {
                  setEditingAdminId(null);
                  setUsername('');
                  setPassword('');
                }}
                className="bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-500 transition-all"
              >
                Otkaži
              </button>
            </>
          )}
        </div>

        <ul className="space-y-4">
          {admins.map((admin) => (
            <li
              key={admin.id}
              className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-4 shadow hover:shadow-md transition-all"
            >
              <p className="text-lg font-semibold text-purple-800">{admin.username}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(admin)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-xl shadow hover:bg-yellow-500 transition-all"
                >
                  Izmeni
                </button>
                <button
                  onClick={() => handleDelete(admin.id)}
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
