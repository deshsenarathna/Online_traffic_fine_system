# Admin Portal — Traffic Fine Monitoring

Admin web portal for senior Sri Lanka Police officials to monitor traffic fine
collections nationwide. Part of the Online Traffic Fine System group project.

Built with **React + Vite**, charts via **Recharts**, API calls via **Axios**,
JWT auth handled on the frontend.

## Run it

```bash
cd admin-portal
npm install
npm run dev
```

Open the URL Vite prints (default http://localhost:5174).

**Demo login:** `admin` / `admin123`

Right now everything runs on **mock data**, so you don't need the backend
running to develop the UI.

## Features

- JWT-based login (token stored in localStorage, attached to every request)
- Nationwide summary cards (total collected, fines issued, paid, unpaid)
- District-wise collections bar chart
- Fine-category breakdown donut chart
- Filterable fine-records table (by district and date range)
- Protected routes (redirects to /login when not authenticated)

## How to connect the real backend

All backend calls live in **one file**: `src/api/adminApi.js`.
Each function has a working mock and the real `client` call commented beneath it.

Steps:
1. Confirm the exact endpoints + JSON shapes with the backend dev.
2. In `vite.config.js`, uncomment the `proxy` block so `/api/*` reaches Spring Boot.
3. In `adminApi.js`, swap each mock for the commented-out real call.

The expected API contract (adjust to match what the backend actually returns):

| Method | Endpoint                            | Returns |
|--------|-------------------------------------|---------|
| POST   | `/api/auth/login`                   | `{ token }` |
| GET    | `/api/admin/summary`                | `{ totalCollected, totalFines, paid, unpaid }` |
| GET    | `/api/admin/collections/by-district`| `[ { district, total } ]` |
| GET    | `/api/admin/collections/by-category`| `[ { category, total, count } ]` |
| GET    | `/api/admin/fines?from=&to=&district=` | `[ { ref, category, district, amount, status, date } ]` |

## Project structure

```
admin-portal/
├── src/
│   ├── api/
│   │   ├── client.js        # axios instance + JWT interceptor
│   │   └── adminApi.js      # mock data + real endpoint stubs  <- edit here
│   ├── auth/AuthContext.jsx # login state
│   ├── components/          # Sidebar, charts, table, cards
│   ├── pages/               # Login, Dashboard
│   ├── App.jsx              # routes
│   └── main.jsx
└── package.json
```
