import { prisma } from '@/lib/prisma';

export default async function MenuPage() {
  const items = await prisma.item.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kućni Meni</h1>
      {items.length === 0 ? (
        <p>Nema stavki u meniju.</p>
      ) : (
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="border rounded p-3 shadow-sm">
              <span className="font-semibold">{item.name}</span> — <em>{item.type}</em>{' '}
              {!item.available && <span className="text-red-600">(Nedostupno)</span>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
