import { redirect } from 'next/navigation';
import { getClientPromise } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export default async function AdminSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await getClientPromise();
  const db = client.db('abmtours');
  const adminCount = await db.collection('admins').countDocuments();

  if (adminCount > 0) {
    redirect('/admin-login');
  }

  return <>{children}</>;
}