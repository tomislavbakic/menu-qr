'use client';

import Link from "next/link";
import './globals.css';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-cyan-100 flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-orange-100 bg-gradient-to-b shadow-lg rounded-lg p-11 max-w-md w-full drop-shadow-md">
        <h1 className="text-5xl md:text-6xl font-extrabold text-pink-500 mb-4 animate-bounce drop-shadow-md">
          Dobro došli!
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-md">
          Izaberite omiljene stavke iz ponude.
        </p>

        <Link
          href="/menu"
          className="bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg transition-all"
        >
          Pogledaj meni
        </Link>
        <p className="text-gray-600 mt-6 mb-2">ili</p>
        <Link
          href="/admin/login"
          className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold mt-5 py-1 px-5 rounded-full shadow-lg transition-all"
        >
          Prijavi se kao domacin
        </Link>
      </div>
    </main>
  );
}
