import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { USER_UPDATE_ROUTE } from '../../requests/req';
import axios from 'axios';

import AuthAttention from '../components/attention/AuthAttention';
import EditSuccessModal from './EditSuccessModal';

function UserDataEditModal({ show, onClose, onSave, user }) {
  const [userData, setUserData] = useState({
    userId: user.id,
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(USER_UPDATE_ROUTE, {
        userId: userData.userId,
        username: userData.username,
        password: userData.password
      });
      if (response.status === 200) {
        onSave(response.data.user.id);
        setUserData({ ...userData, username: '', password: '' });
      } else {
        setError('Update failed. Please try again.');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <Modal centered show={show} onHide={onClose}>
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                autoComplete="current-username"
                type="text"
                placeholder="Enter Username"
                name="username"
                value={userData.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                autoComplete="current-password"
                type="password"
                placeholder="Enter Password"
                name="password"
                value={userData.password}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
          {error && <AuthAttention text={error} />}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="outline-dark" onClick={handleSubmit}>
            <FontAwesomeIcon icon={faSave} className="me-2" /> Save Changes
          </Button>
          <Button variant="outline-dark" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="me-2" /> Close
          </Button>
        </Modal.Footer>
      </Modal>
      {success && <EditSuccessModal onClose={() => setSuccess(false)} />}
    </>
  );
}

export default UserDataEditModal;
