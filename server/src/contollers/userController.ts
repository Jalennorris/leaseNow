import pool from '../db/index.js';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import generateToken from '../utils/auth.js';
import cacheUtils from '../utils/cacheUtils.js'; // Import cache utility

const saltrounds = bcrypt.genSaltSync(10);

export default {
  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { firstname, lastname, username, email, phone, password } = req.body;

      if (!firstname || !lastname || !username || !email || !phone || !password) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      // Check if email or username already exists
      const checkQuery = 'SELECT * FROM users WHERE email = $1 OR username = $2';
      const checkValues = [email, username];

      const { rows: checkResults } = await pool.query(checkQuery, checkValues);
      if (checkResults.length > 0) {
        const checkResult = checkResults[0];
        if (checkResult.email === email) {
          res.status(400).json({ error: `${email} already exists` });
          return;
        } else if (checkResult.username === username) {
          res.status(400).json({ error: `${username} already exists` });
          return;
        }
      }
      const hashedPassword = bcrypt.hashSync(password, saltrounds);

      // Insert new user
      const insertQuery = 'INSERT INTO users (firstname, lastname, username, email, phone, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const insertValues = [firstname, lastname, username, email, phone, hashedPassword];
      const result = await pool.query(insertQuery, insertValues);

      res.status(201).json({
        status: true,
        data: result.rows[0],
        message: 'User created successfully',
      });
    } catch (error) {
      console.error('Error creating a new user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
      // Check if the user data is cached
      const cachedUser = await cacheUtils.get(`user:${id}`);
      if (cachedUser) {
        res.status(200).json({
          status: true,
          data: cachedUser,
          message: 'User retrieved from cache',
        });
        return;
      }

      // If not cached, fetch from the database
      const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const userData = result.rows[0];

      // Cache the user data
      await cacheUtils.set(`user:${id}`, userData);

      res.status(200).json({
        status: true,
        data: userData,
        message: 'User retrieved successfully',
      });
    } catch (error) {
      console.error(`Error retrieving user: ${id}`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if the data is cached
      const cachedUsers = await cacheUtils.get('all_users');
      if (cachedUsers) {
        res.status(200).json({
          status: true,
          data: cachedUsers,
          message: 'All users retrieved from cache',
        });
        return;
      }

      // If not cached, fetch from the database
      const result = await pool.query('SELECT * FROM users');
      
      // Cache the user list
      await cacheUtils.set('all_users', result.rows);

      res.status(200).json({
        status: true,
        data: result.rows,
        message: 'All users retrieved successfully',
      });
    } catch (error) {
      console.error('Error retrieving all users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
      const { firstname, lastname, username, email, phone, password } = req.body;

      const updateQuery = 'UPDATE users SET firstname = $1, lastname = $2, username = $3, email = $4, phone = $5, password = $6 WHERE user_id = $7 RETURNING *';
      const updateValues = [firstname, lastname, username, email, phone, password, id];
      const result = await pool.query(updateQuery, updateValues);

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Delete user data from the cache
      await cacheUtils.del(`user:${id}`);

      res.status(200).json({
        status: true,
        data: result.rows[0],
        message: 'User updated successfully',
      });
    } catch (error) {
      console.error(`Error updating user: ${id}`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteUser: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
      const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Remove user data from the cache
      await cacheUtils.del(`user:${id}`);

      res.status(200).json({
        status: true,
        data: result.rows[0],
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error(`Error deleting user: ${id}`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [username];
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        res.status(401).json({ error: 'Invalid username' });
        return;
      }

      const user = rows[0];
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid password' });
        return;
      }

      const token = generateToken(user);

      res.status(200).json({
        status: true,
        data: user,
        message: 'User logged in successfully',
        token,
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
