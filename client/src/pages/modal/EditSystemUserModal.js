import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import AuthAttention from '../components/attention/AuthAttention';

const EditSystemUserModal = ({ show, handleClose, handleEditUser, user }) => {
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [permissions, setPermissions] = useState({
    systemAccess: false,
    orderInteraction: false,
    precheckInteraction: false,
    payInteraction: false
  });
  const [error, setError] = useState(null);

  const resetForm = () => {
    if (user) {
      setName(user.name || '');
      setAccessCode(user.accessCode || '');
      setPermissions(user.permissions || 
      {
        systemAccess: user.systemAccess,
        orderInteraction: user.orderInteraction,
        precheckInteraction: user.precheckInteraction,
        payInteraction: user.payInteraction
      } ||
      {
        systemAccess: false,
        orderInteraction: false,
        precheckInteraction: false,
        payInteraction: false
      });
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAccessCode(user.accessCode || '');
      setPermissions(user.permissions || 
        {
          systemAccess: user.systemAccess,
          orderInteraction: user.orderInteraction,
          precheckInteraction: user.precheckInteraction,
          payInteraction: user.payInteraction
        } ||
        {
          systemAccess: false,
          orderInteraction: false,
          precheckInteraction: false,
          payInteraction: false
        });
    }
  }, [user]);

  const handlePermissionChange = (permission) => {
    setPermissions(prevPermissions => ({
      ...prevPermissions,
      [permission]: !prevPermissions[permission]
    }));
  };

  const handleEdit = () => {
    if (!name || !accessCode) {
      setError('Name and Access Code are required.'); 
      return;
    }

    handleEditUser({ id: user.id, name, accessCode, permissions });
    handleClose();
    resetForm(); 
  };

  const handleModalClose = () => {
    handleClose();
    resetForm(); 
  };

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      centered 
      backdrop="static" 
      keyboard={false} 
    >
      <Modal.Header>
        <Modal.Title>Edit User</Modal.Title>
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
              />
            ))}
          </Form.Group>
          {error && <AuthAttention text={error} />} 
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="outline-dark" onClick={handleModalClose}>
          Close
        </Button>
        <Button variant="outline-dark" onClick={handleEdit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSystemUserModal;
