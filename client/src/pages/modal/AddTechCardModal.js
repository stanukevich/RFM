import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { CREATE_TECH_CARD } from '../../requests/req'; 
import AuthAttention from '../components/attention/AuthAttention';

import userStore from '../../mobx/userStore';

function AddTechCardModal({ show, handleClose, restaurantId }) {
  const [techCardData, setTechCardData] = useState({
    name: '',
    productionOutput: '',
    costCalculation: ''
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show) {
      setError(null);
      setTechCardData({ name: '', productionOutput: '', costCalculation: '' });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTechCardData({ ...techCardData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(CREATE_TECH_CARD, {
        name: techCardData.name,
        productOutput: techCardData.productionOutput,
        cost: techCardData.costCalculation,
        restaurantId: restaurantId,
      });
      console.log('Response from server:', response.data);
      if (response.status === 200) {
        userStore.loadTechCards(restaurantId);
        handleClose();
      } else {
        console.error('Tech card registration failed:', response.statusText);
        setError('Tech card registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during tech card registration:', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton={false}>
        <Modal.Title className="text-center">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Tech Card
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTechCardName">
            <Form.Label>Tech Card Name</Form.Label>
            <Form.Control type="text" placeholder="Enter tech card name" name="name" value={techCardData.name} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formProductionOutput">
            <Form.Label> Production Output</Form.Label>
            <Form.Control type="text" placeholder="Enter production output" name="productionOutput" value={techCardData.productionOutput} onChange={handleChange} />
          </Form.Group>

          <Form.Group controlId="formCostCalculation">
            <Form.Label> Cost Calculation</Form.Label>
            <Form.Control type="text" placeholder="Enter cost calculation" name="costCalculation" value={techCardData.costCalculation} onChange={handleChange} />
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

export default AddTechCardModal;
