import React, { useState, useEffect } from "react";
import axios from 'axios';
import './reservePlan.css';
import Navigation from "../../components/header/navigation";
import useStore from "../../store/store";

interface Property {
    rent: number;
    deposit: number;
    bed: number;
    bath: number;
    total_sqft: number;
    property_id: number;
}

interface ApiResponse {
    data: Property[];
}

const ReservePlan: React.FC = () => {
    const [property, setProperty] = useState<Property | null>(null);
    const { getPropertyId, setPropertyId } = useStore();

    const propertyId = getPropertyId();

    useEffect(() => {
        const getProperty = async () => {
            if (!propertyId) {
                console.error('No property ID available');
                return;
            }

            try {
                const response = await axios.get<ApiResponse>(`/api/api/properties/${propertyId}`);
                const properties = response.data.data;
                if (properties && properties.length > 0) {
                    setProperty(properties[0]);
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
                <div className="ReservePlan-section1">
                    <img src='*' alt="ReservePlan" className="ReservePlan-image" />
                </div>
                <h1>Reserve Plan for Property {propertyId}</h1>
                <div>
                    <p>Rent: ${property.rent}</p>
                    <p>Deposit: ${property.deposit}</p>
                    <p>Bedrooms: {property.bed}</p>
                    <p>Bathrooms: {property.bath}</p>
                    <p>Total Area: {property.total_sqft} sq ft</p>
                </div>
            </div>
        </div>
    );
};

export default ReservePlan;