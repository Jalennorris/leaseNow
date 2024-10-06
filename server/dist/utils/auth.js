import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const generateToken = (user, secret = process.env.JWT_SECRET ?? '', expiresIn = '1h') => {
    if (!user) {
        throw new Error('User not found');
    }
    if (!secret) {
        throw new Error('Secret not found');
    }
    const payload = {
        id: user.user_id,
        username: user.username
    };
    return jwt.sign(payload, secret, { expiresIn });
};
export default generateToken;
