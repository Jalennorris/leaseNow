import React, { useState, useEffect } from "react";
import './floorplans.css';
import Navigation from "../../components/header/navigation";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath, faExpand } from "@fortawesome/free-solid-svg-icons";
import SearchFloorPlans from "../../components/SearchFloorplan/searchFloorPlan";
import FloorPlansImage from  '../../images/floorplans.webp'
import { useNavigate } from 'react-router-dom';
import useStore from "../../store/store";

interface FloorPlan {
    property_id: number;
    title: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    rent_price: number;
    description: string;
    bed: number;
    bath: number;
    total_sqft: number;
}

interface ApiResponse {
    data: FloorPlan[];
}

const FloorPlans: React.FC = () => {
    const [bedrooms, setBedrooms] = useState<number>(1);
    const [bathrooms, setBathrooms] = useState<number>(1);
    const [moveInDate, setMoveInDate] = useState<string>('');
    const [priceRange, setPriceRange] = useState<number>(0);
    const [data, setData] = useState<FloorPlan[]>([]);
    const [filteredData, setFilteredData] = useState<FloorPlan[]>([]);
    const {propertyId, setPropertyId} = useStore();
    
    const navigate = useNavigate();

    useEffect(() => {
        const getFloorPlans = async () => {
            try {
                const response = await axios.get<ApiResponse>('/api/api/properties/');
                const floorPlans = response.data.data;

                if (floorPlans && floorPlans.length > 0) {
                    setData(floorPlans);
                    setFilteredData(floorPlans);
                    const firstPropertyId = floorPlans[0].property_id.toString();
                    setPropertyId(firstPropertyId);
                } else {
                    console.log('No floor plans found');
                }
            } catch (error: any) {
                console.error('Error fetching floor plans:', error);
            }
        };

        getFloorPlans();
    }, [setPropertyId]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filtered = data.filter((floorPlan) => {
            const matchBedrooms = bedrooms === 0 || floorPlan.bed === bedrooms;
            const matchBathrooms = bathrooms === 0 || floorPlan.bath === bathrooms;
            const matchPriceRange = priceRange === 0 || floorPlan.rent_price <= priceRange;

            return matchBedrooms && matchBathrooms && matchPriceRange;
        });

        setFilteredData(filtered);
        console.log('Filtered data:', filtered);
    };

    const handleReserve = (propertyId: number) => {
        setPropertyId(propertyId.toString());
        navigate(`/floorplans/${propertyId}/reserve`);
        console.log("Navigating to:", `/floorplans/${propertyId}/reserve`); // Add this line
    }
  
    return (
        <div className="floorplans">
            <Navigation />
            <div className="floorplans-container">
                <div className="floorplans-header">
                    <div className="floorplans-content">
                        <h1 className="floorplans-title">Floor Plans</h1>
                        <p className="floorplans-description">Explore our extensive collection of floor plans to find the perfect fit for your needs.</p>
                    </div>

                    <SearchFloorPlans
                        bedrooms={bedrooms}
                        setBedrooms={setBedrooms}
                        bathrooms={bathrooms}
                        setBathrooms={setBathrooms}
                        moveInDate={moveInDate}
                        setMoveInDate={setMoveInDate}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>

            <div className="floorplans-container2">
                {filteredData.length === 0 ? (
                    <p>No floor plans found.</p>
                ) : (
                    filteredData.map((floorPlan) => (
                        <div 
                            className={`floorplans-item ${floorPlan.property_id.toString() === propertyId ? 'selected' : ''}`} 
                            key={floorPlan.property_id}
                        >
                            <p className="floorplans-text">{floorPlan.bed} <FontAwesomeIcon className="floorplans-icon" icon={faBed} /> - {floorPlan.bath} <FontAwesomeIcon className="floorplans-icon" icon={faBath} /></p>
                            <p><FontAwesomeIcon className="floorplans-icon" icon={faExpand} /> {floorPlan.total_sqft} Sq. Ft</p>
                            <img className="floorplans-image" src={FloorPlansImage} alt="floorplans"/>
                            <div className="reserve-container">
                                <p className="floorplans-cost-text"> Starting at ${floorPlan.rent_price}</p>
                            </div>
                            <button onClick={() => handleReserve(floorPlan.property_id)} className="floorplans-button">Reserve Now</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FloorPlans;