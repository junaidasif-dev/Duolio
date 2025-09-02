# Duolio Portfolio

Static portfolio with Vercel serverless functions for storing contact / appointment inquiries (now supports Notion capture).

## Features
- AI/ML project showcase & services
- Appointment form saves submissions to a Notion database (via `/api/contact`)
- (Optional) Can be extended to persist to Vercel Postgres (`duolio_messages`)
- (Optional) Protected admin API to list messages

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

### GET /api/messages (admin only – optional future)
If you implement the Postgres storage + admin endpoint, call with header `Authorization: Bearer <ADMIN_TOKEN>` returning `{ messages: [...] }`.

## Local Dev
1. Copy `.env.example` to `.env.local` and fill values (Vercel auto-loads `.env.local`).
2. (Optional) Add the Vercel Postgres integration if you plan to store messages in Postgres.
3. Install dependencies and run:
```powershell
npm install
npx vercel dev
```
4. Open http://localhost:3000

## Deployment (Vercel)
1. Push repository to GitHub.
2. Import into Vercel dashboard.
3. Add Environment Variables (minimum for Notion):
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   (Optional / future)
   - `POSTGRES_URL`
   - `ADMIN_TOKEN`
4. Deploy. Form will call `/api/contact`.
5. (Optional) To read messages (if admin endpoint added):
```powershell
curl -H "Authorization: Bearer $Env:ADMIN_TOKEN" https://<your-app>.vercel.app/api/messages
```

## Notes
- Table auto-creates on first request; for production, move DDL to a migration step.
- Add spam protection (hCaptcha, honeypot) if volume increases.
- Rotate `ADMIN_TOKEN` periodically.

## License
Proprietary – customize for personal portfolio use.