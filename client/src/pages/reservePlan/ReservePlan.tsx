import React, { useState, useEffect } from "react";
import axios from 'axios';
import './reservePlan.css';
import Navigation from "../../components/header/navigation";
import useStore from "../../store/store";
import floorPlans from '../../images/floorplans.webp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath, faRulerCombined, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

interface Property {
    rent_price: number;
    deposit: number;
    bed: number;
    bath: number;
    total_sqft: number;
    property_id: number;
}

interface Lease {
    renter_id: number;
    property_id: number;
    lease_month: string;
    monthly_rent: number;
}

interface ApiResponse {
    status: boolean;
    data: Property;
    message: string;
}

const ReservePlan: React.FC = () => {
    const [property, setProperty] = useState<Property | null>(null);
    const [lease, setLease] = useState<Lease | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [moveInDate, setMoveInDate] = useState<string>('');
    const [leaseTerm, setLeaseTerm] = useState<string>('12');
    const [successfully, setSuccessfully] = useState<boolean>(false);
    const { getPropertyId } = useStore();
    const propertyId = getPropertyId();
    const renterId = localStorage.getItem('user_id');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProperty = async () => {
            if (!propertyId) {
                console.error('No property ID available');
                return;
            }

            try {
                const response = await axios.get<ApiResponse>(`/api/api/properties/${propertyId}`);
                const propertyData = response.data.data;
                setProperty(propertyData);
            } catch (error: any) {
                console.error('Error fetching property:', error);
                setError('Failed to fetch property details. Please try again later.');
            }
        };

        fetchProperty();
    }, [propertyId]);

    const handleLease = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!propertyId ) {
            setError('No property selected or user not logged in. Please choose a property and log in before leasing.');
            return;
        }

        if (!renterId) {
            navigate('/login')
            setError("User not logged in. Please log in before leasing.");
            console.log("User not logged in. Please log in before leasing.");
            return;
        }

        try {
            const response = await axios.post<{ data: Lease }>('/api/api/leases', {
                property_id: propertyId,
                renter_id: parseInt(renterId),
                lease_month: leaseTerm,
                monthly_rent: property?.rent_price
            });

            if (response.data && response.data.data) {
                console.log('Lease created successfully:', response.data.data);
                setSuccessfully(true);
                setLease(response.data.data);
                setError(null);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error: any) {
            console.error('Error leasing property:', error);
            setError(error.response?.data?.error || 'Leasing property failed. Please try again later.');
        }
    };

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
            <LeasingInfo 
                property={property} 
                moveInDate={moveInDate}
                setMoveInDate={setMoveInDate}
                leaseTerm={leaseTerm}
                setLeaseTerm={setLeaseTerm}
                handleLease={handleLease}
                error={error}
                successfully={successfully}
            />
        </div>
    );
};

const DetailItem: React.FC<{ icon: any; label: string }> = ({ icon, label }) => (
    <div className="detail-item">
        <FontAwesomeIcon icon={icon} />
        <p>{label}</p>
    </div>
);

interface LeasingInfoProps {
    property: Property | null;
    moveInDate: string;
    setMoveInDate: (date: string) => void;
    leaseTerm: string;
    setLeaseTerm: (term: string) => void;
    handleLease: (e: React.FormEvent<HTMLFormElement>) => void;
    error: string | null;
    successfully: boolean;
}

const LeasingInfo: React.FC<LeasingInfoProps> = ({ 
    property, 
    moveInDate, 
    setMoveInDate, 
    leaseTerm, 
    setLeaseTerm, 
    handleLease,
    error,
    successfully
}) => (
    <div className="reservePlan-container-leasing">
        <h1 className="reservePlan-container-leasing-title">Leasing Information</h1>
        {successfully ? (
            <div>
                 <p>Lease created successfully!</p>
                 <Link to='/residentPortal'>Return to Resident Portal</Link>
            </div>
            
        ) : (
            <form className="reservePlan-container-leasing-form" onSubmit={handleLease}>
                <label className="reservePlan-container-leasing-label">Lease Term:</label>
                <select 
                    className="reservePlan-container-leasing-select"
                    value={leaseTerm}
                    onChange={(e) => setLeaseTerm(e.target.value)}
                >
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="9">9 Months</option>
                    <option value="12">12 Months</option>
                    <option value="13">13 Months</option>
                </select>
                
                <label className="reservePlan-container-leasing-label">Rent: ${property?.rent_price}/Month</label>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="reservePlan-container-leasing-button">Start Application</button>
            </form>
        )}
    </div>
);

export default ReservePlan;