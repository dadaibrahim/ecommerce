import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import mysql from 'mysql2/promise';
import CartClient from './CartClient';

export default async function CartPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;

  if (!sessionToken) {
    return redirect('/login');
  }

  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [rows] = await db.execute(
    'SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > NOW()',
    [sessionToken]
  );

  await db.end();

  if ((rows as any[]).length === 0) {
    return redirect('/login');
  }

  const userId = (rows as any[])[0].user_id.toString();

  return <CartClient userId={userId} />;
}
