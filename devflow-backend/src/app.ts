import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoute from "./routes/user.routes";

// Creates the Express application.
// Registers middleware.
// Registers routes.
// Does not start the server.

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "DevFlow API is running",
  });
});

app.use("/api/users", userRoute);

export default app;
