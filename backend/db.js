const mongoose = require("mongoose");

const cleanEnvValue = (value = "") => value.trim().replace(/^['"]|['"]$/g, "");

const connectDb = async () => {
  const mongoUri = cleanEnvValue(process.env.MONGODB_URI || "");

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to backend/.env before starting the server.");
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || undefined,
  });

  console.log("MongoDB connected");
};

module.exports = { connectDb };
