import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_AUTHENTICATE_ROUTE } from "../requests/req";
import AuthAttention from './components/attention/AuthAttention';

function AuthorizationForm({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null); 

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
      const response = await axios.post(`${USER_AUTHENTICATE_ROUTE}`, {
        email: formData.email,
        password: formData.password
      });
      
      // console.log('Response from server:', response.data);
      if (response.status === 200) {
        onLogin(response.data.user);
        navigate('/');
      } else {
        console.error('Authentication failed:', response.statusText);
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during authentication:', error.response.data.message);
      setError(error.response.data.message);
    }
  };
  

  const handleCancel = () => {
    // console.log('Authorization canceled');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 p-4 border rounded">
          <h2><FontAwesomeIcon icon={faUser} /> Login Form</h2>
          <form onSubmit={handleSubmit}>
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
          {error && <AuthAttention text={error} />}
        </div>
      </div>
    </div>
  );
}

export default AuthorizationForm;
