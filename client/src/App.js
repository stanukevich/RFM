import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import userStore from './mobx/userStore';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Registration from './pages/RegistrationForm';
import Authorization from './pages/AuthorizationForm';
import UserDashboard from './pages/UserDashboard';
import Keeper from './pages/Keeper';

const App = observer(() => {
  const { isAuthenticated, isKeeperMode } = userStore;

  const handleLogin = (user) => {
    userStore.authenticate(user);
    userStore.loadRestaurants(user.id)
  };

  const handleLogout = () => {
    userStore.logout();
  };

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          isKeeperMode ? (
            <>
              <Route path="/" element={<Keeper />} />
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/registration" element={<Navigate to="/" />} />
              <Route path="/" element={<UserDashboard onLogout={handleLogout} />} />
              <Route path="*" element={<NotFound />} />
            </>
          )
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Authorization onLogin={handleLogin} />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </Router>
  );
});

export default App;
