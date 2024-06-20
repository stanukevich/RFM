import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function EditSuccessModal({ onClose }) {
  const handleClose = () => {
    onClose(); 
  };

  return (
    <Modal centered show={true} backdrop="static" keyboard={false} onHide={handleClose}>
      <Modal.Body className="text-center">
        <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="black" />
        <p className="mt-3">{`User information - successfully edited!`}</p>
        <Button variant="outline-dark" className="d-block mx-auto" onClick={handleClose}>
          OK
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default EditSuccessModal;
