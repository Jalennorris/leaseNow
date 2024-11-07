import https from 'https';
import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import userRoute from './routes/userRoute.js';
import propertiesRoute from './routes/propertiesRoute.js';
import leaseRoute from './routes/leaseRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import reviewRoute from './routes/reviewRoute..js';
import contactRoute from './routes/controllerRoute.js';
//node dist/index.js
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
let key, cert;
try {
    key = fs.readFileSync('./key.pem');
    cert = fs.readFileSync('./cert.pem');
}
catch (err) {
    console.error('Error reading  SSL certificate files:', err);
    process.exit(1);
}
const credentials = { key, cert };
// Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);
app.use(helmet());
app.use(cors({
    origin: "*"
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Routes
app.use('/api/users', userRoute);
app.use('/api/properties', propertiesRoute);
app.use('/api/leases', leaseRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/contacts', contactRoute);
// Middleware for setting secure cookies
app.use((req, res, next) => {
    res.cookie('name', 'value', {
        secure: true,
        httpOnly: true
    });
    next();
});
// Custom root path route
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Welcome to the API"
    });
});
// 404 Handler
app.use("*", (req, res) => {
    res.status(404).json({
        status: false,
        message: "API Doesn't exist"
    });
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        error: err.message
    });
});
// Create HTTPS server
const server = https.createServer(credentials, app);
server.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});
