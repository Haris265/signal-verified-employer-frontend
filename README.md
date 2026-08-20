# SignalVerified Employer Portal (Next.js)

Showcase-inspired employer UI wired to the Django `/employer/v1/` APIs.

## Screens

| Route | Purpose |
|---|---|
| `/` | Employer login |
| `/projects` | Projects list + entitlement panel |
| `/projects/new` | Request new project |
| `/projects/[projectId]` | Project detail + participants |
| `/projects/[projectId]/participants/[assignmentId]` | Participant evidence profile |

## Prerequisites

1. Django API running on `http://127.0.0.1:8000`
2. Employer seed data:

```bash
# from repo root, with venv active
python manage.py migrate
python manage.py seed_employer_portal
python manage.py runserver
```

Demo employer:

- Email: `loreal.ta@test.com`
- Password: `TestPass123!`

## Run frontend

```bash
cd frontend
cp .env.example .env.local   # if needed
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`NEXT_PUBLIC_API_URL` defaults to `http://127.0.0.1:8000`.

## Notes

- Only employer role (`role === 3`) can use this portal.
- Sign up is intentionally not offered; SignalVerified provisions access.
- CORS for `http://localhost:3000` is enabled in Django settings.
