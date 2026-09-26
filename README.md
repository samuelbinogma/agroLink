# 🌱 AgroLink

**Agriculture Direct Marketplace** — a MERN-stack platform where farmers and
customers trade agricultural products directly, cutting out the middlemen.

> **Status:** Feature 2 complete — full authentication (register + OTP + login + JWT).
> Remaining roadmap items below get built one at a time.

## Tech Stack

| Layer      | Tech                                                          |
| ---------- | ------------------------------------------------------------- |
| Frontend   | React (Vite) + React Router + vanilla CSS + Axios + React Hook Form |
| Backend    | Node.js + Express.js                                           |
| Database   | MongoDB + Mongoose                                             |
| Auth       | JWT + OTP, bcrypt (bcryptjs), express-validator                |
| Real-time (planned) | Socket.io                                               |
| Uploads (planned)  | Multer + Cloudinary                                        |

## What's built so far

### Feature 2 — Authentication (register, OTP verify, login, JWT)

- **User model** (`backend/models/User.js`): name, role (`farmer|customer`),
  email/phone (sparse-unique), bcrypt-hashed password, `isVerified` + OTP fields
- **OTP flow**: register auto-sends a 6-digit code → `/auth/verify-otp` activates
  the account and returns a JWT → login is enabled. OTPs expire in 10 minutes
  and are stored as a SHA-256 hash.
  - *Dev note:* codes are printed in the **backend console**
    (`[DEV-OTP] -> your code: XXXXXX`). Swap `sendOtp` in
    `backend/utils/otp.js` for a real email/SMS provider later.
- **JWT**: signed with a secret from `.env`, payload = `{ id, role }`,
  expires after 7 days. `protect` middleware (`backend/middleware/authMiddleware.js`)
  guards private routes — currently `/auth/me`.
- **Frontend pages**: `Register` (role selection), `Login`, `VerifyOtp` with
  react-hook-form; **AuthContext** manages global auth state and localStorage
  token persistence; Axios interceptor attaches `Bearer` token to all requests.
- **Navbar** now shows Log in / Sign up (logged out) or user name + role + Logout.

### Feature 1 — Project scaffold + Home page

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
│   ├── .env                  # PORT, MONGO_URI, JWT_SECRET (gitignored)
│   ├── server.js             # Express entry point
│   ├── config/db.js          # Mongoose connection
│   ├── models/User.js        # user schema (role, contacts, OTP)
│   ├── controllers/authController.js  # register / OTP / login / me
│   ├── routes/authRoutes.js  # /api/auth + express-validator rules
│   ├── middleware/           # protect (JWT guard), validate (400 helper)
│   └── utils/                # otp.js, generateToken.js
└── frontend/
    ├── vite.config.js        # dev proxy /api → http://localhost:5001
    └── src/
        ├── main.jsx          # BrowserRouter + AuthProvider
        ├── App.jsx           # route table
        ├── api/client.js     # Axios instance + JWT interceptor
        ├── context/AuthContext.jsx  # global auth state (useAuth)
        ├── components/Layout.jsx    # navbar + footer + auth buttons
        └── pages/            # Home, Register, Login, VerifyOtp, dashboards
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
JWT_SECRET=<any long random string>
JWT_EXPIRES_IN=7d
```

For MongoDB Atlas (cloud), replace `MONGO_URI` with your Atlas connection string.

## API endpoints

| Method | Route               | Description                              |
| ------ | ------------------- | ---------------------------------------- |
| GET    | `/api/health`       | Liveness check (backed by MongoDB)       |
| POST   | `/api/auth/register`| Create account + auto-send OTP           |
| POST   | `/api/auth/request-otp` | Resend a fresh OTP                   |
| POST   | `/api/auth/verify-otp` | Check code → activate + return JWT    |
| POST   | `/api/auth/login`   | Contact + password → return JWT          |
| GET    | `/api/auth/me`      | Current user (requires Bearer token)     |

## Roadmap (planned, in build order)

1. ✅ Project scaffold + Home page
2. ✅ User model + Authentication (signup/login with role + OTP)
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