# 🌱 AgroLink

**Agriculture Direct Marketplace** — a MERN-stack platform where farmers and
customers trade agricultural products directly, cutting out the middlemen.

> **Status:** Feature 1 complete — project scaffold + Home page.
> The rest of the roadmap is listed below as it gets built, one feature at a time.

## Tech Stack

| Layer      | Tech                                                          |
| ---------- | ------------------------------------------------------------- |
| Frontend   | React (Vite) + React Router + vanilla CSS + Axios              |
| Backend    | Node.js + Express.js                                           |
| Database   | MongoDB + Mongoose                                             |
| Auth (planned) | JWT + OTP (mobile/email), bcrypt, express-validator        |
| Real-time (planned) | Socket.io                                               |
| Uploads (planned)  | Multer + Cloudinary                                        |

## What's built so far (Feature 1)

- Full MERN folder structure (`backend/` + `frontend/`)
- Express server with a `/api/health` endpoint (first frontend↔backend handshake)
- MongoDB connection via Mongoose (`backend/config/db.js`)
- Vite + React app with React Router
- **Home page** with a hero section and Farmer/Customer role selection that
  routes to placeholder dashboards
- Live **API status chip** on the Home page that checks `/api/health` on load
- Shared Axios client (`src/api/client.js`) ready to carry JWT tokens later
- Design tokens (`CSS variables`) in `src/index.css` so the app is themeable

## Folder structure

```
agroLink/
├── backend/
│   ├── .env                  # PORT, MONGO_URI (gitignored — never commit)
│   ├── server.js             # Express entry point
│   └── config/db.js          # Mongoose connection
└── frontend/
    ├── vite.config.js        # dev proxy /api → http://localhost:5001
    └── src/
        ├── main.jsx          # BrowserRouter + app mount
        ├── App.jsx           # route table
        ├── api/client.js     # shared Axios instance (baseURL '/api')
        ├── components/Layout.jsx   # shared navbar + footer shell
        ├── pages/Home.jsx          # landing + role selection
        ├── pages/FarmerDashboard.jsx    # placeholder
        └── pages/CustomerDashboard.jsx  # placeholder
```

## Getting started

Prerequisites: **Node.js 18+** and **MongoDB running locally** on port 27017
(installed as a Windows service, auto-starts).

```bash
# 1. Backend  (port 5001)
cd backend
npm install
npm run dev

# 2. Frontend (port 5174, auto-picks a free port if 5173 is busy)
cd frontend
npm install
npm run dev
```

Open **http://localhost:5174** — the Home page should show `API connected ✓`.

> Note: this project uses port **5001** because your other project
> (My-Portfolio) occupies 5000.

### Environment variables

Copy `backend/.env` before first run (it ships with defaults):

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/agroLink
NODE_ENV=development
```

For MongoDB Atlas (cloud), replace `MONGO_URI` with your Atlas connection string.

## API endpoints

| Method | Route        | Description                        |
| ------ | ------------ | ---------------------------------- |
| GET    | `/api/health`| Liveness check (backed by MongoDB) |

## Roadmap (planned, in build order)

1. ✅ Project scaffold + Home page
2. User model + Authentication (signup/login with role + OTP)
3. Protected routes + role-based dashboards
4. Farmer product upload & management (CRUD)
5. Customer marketplace (browse, search, filter)
6. Product detail + basic order system
7. In-app messaging (Socket.io)
8. Order status updates + ratings/reviews
9. Location / geospatial features
10. Notifications, profiles, admin, polish

## Scripts

| Where     | Command        | What it does                     |
| --------- | -------------- | -------------------------------- |
| backend   | `npm run dev`  | Start API with auto-restart      |
| backend   | `npm start`    | Start API                        |
| frontend  | `npm run dev`  | Start Vite dev server            |
| frontend  | `npm run build`| Production build to `dist/`      |
| frontend  | `npm run lint` | oxlint (0 warnings/errors)       |