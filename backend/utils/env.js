const crypto = require("crypto");

const cleanEnvValue = (value = "") => value.trim().replace(/^['"]|['"]$/g, "");

let cachedJwtSecret = null;

const getJwtSecret = () => {
  if (cachedJwtSecret) {
    return cachedJwtSecret;
  }

  const configuredSecret = cleanEnvValue(process.env.JWT_SECRET || "");
  if (configuredSecret) {
    cachedJwtSecret = configuredSecret;
    return cachedJwtSecret;
  }

  cachedJwtSecret = crypto
    .createHash("sha256")
    .update(cleanEnvValue(process.env.MONGODB_URI || "") || "readify-ai-fallback-secret")
    .digest("hex");

  console.warn("JWT_SECRET is missing. Using a generated fallback secret for this runtime.");
  return cachedJwtSecret;
};

module.exports = { cleanEnvValue, getJwtSecret };
