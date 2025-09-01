// Serverless function to store contact form submissions using Vercel Postgres
import { sql } from '@vercel/postgres';

const REQUIRED_FIELDS = ['name','email','project_type','message'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const body = req.body || {};
    // Basic validation
    for (const f of REQUIRED_FIELDS) {
      if (!body[f] || String(body[f]).trim() === '') {
        return res.status(400).json({ error: `Missing field: ${f}` });
      }
    }
    // Rudimentary email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Create table if not exists (lightweight for small volume; extract to migration for scale)
    await sql`
      CREATE TABLE IF NOT EXISTS duolio_messages (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        project_type TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );`;

    const { name, email, company = null, project_type, message } = body;
    await sql`
      INSERT INTO duolio_messages (name,email,company,project_type,message)
      VALUES (${name}, ${email}, ${company}, ${project_type}, ${message});`;

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Contact submit error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}