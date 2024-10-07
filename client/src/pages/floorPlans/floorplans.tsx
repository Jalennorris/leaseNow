import React, { useState, useEffect } from "react";
import './floorplans.css';
import Navigation from "../../components/header/navigation";
import axios from 'axios';

const FloorPlans: React.FC = () => {
  
    const [bedrooms, setBedrooms] = useState<number>(1);
    const [bathrooms, setBathrooms] = useState<number>(1);
    const [moveInDate, setMoveInDate] = useState<string>('');
    const [priceRange, setPriceRange] = useState<number>(0);
    const [data, setData] = useState<FloorPlan[]>([]); // State for storing floor plans data
  

    interface FloorPlan {
        property_id: number;
        title: string;
        address: string;
        city: string;
        state: string;
        zip_code: string;
        rent_price: number;
        description: string;
    }
    

    useEffect(() => {
        const getFloorPlans = async () => {
            try {
                const response = await axios.get<FloorPlan[]>('/api/api/properties/'); // Corrected endpoint
                console.log('Response:', response); // Log the entire response object
                const data = response.data.data;
    
                if (data && data.length > 0) {
                    console.log('Data:', data);
                    setData(data); // Set the data to state
                } else {
                    console.log('No floor plans found');
                }
    
            } catch (error: any) {
                console.error('Error fetching floor plans:', error);
                if (axios.isAxiosError(error)) {
                    console.error('Axios error:', error.message);
                    if (error.response) {
                        console.error('Response data:', error.response.data);
                        console.error('Status:', error.response.status);
                    }
                } else {
                    console.error('Unexpected error:', error);
                }
            } finally {
                console.log('Finished fetching floor plans');
            }
        };
    
        getFloorPlans();
    }, []); // Empty dependency array means the effect will run only once on mount
    
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Logic to handle filtering based on form input can be added here
    };

    return (
        <div className="floorplans">
            <Navigation />
            <div className="floorplans-container">
                <div className="floorplans-header">
                    <div className="floorplans-content">
                        <h1 className="floorplans-title">Floor Plans</h1>
                        <p className="floorplans-description">Explore our extensive collection of floor plans to find the perfect fit for your needs.</p>
                    </div>

                    <form className="floorplans-search" onSubmit={handleSubmit}>
                        <div className="filter-box">
                            <label htmlFor="bedrooms">Bedrooms</label>
                            <select 
                                name="bedrooms" 
                                id="bedrooms" 
                                value={bedrooms} 
                                onChange={(e) => setBedrooms(Number(e.target.value))} 
                            >
                                <option value="1">1 Bedroom</option>
                                <option value="2">2 Bedrooms</option>
                                <option value="3">3 Bedrooms</option>
                            </select>
                        </div>
                        <div className="filter-box">
                            <label htmlFor="bathrooms">Bathrooms</label>
                            <select 
                                name="bathrooms" 
                                id="bathrooms" 
                                value={bathrooms} 
                                onChange={(e) => setBathrooms(Number(e.target.value))} // Convert value to number
                            >
                                <option value="1">1 Bathroom</option>
                                <option value="2">2 Bathrooms</option>
                                <option value="3">3 Bathrooms</option>
                            </select>
                        </div>
                        <div className="filter-box">
                            <label htmlFor="date">Move-in Date</label>
                            <input 
                                type="date" 
                                min={new Date().toISOString().split("T")[0]} 
                                value={moveInDate} 
                                onChange={(e) => setMoveInDate(e.target.value)} 
                            />
                        </div>
                        <div className="filter-box">
                            <label htmlFor="priceRange">Price Range</label>
                            <input 
                                type="number" 
                                placeholder="Price" 
                                min="0"   
                                max="10000" 
                                value={priceRange} 
                                onChange={(e) => setPriceRange(Number(e.target.value))} // Convert value to number
                            />
                        </div>
                        <button type="submit">Search</button>
                    </form>
                </div>

              
            </div>
            <div className="floorplans-container2">
                {data.length === 0 ? (
                    <p>No floor plans found.</p>
                ) : (
                    data.map((floorPlan) => (
                    <div  className="floorplans-item" key={floorPlan.property_id}>
                        <h2>{floorPlan.title}</h2>
                        <p>{floorPlan.address}</p>
                        <p>
                        {floorPlan.city}, {floorPlan.state}
                        </p>
                        <p>{floorPlan.zip_code}</p>
                        <p>{floorPlan.rent_price}</p>
                        <p>{floorPlan.description}</p>
                    </div>
                    ))
                )}
                </div>
        </div>
    );
};

export default FloorPlans;
