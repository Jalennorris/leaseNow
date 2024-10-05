import pool from '../db/index.js';
import { Request, Response } from 'express';
import cacheUtils from '../utils/cacheUtils.js';

export default {
    // Create a new property
    createProperty: async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, address, city, state, zip_code, rent_price, description } = req.body;

            // Validate input fields
            if (!title || !address || !city || !state || !zip_code || !description || !rent_price) {
                res.status(400).json({
                    status: false,
                    message: 'All fields are required',
                });
                return;
            }

            // Insert query
            const insertQuery = 'INSERT INTO properties (title, address, city, state, zip_code, rent_price, description) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *';
            const insertValues = [title, address, city, state, zip_code, rent_price, description];

            // Execute query
            const result = await pool.query(insertQuery, insertValues);
            const newProperty = result.rows[0];

            // Cache the new property
            const propertyKey = `property:${newProperty.property_id}`;
            await cacheUtils.set(propertyKey, newProperty, 3600); // TTL of 1 hour

            // Invalidate the cache for all properties
            const allPropertiesKey = 'properties:all';
            await cacheUtils.del(allPropertiesKey);

            // Success response
            res.status(201).json({
                status: true,
                data: newProperty,
                message: 'Property created successfully',
            });
        } catch (error) {
            console.error('Error creating property:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get all properties
    getAllProperties: async (req: Request, res: Response): Promise<void> => {
        const cacheKey = 'properties:all';
        try {
            // Attempt to retrieve from cache
            const cachedData = await cacheUtils.get(cacheKey);
            if (cachedData) {
                res.status(200).json({
                    status: true,
                    data: cachedData,
                    message: 'All properties retrieved successfully (from cache)',
                });
                return;
            }

            // If not in cache, fetch from database
            const result = await pool.query('SELECT * FROM properties');
            const properties = result.rows;

            // Cache the result
            await cacheUtils.set(cacheKey, properties, 3600); // TTL of 1 hour

            // Success response
            res.status(200).json({
                status: true,
                data: properties,
                message: 'All properties retrieved successfully',
            });
        } catch (error) {
            console.error('Error retrieving all properties:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get a single property by ID
    getProperty: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const propertyKey = `property:${id}`;
        try {
            // Attempt to retrieve from cache
            const cachedProperty = await cacheUtils.get(propertyKey);
            if (cachedProperty) {
                res.status(200).json({
                    status: true,
                    data: cachedProperty,
                    message: 'Property retrieved successfully (from cache)',
                });
                return;
            }

            // If not in cache, fetch from database
            const result = await pool.query('SELECT * FROM properties WHERE property_id = $1', [id]);
            const property = result.rows[0];

            if (!property) {
                res.status(404).json({ error: 'Property not found' });
                return;
            }

            // Cache the retrieved property
            await cacheUtils.set(propertyKey, property, 3600); // TTL of 1 hour

            // Success response
            res.status(200).json({
                status: true,
                data: property,
                message: 'Property retrieved successfully',
            });
        } catch (error) {
            console.error(`Error retrieving property: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Update a property
    updateProperty: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const { title, address, city, state, zip_code, rent_price, description } = req.body;

            // Validate input fields
            if (!title || !address || !city || !state || !zip_code || !description || !rent_price) {
                res.status(400).json({
                    status: false,
                    message: 'All fields are required for update',
                });
                return;
            }

            const updateQuery = 'UPDATE properties SET title = $1, address = $2, city = $3, state = $4, zip_code = $5, rent_price = $6, description = $7 WHERE property_id = $8 RETURNING *';
            const updateValues = [title, address, city, state, zip_code, rent_price, description, id];
            const result = await pool.query(updateQuery, updateValues);
            const updatedProperty = result.rows[0];

            if (!updatedProperty) {
                res.status(404).json({ error: 'Property not found' });
                return;
            }

            // Update the cache for the updated property
            const propertyKey = `property:${id}`;
            await cacheUtils.set(propertyKey, updatedProperty, 3600); // TTL of 1 hour

            // Invalidate the cache for all properties
            const allPropertiesKey = 'properties:all';
            await cacheUtils.del(allPropertiesKey);

            res.status(200).json({
                status: true,
                data: updatedProperty,
                message: 'Property updated successfully',
            });
        } catch (error) {
            console.error(`Error updating property: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Delete a property
    deleteProperty: async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const result = await pool.query('DELETE FROM properties WHERE property_id = $1 RETURNING *', [id]);
            const deletedProperty = result.rows[0];

            if (!deletedProperty) {
                res.status(404).json({ error: 'Property not found' });
                return;
            }

            // Invalidate the cache for the deleted property
            const propertyKey = `property:${id}`;
            await cacheUtils.del(propertyKey);

            // Invalidate the cache for all properties
            const allPropertiesKey = 'properties:all';
            await cacheUtils.del(allPropertiesKey);

            res.status(200).json({
                status: true,
                data: deletedProperty,
                message: 'Property deleted successfully',
            });
        } catch (error) {
            console.error(`Error deleting property: ${id}`, error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
