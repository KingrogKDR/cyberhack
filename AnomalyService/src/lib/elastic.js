// elasticClient.js
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

export const elasticClient = new Client({
  node: process.env.ELASTIC_URL, 
  // auth: {
  //   username: 'elastic',
  //   password: 'your-password'
  // },
  compatibility: true // ✅ This forces Accept headers for ES 8.x
});