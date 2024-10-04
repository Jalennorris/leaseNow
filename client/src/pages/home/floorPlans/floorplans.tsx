import React,{ useState, useEffect } from "react";
import './floorplans.css';
import Navigation from '../../../components/header/navigation';
import axios from 'axios';

const FloorPlans: React.FC = () => {
  
    const [bedrooms, setBedrooms] = useState<number>(1);
    const [bathrooms, setBathrooms] = useState<number>(1);
    const [moveInDate, setMoveInDate] = useState<string>('');
    const [priceRange, setPriceRange] = useState<number>(0);
  

    interface FloorPlan {
        id: number;
        type: string;
        name: string;
        description: string;
        image: string;
        price: number;
        address: string;
    }


    useEffect(() => {
        const getFloorPlans = async () => {
            try {
                const response = await axios.get<FloorPlan[]>('/properties/');
                console.log('Response:', response); // Log the entire response object
                const data = response.data;
                if(data) {
                    console.log('Data:', data);
                    
                }
                else if(data.length === 0) {
                    console.log('No floor plans found');
                    
                }
                else {  
                    console.warn'No data returned from API';
                }

             
            } catch (error: any) {
                console.error('Error fetching floor plans:', error);
                if(axios.isAxiosError(error)) {
                    console.error('Error fetching floor plans', error.message);
                    console.error('Axios status\', error.response);
                }
            }
        };
    
        getFloorPlans();
    }, []);

    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
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
        </div>
    );
};

export default FloorPlans;
