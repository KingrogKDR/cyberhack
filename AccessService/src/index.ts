import dotenv from "dotenv";
import express from "express";
import accessRoutes from "./routes/access.routes";

dotenv.config();
const app = express();
const port = Number(process.env.ACCESS_SERVICE_PORT) || 5000;

app.use(express.json());

app.use("/api", accessRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Access Gate Service running on port ${port}`);
});
