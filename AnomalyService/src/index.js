// server.js
import express from "express";
import { getAlerts } from "./services/elastic.js";
import { waitForElasticsearch } from "./lib/elastic.js";

const app = express();
const PORT = process.env.PORT || 8192;

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

// Start server with Elasticsearch readiness check
async function startServer() {
  try {
    console.log('🔍 Checking Elasticsearch connection...');
    await waitForElasticsearch();
    
    app.listen(PORT, () => {
      console.log(`🚀 Anomaly Service running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
