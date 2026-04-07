const { isDbConnected, getDbStatus } = require("../db");

const requireDbReady = (_req, res, next) => {
  if (isDbConnected()) {
    return next();
  }

  const dbStatus = getDbStatus();
  return res.status(503).json({
    error:
      "Database is not connected yet. Check your MongoDB Atlas network access and Render environment variables, then retry.",
    database: dbStatus,
  });
};

module.exports = { requireDbReady };
