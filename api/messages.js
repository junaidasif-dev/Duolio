// Protected endpoint to list stored contact messages
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminToken = process.env.ADMIN_TOKEN;
  const authHeader = req.headers.authorization || '';
  if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    await sql`CREATE TABLE IF NOT EXISTS duolio_messages (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, company TEXT, project_type TEXT NOT NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());`;
    const { rows } = await sql`SELECT id, name, email, company, project_type, message, created_at FROM duolio_messages ORDER BY created_at DESC LIMIT 500;`;
    return res.status(200).json({ messages: rows });
  } catch (err) {
    console.error('List messages error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}