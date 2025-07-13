import express from 'express';
import dotenv from 'dotenv';
import accessRoutes from './routes/access.routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api', accessRoutes);

app.listen(PORT, () => {
  console.log(`✅ Access Gate Service running on port ${PORT}`);
});
