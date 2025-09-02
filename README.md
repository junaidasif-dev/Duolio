# Duolio Portfolio

Static portfolio with a single Vercel serverless function that stores appointment inquiries directly into a Notion database.

## Features
- AI/ML project showcase & services
- Appointment form → Notion database (via `/api/contact`)
- Zero external DB (No Postgres) – just Notion
- Honeypot anti-bot field

## APIs
### POST /api/contact
Creates a new page inside the configured Notion database.

Env vars required:
```
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Recommended Notion DB properties (Name → Type):
```
Name (Title)
Email (Email)
Company (Rich text)
Focus (Select)  # Create select options matching form values
Phone (Rich text)
Message (Rich text)
Submitted (Date)
```
Request JSON example:
```
{"name":"Ada","email":"ada@example.com","company":"Labs","project_type":"LLM / Chatbot","message":"Need help shipping an agent."}
```
Response: `{ ok: true }` on success. (Honeypot field `website` is ignored if filled.)

No other APIs are enabled (admin listing intentionally omitted for Notion‑only setup).

## Local Dev
1. Create a Notion integration (https://www.notion.so/my-integrations) and copy the secret.
2. Create a Notion database and share it with the integration.
3. Create `.env.local` with the two variables below.
4. (If you add a package.json later) install dependencies and run dev; for static HTML + serverless you can directly use `vercel dev`.
```powershell
npm install
npx vercel dev
```
4. Open http://localhost:3000

## Deployment (Vercel)
1. Push repository to GitHub.
2. Import into Vercel dashboard.
3. Add Environment Variables in Vercel:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
4. Deploy. Form posts to `/api/contact`.

## Notes
- Ensure Notion database property names match those listed.
- Add hCaptcha or rate limiting if spam increases.
- For exporting data, use Notion’s native export or its API to query pages.

## License
Proprietary – customize for personal portfolio use.