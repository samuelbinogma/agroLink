/**
 * server.js — Entry point of the AgroLink backend
 *
 * This is the "brain" that:
 *   1. Loads environment variables from .env (dotenv).
 *   2. Connects to MongoDB (config/db.js).
 *   3. Creates the Express app.
 *   4. Registers middleware (cors + express.json).
 *   5. Defines the /api/health route — our first integration point
 *      so the React frontend can "ping" the backend.
 *   6. Starts the server.
 *
 * A note on file structure: we keep routes in separate files as the
 * app grows. For now there is only one, so it lives directly here.
 * In Feature 2 we will add a routes/ folder.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load variables from .env into process.env BEFORE anything uses them.
dotenv.config();

// Connect to MongoDB first.
connectDB();

// Create the Express application.
const app = express();

// ---- Middleware ----
// cors(): allows the React dev server (localhost:5173) to call our API.
//         Without it the browser would block cross-origin requests.
app.use(cors());

// express.json(): parses incoming request bodies as JSON, so when a future
//         feature sends { name: "Tomato" } we receive it as an object.
app.use(express.json());

// ---- Routes ----
// Health check — used by the frontend to confirm the backend is alive.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AgroLink API is running', time: new Date().toISOString() });
});

// ---- 404 fallback for unknown API routes ----
app.use('/api', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ---- Start the server ----
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});