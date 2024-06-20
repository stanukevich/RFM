import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignInAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_REGISTRATION_ROUTE } from "../requests/req";
import AuthAttention from './components/attention/AuthAttention';
import RegisterSuccessModal from './modal/RegisterSuccessModal';

function RegistrationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${USER_REGISTRATION_ROUTE}`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Response from server:', response.data);
      if (response.status === 200) {
        setShowModal(true); 
      } else {
        console.error('Registration failed:', response.statusText);
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error.response.data.message);
      setError(error.response.data.message);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 p-4 border rounded">
          <h2><FontAwesomeIcon icon={faUserPlus} /> Registration Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} autoComplete="current-username" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="current-email" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-outline-dark me-2"><FontAwesomeIcon icon={faSignInAlt} /> Submit</button>
            <button type="button" className="btn btn-outline-dark" onClick={handleCancel}><FontAwesomeIcon icon={faTimes} /> Cancel</button>
          </form>
          {error && <AuthAttention text={error} />} {/* Рендерим AuthAttention в случае ошибки */}
          {showModal && <RegisterSuccessModal username={formData.username} />} {/* Рендерим модальное окно после успешной регистрации */}
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
