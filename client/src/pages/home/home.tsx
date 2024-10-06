import React from "react";
import './home.css'
import Navigation  from '../../components/header/navigation'

import exterior from '../../images/architecture-5583025.jpg'

import spaciousFloorPlan from '../../images/spacious-floor-plan.jpg'
import smartHome from '../../images/smart-home-features.jpg'
import luxuryAmenities from '../../images/luxury-amenities.jpg'
import petFriendly from '../../images/pet-friendly.jpg'

import floorplans from '../../images/floor-plan.jpg'
import Footer from "../../components/footer/footer";




const Home =() => {
    return (
        
        <div className="home-container">
            <Navigation/>
            <section className="home-section1">
                <img src={exterior} alt="exterior" className="exterior-image" />
                <h1 className="home-text">Find Your Dream Apartment with Ease</h1>
                <h2 className="home-text2">Explore modern living spaces tailored to your needs. Book tours, manage leases, and move in seamlessly.</h2>   
            </section>
            <section className="home-section2">
                <h1 className="section2-title"> Experience the perfect living space</h1>
                <div className="features-container">

                    <div className="feature-item">
                        
                        <img src={spaciousFloorPlan} alt="feature1" className="feature-image"/>
                        <h3 className="feature-title">Spacious Floor Plans</h3>
                        <p className="feature-description"> Explore our extensive collection of floor plans to find the perfect fit for your needs.</p>
                    </div>
                    <div className="feature-item">
                        <img src={smartHome} alt="feature2" className="feature-image"/>
                        <h3 className="feature-title">Smart Home Features</h3>
                        <p className="feature-description">We offer a wide range of smart home features to make your life easier.</p>

                    </div>
                    <div className="feature-item">
                        <img src={luxuryAmenities} alt="feature1" className="feature-image"/>
                        <h3 className="feature-title">Luxury Amenities</h3>
                        <p className="feature-description">Experience the epitome of luxury living with our exclusive amenities.</p>
                    </div>
                    <div className="feature-item">
                        <img src={petFriendly} alt="feature1" className="feature-image"/>
                        <h3 className="feature-title">Pet Friendly Community</h3>
                        <p className="feature-description">Find your next pet friendly community with our pet friendly community.</p>
                    </div>

                </div>


            </section>
            <section className="home-section3">
            <div className="section3-content">
                <h1 className="section3-title">Welcome to the LeaseNow Lifestyle</h1>
                <h2 className="section3-description">At LeaseNow, discover a vibrant community where comfort meets modern living.
                    Nestled in a prime location, our thoughtfully designed apartments provide everything you need for a fulfilling lifestyle.
                     With beautifully landscaped gardens, contemporary amenities, and a welcoming atmosphere, you’ll feel right at home in no time.</h2>
             </div>
                <div className="">
                <button className="section3-button"> Schedule a Tour</button>
                </div>

            </section>


            <section className="home-section4">
                <div className="section4-img-content">
                    <img src={floorplans} alt="section4" className="section4-image"/>
                </div>

                <div className="section4-text-content">
                    <h1 className="section4-title">A customized floor plan designed specifically for your needs</h1>
                    <p className="section4-description">At LeaseNow, we offer the ideal apartment layout to match your lifestyle, whether you need a one, two, or three-bedroom home. Enjoy modern features such as gourmet kitchens with premium granite countertops, elegant wood cabinetry, wood-style flooring, and spacious walk-in closets. At LeaseNow, top-tier upgrades come standard.</p>
                    <button className="section4-button">Explore Our Floor Plans</button>
                </div>

            </section>
            <section className="home-section5">
                <div className="section5-content">
                    <div className="section5-text-content">
                    <h1 className="section5-title">Amenities</h1>
                    <p>Dive into our luxurious pool, enjoy a friendly billiards match with a neighbor, or break a sweat in our cutting-edge fitness facility. You can also practice your swing on the putting green or let your furry friend run free at the on-site dog park. With so many amenities, you'll find it hard to leave!</p>
                    <button className="section5-button">Explore Our Amenities</button>
                    </div>

                    <div className="section5-text-content">
                    <h1 className="section5-title">Gallery</h1>
                    <p>Discover what life is like at LeaseNow! Our upscale apartments in Houston, TX, blend comfort with convenience. Explore our modern, roomy floor plans, impressive resort-style amenities, and meticulously maintained community grounds.</p>
                    <button className="section5-button">Explore Our Gallery</button>
                    </div>
                </div>
                </section>
                                    <section className="home-section6">
                        <div className="section6-content">
                            <h1 className="section6-title">Discover What's Happening in Houston, TX!</h1>
                            <p className="section6-description"> (555) 555-5555</p>
                            <p className="section6-description"> 123 Main Street, Houston, TX 77002</p>
                            <p className="section6-description">Located in the heart of Houston Heights, SYNC at Houston Heights combines vibrant city living with a neighborhood feel, just minutes from downtown Houston. Our prime location offers easy access to some of the best shopping, dining, and entertainment options, including local favorites along 19th Street and The Heights Mercantile. Surrounded by top employers, medical centers, and excellent schools, SYNC provides the perfect balance of convenience and community. Enjoy the charm of the Heights along with nearby parks and trails for outdoor enthusiasts—it's all within reach at SYNC!</p>  
                            <button className="section6-button">Neighborhood</button>
                        </div>
                        <div className="section6-content">
                            <iframe
                                className="section6-map"
                                title=" Google Maps Location" 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.8762150436754!2d-95.39803478519025!3d29.80333358197954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640bf7a6ecba5b3%3A0x71dbbeb807726147!2s123%20Main%20St%2C%20Houston%2C%20TX%2077002!5e0!3m2!1sen!2sus!4v1696139085295!5m2!1sen!2sus"
                                width="600"
                                height="450"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </section>

                <Footer/>

        </div>
        
    );
}

export default Home