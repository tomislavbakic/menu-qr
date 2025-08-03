import { prisma } from '@/lib/prisma';
import MenuClient from './MenuClient';
import '../globals.css';

// Server component wrapper - this fetches data and passes to client
export default async function MenuPage() {
  const items = await prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
  console.log('Fetched items:', items);

  // Convert createdAt from Date to string
  const itemsWithStringDates = items.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  return <MenuClient initialItems={itemsWithStringDates} />;
}