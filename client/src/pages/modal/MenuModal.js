import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import AuthAttention from '../components/attention/AuthAttention';
import axios from 'axios';
import userStore from '../../mobx/userStore'; 

import { DELETE_MENU_ITEM } from '../../requests/req';

const MenuModal = ({ showModal, handleCloseModal, selectedCategory, categorizedItems, restaurantId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const itemsPerPage = 16;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // useEffect(() => {
  //   if (showModal && !categorizedItems[selectedCategory]?.length) {
  //   }
  // }, [showModal, selectedCategory, categorizedItems, handleCloseModal]);

  useEffect(() => {
    if (!showModal) {
      setSelectedItemId(null);
      setCurrentPage(1)
    }
  }, [showModal]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  const handleDeleteItem = (itemId) => {
    axios.delete(`${DELETE_MENU_ITEM}`, { data: { menuItemId: itemId } })
      .then(response => {
        console.log("Menu item deleted successfully!", response.data);
        userStore.loadMenuItems(restaurantId);
        handleCloseModal()
      })
      .catch(error => {
        console.error("Error deleting menu item:", error);
      });
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered size="xl">
      <Modal.Header>
        <Modal.Title style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <span>{selectedCategory}</span>
          {categorizedItems[selectedCategory]?.length > itemsPerPage && (
            <div className="d-flex justify-content-end">
              <Button variant="outline-dark" onClick={prevPage} disabled={currentPage === 1}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
              <span className="mx-2 d-flex align-items-center">
                <Badge bg="dark" className="fs-6">{currentPage}</Badge>
              </span>
              <Button variant="outline-dark" onClick={nextPage} disabled={endIndex >= categorizedItems[selectedCategory]?.length}>
                <FontAwesomeIcon icon={faChevronRight} />
              </Button>
            </div>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row xs={1} md={2} lg={4} className="g-3">
          {categorizedItems[selectedCategory]?.slice(startIndex, endIndex).map((item) => (
            <Col key={item.id} xs={6} lg={3} className="mb-3">
              <Card className={`h-100 ${selectedItemId === item.id ? 'border-dark' : ''}`} onClick={() => handleSelectItem(item.id)}>
                <Card.Body className="d-flex flex-column justify-content-between align-items-center">
                  <div>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>${item.price}</Card.Text>
                  </div>
                </Card.Body>
                {selectedItemId === item.id && <Badge bg="dark" className="text-white position-absolute top-0 end-0">Selected</Badge>}
              </Card>
            </Col>
          ))}
        </Row>
        {(!categorizedItems[selectedCategory]?.length) && (
          <AuthAttention text="You need to create dishes in the menu to start working." />
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="outline-dark" disabled={!selectedItemId} onClick={() => handleDeleteItem(selectedItemId)}>
          <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
        <Button variant="outline-dark" onClick={handleCloseModal}>
          <FontAwesomeIcon icon={faTimes}/> Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MenuModal;
