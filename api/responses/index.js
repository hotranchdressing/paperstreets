// api/responses/index.js
let responses = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { category, text } = req.body;
    
    if (!category || !text) {
      return res.status(400).json({ error: 'Missing category or text' });
    }

    responses.push({
      category,
      text,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({ 
      success: true, 
      responses: responses
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      responses: responses,
      count: responses.length,
      message: 'API is working!' 
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}