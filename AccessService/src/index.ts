import dotenv from "dotenv";
import express from "express";
import accessRoutes from "./routes/access.routes";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api", accessRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("Access Gate Service running on port 5000");
});
