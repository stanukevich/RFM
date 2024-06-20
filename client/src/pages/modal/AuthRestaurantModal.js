import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import AuthAttention from '../components/attention/AuthAttention';

import userStore from '../../mobx/userStore';

const AuthRestaurantModal = ({ show, selectedRestaurant, setIsRestaurantLogin, handleClose }) => {
  const [accessKey, setAccessKey] = useState('');
  const [showAttention, setShowAttention] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const handleAccessKeyChange = (e) => {
    setAccessKey(e.target.value);
  };

  const handleLogin = () => {
    if (accessKey === selectedRestaurant.accessKey) {
      setIsRestaurantLogin(true);
      setIsAuth(true);
      setShowAttention(false);
      userStore.loadTables(selectedRestaurant.id);
      userStore.loadSystemUsers(selectedRestaurant.id);
      userStore.loadMenuItems(selectedRestaurant.id);
      userStore.loadOrders(selectedRestaurant.id);
      setAccessKey(''); 
      handleClose(true); 
    } else {
      setShowAttention(true);
    }
  };

  const handleCancel = () => {
    setShowAttention(false);
    handleClose(isAuth);
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header>
        <Modal.Title>Restaurant Access</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="accessKey" className="form-label">Access Key:</label>
          <input type="password" className="form-control" id="accessKey" value={accessKey} onChange={handleAccessKeyChange} />
        </div>
        {showAttention && (
          <AuthAttention text="AccessKey is incorrect or form data is empty." />
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="outline-dark" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="outline-dark" onClick={handleCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AuthRestaurantModal;
