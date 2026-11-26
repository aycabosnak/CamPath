# CamPath API

ASP.NET Core 8 Web API that adds accounts and cross-device progress sync to the CamPath frontend.

**Stack:** C# 12 · ASP.NET Core 8 (controllers) · EF Core 8 + SQLite · JWT bearer auth · xUnit integration tests · Swagger/OpenAPI · Docker

## Run it

```bash
cd backend
dotnet tool restore                          # dotnet-ef (for migrations)
dotnet run --project src/CamPath.Api         # http://localhost:5080, Swagger at /swagger
```

Then start the frontend from the repo root (`npm run dev`). Next.js forwards `/api/*` to `http://localhost:5080` (see `next.config.js`, override with `CAMPATH_API_URL`).

The database (`campath.db`) is created and migrated automatically on startup.

## Test it

```bash
dotnet test
```

24 integration tests boot the real API in memory (`WebApplicationFactory`) against an in-memory SQLite database — real SQL, real unique indexes, real migrations. They cover registration, login, token validation, rate limiting, and every sync merge rule.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account → `{ accessToken, expiresAt, user }` |
| POST | `/api/auth/login` | – | Sign in → same shape |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/progress` | JWT | Full progress state |
| PUT | `/api/progress/sync` | JWT | Merge this device's state into the account, return merged state |
| GET | `/api/health` | – | Liveness + database check |

## How sync works

The frontend keeps working offline against `localStorage`. When signed in, it sends its **whole** progress state and writes the merged answer back. Each field has a merge rule that is order-independent and idempotent, so any number of devices converge without a change log or conflict UI:

| Data | Rule |
|---|---|
| Lesson completions | First completion wins (earliest `completedAt`) |
| Mixed Test attempts, Progress Checks | Latest attempt wins |
| Milestones | Union by level, earliest achievement wins |
| Study days | Set union |
| Skill mastery | Per skill, latest `masteryUpdatedAt` wins |
| Placement result | Latest `completedAt` wins |
| Study time | Never merged — recomputed from lesson minutes, so it can't be double-counted |

Implementation: `Services/ProgressSyncService.cs`. Unique indexes on `(UserId, key)` make repeated pushes safe; a concurrent insert race is retried once.

## Security notes

- Passwords hashed with ASP.NET Core Identity's `PasswordHasher` (PBKDF2), rehashed automatically when the algorithm is upgraded.
- Login returns the same message for "unknown email" and "wrong password".
- Login/register are rate limited per IP (`RateLimiting:AuthPermitLimit`, default 10/min).
- The JWT signing key is **not** in `appsettings.json`. Development uses a dev-only key; anywhere else set `Jwt__SigningKey` (32+ bytes) or the app refuses to start.
- Sync payloads are validated and capped (500 entries per collection, 64 KB placement result).

## Docker

```bash
docker build -t campath-api ./backend
docker run -p 5080:8080 -e Jwt__SigningKey="<32+ random bytes>" -v campath-data:/data campath-api
```

## Project layout

```
src/CamPath.Api/
  Controllers/   AuthController, ProgressController
  Services/      TokenService (JWT), ProgressSyncService (merge rules)
  Domain/        Entities
  Data/          AppDbContext + EF Core migrations
  Contracts/     Request/response DTOs (mirror the frontend's ProgressState)
tests/CamPath.Api.Tests/
  AuthTests, ProgressSyncTests, CamPathApiFactory
```

## Not built yet

Refresh tokens, password reset, email verification, teacher/class endpoints. See `docs/PROJECT_STATUS.md`.
