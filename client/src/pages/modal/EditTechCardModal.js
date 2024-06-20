import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { UPDATE_TECH_CARD } from '../../requests/req'; 

import userStore from '../../mobx/userStore';
import AuthAttention from '../components/attention/AuthAttention'; 

function EditTechCardModal({ show, handleClose, techCard, restaurantId }) {
  const [techCardData, setTechCardData] = useState({
    name: '',
    productionOutput: '',
    costCalculation: ''
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && techCard) {
      setTechCardData({
        name: techCard.name || '', 
        productionOutput: techCard.productOutput || '',
        costCalculation: techCard.cost || '' 
      });
    } else {
      setTechCardData({
        name: '',
        productionOutput: '',
        costCalculation: ''
      });
      setError(null);
    }
  }, [show, techCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTechCardData({ ...techCardData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${UPDATE_TECH_CARD}`, {
        techCardId: techCard.id,
        name: techCardData.name,
        productOutput: techCardData.productionOutput,
        cost: techCardData.costCalculation
      });
      console.log('Response from server:', response.data);
      if (response.status === 200) {
        userStore.loadTechCards(restaurantId);
        handleClose();
      } else {
        console.error('Tech card update failed:', response.statusText);
        setError('Tech card update failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during tech card update:', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  const handleModalClose = () => {
    setTechCardData({
      name: '',
      productionOutput: '',
      costCalculation: ''
    });
    setError(null); 
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton={false}>
        <Modal.Title className="text-center">
          <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit Tech Card
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
          <FontAwesomeIcon icon={faEdit} className="me-2" /> Update
        </Button>
        <Button variant="outline-dark" onClick={handleModalClose}>
          <FontAwesomeIcon icon={faTimes} className="me-2" /> Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditTechCardModal;
