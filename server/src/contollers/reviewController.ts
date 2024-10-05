import pool from '../db/index.js';
import { Request, Response } from 'express';
import cacheUtils from '../utils/cacheUtils.js'; // Import caching utility
import rateLimit from 'express-rate-limit';

// Create a rate limiter for creating reviews
const createReviewRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many reviews created from this IP, please try again later.',
    headers: true,
});

export default {

    createReview:  async (req: Request, res: Response): Promise<void> => {
        const { renter_id, property_id, rating, comment } = req.body;

        // Input validation
        if (!renter_id || !property_id || !rating) {
            res.status(400).json({
                status: false,
                message: 'Missing required fields',
            });
            return;
        }
        if (rating < 1 || rating > 5) {
            res.status(400).json({
                status: false,
                message: 'Rating must be between 1 and 5',
            });
            return;
        }

        try {
            // Check if review already exists
            const existingReview = await pool.query('SELECT 1 FROM reviews WHERE renter_id = $1 AND property_id = $2', [renter_id, property_id]);
            if (existingReview.rows.length > 0) {
                res.status(400).json({
                    status: false,
                    message: 'Review already exists',
                });
                return;
            }

            // Insert new review
            const result = await pool.query('INSERT INTO reviews (renter_id, property_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *', [renter_id, property_id, rating, comment]);

            // Clear cache
            await cacheUtils.del('all_reviews');

            res.status(201).json({
                status: true,
                data: result.rows[0],
                message: 'Review created successfully',
            });
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getReviews: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check cache first
            const cacheKey = 'all_reviews';
            const cachedReviews = await cacheUtils.get(cacheKey);
            if (cachedReviews) {
                res.status(200).json({
                    status: true,
                    data: cachedReviews,
                    message: 'Reviews retrieved successfully from cache',
                });
                return;
            }

            // Query database if not cached
            const result = await pool.query('SELECT * FROM reviews');

            // Cache results
            await cacheUtils.set(cacheKey, result.rows, 3600); // Cache for 1 hour

            res.status(200).json({
                status: true,
                data: result.rows,
                message: 'Reviews retrieved successfully',
            });
        } catch (error) {
            console.error('Error retrieving reviews:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getReview: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM reviews WHERE review_id = $1', [id]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'Review not found',
                });
                return;
            }
            res.status(200).json({
                status: true,
                data: result.rows[0],
                message: 'Review retrieved successfully',
            });
        } catch (error) {
            console.error(`Error retrieving review: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateReview: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { rating, comment } = req.body;

        // Input validation
        if (rating && (rating < 1 || rating > 5)) {
            res.status(400).json({
                status: false,
                message: 'Rating must be between 1 and 5',
            });
            return;
        }

        try {
            const result = await pool.query('UPDATE reviews SET rating = $1, comment = $2 WHERE review_id = $3 RETURNING *', [rating, comment, id]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'Review not found',
                });
                return;
            }

            // Clear cache
            await cacheUtils.del('all_reviews');

            res.status(200).json({
                status: true,
                data: result.rows[0],
                message: 'Review updated successfully',
            });
        } catch (error) {
            console.error(`Error updating review: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    deleteReview: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const result = await pool.query('DELETE FROM reviews WHERE review_id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'Review not found',
                });
                return;
            }

            // Clear cache
            await cacheUtils.del('all_reviews');

            res.status(200).json({
                status: true,
                data: result.rows[0],
                message: 'Review deleted successfully',
            });
        } catch (error) {
            console.error(`Error deleting review: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

};
