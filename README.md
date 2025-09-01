# Duolio Portfolio

Static portfolio with Vercel serverless functions for storing contact inquiries.

## Features
- AI/ML project showcase & services
- Contact form persists submissions to Vercel Postgres (`duolio_messages`)
- Protected admin API to list messages

## APIs
### POST /api/contact
Request JSON:
```
{"name":"Ada","email":"ada@example.com","company":"Labs","project_type":"LLM / Chatbot","message":"Need help shipping an agent."}
```
Response: `{ ok: true }` on success.

### GET /api/messages (admin only)
Headers: `Authorization: Bearer <ADMIN_TOKEN>`
Response: `{ messages: [...] }`

## Local Dev
1. Copy `.env.example` to `.env.local` and fill values (Vercel auto-loads `.env.local`).
2. Ensure you have added the Vercel Postgres integration to the project to receive `POSTGRES_URL`.
3. Install dependencies and run:
```powershell
npm install
npx vercel dev
```
4. Open http://localhost:3000

## Deployment (Vercel)
1. Push repository to GitHub.
2. Import into Vercel dashboard.
3. Add Environment Variables:
   - `POSTGRES_URL` (from Vercel Postgres integration)
   - `ADMIN_TOKEN` (a long random string)
4. Deploy. Contact form will call `/api/contact`.
5. To read messages:
```powershell
curl -H "Authorization: Bearer $Env:ADMIN_TOKEN" https://<your-app>.vercel.app/api/messages
```

## Notes
- Table auto-creates on first request; for production, move DDL to a migration step.
- Add spam protection (hCaptcha, honeypot) if volume increases.
- Rotate `ADMIN_TOKEN` periodically.

## License
Proprietary – customize for personal portfolio use.