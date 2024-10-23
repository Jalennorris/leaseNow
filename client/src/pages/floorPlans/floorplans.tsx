import React, { useState, useEffect, useMemo } from "react";
import './floorplans.css';
import Navigation from "../../components/header/navigation";
import Footer from "../../components/footer/footer";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faBath, faExpand, faChevronLeft, faChevronRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import SearchFloorPlans from "../../components/SearchFloorplan/searchFloorPlan";
import FloorPlansImage from '../../images/floorplans.webp';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from "../../store/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

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

const NoResults: React.FC = () => {
  return (
    <div className="no-results">
      <p>No results found.</p>
    </div>
  );
};

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
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [sortCriteria, setSortCriteria] = useState<string>('price');
  

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
          setPropertyId(floorPlans[0].property_id.toString());
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
    const sorted = [...filtered].sort((a, b) => {
      if(sortCriteria === 'price') {
        return a.rent_price - b.rent_price;
      }else if(sortCriteria === 'size') {
        return a.total_sqft - b.total_sqft;
      }
      return 0;
    })
    setFilteredData(sorted);
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
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
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

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
        isFetching
      ) {
        return;
      }
      setIsFetching(true);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
    
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    setIsFetching(false);
  }, [isFetching, currentPage, totalPages]);

  const handleRest  = () => {
    setBedrooms(1);
    setBathrooms(1);
    setMoveInDate('');
    setPriceRange(0);
    setSortCriteria('price');
    window.location.reload();
   
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
            sortCriteria={sortCriteria}
            setSortCriteria={setSortCriteria}
            onSubmit={handleSubmit}
            onRest={handleRest}
          />
        </div>
      </div>

      <div className="floorplans-container2">
        {isLoading ? (
          <div className="skeleton-container" aria-live="polite">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton-item" key={index}>
                <Skeleton height={200} width={300} />
                <Skeleton height={30} width={300} />
                <Skeleton height={30} width={300} />
                <Skeleton height={20} width={250} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div className="floorplans-grid">
              {currentPlans.map((floorPlan) => (
                <div key={floorPlan.property_id} className="floorplan-card">
                  <LazyLoadImage
                    src={FloorPlansImage}
                    alt={`Floor plan for ${floorPlan.title}`}
                    className="floorplans-image"
                    effect="blur"
                   
                  />
                  <div className="floorplan-details">
                   
                    <p className="floorplan-address">
                      {floorPlan.address}, {floorPlan.city}, {floorPlan.state} {floorPlan.zip_code}
                    </p>
                    <p className="floorplan-description">{floorPlan.description}</p>
                    <div className="floorplan-info">
                      <div className="floorplan-info-item">
                        <FontAwesomeIcon icon={faBed} /> {floorPlan.bed} Beds
                      </div>
                      <div className="floorplan-info-item">
                        <FontAwesomeIcon icon={faBath} /> {floorPlan.bath} Baths
                      </div>
                      <div className="floorplan-info-item">
                        <FontAwesomeIcon icon={faExpand} /> {floorPlan.total_sqft} sqft
                      </div>
                    </div>
                    <p className="floorplan-price">${floorPlan.rent_price.toLocaleString()} /mo</p>
                    <button
                      className="floorplans-button"
                      onClick={() => handleReserve(floorPlan.property_id)}
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            
          </>
        )}
        
      </div>
      <div className="pagination-container">
              <button
                className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => paginate(currentPage - 1)}
                aria-label="Go to previous page"
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              {renderPaginationButtons()}
              <button
                className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => paginate(currentPage + 1)}
                aria-label="Go to next page"
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
      <Footer />
    </div>
  );
};

export default FloorPlans;


