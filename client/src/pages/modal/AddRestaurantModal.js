import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { USER_ADD_RESTAURANT_ROUTE } from '../../requests/req';
import AuthAttention from '../components/attention/AuthAttention';

import userStore from '../../mobx/userStore'

function AddRestaurantModal({ show, handleClose }) {
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    password: ''
  });

  const [error, setError] = useState(null); 

  useEffect(() => {
    if (!show) {
      setError(null);
      setRestaurantData({ name: '', password: '' });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData({ ...restaurantData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(USER_ADD_RESTAURANT_ROUTE, {
        name: restaurantData.name,
        accessKey: restaurantData.password,
        userId: userStore.user.id
      });
      console.log('Response from server:', response.data);
      if (response.status === 200) {
        userStore.loadRestaurants(userStore.user.id)
        handleClose(); 
      } else {
        console.error('Restaurant registration failed:', response.statusText);
        setError('Restaurant registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during restaurant registration:', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton={false}>
        <Modal.Title className="text-center"><FontAwesomeIcon icon={faPlus} className="me-2" /> Add</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formRestaurantName">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control type="text" placeholder="Enter restaurant name" name="name" value={restaurantData.name} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" name="password" value={restaurantData.password} onChange={handleChange} />
          </Form.Group>
        </Form>
        {error && <AuthAttention text={error} />} 
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="outline-dark" onClick={handleSubmit} type="submit">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Add
        </Button>
        <Button variant="outline-dark" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} className="me-2" /> Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddRestaurantModal;
