// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDb, getDbStatus } = require('./db');

// Import your routes
const generateReadmeRoute = require('./routes/generateReadme');
const authRoute = require('./routes/auth');
const readmeRoute = require('./routes/readmes');

const app = express();
const PORT = process.env.PORT || 5000;
const configuredOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:8080")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  ...configuredOrigins,
  "http://localhost:8080",
  "http://localhost:8081",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8081",
]);
 
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
}));
app.use(express.json()); // Parses incoming JSON requests

app.get('/api/health', (_req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    ok: true,
    database: {
      readyState: dbStatus.readyState,
      hasConnectedOnce: dbStatus.hasConnectedOnce,
    },
  });
});

app.use('/api', generateReadmeRoute);
app.use('/api/auth', authRoute);
app.use('/api/readmes', readmeRoute);

const startDbConnectionLoop = async () => {
  try {
    await connectDb();
  } catch (error) {
    console.error('Initial MongoDB connection failed. Retrying in 10 seconds.', error);
    setTimeout(startDbConnectionLoop, 10000);
  }
};

app.listen(PORT, () => {
  console.log(`Server is successfully running on http://localhost:${PORT}`);
  startDbConnectionLoop();
});
