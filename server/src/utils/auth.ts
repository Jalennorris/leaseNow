import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface User {
    user_id: string;
    username: string;
}

const generateToken = (user: User, secret: string = process.env.JWT_SECRET ?? '', expiresIn: string = '1h'): string => {
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
