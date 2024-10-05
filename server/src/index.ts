import https from 'https';
import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import userRoute from './routes/userRoute.js'
import propertiesRoute from './routes/propertiesRoute.js'
import leaseRoute from './routes/leaseRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import reviewRoute from  './routes/reviewRoute..js'


//node dist/index.js
dotenv.config();

const app = express();
const port = process.env.PORT || 4000; // Default to 3000 if PORT is not defined

let key: Buffer, cert: Buffer;
try {
    key = fs.readFileSync('./key.pem');
    cert = fs.readFileSync('./cert.pem');
} catch (err) {
    console.error('Error reading  SSL certificate files:', err);
    process.exit(1);
}

const credentials = {key, cert};

// Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});

app.use(limiter);
app.use(helmet()); // Added Helmet for security
app.use(cors({
    origin: "*" // Consider restricting this in production
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Routes
app.use('/api/users', userRoute)
app.use('/api/properties', propertiesRoute)
app.use('/api/leases', leaseRoute)
app.use('/api/payments', paymentRoute)
app.use('/api/reviews', reviewRoute)


// Middleware for setting secure cookies
app.use((req: Request, res: Response, next: NextFunction) => {
    res.cookie('name', 'value', {
        secure: true,
        httpOnly: true
    });
    next();
});

// Custom root path route
app.get('/', (req: Request, res: Response) => {
    res.json({
        status: true,
        message: "Welcome to the API"
    });
});

// 404 Handler
app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: false,
        message: "API Doesn't exist"
    });
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        error: err.message // Include error message for debugging
    });
});

// Create HTTPS server
const server = https.createServer(credentials, app);

server.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});