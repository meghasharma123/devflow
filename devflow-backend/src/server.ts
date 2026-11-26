import app from "./app";
import dotenv from "dotenv";
import { connectRedis } from "./config/redis.";

// Loads environment configuration.
// Starts the HTTP server.
// Handles server startup.

dotenv.config();

const PORT = Number(process.env.DEV_PORT) || 3000;

async function startServer() {
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
