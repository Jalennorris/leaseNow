import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;
dotenv.config();
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing environment variable: ${envVar}`);
    }
}
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
});
const testConnection = async () => {
    try {
        const req = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', req.rows[0]);
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
testConnection();
export default pool;
