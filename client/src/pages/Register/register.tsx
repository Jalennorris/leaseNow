import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './register.css';
import Navigation from '../../components/header/navigation';
import Footer from "../../components/footer/footer";

interface UserInformation {
    firstname: string;
    lastname: string;
    email: string;
   
    phone: string;
    username: string;
    password: string;
}

const Register: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInformation>({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        username: '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Check if any field is empty
            if (Object.values(userInfo).some(field => field === '')) {
                setError('All fields are required');
                return;
            }
    
            // Check if passwords match
            if (userInfo.password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
    
            // Send registration request
            const response = await axios.post('/api/api/users', userInfo);
            console.log(response.data);
            navigate('/login');
            
        } catch (error) {
            console.error('Registration error:', error);
            if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.error || 'An error occurred during registration');
            } else {
                setError('An unexpected error occurred');
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    }

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (userInfo.password !== e.target.value) {
            setError('Passwords do not match');
        } else {
            setError('');
        }
    }

    return (
        <div>
            <Navigation />
            <div className="register-container">
                <h1 className="register-title">Register</h1>
                <h2 className='register-subtitle'>Create an account</h2>
                
                <form className='register-form' onSubmit={handleRegister}>
                    <label className='register-label'>Legal First Name</label>
                    <input className='register-input' type="text" placeholder='Enter Name' name='firstname' value={userInfo.firstname} onChange={handleChange} required />
                    
                    <label className='register-label'>Legal Last Name</label>
                    <input className='register-input' type="text" placeholder='Enter Name' name='lastname' value={userInfo.lastname} onChange={handleChange} required />

                    <label className='register-label'>Email</label>
                    <input className='register-input' type="email" placeholder='Enter Email' name='email' value={userInfo.email} onChange={handleChange} required />

                    <label className='register-label'>Phone</label>
                    <input className='register-input' type="tel" placeholder='(xxx)xxx-xxxx' name='phone' value={userInfo.phone} onChange={handleChange} required />
                    
                    <label className='register-label'>Username</label>
                    <input className='register-input' type="text" placeholder='Enter Username' name='username' value={userInfo.username} onChange={handleChange} required />

                    <label className='register-label'>Password</label>
                    <input className='register-input' type="password" placeholder='Enter Password' name='password' value={userInfo.password} onChange={handleChange} required />

                    <label className='register-label'>Confirm Password</label>
                    <input className='register-input' type="password" placeholder='Confirm Password' value={confirmPassword} onChange={handleConfirmPassword} required />

                    <button className='register-button' type='submit'>Register</button>
                </form>
                {error && <p className='register-error'>{error}</p>}
                <p className='register-text'>Already have an account? <Link to="/login">Login</Link></p>
            </div>
            <Footer />
        </div>
    );
}

export default Register;