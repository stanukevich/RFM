import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import AuthAttention from '../components/attention/AuthAttention';

const AddSystemUser = ({ show, handleClose, handleAddUser }) => {
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [permissions, setPermissions] = useState({
    systemAccess: false,
    orderInteraction: false,
    precheckInteraction: false,
    payInteraction: false
    // discountAccess: false
  });
  const [error, setError] = useState(null); 

  const handlePermissionChange = (permission) => {
    setPermissions(prevPermissions => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission]
    }));
  };

  const handleAdd = () => {
    if (!name || !accessCode) {
      setError('Name and Access Code are required.');
      return;
    }
    
    handleAddUser({ name, accessCode, permissions });
    clearForm();
    handleClose();
  };

  const clearForm = () => {
    setName('');
    setAccessCode('');
    setPermissions({
      systemAccess: false,
      orderInteraction: false,
      precheckInteraction: false,
      payInteraction: false
      // discountAccess: false
    });
    setError(null); 
  };

  const handleCloseModal = () => {
    clearForm(); 
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      centered 
      backdrop="static" 
      keyboard={false} 
    >
      <Modal.Header>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Access Code</Form.Label>
            <Form.Control type="text" placeholder="Enter access code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Permissions</Form.Label>
            {Object.keys(permissions).map(permission => (
              <Form.Check
                key={permission}
                type="checkbox"
                label={permission.charAt(0).toUpperCase() + permission.slice(1)}
                checked={permissions[permission]}
                onChange={() => handlePermissionChange(permission)}
                style={{ color: 'black' }} 
              />
            ))}
          </Form.Group>
          {error && <AuthAttention text={error} />}
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="outline-dark" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="outline-dark" onClick={handleAdd}>
          Add User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSystemUser;
