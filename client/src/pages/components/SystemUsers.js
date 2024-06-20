import React, { useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faPlus, faEdit, faTrash, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import EditSystemUserModal from '../modal/EditSystemUserModal'; 
import AddSystemUser from '../modal/AddSystemUserModal';
import axios from 'axios';
import { CREATE_SYSTEM_USER, DELETE_SYSTEM_USER, UPDATE_SYSTEM_USER } from '../../requests/req'; 

import userStore from '../../mobx/userStore';

const SystemUsers = ({ systemUsers, restaurantId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [editingUser, setEditingUser] = useState(null); 
  const itemsPerPage = 3;

  const handleEditClick = (userId) => {
    const userToEdit = systemUsers.find(user => user.id === userId);
    // console.log(userToEdit)
    setEditingUser(userToEdit);
    setShowEditModal(true);
    setError(null); 
    setSuccess(false); 
  };

  const handleEditUser = (editedUser) => {
    // console.log(editedUser)
    axios.put(UPDATE_SYSTEM_USER, {
      systemUserId: editedUser.id,
      name: editedUser.name,
      accessCode: editedUser.accessCode,
      systemAccess: editedUser.permissions.systemAccess,
      orderInteraction: editedUser.permissions.orderInteraction,
      precheckInteraction: editedUser.permissions.precheckInteraction,
      payInteraction: editedUser.permissions.payInteraction
      // discountAccess: editedUser.permissions.discountAccess
    })
      .then(response => {
        setSelectedUser(null);
        setCurrentPage(1);
        userStore.loadSystemUsers(restaurantId);
        setSuccess(true);
      })
      .catch(error => {
        setError('Error editing user: ' + error.message);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const filteredUsers = systemUsers.filter(user =>
    user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleUserSelect = (userId) => {
    setSelectedUser(selectedUser === userId ? null : userId);
  };

  const renderPermissions = (user) => {
    const iconColor = selectedUser === user.id ? 'text-light' : 'text-dark';

    return (
      <div>
        <div className="d-flex align-items-center mb-1">
          <span className="me-2">System Access</span>
          {user.systemAccess ? <FontAwesomeIcon icon={faCheckCircle} className={iconColor} /> : <FontAwesomeIcon icon={faTimesCircle} className={iconColor} />}
        </div>
        <div className="d-flex align-items-center mb-1">
          <span className="me-2">Order Interaction</span>
          {user.orderInteraction ? <FontAwesomeIcon icon={faCheckCircle} className={iconColor} /> : <FontAwesomeIcon icon={faTimesCircle} className={iconColor} />}
        </div>
        <div className="d-flex align-items-center mb-1">
          <span className="me-2">Precheck interaction</span>
          {user.precheckInteraction ? <FontAwesomeIcon icon={faCheckCircle} className={iconColor} /> : <FontAwesomeIcon icon={faTimesCircle} className={iconColor} />}
        </div>
        <div className="d-flex align-items-center mb-1">
          <span className="me-2">Pay interaction</span>
          {user.payInteraction ? <FontAwesomeIcon icon={faCheckCircle} className={iconColor} /> : <FontAwesomeIcon icon={faTimesCircle} className={iconColor} />}
        </div>
        {/* <div className="d-flex align-items-center mb-1">
          <span className="me-2">Discount Access</span>
          {user.discountAccess ? <FontAwesomeIcon icon={faCheckCircle} className={iconColor} /> : <FontAwesomeIcon icon={faTimesCircle} className={iconColor} />}
        </div> */}
      </div>
    );
  };

  const handleAddUser = (newUser) => {
    axios.post(CREATE_SYSTEM_USER, {
      name: newUser.name,
      accessCode: newUser.accessCode,
      systemAccess: newUser.permissions.systemAccess,
      orderInteraction: newUser.permissions.orderInteraction,
      precheckInteraction: newUser.permissions.precheckInteraction,
      payInteraction: newUser.permissions.payInteraction,
      // discountAccess: newUser.permissions.discountAccess,
      restaurantId: restaurantId
    })
      .then(response => {
        setSelectedUser(null);
        setCurrentPage(1);
        userStore.loadSystemUsers(restaurantId);
      })
      .catch(error => {
        console.error('Error adding new user:', error);
      });
  };

  const handleDeleteUser = (userId) => {
    axios.delete(DELETE_SYSTEM_USER, { data: { systemUserId: userId } })
      .then(response => {
        setSelectedUser(null);
        setCurrentPage(1);
        userStore.loadSystemUsers(restaurantId);
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  return (
    <div className="fade show">
      <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faSearch} className="me-2 text-dark" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="rounded-pill align-items-center px-2 py-1"
          />
        </div>
        <div className="pagination">
          <Button variant="outline-dark" onClick={prevPage} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <span className="mx-2 d-flex align-items-center">
            <Badge bg="dark">{currentPage}</Badge>
          </span>
          <Button variant="outline-dark" onClick={nextPage} disabled={indexOfLastUser >= filteredUsers.length}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>
      </div>
      <Table striped bordered hover className="mt-4 table-scroll">
        <thead>
          <tr>
            <th>Name</th>
            <th>Access Code</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id} className={selectedUser === user.id ? 'table-dark' : ''} onClick={() => handleUserSelect(user.id)}>
              <td>{user.name}</td>
              <td>{user.accessCode}</td>
              <td>{renderPermissions(user)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-3">
        <Button variant="outline-dark" className="me-1" onClick={() => setShowAddModal(true)} disabled={selectedUser}>
          <FontAwesomeIcon icon={faPlus} /> Add
        </Button>
        <Button variant="outline-dark" onClick={() => handleEditClick(selectedUser)} disabled={!selectedUser} className="me-1">
          <FontAwesomeIcon icon={faEdit} /> Edit
        </Button>
        <Button variant="outline-dark" onClick={() => handleDeleteUser(selectedUser)} disabled={!selectedUser}>
          <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
      </div>
      <AddSystemUser show={showAddModal} handleClose={() => setShowAddModal(false)} handleAddUser={handleAddUser} />
      <EditSystemUserModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        handleEditUser={handleEditUser}
        user={editingUser}
        error={error}
        success={success}
      />
    </div>
  );
};

export default SystemUsers;
