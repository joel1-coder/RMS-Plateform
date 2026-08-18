# RMS Platform Backend

Production-oriented Node.js, Express, MongoDB, Mongoose, and JWT backend generated from the repository `analysis/` files.

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API starts on `PORT` and exposes routes under `/api`. Health checks are available at `/health`.

## Environment

- `PORT`: Express port, default `5000`.
- `MONGO_URI`: MongoDB connection for development/runtime.
- `MONGO_URI_TEST`: Optional MongoDB connection for tests if not using the in-memory server.
- `JWT_SECRET`: Required signing secret for JWTs.
- `JWT_EXPIRES_IN`: JWT lifetime, default `1d`.
- `CORS_ORIGIN`: Frontend origin, for example `http://localhost:5173`.
- `UPLOAD_DIR`: Local upload storage directory, default `uploads`.
- `MAX_FILE_SIZE_MB`: Upload limit.
- `ALLOWED_FILE_EXTENSIONS`: Comma-separated file extensions for uploads.
- `S3_*`: Reserved placeholders for a future S3-compatible adapter.

## Seed Data

```bash
cd backend
npm run seed
```

The seed script reads `../analysis/seed-data.json`, hashes known demo passwords, and upserts users, research projects, meetings, and system settings.

Demo login passwords:

- `admin@rms.edu` / `admin123`
- `supervisor@rms.edu` / `super123`
- `scholar@rms.edu` / `scholar123`
- `hod@rms.edu` / `hod123`
- `drc@rms.edu` / `drc123`

## Tests

```bash
cd backend
npm test
```

Tests use `mongodb-memory-server` by default. If your environment cannot download MongoDB binaries, set `MONGO_URI_TEST` to a local test database before running `npm test`.

## Frontend Integration

Run the frontend with `VITE_API_BASE_URL=http://localhost:5000/api` or configure its proxy to forward `/api` to `http://localhost:5000`. CORS allows `CORS_ORIGIN`.

## Git And PR

```bash
git push -u origin backend/auto-gen-20260818-5e5860c4
```

Open a PR titled:

```text
feat(backend): scaffold Node+Express+Mongoose backend (auto-generated)
```

Suggested PR body:

```text
Generated a Node/Express/Mongoose backend under backend/ from analysis/api-spec.json, analysis/db-schema.json, analysis/route-map.json, and analysis/seed-data.json.

Includes JWT auth, role authorization, Mongoose models, CRUD/resource controllers, upload handling, seed data, and Jest/Supertest integration tests.

See backend/analysis-inference.md for route-map-only endpoints and verification notes.
```
