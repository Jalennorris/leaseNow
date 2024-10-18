import React, { useState, useEffect } from "react";
import axios from 'axios';
import './reservePlan.css';
import Navigation from "../../components/header/navigation";
import useStore from "../../store/store";
import floorPlans from '../../images/floorplans.webp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath, faRulerCombined, faDollarSign } from "@fortawesome/free-solid-svg-icons";

interface Property {
    rent_price: number;
    deposit: number;
    bed: number;
    bath: number;
    total_sqft: number;
    property_id: number;
}

interface ApiResponse {
    status: boolean;
    data: {
        [key: string]: Property;
    };
    message: string;
}

const ReservePlan: React.FC = () => {
    const [property, setProperty] = useState<Property | null>(null);
    const { getPropertyId } = useStore();

    const propertyId = getPropertyId();

    useEffect(() => {
        const getProperty = async () => {
            if (!propertyId) {
                console.error('No property ID available');
                return;
            }

            try {
                const response = await axios.get<ApiResponse>(`/api/api/properties/${propertyId}`);
                const propertyData = response.data.data;
                
                if (propertyData) {
                    setProperty(propertyData);
                } else {
                    console.log('No property found');
                }
            } catch (error: any) {
                console.error('Error fetching property:', error);
            }
        };

        getProperty();
    }, [propertyId]);

    return (
        <div>
            <Navigation />
            <div className="reservePlan-container">
                <h1 className="reservePlan-container-title">Reserve Your New Home</h1>
                {!property ? (
                    <div className="loading">
                        <h2>Loading property details...</h2>
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="property-details">

                       
                        <img src={floorPlans} alt="Floor Plan" className="floorplan-image" />
                        <div className="details-grid">
                            <div className="detail-item">
                                <FontAwesomeIcon icon={faDollarSign} />
                                <p>Rent: <strong>${property.rent_price}/Month</strong></p>
                            </div>
                            <div className="detail-item">
                                <FontAwesomeIcon icon={faBed} />
                                <p>Bedrooms: <strong>{property.bed}</strong></p>
                            </div>
                            <div className="detail-item">
                                <FontAwesomeIcon icon={faBath} />
                                <p>Bathrooms: <strong>{property.bath}</strong></p>
                            </div>
                            <div className="detail-item">
                                <FontAwesomeIcon icon={faRulerCombined} />
                                <p>Total Area: <strong>{property.total_sqft} sq ft</strong></p>
                            </div>
                        </div>
                      
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReservePlan;