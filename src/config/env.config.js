const requiredEnvVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};