# SignalVerified Employer Portal (Next.js)

Showcase-inspired employer UI wired to the Django `/employer/v1/` APIs.

## Screens

| Route | Purpose |
|---|---|
| `/` | Employer login |
| `/persona` | First-time persona selection (org vs student/candidate) |
| `/register` | B2C candidate self-registration |
| `/projects` | Projects list + entitlement panel |
| `/projects/new` | Request new project (licensed orgs only; hiring capped 1–3) |
| `/projects/[projectId]` | Project detail + participants (no list scores) |
| `/projects/[projectId]/participants/[assignmentId]` | B2B HTML Signal (final score only; PDF download separate) |

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

- Only employer role (`role === 3`) can use the projects portal.
- B2B orgs are provisioned by SignalVerified; B2C candidates self-register via `/persona` → `/register`.
- `Entitlement.contact_sales === true` greys out New project (admin license gate).
- CORS for `http://localhost:3000` is enabled in Django settings.
