import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import AuthAttention from '../components/attention/AuthAttention';

const KeeperMenu = ({ menuItems, onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(9); // 3x3 grid

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredCategories = menuItems
    .map(item => item.category)
    .filter((category, index, self) => self.indexOf(category) === index && category.toLowerCase().includes(searchTerm.toLowerCase()));

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const canGoNextCategories = indexOfLastCategory < filteredCategories.length;
  const canGoPrevCategories = currentPage > 1;

  return (
    <div className="container mt-2 border rounded pb-4" style={{ maxWidth: '500px' }}>
      <header className="d-flex justify-content-between align-items-center mt-3 mb-3 border-bottom pb-2">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faSearch} className="me-2 text-dark" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="rounded-pill align-items-center px-2 py-1"
          />
        </div>
        <div className="pagination">
          <Button variant="outline-dark" onClick={prevPage} disabled={!canGoPrevCategories}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <span className="mx-2 d-flex align-items-center">
            <Badge bg="dark">{currentPage}</Badge>
          </span>
          <Button variant="outline-dark" onClick={nextPage} disabled={!canGoNextCategories}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </header>
      <div>
        <div className="d-flex flex-wrap justify-content-center">
          {currentCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => onSelectCategory(category)}
              className="category-square"
              style={{
                width: '120px',
                height: '120px',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem',
                margin: '5px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: 'black',
                wordBreak: 'break-all',
                textAlign: 'center',
                overflow: 'hidden',
                padding: '5px',
              }}
            >
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>
      {!filteredCategories.length && (
        <AuthAttention text="No categories available." />
      )}
    </div>
  );
};

export default KeeperMenu;
