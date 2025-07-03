import express from 'express';
import dotenv from 'dotenv';
import accessRoutes from './routes/access.routes';

dotenv.config();
const app = express();

app.use(express.json());

app.use('/api', accessRoutes);

app.listen(5000, () => {
  console.log('✅ Access Gate Service running on port 5000');
});
