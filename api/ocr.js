export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { image, mediaType, prompt } = req.body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    console.log('API Key exists:', !!apiKey, apiKey ? apiKey.slice(0,10) : 'NONE');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const rawText = await response.text();
    console.log('Anthropic status:', response.status, rawText.slice(0,100));

    try {
      const data = JSON.parse(rawText);
      return res.status(response.ok ? 200 : response.status).json(data);
    } catch(e) {
      return res.status(502).json({ error: 'Parse error', raw: rawText.slice(0,200) });
    }

  } catch (error) {
    console.error('Handler error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}