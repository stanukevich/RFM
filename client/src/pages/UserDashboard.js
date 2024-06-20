import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import AccountData from './components/AccountData.js';
import TechCards from './components/TechCards.js';
import UserRestaurants from './components/UserRestaurants.js';
// import User from '..//test_data/User';
import AttentionMessage from './components/attention/RestaurantNotSelected.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faMap, faUtensils, faUsers} from '@fortawesome/free-solid-svg-icons';
import TableMaps from './components/TableMaps';
import Menu from './components/Menu';
import SystemUsers from './components/SystemUsers.js';

import ToggleSwitch from './components/ToggleSwitch.js';

import userStore from '../mobx/userStore.js'
import { observer } from 'mobx-react';

const UserDashboard = observer(({ onLogout }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Состояние для хранения выбранного ресторана
  const [selectedControlButton, setSelectedControlButton] = useState('techCards'); // Состояние для хранения выбранной кнопки панели управления (по умолчанию "Tech Cards")

  // Активные данные пользователя
  // const { user } = userStore;
  // console.log(user)
  // const user = User;

  // Функция для выбора ресторана
  const handleRestaurantSelection = (index) => {
    setSelectedRestaurant(index);
    // console.log(user.restaurants[index].name)s
    // console.log(index)
    if(index !== null){
      userStore.loadTechCards(userStore.restaurants[index].id)
    }
    setSelectedControlButton('techCards');
  };

  // Функция для сброса выбранного ресторана при удалении
  const handleRestaurantDeletion = () => {
    setSelectedRestaurant(null);
    setSelectedControlButton(null);
  };  

  // Функция для выбора кнопки панели управления
  const handleControlButtonSelection = (buttonName) => {
    if(buttonName === 'tableMaps' && selectedRestaurant !== null){
      userStore.loadTables(userStore.restaurants[selectedRestaurant].id)
      // console.log("CHECK")
    } 
    if(buttonName === 'techCards' && selectedRestaurant !== null){
      userStore.loadTechCards(userStore.restaurants[selectedRestaurant].id)
    }
    if(buttonName === 'menu' && selectedRestaurant !== null){
      userStore.loadMenuItems(userStore.restaurants[selectedRestaurant].id)
      userStore.loadTechCards(userStore.restaurants[selectedRestaurant].id)
    }
    if(buttonName === 'systemUsers' && selectedRestaurant !== null){
      userStore.loadSystemUsers(userStore.restaurants[selectedRestaurant].id)
    }
    setSelectedControlButton(buttonName);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <h1>RestroFoodManager</h1>
          <AccountData onLogoutConfirmation={handleLogout} user={userStore.user}/>
          <UserRestaurants restaurants={userStore.restaurants} onSelectRestaurant={handleRestaurantSelection} onDeleteRestaurant={handleRestaurantDeletion}  selectedControlButton={selectedControlButton} />
          <p className="mt-3">&copy; 2024 RestroFoodManager. All rights reserved.</p>
          <ToggleSwitch/>
        </div>
        <div className="col-md-8">
          <footer className="text-center mt-auto">
            <h4>Your Restaurant Control Panel </h4>
            <div className="mt-3">
              <Button
                variant={selectedControlButton === 'techCards' && selectedRestaurant !== null ? "dark" : "outline-dark"}
                className="me-1"
                onClick={() => handleControlButtonSelection('techCards')}
                disabled={selectedRestaurant === null}
              >
                <FontAwesomeIcon icon={faCog} /> Tech cards
              </Button>
              <Button
                variant={selectedControlButton === 'tableMaps' && selectedRestaurant !== null ? "dark" : "outline-dark"}
                className="me-1"
                onClick={() => handleControlButtonSelection('tableMaps')}
                disabled={selectedRestaurant === null}
              >
                <FontAwesomeIcon icon={faMap} /> Setting up table maps
              </Button>
              <Button
                variant={selectedControlButton === 'menu' && selectedRestaurant !== null ? "dark" : "outline-dark"}
                className="me-1"
                onClick={() => handleControlButtonSelection('menu')}
                disabled={selectedRestaurant === null}
              >
                <FontAwesomeIcon icon={faUtensils} /> Menu
              </Button>
              <Button
                variant={selectedControlButton === 'systemUsers' && selectedRestaurant !== null ? "dark" : "outline-dark"}
                className="me-1"
                onClick={() => handleControlButtonSelection('systemUsers')}
                disabled={selectedRestaurant === null}
              >
                <FontAwesomeIcon icon={faUsers} /> System Users
              </Button>
              {/* <Button
                variant={selectedControlButton === 'analytics' && selectedRestaurant !== null ? "dark" : "outline-dark"}
                onClick={() => handleControlButtonSelection('analytics')}
                disabled={selectedRestaurant === null}
              >
                <FontAwesomeIcon icon={faChartLine} /> Analytics
              </Button> */}
            </div>
            {selectedRestaurant === null && (
              <AttentionMessage />
            )}
            {selectedControlButton === 'techCards' && selectedRestaurant !== null && (
              <TechCards key={selectedRestaurant} techCards={userStore.techCards} restaurantId={userStore.restaurants[selectedRestaurant].id} />
              // <TechCards key={selectedRestaurant} techCards={[]} />
            )}
            {selectedControlButton === 'tableMaps' && selectedRestaurant !== null && (
              <TableMaps tables={userStore.tables} restaurantId={userStore.restaurants[selectedRestaurant].id} />
            )}
            {
            selectedControlButton === 'menu' && selectedRestaurant !== null && (
              <Menu menuItems={userStore.menuItems} techCards={userStore.techCards} restaurantId={userStore.restaurants[selectedRestaurant].id}/>
            )
            }
            {
            selectedControlButton === 'systemUsers' && selectedRestaurant !== null && (
              <SystemUsers systemUsers={userStore.systemUsers} restaurantId={userStore.restaurants[selectedRestaurant].id}/>
            )
            }
          </footer>
        </div>
      </div>
    </div>
  );
})

export default UserDashboard;
