import React, { useState, useEffect } from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSearch, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddTechCardModal from '../modal/AddTechCardModal'; 
import EditTechCardModal from '../modal/EditTechCardModal'; 
import ConfirmationModal from '../modal/ConfirmationModal';
import axios from 'axios';
import { DELETE_TECH_CARD } from '../../requests/req'; 

import userStore from '../../mobx/userStore.js'

function TechCards({ techCards, uniqueKey, restaurantId }) {
  const [selectedTechCard, setSelectedTechCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [visible, setVisible] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
  const [deletingTechCardId, setDeletingTechCardId] = useState(null); 

  useEffect(() => {
    setCurrentPage(1);
    setVisible(true);
  }, [uniqueKey]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;

  const handleSelectTechCard = (id) => {
    setSelectedTechCard(id === selectedTechCard ? null : id);
  };

  const handleAddTechCard = () => {
    setShowAddModal(true); 
  };

  const handleDeleteTechCard = () => {
    if (selectedTechCard) {
      setDeletingTechCardId(selectedTechCard); 
      setShowConfirmationModal(true); 
    }
  };

  const handleConfirmDelete = () => {
    if (deletingTechCardId) {
      axios.delete(`${DELETE_TECH_CARD}`, { data: { techCardId: deletingTechCardId } })
        .then(response => {
          console.log("Tech card deleted successfully!");
        })
        .catch(error => {
          console.error("Error deleting tech card:", error);
        })
        .finally(() => {
          setShowConfirmationModal(false); 
          setDeletingTechCardId(null); 
          userStore.loadTechCards(restaurantId);
          setSelectedTechCard(null);
          setCurrentPage(1); 
        });
    }
  };
  
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false); 
    setDeletingTechCardId(null); 
  };

  const handleEditTechCard = () => {
    if (selectedTechCard) {
      setShowEditModal(true); 
    }
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredCards = techCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <div className={`fade ${visible ? 'show' : ''}`}>
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
          <Button variant="outline-dark" onClick={nextPage} disabled={indexOfLastCard >= filteredCards.length}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </div>
      <Table striped bordered hover className="mt-4 table-scroll">
        <thead>
          <tr>
            <th>Name</th>
            <th>Production Output</th>
            <th>Cost Calculation</th>
          </tr>
        </thead>
        <tbody>
          {currentCards.map(card => (
            <tr key={card.id} className={selectedTechCard === card.id ? 'table-dark' : ''} onClick={() => handleSelectTechCard(card.id)}>
              <td>{card.name}</td>
              <td>{card.productOutput}</td>
              <td>{card.cost}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-3">
        <Button variant="outline-dark" disabled={!selectedTechCard} className="me-1" onClick={handleEditTechCard}>
          <FontAwesomeIcon icon={faEdit} /> Edit
        </Button>
        <Button variant="outline-dark" disabled={!selectedTechCard} className="me-1" onClick={handleDeleteTechCard}>
          <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
        <Button variant="outline-dark" onClick={handleAddTechCard}>
          <FontAwesomeIcon icon={faPlus} /> Add new
        </Button>
      </div>
      <AddTechCardModal show={showAddModal} handleClose={() => setShowAddModal(false)} restaurantId={restaurantId} />
      <EditTechCardModal show={showEditModal} handleClose={() => setShowEditModal(false)} techCard={techCards.find(card => card.id === selectedTechCard)} restaurantId={restaurantId} />
      <ConfirmationModal
        show={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default TechCards;
