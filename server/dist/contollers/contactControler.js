import pool from '../db/index.js';
export default {
    createContact: async (req, res) => {
        const { firstName, lastName, email, message, phone, checkbox } = req.body;
        try {
            if (!firstName || !lastName || !email || !message || !phone || !checkbox) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const insertQuery = 'Insert into contacts (firstname, lastname, email, message, phone, checkbox) values ($1, $2, $3, $4, $5, $6) returning *';
            const insertValues = [firstName, lastName, email, message, phone, checkbox];
            const result = await pool.query(insertQuery, insertValues);
            res.status(201).json({
                message: 'Contact created successfully',
                status: true,
                data: result.rows[0]
            });
        }
        catch (error) {
            console.error('Error creating contact', error);
            res.status(500).json({
                status: false,
                message: 'Error creating contact',
                error: 'Internal server error'
            });
        }
    },
    getContacts: async (req, res) => {
        try {
            const query = 'SELECT * FROM contacts';
            const result = await pool.query(query);
            res.status(200).json({
                status: true,
                data: result.rows
            });
        }
        catch (error) {
            console.error('Error retrieving contacts', error);
            res.status(500).json({
                status: false,
                message: 'Error retrieving contacts',
                error: 'Internal server error'
            });
        }
    },
    getContact: async (req, res) => {
        const { id } = req.params;
        try {
            const query = 'SELECT * FROM contacts WHERE id = $1';
            const result = await pool.query(query, [id]);
            res.status(200).json({
                status: true,
                data: result.rows[0]
            });
        }
        catch (error) {
            console.error('Error retrieving contact', error);
            res.status(500).json({
                status: false,
                message: 'Error retrieving contact',
                error: 'Internal server error'
            });
        }
    },
    updateContact: async (req, res) => {
        const { id } = req.params;
        const { firstName, lastName, email, message, phone, checkbox } = req.body;
        try {
            const query = 'UPDATE contacts SET firstname = $1, lastname = $2, email = $3, message = $4, phone = $5, checkbox = $6 WHERE id = $7';
            const result = await pool.query(query, [firstName, lastName, email, message, phone, checkbox, id]);
            res.status(200).json({
                status: true,
                data: result.rows[0]
            });
        }
        catch (error) {
            console.error('Error updating contact', error);
            res.status(500).json({
                status: false,
                message: 'Error updating contact',
                error: 'Internal server error'
            });
        }
    },
    deleteContact: async (req, res) => {
        const { id } = req.params;
        try {
            const query = 'DELETE FROM contacts WHERE id = $1';
            const result = await pool.query(query, [id]);
            res.status(200).json({
                status: true,
                data: result.rows[0]
            });
        }
        catch (error) {
            console.error('Error deleting contact', error);
            res.status(500).json({
                status: false,
                message: 'Error deleting contact',
                error: 'Internal server error'
            });
        }
    }
};
