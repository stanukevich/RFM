import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCog, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import EmptyListOfRestaurants from './attention/EmptyListOfRestaurants';
import AddRestaurantModal from '../modal/AddRestaurantModal.js';
import ConfirmationModal from '../modal/ConfirmationModal'; 
import RestaurantSettingsModal from '../modal/RestaurantSettingsModal'; 

import axios from 'axios';
import { USER_DELETE_RESTAURANT_ROUTE } from './/..//../requests/req.js'
import userStore from '../../mobx/userStore.js'

function UserRestaurants({ restaurants, onSelectRestaurant, onDeleteRestaurant }) {

  // Активные данные пользователя
  // const { user } = userStore;

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [deletingRestaurantIndex, setDeletingRestaurantIndex] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false); 

  const handleRestaurantClick = (index) => {
    setSelectedRestaurant(index === selectedRestaurant ? null : index);
    onSelectRestaurant(index === selectedRestaurant ? null : index);
  };

  const handleDeleteClick = (event, index) => {
    event.stopPropagation();
    setDeletingRestaurantIndex(index); 
    setShowConfirmationModal(true);
  };

  const handleEditClick = (event, index) => {
    event.stopPropagation();
    setDeletingRestaurantIndex(index);
    setShowSettingsModal(true);
  };

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleConfirmDelete = () => {
    const deletingIndex = deletingRestaurantIndex;

    const restaurantIdToDelete = restaurants[deletingIndex].id;

    axios.delete(`${USER_DELETE_RESTAURANT_ROUTE}`, { data: { restaurantId: restaurantIdToDelete } })
      .then(response => {
        console.log("Restaurant deleted successfully!");
      })
      .catch(error => {
        console.error("Error deleting restaurant:", error);
      })
      .finally(() => {
        setShowConfirmationModal(false);
        setDeletingRestaurantIndex(null);
        userStore.loadRestaurants(userStore.user.id);
        setSelectedRestaurant(null);
        onDeleteRestaurant();
      });
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setDeletingRestaurantIndex(null);
  };

  const handleCloseSettingsModal = () => {
    setShowSettingsModal(false);
    setDeletingRestaurantIndex(null);
  };

  return (
    <div>
      <style>
        {`
          .badge-selected {
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .badge-selected.show {
            opacity: 1;
          }
        `}
      </style>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Your Restaurants</h2>
        <Button variant="outline-dark" onClick={handleShowAddModal}>
          <FontAwesomeIcon icon={faPlus} className="me-1" /> Add
        </Button>
      </div>
      <div className="border p-3" style={{ maxHeight: '180px', overflowY: 'auto' }}>
        {restaurants.length === 0 ? (
          <EmptyListOfRestaurants />
        ) : (
          restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center"
              onClick={() => handleRestaurantClick(index)}
            >
              <div>
                {restaurant.name}
                <Badge bg="dark" className={`ms-2 badge-selected ${selectedRestaurant === index ? 'show' : ''}`}>Selected</Badge>
              </div>
              <div>
                {selectedRestaurant === index && (
                  <div className="fade show">
                    <Button variant="outline-dark" className="me-1" onClick={(event) => handleEditClick(event, index)}>
                      <FontAwesomeIcon icon={faCog} />
                    </Button>
                    <Button variant="outline-dark" onClick={(event) => handleDeleteClick(event, index)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <AddRestaurantModal show={showAddModal} handleClose={handleCloseAddModal} />
      <ConfirmationModal
        show={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmDelete}
      />
      <RestaurantSettingsModal
        show={showSettingsModal}
        restId={deletingRestaurantIndex !== null && restaurants[deletingRestaurantIndex]?.id}
        handleClose={handleCloseSettingsModal}
      />
    </div>
  );
}

export default UserRestaurants;
