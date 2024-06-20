import React, { useState } from 'react';
import { Button, Card, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import MenuModal from '../modal/MenuModal';
import AuthAttention from '../components/attention/AuthAttention';
import AddDishModal from '../modal/AddDishModal';

const Menu = ({menuItems, techCards, restaurantId}) => {
  // const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', price: '' });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [categoryPage, setCategoryPage] = useState(1);
  const categoriesPerPage = 16;
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // const handleAddItem = () => {
  //   if (newItem.category.trim() !== '') {
  //     setMenuItems([...menuItems, { ...newItem, id: Date.now() }]);
  //     setNewItem({ name: '', category: '', price: '' });
  //     setShowAddDishModal(false); // Close the modal after adding an item
  //   }
  // };

  // const handleDeleteItem = (id) => {
  //   setMenuItems(menuItems.filter(item => item.id !== id));
  // };

  const categorizedItems = menuItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] ? [...acc[item.category], item] : [item];
    return acc;
  }, {});

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? '' : category); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory('');
  };

  const categoryKeys = Object.keys(categorizedItems);
  const filteredCategories = categoryKeys.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (categoryPage - 1) * categoriesPerPage;
  const endIndex = startIndex + categoriesPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const nextPage = () => {
    if (endIndex < filteredCategories.length) {
      setCategoryPage(categoryPage + 1);
    }
  };

  const prevPage = () => {
    if (categoryPage > 1) {
      setCategoryPage(categoryPage - 1);
    }
  };

  const canGoNext = endIndex < filteredCategories.length;
  const canGoPrev = categoryPage > 1;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCategoryPage(1);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faSearch} className="me-2 text-dark" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="rounded-pill align-items-center px-2 py-1"
            style={{ minWidth: '200px' }}
          />
        </div>
        <div className="d-flex align-items-center">
          <Button variant="outline-dark" onClick={() => setShowAddDishModal(true)} className="me-2">
            <FontAwesomeIcon icon={faPlus} /> Add Dish
          </Button>
          <div className="pagination d-flex align-items-center">
            <Button variant="outline-dark" onClick={prevPage} disabled={!canGoPrev}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <span className="mx-2 d-flex align-items-center">
              <Badge bg="dark">{categoryPage}</Badge>
            </span>
            <Button variant="outline-dark" onClick={nextPage} disabled={!canGoNext}>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
        </div>
      </div>
      <Card className="mb-4">
        <Card.Body>
            {categoryKeys.length === 0 && (
              <AuthAttention text="You need to create dishes in the menu to start working." />
            )}
          <div style={{ padding: '15px', borderRadius: '5px' }}>
            <Row>
              {currentCategories.map((category) => (
                <Col key={category} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className={`h-100 ${selectedCategory === category ? 'bg-dark text-white' : 'bg-light'}`} onClick={() => handleCategoryClick(category)} style={{ cursor: 'pointer' }}>
                    <Card.Body>
                      <Card.Title>{category}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Card.Body>
      </Card>
      <MenuModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedCategory={selectedCategory}
        categorizedItems={categorizedItems}
        restaurantId={restaurantId}
        // handleDeleteItem={handleDeleteItem}
      />
      <AddDishModal
        show={showAddDishModal}
        handleClose={() => setShowAddDishModal(false)}
        newItem={newItem}
        handleInputChange={handleInputChange}
        setNewItem={setNewItem}
        techCards={techCards}
        restaurantId={restaurantId}
      />
    </div>
  );
};

export default Menu
