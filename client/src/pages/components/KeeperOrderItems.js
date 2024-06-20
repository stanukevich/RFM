import React, { useState } from 'react';
import { Button, Table, Form, Badge, DropdownButton, Dropdown } from 'react-bootstrap';
import AuthAttention from './attention/AuthAttention';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faPaperPlane, faClipboardCheck, faMoneyBillWave, faBan } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { DELETE_ORDER_MENU_ITEM, UPDATE_ORDER_MENU_ITEM, UPDATE_ORDER_MENU_ITEMS, UPDATE_ORDER } from '../../requests/req';
import userStore from '../../mobx/userStore';

const KeeperOrderItems = ({ onCreateOrder, selectedOrderId, setSelectedOrderId, orders, onDeleteEmptyOrder, restaurantId, selectedRowIndex, setSelectedRowIndex, systemUser }) => {
  const selectedOrderIndex = parseInt(selectedOrderId);
  const selectedOrder = orders[selectedOrderIndex] || [];

  const selectedMenuItem = selectedRowIndex !== null ? selectedOrder.OrderMenuItems[selectedRowIndex] : null;

  const [paymentType, setPaymentType] = useState('cash');

  const handleQuantityChange = async (index, value) => {
    const quantity = Number(value);
    if (quantity > 0) {
      const newOrders = [...orders];
      try {
        const selectedItem = newOrders[selectedOrderIndex].OrderMenuItems[index];
        const response = await axios.put(UPDATE_ORDER_MENU_ITEM, { id: selectedItem.id, quantity });
        if (response.status === 200) {
          console.log('Order menu item quantity updated successfully');
          await userStore.loadOrders(restaurantId);
        } else {
          console.error('Failed to update order menu item quantity', response);
        }
      } catch (error) {
        console.error('Error updating order menu item quantity', error);
      }
    }
  };

  const hasUnsentItems = selectedOrder && selectedOrder.OrderMenuItems && selectedOrder.OrderMenuItems.some(item => !item.sendingStatus);

  const handleSendToKitchen = async () => {
    try {
      if (!selectedMenuItem) {
        const unsentItems = selectedOrder.OrderMenuItems.filter(item => !item.sendingStatus);
        const updatedItems = unsentItems.map(item => ({
          ...item,
          sendingStatus: true
        }));

        const response = await axios.put(UPDATE_ORDER_MENU_ITEMS, { updatedItems: updatedItems });
        if (response.status === 200) {
          console.log('Order menu items sent to kitchen successfully');
          await userStore.loadOrders(restaurantId);
        } else {
          console.error('Failed to send order menu items to kitchen', response);
        }
      } else {
        const response = await axios.put(UPDATE_ORDER_MENU_ITEM, { id: selectedMenuItem.id, sendingStatus: true });
        if (response.status === 200) {
          console.log('Order menu item sent to kitchen successfully');
          await userStore.loadOrders(restaurantId);
        } else {
          console.error('Failed to send order menu item to kitchen', response);
        }
      }
    } catch (error) {
      console.error('Error sending order menu item(s) to kitchen', error);
    }
  };

  const calculateTotal = () => {
    if (!selectedOrder) {
      return 0;
    }
    const total = selectedOrder.OrderMenuItems.reduce((total, item) => total + item.quantity * item.menuItem.price, 0);
    return total;
  };

  const handleRowClick = (index) => {
    if (systemUser.orderInteraction && !selectedOrder.precheckStatus) {
      setSelectedRowIndex(selectedRowIndex === index ? null : index);
    }
  };

  const handleSelectOrder = (orderId) => {
    if (systemUser.orderInteraction) {
      setSelectedOrderId(orderId);
      setSelectedRowIndex(null);
    }
  };

  const handleDeleteItem = async () => {
    if (selectedRowIndex !== null) {
      const selectedItemId = selectedMenuItem.id;
      try {
        const response = await axios.delete(DELETE_ORDER_MENU_ITEM, { data: { id: selectedItemId } });
        if (response.status === 200) {
          console.log('Order menu item deleted successfully');
          await userStore.loadOrders(restaurantId);
        } else {
          console.error('Failed to delete order menu item', response);
        }
      } catch (error) {
        console.error('Error deleting order menu item', error);
      }
      setSelectedRowIndex(null);
    }
  };

  const handlePrecheck = async () => {
    try {
      const response = await axios.put(UPDATE_ORDER, { id: selectedOrder.id, precheckStatus: true });
      if (response.status === 200) {
        console.log('Order prechecked successfully');
        await userStore.loadOrders(restaurantId);
      } else {
        console.error('Failed to precheck order', response);
      }
    } catch (error) {
      console.error('Error prechecking order', error);
    }
  };

  const handleCancelPrecheck = async () => {
    try {
      const response = await axios.put(UPDATE_ORDER, { id: selectedOrder.id, precheckStatus: false });
      if (response.status === 200) {
        console.log('Order cancel precheck successfully');
        await userStore.loadOrders(restaurantId);
        setPaymentType('cash');
      } else {
        console.error('Failed to cancel precheck in order', response);
      }
    } catch (error) {
      console.error('Error prechecking order', error);
    }
  };

  const handlePay = async () => {
    try {
      const response = await axios.put(UPDATE_ORDER, { id: selectedOrder.id, paymentStatus: true, paymentType: paymentType, amountPrice: calculateTotal().toFixed(2) });
      if (response.status === 200) {
        console.log('Order paid successfully');
        await userStore.loadOrders(restaurantId);
        setPaymentType('cash');
        setSelectedOrderId(0);
      } else {
        console.error('Failed to pay order', response);
      }
    } catch (error) {
      console.error('Error prechecking order', error);
    }
  };

  const allItemsSent = selectedOrder && selectedOrder.OrderMenuItems && selectedOrder.OrderMenuItems.length > 0 && selectedOrder.OrderMenuItems.every(item => item.sendingStatus);
  const canPrecheck = allItemsSent;
  const canPay = selectedOrder && selectedOrder.precheckStatus;

  return (
    <div className="container mt-2 border rounded pb-3" style={{ maxWidth: '600px' }}>
      <header className="d-flex justify-content-between align-items-center mt-3 mb-3 border-bottom pb-2">
        <h5 className="mb-0">Order Items</h5>
        <div className="d-flex align-items-center">
          <DropdownButton
            className="px-2"
            variant="outline-dark"
            id="dropdown-basic-button"
            title={orders.length > 0 ? `Order #${parseInt(selectedOrderId) + 1}` : "No Orders Available"}
            onSelect={handleSelectOrder}
            disabled={orders.length === 0 || !systemUser.orderInteraction}
          >
            {orders.map((order, index) => (
              <Dropdown.Item key={index} eventKey={String(index)}>
                Order #{index + 1}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          {orders.length > 0 && selectedOrder && (!selectedOrder.OrderMenuItems || selectedOrder.OrderMenuItems.length === 0) && (
            <Button variant="outline-dark" onClick={onDeleteEmptyOrder} className="me-2" disabled={!systemUser.orderInteraction}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          )}
          <Button variant="outline-dark" onClick={onCreateOrder} className="me-2" disabled={!systemUser.orderInteraction}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
      </header>
      {!selectedOrder ? (
        <AuthAttention text="Order not found. Please select a valid order." />
      ) : (!selectedOrder || !selectedOrder.OrderMenuItems || selectedOrder.OrderMenuItems.length === 0) ? (
        <AuthAttention text="You need to select dishes from the menu to add them to the order." />
      ) : (
        <>
          <Table bordered hover>
            <thead>
              <tr className='table-secondary'>
                <th>#</th>
                <th>Item</th>
                <th style={{ width: '50px' }}>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.OrderMenuItems.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(index)}
                  className={item.sendingStatus ? 'table-light' : 'table-default'}
                >
                  <td>{index + 1}</td>
                  <td>
                    {item.menuItem.name}{' '}
                    {selectedRowIndex === index && <Badge bg="dark" text="light">Selected</Badge>}
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        if (!item.sendingStatus) {
                          handleQuantityChange(index, e.target.value);
                        }
                      }}
                      disabled={!systemUser.orderInteraction || item.sendingStatus || selectedOrder.precheckStatus}
                    />
                  </td>
                  <td>${item.menuItem.price}</td>
                  <td>${(item.quantity * item.menuItem.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-end me-3">
            <strong>Total: ${calculateTotal().toFixed(2)}</strong>
          </div>
        </>
      )}
      <footer className="d-flex justify-content-center mt-2 pt-3 border-top">
        {selectedMenuItem ? (
          <>
            {!selectedMenuItem.sendingStatus && (
              <Button variant="outline-dark" className="me-2" onClick={() => handleSendToKitchen(selectedMenuItem)} disabled={!systemUser.orderInteraction}>
                <FontAwesomeIcon icon={faPaperPlane} /> Send to Kitchen
              </Button>
            )}
            <Button variant="outline-dark" className="me-2" onClick={handleDeleteItem} disabled={!systemUser.orderInteraction}>
              <FontAwesomeIcon icon={faTrash} /> Delete Item
            </Button>
          </>
        ) : (
          <>
            {hasUnsentItems && (
              <Button variant="outline-dark" className="me-2" onClick={handleSendToKitchen} disabled={!systemUser.orderInteraction}>
                <FontAwesomeIcon icon={faPaperPlane} /> Send to Kitchen
              </Button>
            )}
            {canPrecheck && !selectedOrder.precheckStatus && (
              <Button variant="outline-dark" className="me-2" onClick={handlePrecheck} disabled={!systemUser.precheckInteraction}>
                <FontAwesomeIcon icon={faClipboardCheck} /> Precheck
              </Button>
            )}
            {selectedOrder.precheckStatus && (
              <Button variant="outline-dark" className="me-2" onClick={handleCancelPrecheck} disabled={!systemUser.precheckInteraction}>
                <FontAwesomeIcon icon={faBan} /> Cancel Precheck
              </Button>
            )}
            {canPay && (
              <div className='d-flex'>
                <Button variant="outline-dark" onClick={handlePay} className="d-flex align-items-center" disabled={!systemUser.payInteraction}>
                  <FontAwesomeIcon className="mx-2" icon={faMoneyBillWave} /> Pay {paymentType === 'cash' ? 'Cash' : 'Card'}
                </Button>
                <DropdownButton
                  className='mx-2'
                  title={`${paymentType === 'cash' ? 'Cash' : 'Card'}`}
                  variant="outline-dark"
                  disabled={!systemUser.payInteraction}
                >
                  <Dropdown.Item onClick={() => setPaymentType('cash')}>Cash</Dropdown.Item>
                  <Dropdown.Item onClick={() => setPaymentType('card')}>Card</Dropdown.Item>
                </DropdownButton>
              </div>
            )}
          </>
        )}
      </footer>
    </div>
  );
};

export default KeeperOrderItems;
