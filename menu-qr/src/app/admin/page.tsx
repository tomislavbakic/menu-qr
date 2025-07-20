'use client';

import React, { useEffect, useState } from 'react';

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
    <div style={{ padding: 20 }}>
      <h1>Admin CRUD</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />

      {editingAdminId === null ? (
        <button onClick={handleAdd}>Add Admin</button>
      ) : (
        <>
          <button onClick={handleUpdate}>Update Admin</button>
          <button
            onClick={() => {
              setEditingAdminId(null);
              setUsername('');
              setPassword('');
            }}
          >
            Cancel
          </button>
        </>
      )}

      <hr />

      <ul>
        {admins.map((admin) => (
          <li key={admin.id}>
            <b>{admin.username}</b>{' '}
            <button onClick={() => startEdit(admin)}>Edit</button>{' '}
            <button onClick={() => handleDelete(admin.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
