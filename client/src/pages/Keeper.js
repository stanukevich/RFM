import React, { useState, useEffect } from 'react';
import ToggleSwitch from './components/ToggleSwitch';
import { observer } from 'mobx-react';
import userStore from '../mobx/userStore';
import KeeperUserRestaurants from './components/KeeperUserRestaurants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import KeeperRestroSystemLogin from './components/KeeperRestroSystemLogin';
import KeeperRestroSystemTables from './components/KeeperRestroSystemTables';
import KeeperRestroSystemUser from './components/KeeperRestroSystemUser';
// import KeeperRestroOrdersList from './components/KeeperRestroOrdersList';
import restrofoodmanagerlogo from '../img/avatars/restrofoodmanagericon.jpg';
import AuthAttention from './components/attention/AuthAttention';

const Keeper = observer(() => {
  const restaurants = userStore.restaurants;
  const systemUsers = userStore.systemUsers;
  const tables = userStore.tables;
  const menuItems = userStore.menuItems;
  const orders = userStore.orders;

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isRestaurantLogin, setIsRestaurantLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let pollingInterval;

    const fetchOrders = async () => {
      if (selectedRestaurant && isLoggedIn && loggedInUser) {
        try {
          await userStore.loadOrders(selectedRestaurant.id);
        } catch (err) {
          console.error('Error fetching orders:', err);
        }
      }
    };

    if (selectedRestaurant && isLoggedIn && loggedInUser) {
      fetchOrders(); // Initial fetch
      pollingInterval = setInterval(fetchOrders, 2000); // Poll every 2 seconds
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [selectedRestaurant, isLoggedIn, loggedInUser]);

  const handleReturnToRestaurants = () => {
    setIsRestaurantLogin(false);
    setSelectedRestaurant(null);
    setError('');
    setIsLoggedIn(false);
    setLoggedInUser(null);
  };

  const handleLogin = (password) => {
    const user = systemUsers.find(user => user.accessCode === password);
    // console.log(user)
    if (user && user.systemAccess) {
      console.log('Login successful:', user);
      setError('');
      setIsLoggedIn(true);
      setLoggedInUser(user);
    } else if(user && !user.systemAccess) {
      console.log('Login failed: don`t have access');
      setError('Login failed: don`t have access');
    }
      else {
      console.log('Login failed: Invalid access code');
      setError('Login failed: Invalid access code');
    }
  };

  const handleLogout = () => {
    console.log('User logged out');
    setIsLoggedIn(false);
    setLoggedInUser(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-white text-dark text-center py-3 border-bottom">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <img src={restrofoodmanagerlogo} alt="RestroFoodManager Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
          <h1>RestroFoodManager</h1>
        </div>
        <h4 className="mb-0 text-muted fs-6">Empowering Restaurants, Delighting Customers: RestroFoodManager - Your Recipe for Success!</h4>
      </header>
      <main className="flex-grow-1 container py-4">
        {isRestaurantLogin ? (
          isLoggedIn ? (
            <div>
              <div className="d-flex flex-column align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <h4 className="text-center mb-0">{selectedRestaurant?.name} Keeper System</h4>
                  {/* <button className="btn btn-outline-dark ms-2 mt-1" onClick={handleReturnToRestaurants}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button> */}
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="d-flex align-items-center justify-content-center">
                  {/* <KeeperRestroOrdersList /> */}
                  <KeeperRestroSystemTables tables={tables} menuItems={menuItems} orders={orders.filter(order => !order.paymentStatus)} restaurantId={selectedRestaurant.id} systemUserId={loggedInUser.id} systemUser={loggedInUser}/>
                  <KeeperRestroSystemUser user={loggedInUser} onLogout={handleLogout} orders={orders.filter(order => order.paymentStatus)} systemUser={loggedInUser} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <h4 className="text-center mb-0">{selectedRestaurant?.name} Keeper System</h4>
                <button className="btn btn-outline-dark ms-2 mt-1" onClick={handleReturnToRestaurants}>
                <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>
              <KeeperRestroSystemLogin onLogin={handleLogin} />
              {error && <AuthAttention text={error} />}
            </div>
          )
        ) : (
          <React.Fragment>
            <h2 className="text-center mb-4">Your Restaurants</h2>
            <KeeperUserRestaurants 
              restaurants={restaurants} 
              selectedRestaurant={selectedRestaurant} 
              setSelectedRestaurant={setSelectedRestaurant}
              setIsRestaurantLogin={setIsRestaurantLogin}
              isRestaurantLogin={isRestaurantLogin} 
            />
          </React.Fragment>
        )}
      </main>
      <footer className="bg-white text-dark py-3 mt-auto border-top d-flex justify-content-center align-items-center">
        <div className="container d-flex justify-content-center align-items-center">
        {!isRestaurantLogin && (<ToggleSwitch />)}
          <p className="mb-0 ml-3">© 2024 RestroFoodManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
});

export default Keeper;
