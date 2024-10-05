import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;

dotenv.config();

const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT'] as const;
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing environment variable: ${envVar}`);
    }
}

const pool = new Pool({
    user: process.env.DB_USER as string,
    host: process.env.DB_HOST as string,
    database: process.env.DB_DATABASE as string,  
    password: process.env.DB_PASSWORD as string,
    port: parseInt(process.env.DB_PORT as string, 10),
});

const testConnection = async (): Promise<void> => {
    try {
        const req = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', req.rows[0]);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

testConnection();

export default pool;