import React, { useState, ChangeEvent, FormEvent } from 'react';
import Navigation from '../../components/header/navigation';
import Footer from '../../components/footer/footer';
import axios from 'axios';
import './contact.css';

interface ContactProps {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    message: string;
    checkbox: boolean;
}

const Contact: React.FC = () => {
    const [contactData, setContactData] = useState<ContactProps>({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        message: '',
        checkbox: false
    });
    const [successful, setSuccessful] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setContactData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/api/contact', contactData);
            setSuccessful(true);
            setContactData({
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                message: '',
                checkbox: false
            });
            setError(null);
        } catch (error) {
            setError(error.response?.data?.error || 'An error occurred');
            console.error(error);
        }
    };

    return (
        <div>
            <Navigation />
            <div className="contact-container">
                <form onSubmit={handleSubmit}>
                    <label className='contact-label' htmlFor="firstname">First Name</label>
                    <input 
                        className='contact-input' 
                        type="text" 
                        id="firstname"
                        name="firstname"
                        placeholder='Enter Name'   
                        value={contactData.firstname}
                        onChange={handleInputChange}
                        required 
                    />
                    
                    <label className='contact-label' htmlFor="lastname">Last Name</label>
                    <input 
                        className='contact-input' 
                        type="text" 
                        id="lastname"
                        name="lastname"
                        placeholder='Enter Name' 
                        value={contactData.lastname} 
                        onChange={handleInputChange}
                        required 
                    />

                    <label className='contact-label' htmlFor="email">Email</label>
                    <input 
                        className='contact-input' 
                        type="email" 
                        id="email"
                        name="email"
                        placeholder='Enter Email' 
                        value={contactData.email} 
                        onChange={handleInputChange}
                        required 
                    />

                    <label className='contact-label' htmlFor="phone">Phone</label>
                    <input 
                        className='contact-input' 
                        type="tel" 
                        id="phone"
                        name="phone"
                        placeholder='Enter Phone Number' 
                        value={contactData.phone} 
                        onChange={handleInputChange}
                        required 
                    />

                    <label className='contact-label' htmlFor="message">Message</label>
                    <textarea 
                        className='contact-textarea' 
                        id="message"
                        name="message"
                        placeholder='Enter Message' 
                        value={contactData.message} 
                        onChange={handleInputChange}
                        required 
                    />

                    <label className='contact-checkbox'> 
                        <input 
                            type="checkbox" 
                            name="checkbox"
                            checked={contactData.checkbox} 
                            onChange={handleInputChange}
                            required 
                        /> 
                        I agree to the terms and conditions
                    </label>

                    <p className='contact-form-text'>
                        I understand and agree that any information submitted will be forwarded to our office by email and not via a secure messaging system.
                        This form should not be used to transmit private health information, and we disclaim all warranties with respect to 
                        the privacy and confidentiality of any information submitted through this form.
                    </p>
                    
                    <button className='contact-button' type='submit'>Submit</button>
                </form>

                {successful && <p className="success-message">Form submitted successfully!</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
            <Footer />
        </div>
    );
};

export default Contact;