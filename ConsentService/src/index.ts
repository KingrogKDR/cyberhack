import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import consentRoutes from './routes/consent.routes';
import { startConsentExpirationJob } from './jobs/expireConsents.job';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Global middlewares
app.use(helmet());               // Security headers
app.use(cors());                
app.use(express.json());         

app.use('/api', consentRoutes);

app.get('/', (_req, res) => {
  res.send('✅ Consent Service is running');
});

// Start background job (e.g., hourly expiration task)
startConsentExpirationJob();

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Consent Service running at http://localhost:${PORT}`);
});
