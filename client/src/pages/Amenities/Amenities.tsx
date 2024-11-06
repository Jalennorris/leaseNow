import React from "react";
import './amenities.css';
import Navigation from "../../components/header/navigation";
import Footer from "../../components/footer/footer";
import gym from "../../images/gym.jpg";
import communities from "../../images/communities.jpg";


const Amenities: React.FC = () => {
    return(
        <div>
            <Navigation/>
          <div className="amenities-container">
            <section className="amenities-section"> 
                
                <h1 className="section1-amenities-title">Cant Miss Houston Heights Amenties</h1>
                <img src={gym} alt="gym-amenities" className="amenities-image"/>
             </section>
             <section className="section2-amenities-section"> 
                <h1 className="section2-amenities-title">Coummunity Amenities</h1>
                <img src={communities } alt="communities-amenities" className="section2-amenities-image"/>
                <ul className="section2-amenities-list">
                    <li className="section2-amenities-item"> 24/7 Security</li>
                    <li className="section2-amenities-item"> 24-hour fitness center</li>
                    <li className="section2-amenities-item"> l Resort Style Pool</li>
                    <li className="section2-amenities-item"> Poolside Cabana</li>
                    <li className="section2-amenities-item"> Poolside Lounge</li>
                    <li className="section2-amenities-item"> Poolside Bar</li>
                    <li className="section2-amenities-item"> Poolside Grill</li>
                    <li className="section2-amenities-item"> Community Clubhouse</li>
                    <li className="section2-amenities-item"> Wifi in all areas</li>
                    <li className="section2-amenities-item"> Connected Wifi Parking</li>
                    <li className="section2-amenities-item"> Door to Door Valet Trash</li>
                    <li className="section2-amenities-item">Full Size Washer & Dryer</li>
                </ul>
             </section>
             <section className="section3-amenities-section"> 
                <h1 className="section3-amenities-title">Pet & Parking Policies</h1>
                <ul  className="section3-amenities-list">
                    <li className="section3-amenities-item"> Pet Policy Type: Cat, Dogs</li>
                    <li className="section3-amenities-item">Max Number of Pets: 2</li>
                    <li className="section3-amenities-item">Pet policy: We implement a 2-pet limit per apartment home. Please contact the office for pet fee and pet rent amounts required for each pet. Not approved but not limited to, Pit Bull Terriers, Staffordshire Terriers, Rottweilers, German Shepherd, Presa Canarios, Chow Chow, Doberman Pinschers, Akitas, Wolf hybrids, Mastiffs, Cane Corsos, Great Danes, Alaskan Malamutes, Siberian Huskies. Including any mix of the breeds listed above.</li>
                    <li className="section3-amenities-item">Parking Comment: Please call us regarding our Parking Policy.</li>
                </ul>
             </section>
             <section className="scetion4-amenities-section"> 
             <iframe
                                className="section4-map-amenities"
                                title=" Google Maps Location" 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.8762150436754!2d-95.39803478519025!3d29.80333358197954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640bf7a6ecba5b3%3A0x71dbbeb807726147!2s123%20Main%20St%2C%20Houston%2C%20TX%2077002!5e0!3m2!1sen!2sus!4v1696139085295!5m2!1sen!2sus"
                                width="600"
                                height="450"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                <div className="office-hours">
                    <h1 className="office-hours-title">LeaseNow</h1>
                    <p className="office-hours-text">Address: 123 Main Street, Houston, TX 77001</p>
                    <p className="office-hours-text">Phone: (555)-555-5555</p>
                    <p className="office-hours-text">Fax: (555)-555-5555</p>
                    <p className="office-hours-text">Email: 7Xa2S@leaseNow.com</p>

                    
                    <h1 className="office-hours-title">Office Hours</h1>
                    <p className="office-hours-text">Monday: 9am - 5pm</p>
                    <p className="office-hours-text">Tuesday: 9am - 5pm</p>
                    <p className="office-hours-text">Wednesday: 9am - 5pm</p>
                    <p className="office-hours-text">Thursday: 9am - 5pm</p>
                    <p className="office-hours-text">Friday: 9am - 5pm</p>
                    <p className="office-hours-text">Saturday: 9am - 5pm</p>
                    <p className="office-hours-text">Sunday: 9am - 5pm</p>

                </div>
                
             
             </section>

          </div>
            <Footer/>
        </div>
    )
}

export default Amenities