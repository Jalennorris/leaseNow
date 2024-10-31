import React, { useState } from 'react';
import './login.css';
import Footer from '../../components/footer/footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UserInformation {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [login, setLogin] = useState<UserInformation>({ username: '', password: '' });
    const [error, setError] = useState('');
    

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (login.username === '' || login.password === '') {
            setError('All fields are required');
            return;
        }

        try {
            const response = await axios.post('/api/api/users/login', login); 
            console.log(response.data);

           
            const token = response.data.token; 


            localStorage.setItem('user_id', response.data.data.user_id);
            localStorage.setItem('username', login.username);
            localStorage.setItem('token', token); 
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'Login failed. Please check your credentials.');
            } else {
                setError('An unexpected error occurred during login');
            }
        } finally {
            console.log('Login attempt has been completed');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className='login-container'>
                <div className='login-form-container'>
                    <h1 className='login-title'>Welcome</h1>
                    <h2 className='login-title2'>Login to Portal</h2>
                    <form className='login-form' onSubmit={handleLogin}>
                        <label className='login-label' htmlFor='username'>Username</label>
                        <input className='login-input' type="text" id='username' name='username' placeholder='Enter Username' value={login.username} onChange={handleChange} required />
                        <label className='login-label' htmlFor='password'>Password</label>
                        <input className='login-input' type="password" id='password' name='password' placeholder='Enter Password' value={login.password} onChange={handleChange} required />
                        <button className='login-button' type='submit'>Login</button>
                    </form>
                    {error && <p className='login-error-text'>{error}</p>}
                    <p className='login-text'>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
