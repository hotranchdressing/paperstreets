// api/responses/index.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Handle POST - Add new response
    if (req.method === 'POST') {
      const { category, text } = req.body;
      
      if (!category || !text) {
        return res.status(400).json({ error: 'Missing category or text' });
      }

      await sql`
        INSERT INTO responses (category, text)
        VALUES (${category}, ${text})
      `;

      const rows = await sql`
        SELECT category, text, timestamp 
        FROM responses 
        ORDER BY timestamp ASC
      `;

      return res.status(200).json({ 
        success: true, 
        responses: rows
      });
    }

    // Handle GET - Retrieve all responses
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT category, text, timestamp 
        FROM responses 
        ORDER BY timestamp ASC
      `;
      
      return res.status(200).json({ 
        responses: rows,
        count: rows.length
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
}