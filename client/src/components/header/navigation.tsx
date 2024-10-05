import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './navigation.css';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false); 

    const toggleMenu = () => {
        setIsOpen(!isOpen); 
    };

    return (
        <div className="navigation-container">
            <div className="logo-container">
                <h1 className="logo-text">LeaseNow</h1>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                {isOpen ? (
                    <FontAwesomeIcon icon={faXmark} />
                ) : (
                    '☰' // Show hamburger icon when closed
                )}
            </div>
            <div className={`navigation-menu ${isOpen ? 'active' : ''}`}>
                <ul className="navigation-list">
                    <li><a href="/floorplans" className="navigation-link">Floorplans</a></li>
                    <li><a href="/amenities" className="navigation-link">Amenities</a></li>
                    <li><a href="/life" className="navigation-link">Life</a></li>
                    <li><a href="/residentPortal" className="navigation-link">Resident Portal</a></li>
                    <li><a href="/tour" className="navigation-link">Tour</a></li>
                    <li><a href="/contact" className="navigation-link">Contact</a></li>
                    <li><a href="/applynow" className="navigation-link">Apply Now</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Navigation;
