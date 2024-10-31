import pool from '../db/index.js';
import cacheUtils from '../utils/cacheUtils.js'; // Import caching utility
export default {
    createLease: async (req, res) => {
        const { renter_id, property_id, lease_month, monthly_rent } = req.body;
        // Input validation
        if (!renter_id || !property_id || !lease_month || !monthly_rent) {
            res.status(400).json({
                status: false,
                message: 'Missing required fields',
            });
            return;
        }
        try {
            // Check if renter_id and property_id exist in the users and properties tables
            const userExists = await pool.query('SELECT 1 FROM users WHERE user_id = $1', [renter_id]);
            const propertyExists = await pool.query('SELECT 1 FROM properties WHERE property_id = $1', [property_id]);
            if (userExists.rows.length === 0) {
                res.status(400).json({
                    status: false,
                    message: 'Invalid renter_id. User does not exist',
                });
                return;
            }
            if (propertyExists.rows.length === 0) {
                res.status(400).json({
                    status: false,
                    message: 'Invalid property_id. Property does not exist',
                });
                return;
            }
            // Insert into leases table
            const result = await pool.query('INSERT INTO leases (renter_id, property_id, lease_month , monthly_rent) VALUES ($1, $2, $3, $4) RETURNING *', [renter_id, property_id, lease_month, monthly_rent]);
            // Clear cache
            await cacheUtils.del('all_leases');
            res.status(201).json({
                status: true,
                data: result.rows[0],
                message: 'Lease created successfully',
            });
        }
        catch (error) {
            console.error('Error creating lease:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getLease: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('SELECT * FROM leases WHERE lease_id = $1', [id]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'Lease not found',
                });
                return;
            }
            res.status(200).json({
                status: true,
                data: result.rows[0],
                message: 'Lease retrieved successfully',
            });
        }
        catch (error) {
            console.error(`Error retrieving lease: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    deleteLease: async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query('DELETE FROM leases WHERE lease_id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'Lease not found',
                });
                return;
            }
            // Clear cache
            await cacheUtils.del('all_leases');
            res.status(200).json({
                status: true,
                data: result.rows[0],
                message: 'Lease deleted successfully',
            });
        }
        catch (error) {
            console.error(`Error deleting lease: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    updateLease: async (req, res) => {
        const { id } = req.params;
        const { renter_id, property_id, start_date, end_date, monthly_rent, deposit } = req.body;
        // Input validation
        if (!renter_id || !property_id || !start_date || !end_date || !monthly_rent || !deposit) {
            res.status(400).json({
                status: false,
                message: 'Missing required fields',
            });
            return;
        }
        try {
            // Update lease
            const result = await pool.query('UPDATE leases SET renter_id = $1, property_id = $2, start_date = $3, end_date = $4, monthly_rent = $5, deposit = $6 WHERE lease_id = $7 RETURNING *', [renter_id, property_id, start_date, end_date, monthly_rent, deposit, id]);
            if (result.rows.length === 0) {
                res.status(404).json({
                    status: false,
                    message: 'Lease not found',
                });
                return;
            }
            // Clear cache
            await cacheUtils.del('all_leases');
            res.status(200).json({
                status: true,
                data: result.rows[0],
                message: 'Lease updated successfully',
            });
        }
        catch (error) {
            console.error(`Error updating lease: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getAllLeases: async (req, res) => {
        try {
            // Check cache first
            const cacheKey = 'all_leases';
            const cachedLeases = await cacheUtils.get(cacheKey);
            if (cachedLeases) {
                res.status(200).json({
                    status: true,
                    data: cachedLeases,
                    message: 'All leases retrieved successfully from cache',
                });
                return;
            }
            // If not cached, query the database
            const result = await pool.query('SELECT * FROM leases');
            // Cache the results
            await cacheUtils.set(cacheKey, result.rows, 3600); // Cache for 1 hour
            res.status(200).json({
                status: true,
                data: result.rows,
                message: 'All leases retrieved successfully',
            });
        }
        catch (error) {
            console.error('Error retrieving all leases:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
