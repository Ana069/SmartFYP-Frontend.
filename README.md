# SmartFYP — Frontend

This is the **frontend-only** portion of the SmartFYP project

## Stack
- React 19 + Vite 6
- React Router v7
- Tailwind CSS v4
- Axios, Recharts, Lucide Icons, React Hot Toast, Framer Motion (`motion`)

## Structure
```
src/
 ├── components/     Reusable UI components (Navbar, modals, tables, etc.)
 ├── context/         React context providers (Auth, Notifications)
 ├── layouts/         Page layout wrappers (DashboardLayout)
 ├── pages/            Route-level pages (Home, Login, Projects, dashboards, etc.)
 ├── services/         API client (api.js)
 ├── utils/            Helper functions
 ├── App.jsx           Root component / router
 ├── main.jsx          App entry point
 └── index.css         Global styles (Tailwind)
index.html             Vite HTML entry
vite.config.js         Vite build/dev configuration
```

## Demo Mode (no backend required)

This frontend includes a **Demo Mode** so you can present the UI without running the
Express backend or MongoDB at all. On the Login page, use any of these accounts —
they're checked locally and never hit a real API:

| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | demo123 |
| HOD | hod@demo.com | demo123 |
| Supervisor | supervisor@demo.com | demo123 |
| Team Leader | leader@demo.com | demo123 |
| Team Member | member@demo.com | demo123 |

Make sure the **role dropdown on the login form matches** the account's role above.

Once logged in, any API calls that fail (because there's no backend) are quietly
turned into empty responses, so dashboards render normally with empty lists/states
instead of throwing network errors. This mode is meant for showing off the UI/UX —
it does **not** simulate real project/task data. For a fully working demo with real
data, run the actual backend (see "Connecting to a real backend" below).

See `src/utils/demoMode.js` for how this works or to add more demo accounts.

## Running standalone

```bash
npm install
npm run dev
```

### Connecting to a real backend
This app talks to a backend API. By default it makes relative `/api/...` requests,
so you'll either need:
1. The backend server running locally (see `vite.config.js` — dev server proxies
   `/api` to `http://localhost:3000`), or
2. A deployed backend URL set via an environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
   (create a `.env` file in this folder with that line)

To build for production:
```bash
npm run build
```
Output goes to `dist/`.


