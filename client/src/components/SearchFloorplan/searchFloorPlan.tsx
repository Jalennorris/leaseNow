import React from "react";
import './searchFloorPlan.css';

interface SearchFloorPlansProps {
  bedrooms: number;
  setBedrooms: (value: number) => void;
  bathrooms: number;
  setBathrooms: (value: number) => void;
  moveInDate: string;
  setMoveInDate: (value: string) => void;
  priceRange: number;
  setPriceRange: (value: number) => void;
  sortCriteria: string;
  setSortCriteria: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SearchFloorPlans: React.FC<SearchFloorPlansProps> = ({
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  moveInDate,
  setMoveInDate,
  priceRange,
  setPriceRange,
  sortCriteria,
  setSortCriteria,
  onSubmit,
}) => {
  return (
    <form className="floorplans-search" onSubmit={onSubmit}>
      <div className="filter-box">
        <label htmlFor="bedrooms">Bedrooms</label>
        <select
          name="bedrooms"
          id="bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(Number(e.target.value))}
        >
          <option value="0">Any</option>
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
          onChange={(e) => setBathrooms(Number(e.target.value))}
        >
          <option value="0">Any</option>
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
          onChange={(e) => setPriceRange(Number(e.target.value))}
        />
      </div>

      <div className="filter-box">
        <label htmlFor="sortCriteria">Sort by:</label>
        <select
          name="sortCriteria"
          id="sortCriteria"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="price">Price (low to high)</option>
          <option value="size">Size (small to large)</option>
        </select>
      </div>

      <button type="submit">Search</button>
    </form>
  );
};

export default SearchFloorPlans;
