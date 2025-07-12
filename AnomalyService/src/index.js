// server.js
import express from "express";
import anomalyRoutes from "./routes/anomaly.route.js";
import { getAnomalies } from "./services/elastic.js";

const app = express();
const PORT = 8192;

app.use(express.json());

app.get("/", (req, res) => {
  const data = req.body;
  res.status(200).json({
    message:
      "Hey there, just wanted to let you know that the server is working. All the best ;)",
    data,
  });
});

app.post("/get-alerts", async (req, res) => {
  const { userId } = req.query;
  try {
    const alerts = await getAlerts({
      userId,
    });

    res.json({ alerts });
  } catch (err) {
    console.error("Error getting anomalies:", err);
    res.status(500).send(err || "Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Anomaly Service running at http://localhost:${PORT}`);
});
