import pool from '../db/index.js';
import cacheUtils from '../utils/cacheUtils.js'; // Import caching utility
import rateLimit from 'express-rate-limit'; // Import rate limiting middleware
// Define rate limit for payment routes
const paymentRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
export default {
    getAllPayments: async (req, res) => {
        try {
            // Check cache first
            const cacheKey = 'all_payments';
            const cachedPayments = await cacheUtils.get(cacheKey);
            if (cachedPayments) {
                res.status(200).json({
                    status: true,
                    data: cachedPayments,
                    message: 'Payments retrieved successfully from cache',
                });
                return;
            }
            // If not cached, query the database
            const result = await pool.query('SELECT * FROM payments');
            // Cache the results
            await cacheUtils.set(cacheKey, result.rows, 3600); // Cache for 1 hour
            res.status(200).json({
                status: true,
                data: result.rows,
                message: 'Payments retrieved successfully',
            });
        }
        catch (error) {
            console.error('Error retrieving payments:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    createPayment: async (req, res) => {
        const { lease_id, payment_date, amount } = req.body;
        try {
            // Check if lease exists
            const existLease = await pool.query('SELECT * FROM leases WHERE lease_id = $1', [lease_id]);
            if (existLease.rows.length === 0) {
                res.status(400).json({
                    status: false,
                    message: 'Invalid lease_id. Lease does not exist',
                });
                return;
            }
            // Insert new payment
            const result = await pool.query('INSERT INTO payments (lease_id, payment_date, amount) VALUES ($1, $2, $3) RETURNING *', [lease_id, payment_date, amount]);
            // Clear cache
            await cacheUtils.del('all_payments');
            res.status(201).json({
                status: true,
                data: result.rows[0],
                message: 'Payment created successfully',
            });
        }
        catch (error) {
            console.error('Error creating payment:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getPayment: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM payments WHERE payment_id = $1', [id]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'Payment not found',
                });
                return;
            }
            res.status(200).json({
                status: true,
                data: result.rows[0],
                message: 'Payment retrieved successfully',
            });
        }
        catch (error) {
            console.error(`Error retrieving payment: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    updatePayment: async (req, res) => {
        const { id } = req.params;
        const { lease_id, payment_date, amount, payment_status } = req.body;
        try {
            // Check if lease exists
            const existLease = await pool.query('SELECT * FROM leases WHERE lease_id = $1', [lease_id]);
            if (existLease.rows.length === 0) {
                res.status(400).json({
                    status: false,
                    message: 'Invalid lease_id. Lease does not exist',
                });
                return;
            }
            // Update payment
            const result = await pool.query('UPDATE payments SET lease_id = $1, payment_date = $2, amount = $3, payment_status = $4 WHERE payment_id = $5 RETURNING *', [lease_id, payment_date, amount, payment_status, id]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'Payment not found',
                });
                return;
            }
            // Clear cache
            await cacheUtils.del('all_payments');
            res.status(200).json({
                status: true,
                data: result.rows[0],
                message: 'Payment updated successfully',
            });
        }
        catch (error) {
            console.error(`Error updating payment: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    deletePayment: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('DELETE FROM payments WHERE payment_id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'Payment not found',
                });
                return;
            }
            // Clear cache
            await cacheUtils.del('all_payments');
            res.status(200).json({
                status: true,
                data: result.rows[0],
                message: 'Payment deleted successfully',
            });
        }
        catch (error) {
            console.error(`Error deleting payment: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
// Apply rate limiter to all payment routes
// You can include this in your routes setup, e.g.:
// app.use('/payments', paymentRateLimiter, paymentRoutes);
