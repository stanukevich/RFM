import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import KeeperRevenueModal from '../modal/KeeperRevenueModal';

const KeeperRestroSystemUser = ({ user, onLogout, orders, systemUser }) => {
  const [showRevenueModal, setShowRevenueModal] = useState(false);

  const handleButtonClick = (message) => {
    console.log(message);
    if (message === 'View revenue') {
      setShowRevenueModal(true);
    };
  }

  return (
    <div style={{ width: '250px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', height: '100%', marginLeft: '20px' }}>
      <header className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div className="d-flex align-items-center">
          <h5>{user.name}</h5>
        </div>
        <Button variant="outline-dark" onClick={onLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </Button>
      </header>
      <div>
        {/* <Button variant="outline-dark" className="w-100 mb-2" onClick={() => handleButtonClick('View receipts')}>
          <FontAwesomeIcon icon={faReceipt} className="me-2" /> View receipts
        </Button> */}
        <Button 
          variant="outline-dark" 
          className="w-100 mb-2" 
          onClick={() => handleButtonClick('View revenue')}
          disabled={!systemUser.payInteraction}
        >
          <FontAwesomeIcon icon={faDollarSign} className="me-2" /> View revenue
        </Button>
      </div>
      <KeeperRevenueModal
        show={showRevenueModal}
        onHide={() => setShowRevenueModal(false)}
        orders={orders}
      />
    </div>
  );
};

export default KeeperRestroSystemUser;
