import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer } from 'mobx-react';
import userStore from '../../mobx/userStore';

const ToggleSwitch = observer(() => {
  const handleToggle = () => {
    userStore.setKeeperMode(!userStore.isKeeperMode);
  };

  return (
    <div>
      <div className="toggle-component">
        <div className="toggle-container d-flex align-items-center justify-content-center p-3 rounded">
          <div className={`toggle-title me-3 ${userStore.isKeeperMode ? 'text-dark' : 'text-muted'}`}>
            {userStore.isKeeperMode ? 'Keeper mode' : 'Dashboard mode'}
          </div>
          <div className="form-check form-switch">
            <input
              className={`form-check-input ${userStore.isKeeperMode ? 'bg-dark border-dark' : 'bg-white border'}`}
              type="checkbox"
              id="flexSwitchMode"
              checked={userStore.isKeeperMode}
              onChange={handleToggle}
              style={{ height: '1.5em', width: '3em' }}
            />
            <label className="form-check-label" htmlFor="flexSwitchMode"></label>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ToggleSwitch;
