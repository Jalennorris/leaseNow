import React, { useState, useEffect, useMemo } from "react";
import './floorplans.css';
import Navigation from "../../components/header/navigation";
import Footer from "../../components/footer/footer";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath, faExpand, faChevronLeft, faChevronRight,faSpinner } from "@fortawesome/free-solid-svg-icons";
import SearchFloorPlans from "../../components/SearchFloorplan/searchFloorPlan";
import FloorPlansImage from '../../images/floorplans.webp';
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

const plansPerPage = 6;
const maxVisibleButtons = 5;

const FloorPlans: React.FC = () => {
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [moveInDate, setMoveInDate] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(0);
  const [data, setData] = useState<FloorPlan[]>([]);
  const [filteredData, setFilteredData] = useState<FloorPlan[]>([]);
  const { propertyId, setPropertyId } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getFloorPlans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiResponse>('/api/api/properties/');
        const floorPlans = response.data.data;

        if (floorPlans && floorPlans.length > 0) {
          setData(floorPlans);
          setFilteredData(floorPlans);
          const firstPropertyId = floorPlans[0].property_id.toString();
          setPropertyId(firstPropertyId);
        } else {
          setError('No floor plans found. Please try again later.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(`Error fetching floor plans: ${error.response?.data?.message || error.message}`);
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
        console.error('Error fetching floor plans:', error);
      } finally {
        setIsLoading(false);
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
  };

  const handleReserve = (propertyId: number) => {
    setPropertyId(propertyId.toString());
    navigate(`/floorplans/${propertyId}/reserve`);
  };

  const currentPlans = useMemo(() => {
    const indexOfLastPlan = currentPage * plansPerPage;
    const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
    return filteredData.slice(indexOfFirstPlan, indexOfLastPlan);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / plansPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const renderPaginationButtons = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((number, index) => {
      if (number === '...') {
        return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
      }
      return (
        <button
          key={number}
          onClick={() => paginate(number as number)}
          className={`pagination-button ${number === currentPage ? 'active' : ''}`}
          aria-label={`Go to page ${number}`}
        >
          {number}
        </button>
      );
    });
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
        {isLoading ? (
         <div className="loading-spinner">
         <FontAwesomeIcon icon={faSpinner} spin size="3x" />
         <p>Loading floor plans...</p>
       </div>
     ) : error ? (
       <div className="error-message">
         <p>{error}</p>
         <button onClick={() => window.location.reload()}>Try Again</button>
       </div>
     ) : currentPlans.length === 0 ? (
       <p>No floor plans match your search criteria. Please try different options.</p>
     ) : (
          currentPlans.map((floorPlan) => (
            <div
              className={`floorplans-item ${floorPlan.property_id.toString() === propertyId ? 'selected' : ''}`}
              key={floorPlan.property_id}
            >
              <p className="floorplans-text">{floorPlan.bed} <FontAwesomeIcon className="floorplans-icon" icon={faBed} /> - {floorPlan.bath} <FontAwesomeIcon className="floorplans-icon" icon={faBath} /></p>
              <p><FontAwesomeIcon className="floorplans-icon" icon={faExpand} /> {floorPlan.total_sqft} Sq. Ft</p>
              <img className="floorplans-image" src={FloorPlansImage} alt="floorplans" />
              <div className="reserve-container">
                <p className="floorplans-cost-text"> Starting at ${floorPlan.rent_price}</p>
              </div>
              <button onClick={() => handleReserve(floorPlan.property_id)} className="floorplans-button">Reserve Now</button>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button pagination-nav"
          aria-label="Go to previous page"
        >
          <FontAwesomeIcon icon={faChevronLeft} /> Previous
        </button>
        {renderPaginationButtons()}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button pagination-nav"
          aria-label="Go to next page"
        >
          Next <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default FloorPlans;
