import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus, faUtensils, faUsers, faUtensilSpoon } from '@fortawesome/free-solid-svg-icons';
import banner1 from '../img/banners/banner1.jpg';
import banner2 from '../img/banners/banner2.jpg';
import banner3 from '../img/banners/banner3.jpg';

function Home() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="text-center mb-5">
            <h1>Welcome to RestroFoodManager</h1>
            <p>Empowering Restaurants, Delighting Customers: RestroFoodManager - Your Recipe for Success!</p>
          </div>
          <div className="row mb-5">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title"><FontAwesomeIcon icon={faUserPlus} /> Registration</h5>
                  <p className="card-text">Register to access our services.</p>
                  <a href="/registration" className="btn btn-dark">Register</a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title"><FontAwesomeIcon icon={faUser} /> Login</h5>
                  <p className="card-text">Already registered? Log in here.</p>
                  <a href="/login" className="btn btn-dark">Login</a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="card text-center">
                <img src={banner1} className="card-img-top" alt="Banner 1" />
                <div className="card-body">
                  <FontAwesomeIcon icon={faUtensilSpoon} />
                  <p className="card-text">Optimize your restaurant with RestroFoodManager - manage easily, serve deliciously!</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <img src={banner3} className="card-img-top" alt="Banner 2" />
                <div className="card-body">
                  <FontAwesomeIcon icon={faUsers} />
                  <p className="card-text">Enhance customer service and increase efficiency with RestroFoodManager.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center">
                <img src={banner2} className="card-img-top" alt="Banner 3" />
                <div className="card-body">
                  <FontAwesomeIcon icon={faUtensils} />
                  <p className="card-text">Transform your restaurant into a place where culinary ideas come alive - with RestroFoodManager.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-5 text-center">
        <p>&copy; 2024 RestroFoodManager. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
