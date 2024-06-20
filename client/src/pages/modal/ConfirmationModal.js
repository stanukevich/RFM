import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

function ConfirmationModal({ show, onClose, onConfirm }) {
  return (
    <Modal centered show={show} onHide={onClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" style={{ color: 'black' }} /> Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        Are you sure you want to do this?
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="outline-dark" onClick={onConfirm}>
          <FontAwesomeIcon icon={faCheck} className="me-2" /> Yes
        </Button>
        <Button variant="outline-dark" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} className="me-2" /> No
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
