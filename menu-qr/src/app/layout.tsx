import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: 'Menu',
  description: 'Meni za kućnu upotrebu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 text-gray-800">
        <header className="bg-purple-600 text-white px-6 py-4 shadow-md">
          <h1 className="text-2xl font-bold">🍽️ Menu</h1>
        </header>

        <main className="flex-1 p-4">{children}</main>

        <footer className="bg-white text-center text-sm text-gray-500 py-4 shadow-inner">
          <p className="m-0">© 2025 Menu</p>
        </footer>
      </body>
    </html>
  );
}
