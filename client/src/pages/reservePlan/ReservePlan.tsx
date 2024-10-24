import React, { useState, useEffect } from "react";
import axios from 'axios';
import './reservePlan.css';
import Navigation from "../../components/header/navigation";
import useStore from "../../store/store";
import floorPlans from '../../images/floorplans.webp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath, faRulerCombined, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// Define interfaces for property and API response types
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

    // Fetch property details on component mount or when propertyId changes
    useEffect(() => {
        const fetchProperty = async () => {
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

        fetchProperty();
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
                            <DetailItem icon={faDollarSign} label={`Rent: $${property.rent_price}/Month`} />
                            <DetailItem icon={faBed} label={`Bedrooms: ${property.bed}`} />
                            <DetailItem icon={faBath} label={`Bathrooms: ${property.bath}`} />
                            <DetailItem icon={faRulerCombined} label={`Total Area: ${property.total_sqft} sq ft`} />
                        </div>
                    </div>
                )}
            </div>
            <LeasingInfo property={property} />
        </div>
    );
};

// Component to display property details
const DetailItem: React.FC<{ icon: any; label: string }> = ({ icon, label }) => (
    <div className="detail-item">
        <FontAwesomeIcon icon={icon} />
        <p>{label}</p>
    </div>
);

// Component to handle leasing information
const LeasingInfo: React.FC<{ property: Property | null }> = ({ property }) => (
    <div className="reservePlan-container-leasing">
        <h1 className="reservePlan-container-leasing-title">Leasing Information</h1>
        <label className="reservePlan-container-leasing-label">Move-in Date (YYYY-MM-DD)</label>
        <input className="reservePlan-container-leasing-input" type="date" />
        
        <label className="reservePlan-container-leasing-label">Lease Term:</label>
        <select className="reservePlan-container-leasing-select">
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="9">9 Months</option>
            <option value="12">12 Months</option>
            <option value="13">13 Months</option>
        </select>
        
        <label className="reservePlan-container-leasing-label">Rent: ${property?.rent_price}/Month</label>
      <Link to="/register" className="reservePlan-container-leasing-button">Start Application</Link> 
    </div>
);

export default ReservePlan;
