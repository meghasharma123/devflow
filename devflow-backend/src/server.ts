import app from "./app";
import dotenv from "dotenv"

// Loads environment configuration.
// Starts the HTTP server.
// Handles server startup.

dotenv.config()

const PORT = Number(process.env.DEV_PORT) || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})