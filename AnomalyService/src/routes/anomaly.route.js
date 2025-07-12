// routes/anomaly.js
import express from 'express';
import { detectAnomalies } from '../services/elastic.js'

const router = express.Router();

router.get('/check-anomalies', async (req, res) => {
  const { threshold, windowMinutes } = req.query;
  try {
    const anomalies = await detectAnomalies({
      threshold,
      windowMinutes
    });

    res.json({ anomalies });
  } catch (err) {
    console.error('Error checking anomalies:', err);
    res.status(500).send('Internal Server Error');
  }
});
export default router;
