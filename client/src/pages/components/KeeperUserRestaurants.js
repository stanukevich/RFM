import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import AuthAttention from './attention/AuthAttention';
import AuthRestaurantModal from '../modal/AuthRestaurantModal'; 

const KeeperUserRestaurants = ({ restaurants, selectedRestaurant, setSelectedRestaurant, setIsRestaurantLogin}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsPerPage] = useState(8); 
  const [showModal, setShowModal] = useState(false); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleCloseModal = (authenticated) => {
    // console.log(authenticated)
    if(!authenticated){
      setSelectedRestaurant(null)
    }
    setShowModal(false);
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faSearch} className="me-2 text-dark" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="rounded-pill align-items-center px-2 py-1"
          />
        </div>
        <div className="pagination">
          <Button variant="outline-dark" onClick={prevPage} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <span className="mx-2 d-flex align-items-center">
            <Badge bg="dark">{currentPage}</Badge>
          </span>
          <Button variant="outline-dark" onClick={nextPage} disabled={indexOfLastRestaurant >= filteredRestaurants.length}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </div>
      <div className="border rounded p-4">
        <div className="d-flex flex-wrap justify-content-center">
          {currentRestaurants.length > 0 ? (
            currentRestaurants.map((restaurant, index) => (
              <div
                key={index}
                onClick={() => handleRestaurantClick(restaurant)} 
                style={{ 
                  width: '150px', 
                  height: '150px',
                  border: '1px solid #ced4da', 
                  borderRadius: '0.25rem',
                  margin: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: selectedRestaurant === restaurant ? 'black' : 'white', 
                  color: selectedRestaurant === restaurant ? 'white' : 'black', 
                  wordBreak: 'break-all',
                  textAlign: 'center',
                  overflow: 'hidden',
                  padding: '5px' 
                }}
              >
                <span>{restaurant.name}</span>
              </div>
            ))
          ) : (
            <AuthAttention text="No restaurants available. You need to create restaurants in UserDashboard." />
          )}
        </div>
      </div>
      <AuthRestaurantModal show={showModal} selectedRestaurant={selectedRestaurant} setIsRestaurantLogin={setIsRestaurantLogin} handleClose={handleCloseModal}/>
    </div>
  );
};

export default KeeperUserRestaurants;
