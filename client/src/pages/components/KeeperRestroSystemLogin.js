import React, { useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const KeeperRestroSystemLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [maskedPassword, setMaskedPassword] = useState('');

  const handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/^\d$/.test(keyValue)) {
      setPassword(prevPassword => prevPassword + keyValue);
      setMaskedPassword(prevMaskedPassword => prevMaskedPassword + '*');
    }
  };

  const handleClear = () => {
    if (password.length > 0) {
      const newPassword = password.substring(0, password.length - 1);
      setPassword(newPassword);
      setMaskedPassword(maskedPassword.substring(0, maskedPassword.length - 1));
    }
  };

  const handleLogin = () => {
    onLogin(password);
    setPassword('');
    setMaskedPassword('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      handleClear();
    }
  };

  const handleButtonClick = (value) => {
    if (typeof value === 'number' || value === 'Clear' || value === 'Ok') {
      if (value === 'Clear') {
        handleClear();
      } else if (value === 'Ok') {
        handleLogin();
      } else {
        setPassword(prevPassword => prevPassword + value);
        setMaskedPassword(prevMaskedPassword => prevMaskedPassword + '*');
      }
    }
  };

  return (
    <Container className="text-center border p-3" style={{ maxWidth: '350px', margin: 'auto' }}>
      <div className="text-center mb-3" style={{ width: '100%' }}>
        <Form.Control
          type="password"
          value={maskedPassword}
          placeholder='Enter system user password'
          readOnly
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ textAlign: 'center', width: '100%', height: '50px' }}
        />
      </div>
      <Row xs={3} className="g-2 justify-content-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'Clear', 'Ok'].map((value, index) => (
          <Col key={index} className="d-flex justify-content-center align-items-center pe-0 ps-0">
            <Button
              variant={typeof value === 'number' ? "outline-dark" : value === 'Clear' ? 'outline-dark' : 'outline-dark'}
              style={{
                width: '78px', 
                height: '78px',
                fontSize: '26px',
                borderRadius: '0 !important',
                padding: 0,
              }}
              onClick={() => handleButtonClick(value)}
            >
              {value === '*' ? maskedPassword : 
                value === 'Clear' ? <FontAwesomeIcon icon={faTrashAlt} /> : 
                value === 'Ok' ? <FontAwesomeIcon icon={faCheck} /> : value
              }
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KeeperRestroSystemLogin;
