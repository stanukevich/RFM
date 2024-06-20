import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import AuthAttention from '../components/attention/AuthAttention';
import axios from 'axios';
import userStore from '../../mobx/userStore.js';

import { CREATE_MENU_ITEM } from '../../requests/req.js';

const AddDishModal = ({ show, handleClose, newItem, handleInputChange, setNewItem, techCards, restaurantId }) => {
  const [selectedTechCards, setSelectedTechCards] = useState([]);
  const [techCardQuantities, setTechCardQuantities] = useState({});
  const [activeCard, setActiveCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAttention, setShowAttention] = useState(false);
  const itemsPerPage = 6;

  const handleCloseModal = () => {
    clearDataInModal();
    handleClose();
  };

  const handleSelectTechCard = (techCardId, quantity) => {
    if (selectedTechCards.includes(techCardId)) {
      setSelectedTechCards(selectedTechCards.filter(id => id !== techCardId));
    } else {
      setSelectedTechCards([...selectedTechCards, techCardId]);
    }
    setTechCardQuantities(prevState => ({
      ...prevState,
      [techCardId]: quantity,
    }));
    setActiveCard(techCardId);
  };

  const filteredTechCards = techCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTechCards.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const calculateCost = () => {
    let totalCost = 0;
    selectedTechCards.forEach(cardId => {
      const quantity = techCardQuantities[cardId] || 1;
      const card = techCards.find(card => card.id === cardId);
      totalCost += quantity * card.cost;
    });
    return totalCost.toFixed(2);
  };

  const clearDataInModal = () => {
    setSelectedTechCards([]);
    setTechCardQuantities({});
    setActiveCard(null);
    setSearchTerm('');
    setCurrentPage(1);
    setShowAttention(false);
    setNewItem({ name: '', category: '', price: '' });
  };

  // const handleAddItemInModal = () => {
  //   if (!newItem.name.trim() || !newItem.category.trim() || !newItem.price.trim() || selectedTechCards.length === 0) {
  //     setShowAttention(true);
  //   } else {
  //     const newMenuItem = {
  //       ...newItem,
  //       techCards: selectedTechCards.map(id => ({
  //         id,
  //         quantity: techCardQuantities[id] || 1,
  //       })),
  //       restaurantId: restaurantId,
  //     };

  //     console.log(newMenuItem)

  //     axios.post(CREATE_MENU_ITEM, newMenuItem)
  //       .then(response => {
  //         console.log("Menu item created successfully!", response.data);
  //         userStore.loadMenuItems(restaurantId); // Обновление информации пользователя
  //         console.log(userStore.menuItems)
  //         clearDataInModal();
  //         handleClose();
  //       })
  //       .catch(error => {
  //         console.error("Error creating menu item:", error);
  //       });
  //   }
  // };

  const handleAddItemInModal = async () => {
    if (!newItem.name.trim() || !newItem.category.trim() || !newItem.price.trim() || selectedTechCards.length === 0) {
      setShowAttention(true);
    } else {
      const newMenuItem = {
        ...newItem,
        techCards: selectedTechCards.map(id => ({
          id,
          quantity: techCardQuantities[id] || 1,
        })),
        restaurantId: restaurantId,
      };
  
      // console.log(newMenuItem);
  
      try {
        const response = await axios.post(CREATE_MENU_ITEM, newMenuItem);
        // console.log("Menu item created successfully!", response.data);
  
        if (response.status === 200) {
          await userStore.loadMenuItems(restaurantId);
          // console.log(userStore.menuItems);
          clearDataInModal();
          handleClose();
        } else {
          console.error('Menu item creation failed:', response.statusText);
          // setError('Menu item creation failed. Please try again.');
        }
      } catch (error) {
        console.error("Error creating menu item:", error.response?.data?.message || error.message);
        // setError(error.response?.data?.message || "An error occurred. Please try again.");
      }
    }
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header>
        <Modal.Title>{'Add New Dish'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              placeholder="Dish Name"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              placeholder="Category"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              type="number"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              placeholder="Price"
            />
          </InputGroup>
          <div className="d-flex align-items-center mb-3">
            <InputGroup style={{ marginRight: '10px' }}>
              <div className="position-absolute top-50 start-0 translate-middle-y" style={{ marginRight: '10px' }}>
                <FontAwesomeIcon icon={faSearch} className="text-dark" />
              </div>
              <input
                type="text"
                placeholder="Search tech cards..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="rounded-pill align-items-center px-2 py-1"
                style={{ minWidth: '200px', paddingRight: '30px', marginLeft: '20px' }}
              />
            </InputGroup>
            <div className="pagination mt-2 mb-2 d-flex align-items-center">
              <Button variant="outline-dark" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
              <span className="mx-2 d-flex align-items-center">
                <Badge bg="dark">{currentPage}</Badge>
              </span>
              <Button variant="outline-dark" onClick={() => paginate(currentPage + 1)} disabled={currentItems.length < itemsPerPage}>
                <FontAwesomeIcon icon={faChevronRight} />
              </Button>
            </div>
          </div>
          <div className="row mt-2">
            {currentItems.map(card => (
              <div key={card.id} className="col-md-4 mb-3">
                <Card
                  style={{ width: '100%', position: 'relative', paddingTop: '10px' }}
                  onClick={() => handleSelectTechCard(card.id, techCardQuantities[card.id] || 1)}
                  className={activeCard === card.id ? 'active' : ''}
                >
                  <Card.Body>
                    <Card.Title style={{ textAlign: 'center', marginBottom: '10px' }}>{card.name}</Card.Title>
                    {selectedTechCards.includes(card.id) && (
                      <Badge bg="dark" className="position-absolute top-0 end-0">
                        Selected
                      </Badge>
                    )}
                    {selectedTechCards.includes(card.id) && (
                      <Form.Control
                        type="number"
                        min="1"
                        value={techCardQuantities[card.id] || 1}
                        onChange={(e) => setTechCardQuantities({ ...techCardQuantities, [card.id]: parseFloat(e.target.value) })}
                        placeholder="Quantity"
                        onFocus={() => setActiveCard(card.id)}
                        onBlur={() => setActiveCard(null)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ textAlign: 'center' }}
                      />
                    )}
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
          <div className="mb-3">
            <Badge bg="dark" className="me-2">Cost: ${calculateCost()}</Badge>
          </div>
          {showAttention && (
            <AuthAttention text="All fields must be filled in, and at least one tech card must be selected." />
          )}
          <div className="d-flex justify-content-center mt-3">
            <Button variant="outline-dark" onClick={handleAddItemInModal} className="me-2">
              <FontAwesomeIcon icon={faPlus} /> Add
            </Button>
            <Button variant="outline-dark" onClick={handleCloseModal}>
              <FontAwesomeIcon icon={faTimes} /> Close
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDishModal;
