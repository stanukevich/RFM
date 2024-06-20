import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 
import userPhoto from '..//../img/avatars/unsigned_avatar.jpg'; 
import UserDataEditModal from '../modal/UserDataEditModal.js'; 
import ConfirmationModal from '../modal/ConfirmationModal.js';

import userStore from '../../mobx/userStore.js';

function AccountData({ user , onLogoutConfirmation}) {
  const [showEditModal, setShowEditModal] = useState(false); 
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); 

  const handleShowEditModal = () => setShowEditModal(true);

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowLogoutConfirmation = () => setShowLogoutConfirmation(true);

  const handleCloseLogoutConfirmation = () => setShowLogoutConfirmation(false);

  const handleSaveUserData = (userId) => {
    userStore.getUserById(userId)
    handleCloseEditModal();
  };

  const handleLogout = () => {
    onLogoutConfirmation();
    handleCloseLogoutConfirmation();
  };

  const UserRegistrationInfo = ({ registrationDate }) => {
    const dateObj = new Date(registrationDate);
  
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + dateObj.getDate()).slice(-2);
  
    // Формируем строку с датой в нужном формате (YYYY-MM-DD)
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate
  };

  return (
    <div>
      <h2>Account data</h2>
      <Card className="mb-4">
        <Card.Body className="text-center">
          <div className="position-relative rounded-circle border mx-auto mb-3" style={{ width: '65px', height: '65px', overflow: 'hidden' }}>
            <img src={userPhoto} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <Card.Title>{user.username}</Card.Title>
          <Card.Text>
            <strong>Registration Date:</strong> {UserRegistrationInfo({ registrationDate: user.registrationDate })}<br />
            <strong>User ID:</strong> {user.id}<br />
            <strong>Mail:</strong> {user.mail}<br />
          </Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button variant="outline-dark" onClick={handleShowEditModal}><FontAwesomeIcon icon={faEdit} /> Edit</Button>
          <Button variant="outline-dark" onClick={handleShowLogoutConfirmation}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</Button>
        </Card.Footer>
      </Card>

      <UserDataEditModal show={showEditModal} onClose={handleCloseEditModal} onSave={handleSaveUserData} user={user} />

      <ConfirmationModal
        show={showLogoutConfirmation}
        onClose={handleCloseLogoutConfirmation}
        onConfirm={handleLogout}
        title="Confirmation"
        message="Are you sure you want to logout?"
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
}

export default AccountData;
