// server.js
import express from "express";
import { getAlerts } from "./services/elastic.js";
import { getAllUsersInfo } from "./services/db.js";
import { waitForElasticsearch } from "./lib/elastic.js";
import cookieParser from "cookie-parser";
import {
  jwtMiddleware,
  requirerole,
  requireBankRole,
} from "./middlewares/jwtMiddleware.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8192;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // if you're using cookies or authorization headers
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  const data = req.body;
  res.status(200).json({
    message:
      "Hey there, just wanted to let you know that the server is working. All the best ;)",
    data,
  });
});

// Get alerts for authenticated user (role 'user' gets their own alerts)
app.get("/get-alerts", jwtMiddleware, async (req, res) => {
  try {
    let userId;

    if (req.role === "user") {
      // For users, use their own userId from token
      userId = req.userId;
    } else {
      return res.status(403).json({ message: "Forbidden: Invalid role" });
    }

    const alerts = await getAlerts("alerts", userId);
    res.json({ alerts });
  } catch (err) {
    console.error("Error getting alerts:", err);
    res.status(500).send(err || "Internal Server Error");
  }
});

// Get all alerts - only accessible by bank role
app.get(
  "/get-alerts-user",
  jwtMiddleware,
  requireBankRole,
  async (req, res) => {
    const { userId } = req.params; // Bank role can access all alerts
    try {
      const alerts = await getAlerts("alerts", userId); // No userId filter to get all alerts
      res.json({ alerts });
    } catch (err) {
      console.error("Error getting all alerts:", err);
      res.status(500).send(err || "Internal Server Error");
    }
  }
);

// Get users who have alerts - only accessible by bank role
app.get("/get-all-alerts", jwtMiddleware, requireBankRole, async (req, res) => {
  try {
    const alerts = await getAlerts("alerts");
    const uniqueUserIds = [...new Set(alerts.map((alert) => alert.userId))];

    // Get user information for each unique userId
    const allUsers = await getAllUsersInfo();
    const usersWithAlerts = allUsers.filter((user) =>
      uniqueUserIds.includes(user.id)
    );

    const result = usersWithAlerts.map((user) => ({
      userId: user.id,
      userName: user.name,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error getting alerts users:", err);
    res.status(500).send(err || "Internal Server Error");
  }
});

// Start server with Elasticsearch readiness check
async function startServer() {
  try {
    console.log("🔍 Checking Elasticsearch connection...");
    await waitForElasticsearch();

    app.listen(PORT, () => {
      console.log(`🚀 Anomaly Service running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
