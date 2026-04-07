const mongoose = require("mongoose");
const { cleanEnvValue } = require("./utils/env");
let hasConnectedOnce = false;

mongoose.set("bufferCommands", false);

const connectDb = async () => {
  const mongoUri = cleanEnvValue(process.env.MONGODB_URI || "");

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to backend/.env before starting the server.");
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || undefined,
  });

  hasConnectedOnce = true;
  console.log("MongoDB connected");
};

const getDbStatus = () => ({
  readyState: mongoose.connection.readyState,
  hasConnectedOnce,
});

const isDbConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDb, getDbStatus, isDbConnected };
