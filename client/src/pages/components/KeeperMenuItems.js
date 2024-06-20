import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import AuthAttention from '../components/attention/AuthAttention';
import axios from 'axios';
import userStore from '../../mobx/userStore';
import { CREATE_ORDER_MENU_ITEM } from '../../requests/req';

const KeeperMenuItems = ({ items, currentPage, canGoPrev, canGoNext, onPageChange, onBack, categoryName, initialOrders, selectedOrderId, restaurantId, systemUser }) => {
  const itemsPerPage = 9;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const nextPage = () => {
    onPageChange(currentPage + 1);
  };

  const prevPage = () => {
    onPageChange(currentPage - 1);
  };

  const selectedOrderIndex = parseInt(selectedOrderId);

  const selectedMenuItems = initialOrders && initialOrders.length > selectedOrderIndex && initialOrders[selectedOrderIndex].OrderMenuItems ? initialOrders[selectedOrderIndex].OrderMenuItems : [];

  const isItemSelected = (item) => {
    return selectedMenuItems.some(selectedItem => selectedItem.menuItem.id === item.id);
  };

  const handleMenuItemClick = async (item) => {
    if (!systemUser.orderInteraction) {
      return;
    }

    if (initialOrders && initialOrders[selectedOrderIndex]) {
      const order = initialOrders[selectedOrderIndex];
      
      if (order.precheckStatus) {
        return;
      }

      const orderId = order.id;
      const menuItemId = item.id;

      try {
        const response = await axios.post(CREATE_ORDER_MENU_ITEM, { orderId, menuItemId });

        if (response.status === 200 || response.status === 201) {
          console.log('MenuItem added to order successfully');
          await userStore.loadOrders(restaurantId);
        } else {
          console.error('Failed to add MenuItem to order', response);
        }
      } catch (error) {
        console.error('Error adding MenuItem to order', error);
      }
    }
  };

  return (
    <div className="container mt-2 border rounded pb-4" style={{ maxWidth: '500px' }}>
      <header className="d-flex justify-content-between align-items-center mt-3 mb-3 border-bottom pb-2">
        <div className="d-flex align-items-center">
          <h5 className="mb-0 mr-3" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{categoryName}</h5>
          <Button variant="outline-dark" onClick={onBack} style={{ marginLeft: '10px' }}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
        </div>
        <div className="d-flex align-items-center">
          <Button variant="outline-dark" onClick={prevPage} disabled={!canGoPrev}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <span className="d-flex align-items-center mx-2">
            <Badge bg="dark">{currentPage}</Badge>
          </span>
          <Button variant="outline-dark" onClick={nextPage} disabled={!canGoNext}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </header>
      <div>
        <div className="d-flex flex-wrap justify-content-center">
          {currentItems.map((item, index) => (
            <div
              key={index}
              className="category-square"
              onClick={() => handleMenuItemClick(item)}
              style={{
                width: '120px',
                height: '120px',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem',
                margin: '5px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: 'black',
                textAlign: 'center',
                padding: '5px',
                position: 'relative',
              }}
            >
              <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }}>{item.name}</span>
              <span style={{
                marginTop: '5px',
                fontSize: '0.8em',
                color: 'gray',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }}>${item.price}</span>
              {isItemSelected(item) && <Badge bg="dark" style={{ position: 'absolute', top: '5px', right: '5px' }}>Selected</Badge>}
            </div>
          ))}
        </div>
      </div>
      {!currentItems.length && (
        <AuthAttention text="You need to create dishes in the menu to start working." />
      )}
    </div>
  );
};

export default KeeperMenuItems;
