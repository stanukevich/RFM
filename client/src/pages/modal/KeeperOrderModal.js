import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import KeeperMenu from '../components/KeeperMenu';
import KeeperMenuItems from '../components/KeeperMenuItems';
import KeeperOrderItems from '../components/KeeperOrderItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CREATE_EMPTY_ORDER, DELETE_ORDER } from '../../requests/req';
import userStore from '../../mobx/userStore';

const KeeperOrderModal = ({ showModal, handleCloseModal, menuItems, initialOrders, restaurantId, systemUserId, table, systemUser }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const handleCloseModalAndReset = () => {
    setSelectedCategory(null);
    setSelectedOrderId(0);
    setCurrentPage(1);
    setOrderItems([]);
    handleCloseModal();
    setSelectedRowIndex(null)
  };

  const handleAddToOrder = (item) => {
    setOrderItems((prevItems) => {
      const itemExists = prevItems.find((orderItem) => orderItem.id === item.id);
      if (itemExists) {
        return prevItems.map((orderItem) =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const handleQuantityChange = (id, quantity) => {
    setOrderItems((prevItems) =>
      prevItems.map((orderItem) => (orderItem.id === id ? { ...orderItem, quantity } : orderItem))
    );
  };

  const handleCreateOrder = async () => {
    const tableId = table.id;

    try {
      const response = await axios.post(CREATE_EMPTY_ORDER, {
        restaurantId,
        systemUserId,
        tableId
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Order created successfully');
        await userStore.loadOrders(restaurantId); 
      } else {
        console.error('Failed to create order', response);
      }
    } catch (error) {
      console.error('Error creating order', error);
    }
  };

  const handleDeleteEmptyOrder = async () => {
    const selectedOrderIndex = parseInt(selectedOrderId);
    const selectedOrder = initialOrders[selectedOrderIndex] || [];
    const orderId = selectedOrder.id

    try {
      const response = await axios.delete(DELETE_ORDER, { data: { orderId: orderId } });

      if (response.status === 200) {
        console.log('Order deleted successfully');
        await userStore.loadOrders(restaurantId);
        setSelectedOrderId(0);
      } else {
        console.error('Failed to delete order', response);
      }
    } catch (error) {
      console.error('Error deleting order', error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleCloseModalAndReset} centered size="xl">
      <Modal.Header>
        <h5 className="modal-title">Work with order</h5>
        <Button variant="outline-dark" onClick={handleCloseModalAndReset} style={{ marginLeft: 'auto' }}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, marginRight: '10px' }}>
            {!selectedCategory ? (
              <KeeperMenu menuItems={menuItems} onSelectCategory={handleCategorySelect} />
            ) : (
              <KeeperMenuItems
                items={menuItems.filter((item) => item.category === selectedCategory)}
                currentPage={currentPage}
                canGoPrev={currentPage > 1}
                canGoNext={currentPage * 9 < menuItems.filter((item) => item.category === selectedCategory).length}
                onPageChange={setCurrentPage}
                onBack={handleBackToCategories}
                categoryName={selectedCategory}
                onAddToOrder={handleAddToOrder}
                initialOrders={initialOrders}
                selectedOrderId={selectedOrderId}
                restaurantId={restaurantId}
                systemUser={systemUser}
              />
            )}
          </div>
          <div style={{ flex: 1, marginLeft: '10px' }}>
            <KeeperOrderItems
              items={orderItems.map((item) => ({
                ...item,
                setQuantity: (quantity) => handleQuantityChange(item.id, quantity),
              }))}
              onCreateOrder={handleCreateOrder}
              onDeleteEmptyOrder={handleDeleteEmptyOrder} 
              selectedOrderId={selectedOrderId}
              setSelectedOrderId={setSelectedOrderId}
              orders={initialOrders}
              selectedRowIndex={selectedRowIndex}
              setSelectedRowIndex={setSelectedRowIndex}
              restaurantId={restaurantId}
              systemUser={systemUser}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default KeeperOrderModal;
