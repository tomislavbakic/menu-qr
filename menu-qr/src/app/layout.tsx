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
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <header style={{ backgroundColor: '#222', padding: '1rem', color: 'white' }}>
          <h1 style={{ margin: 0 }}>🍽️ Menu QR</h1>
        </header>
        <main>{children}</main>
        <footer style={{ backgroundColor: '#eee', padding: '1rem', marginTop: '2rem' }}>
          <p style={{ margin: 0 }}>© 2025 Menu QR</p>
        </footer>
      </body>
    </html>
  );
}