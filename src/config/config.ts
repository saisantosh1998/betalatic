import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });
const config = {
    port: process.env.PORT,
    host: process.env.DB_HOST,
    dbPort: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    env: process.env.NODE_ENV,
};

export default config;