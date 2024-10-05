import { Link } from 'react-router-dom'
import './footer.css'
import React from 'react'



const Footer = () => {

    return (
        <div className="footer-container">
            <p className='footer-text'>LeaseNow values the diversity of all individuals<br/> 
                and provides care without discrimination based on race, age,<br/> 
                religion, ability, marital status, sexual orientation, gender identity, or sex.</p>
            <p className='footer-text'> &copy; 2024 LeaseNow. 
                All rights reserved.</p>
                <p className='footer-text'> Designed by Jalen Norris ❤️</p>
            <ul className='footer-list'>
                <li>
                    <Link to='/' className='footer-link'>Notice of Privacy Practices</Link>
                </li>
                <li>
                    <Link to='/' className='footer-link'> Terms & conditions</Link>

                </li>
                <li>
                    <Link to ='/' className='footer-link'>Contact: (555)-555-5555</Link>

                </li>
            </ul>
        </div>
    )

}


export default Footer