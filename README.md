# FamilyTree

Interactive family tree application with:
- tree visualization (GoJS)
- generational timeline mode
- branch collapse/expand controls
- duplicate and birth-year validations
- Cloudflare Worker API + D1 database

[FamilyTree App](https://familytree.buraak-cakir.workers.dev/)

## Technologies

- Frontend: React 19, TypeScript, Vite 6
- UI: Tailwind CSS 4, Radix UI, custom component library
- Diagram engine: GoJS + gojs-react
- Backend: Hono on Cloudflare Workers
- Database: Cloudflare D1 (SQLite)
- Tooling: ESLint, Wrangler
- Containerization: Docker, Docker Compose

## Project Structure

- `src/react-app` -> React client application
- `src/worker` -> Hono API running on Cloudflare Workers
- `schema.sql` -> D1 schema and seed data
- `wrangler.json` -> Worker and D1 configuration

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Docker

Build and run:

```bash
docker compose up --build -d
```

Stop:

```bash
docker compose down
```

## Build, Lint, Deploy

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Deploy to Cloudflare:

```bash
npm run deploy
```

Worker logs:

```bash
npx wrangler tail
```

## Notes

- API endpoint for tree data: `/api/family/tree`
- API endpoint for member creation: `/api/family/nodes`
- Duplicate rule: same `name + birthYear + gender` is blocked
- Child birth year cannot be earlier than parent birth year
