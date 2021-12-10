import { cleanEnv, url } from 'envalid'
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  CORS: url(),
});
