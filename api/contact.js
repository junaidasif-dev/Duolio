// Serverless function for handling appointment form submissions
// Saves (or will save) to Notion database via Notion API.
// Expects environment variables:
//   NOTION_API_KEY  - secret integration token
//   NOTION_DATABASE_ID - target database to insert rows
// Optional (future): ADMIN_TOKEN for auth to list messages.

const https = require('https');

async function insertIntoNotion(payload) {
  const { NOTION_API_KEY, NOTION_DATABASE_ID } = process.env;
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    throw new Error('Missing Notion configuration. Set NOTION_API_KEY and NOTION_DATABASE_ID');
  }
  const postData = JSON.stringify({
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      Name: { title: [{ text: { content: payload.name || 'Unknown' } }] },
      Email: payload.email ? { email: payload.email } : undefined,
      Company: payload.company ? { rich_text: [{ text: { content: payload.company } }] } : undefined,
      Focus: payload.project_type ? { select: { name: payload.project_type } } : undefined,
      Phone: payload.phone ? { rich_text: [{ text: { content: payload.phone } }] } : undefined,
      Message: payload.message ? { rich_text: [{ text: { content: payload.message } }] } : undefined,
      Submitted: { date: { start: new Date().toISOString() } }
    }
  });

  const options = {
    hostname: 'api.notion.com',
    path: '/v1/pages',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error('Notion API error ' + res.statusCode + ': ' + data));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method not allowed' });
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const data = JSON.parse(body || '{}');
      // Basic spam honeypot check
      if (data.website) {
        return res.json({ ok: true }); // silently ignore
      }
      if (!data.name || !data.email || !data.project_type || !data.message) {
        res.statusCode = 400;
        return res.json({ error: 'Missing required fields' });
      }

      await insertIntoNotion(data);
      res.json({ ok: true });
    } catch (err) {
      console.error('Contact submission error:', err);
      res.statusCode = 500;
      res.json({ error: err.message || 'Internal error' });
    }
  });
};
