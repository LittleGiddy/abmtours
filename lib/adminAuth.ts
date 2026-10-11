import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb';

export async function isAdminRequest(): Promise<boolean> {
  const cookieStore = await cookies();

  if (cookieStore.get('admin-auth')?.value !== 'true') {
    return false;
  }

  const email = cookieStore.get('admin-email')?.value;
  if (!email) {
    return false;
  }

  const client = await getClientPromise();
  const db = client.db('abmtours');
  const admin = await db.collection('admins').findOne({ email });

  return admin?.role === 'admin';
}

/**
 * Guard for admin-only route handlers.
 * Returns a 401 response to return early, or null when the request may proceed.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdminRequest()) {
    return null;
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}