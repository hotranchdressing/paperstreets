// api/responses.js (Simple test version - no database)
// This will help us figure out if the API is working at all

let responses = []; // In-memory storage (resets on cold starts)

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Handle POST - Add new response
    if (req.method === 'POST') {
      const { category, text } = req.body;
      
      if (!category || !text) {
        return res.status(400).json({ error: 'Missing category or text' });
      }

      // Add to in-memory array
      responses.push({
        category,
        text,
        timestamp: new Date().toISOString()
      });

      console.log('Saved response:', category, text);

      return res.status(200).json({ 
        success: true, 
        responses: responses
      });
    }

    // Handle GET - Retrieve all responses
    if (req.method === 'GET') {
      return res.status(200).json({ 
        responses: responses,
        count: responses.length,
        message: 'API is working!' 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      stack: error.stack
    });
  }
};