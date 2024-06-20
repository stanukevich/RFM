import React from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function RegisterSuccessModal({ username }) {
  return (
    <Modal
      centered
      show={true}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body className="text-center">
        <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="black" />
        <p className="mt-3">{`User, ${username} - successfully registered in RFM system!`}</p>
        <Link to="/" className="btn btn-outline-dark">OK</Link>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterSuccessModal;
