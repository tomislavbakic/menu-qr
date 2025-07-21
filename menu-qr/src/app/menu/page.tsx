import { prisma } from '@/lib/prisma';
import '../globals.css'; // Ensure global styles are imported

export default async function MenuPage() {
  const items = await prisma.item.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-6">
          🍽️ Kućni Meni
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Nema stavki u meniju.</p>
        ) : (
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
                {!item.available && (
                  <span className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                    Nedostupno
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
