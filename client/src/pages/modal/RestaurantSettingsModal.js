import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { USER_UPDATE_RESTAURANT_ROUTE } from '../../requests/req';
import AuthAttention from '../components/attention/AuthAttention';

import userStore from '../../mobx/userStore';

function RestaurantSettingsModal({ show, restId, handleClose }) {
    const [restaurantName, setRestaurantName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { user } = userStore;

    const handleSave = async () => {

        try {
            const restaurantData = {
                restaurantId: restId,
                name: restaurantName,
                password: password
            };

            console.log(restaurantData)

            const response = await axios.put(USER_UPDATE_RESTAURANT_ROUTE, restaurantData);

            if (response.status === 200) {
                console.log('Restaurant updated successfully:', response.data);
                handleClose();
                userStore.loadRestaurants(user.id);
                setRestaurantName("")
                setPassword("")
                setError("")
            } else {
                console.error('Error updating restaurant:', response.statusText);
                setError('Failed to update restaurant. Please try again.');
            }
        } catch (error) {
            console.error('Error updating restaurant:', error.response.data.message);
            setError(error.response.data.message);
        }
    };

    return (
        <Modal centered show={show} onHide={handleClose} backdrop="static">
            <Modal.Header>
                <Modal.Title>
                    <FontAwesomeIcon icon={faPen} className="me-2" /> Restaurant Settings
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="restaurantName">
                        <Form.Label>Restaurant Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter restaurant name"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            autoComplete="current-username"
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </Form.Group>
                    {error && <AuthAttention text={error} />}
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="outline-dark" onClick={handleSave}>
                    <FontAwesomeIcon icon={faPen} className="me-2" /> Save
                </Button>
                <Button variant="outline-dark" onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} className="me-2" /> Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RestaurantSettingsModal;
