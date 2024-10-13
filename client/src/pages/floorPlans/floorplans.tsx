import React, { useState, useEffect } from "react";
import './floorplans.css';
import Navigation from "../../components/header/navigation";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath, faExpand } from "@fortawesome/free-solid-svg-icons";
import SearchFloorPlans from "../../components/SearchFloorplan/searchFloorPlan";

const FloorPlans: React.FC = () => {

    const [bedrooms, setBedrooms] = useState<number>(1);
    const [bathrooms, setBathrooms] = useState<number>(1);
    const [moveInDate, setMoveInDate] = useState<string>('');
    const [priceRange, setPriceRange] = useState<number>(0);
    const [data, setData] = useState<FloorPlan[]>([]);
    const [filteredData, setFilteredData] = useState<FloorPlan[]>([]);

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

    useEffect(() => {
        const getFloorPlans = async () => {
            try {
                const response = await axios.get<FloorPlan[]>('/api/api/properties/');
                const floorPlans = response.data.data;

                if (floorPlans && floorPlans.length > 0) {
                    setData(floorPlans);
                    setFilteredData(floorPlans);
                    
                } else {
                    console.log('No floor plans found');
                }

            } catch (error: any) {
                console.error('Error fetching floor plans:', error);
            }
        };

        getFloorPlans();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filtered = data.filter((floorPlan) => {
            const matchBedrooms = bedrooms === 0 || floorPlan.bed === bedrooms;
            const matchBathrooms = bathrooms === 0 || floorPlan.bath === bathrooms;
            const matchPriceRange = priceRange === 0 || floorPlan.rent_price <= priceRange;

            return matchBedrooms && matchBathrooms && matchPriceRange;
        });

        setFilteredData(filtered); // Update filteredData based on form inputs
        console.log('Filtered data:', filtered);
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
                        <div className="floorplans-item" key={floorPlan.property_id}>
                            <p>{floorPlan.bed} <FontAwesomeIcon icon={faBed} /> - {floorPlan.bath} <FontAwesomeIcon icon={faBath} /></p>
                            <p><FontAwesomeIcon icon={faExpand} /> {floorPlan.total_sqft}</p>
                            <p>{floorPlan.rent_price}</p>
                            <button>Book Now</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FloorPlans;
