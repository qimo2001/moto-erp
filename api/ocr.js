export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { image, mediaType, prompt } = req.body;

    if (!image) return res.status(400).json({ error: 'image is required' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType || 'image/jpeg',
                data: image
              }
            },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    if (!contentType.includes('application/json')) {
      console.error('Non-JSON from Anthropic:', rawText.slice(0, 200));
      return res.status(502).json({ error: 'Anthropic API returned non-JSON', preview: rawText.slice(0, 100) });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      return res.status(502).json({ error: 'Failed to parse Anthropic response' });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('OCR error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}