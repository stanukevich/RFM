import { makeObservable, observable, action } from 'mobx';
import Cookies from 'js-cookie';
import { USER_GET_USER_BY_ID_ROUTE, USER_GET_RESTAURANTS_ROUTE, GET_TECH_CARDS_BY_RESTAURANT_ID, GET_TABLES_BY_RESTAURANT_ID, GET_MENU_ITEMS_BY_RESTAURANT_ID, GET_SYSTEM_USERS_BY_RESTAURANT_ID, GET_ORDERS_BY_RESTAURANT_ID } from '../requests/req';
import axios from 'axios';

class UserStore {
  user = {
    username: '',
    registrationDate: '',
    mail: '',
    id: '',
    passwordHash: '',
    updatedAt: '',
    subscriptionType: 'NULL',
    restaurants: []
  };

  restaurants = [];
  techCards = [];
  tables = [];
  menuItems = [];
  systemUsers = [];
  orders = [];

  isAuthenticated = false;
  isKeeperMode = false;

  constructor() {
    makeObservable(this, {
      user: observable,
      restaurants: observable,
      techCards: observable,
      tables: observable,
      menuItems: observable,
      orders: observable,
      systemUsers: observable,
      isAuthenticated: observable,
      isKeeperMode: observable,
      setUser: action,
      authenticate: action,
      logout: action,
      setKeeperMode: action,
      getUserById: action,
      loadRestaurants: action,
      loadTechCards: action,
      loadTables: action,
      loadMenuItems: action,
      loadSystemUsers: action,
      loadOrders: action,
      setOrders: action,
      setTechCards: action,
      setTables: action,
      setRestaurants: action,
      setMenuItems: action,
      setSystemUsers: action,
    });

    this.loadUserFromCookies();
  }

  setUser(user) {
    // console.log("SET USER", user);
    this.user = { // Update user data
      username: user.username,
      registrationDate: user.registrationDate || user.createdAt,
      mail: user.mail || user.email,
      id: user.id,
      passwordHash: user.passwordHash,
      updatedAt: user.updatedAt,
      subscriptionType: user.subscriptionType || 'NULL2',
      restaurants: user.restaurants || []
    };

    Cookies.set('userId', user.id, { expires: 7 }); 
  }

  getUserById(userId) {
    axios.post(USER_GET_USER_BY_ID_ROUTE, { userId })
      .then(response => {
        if (response.status === 200) {
          const userData = response.data.user;
          this.setUser(userData);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }

  loadRestaurants() {
    axios.post(USER_GET_RESTAURANTS_ROUTE, { userId: this.user.id })
      .then(response => {
        if (response.status === 200) {
          this.setRestaurants(response.data.restaurants);
        } else {
          console.error('Error fetching restaurants:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error fetching restaurants:', error);
      });
  }

  loadTechCards(restaurantId) {
    axios.post(GET_TECH_CARDS_BY_RESTAURANT_ID, { restaurantId })
      .then(response => {
        if (response.status === 200) {
          this.setTechCards(response.data.techCards);
        } else {
          console.error('Error fetching tech cards:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error fetching tech cards:', error);
      });
  }

  loadTables(restaurantId) {
    axios.post(GET_TABLES_BY_RESTAURANT_ID, { restaurantId })
      .then(response => {
        if (response.status === 200) {
          this.setTables(response.data.tables);
        } else {
          console.error('Error fetching tables:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error fetching tables:', error);
      });
  }

  loadMenuItems(restaurantId) {
    axios.post(GET_MENU_ITEMS_BY_RESTAURANT_ID, { restaurantId })
      .then(response => {
        if (response.status === 200) {
          this.setMenuItems(response.data.menuItems);
        } else {
          console.error('Error fetching tables:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error fetching tables:', error);
      });
  }

  loadSystemUsers(restaurantId) {
    axios.post(GET_SYSTEM_USERS_BY_RESTAURANT_ID, { restaurantId })
      .then(response => {
        if (response.status === 200) {
          this.setSystemUsers(response.data.systemUsers);
        } else {
          console.error('Error fetching tables:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error fetching tables:', error);
      });
  }

  loadOrders(restaurantId) {
    axios.post(GET_ORDERS_BY_RESTAURANT_ID, { restaurantId })
      .then(response => {
        if (response.status === 200) {
          this.setOrders(response.data.orders);
        } else {
          console.error('Error fetching tables:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error fetching tables:', error);
      });
  }

  setOrders(orders) {
    this.orders = orders;
    Cookies.set('orders', JSON.stringify(orders), { expires: 7 });
  }

  setSystemUsers(systemUsers) {
    this.systemUsers = systemUsers;
    Cookies.set('systemUsers', JSON.stringify(systemUsers), { expires: 7 });
  }

  setMenuItems(menuItems) {
    this.menuItems = menuItems;
    Cookies.set('menuItems', JSON.stringify(menuItems), { expires: 7 });
  }

  setTechCards(techCards) {
    this.techCards = techCards;
    Cookies.set('techCards', JSON.stringify(techCards), { expires: 7 });
  }

  setTables(tables) {
    this.tables = tables;
    Cookies.set('tables', JSON.stringify(tables), { expires: 7 });
  }

  setRestaurants(restaurants) {
    this.restaurants = restaurants;
    Cookies.set('restaurants', JSON.stringify(restaurants), { expires: 7 });
  }

  authenticate(user) {
    this.isAuthenticated = true;
    this.user = { // Update user data
      username: user.username,
      registrationDate: user.createdAt,
      mail: user.email,
      id: user.id,
      passwordHash: user.passwordHash,
      updatedAt: user.updatedAt,
      subscriptionType: user.subscriptionType || 'NULL2',
      restaurants: user.restaurants || []
    };

    // Save essential user data to cookies
    Cookies.set('userId', user.id, { expires: 7 });
    Cookies.set('isAuthenticated', true, { expires: 7 });
  }

  logout() {
    this.isAuthenticated = false;
    this.isKeeperMode = false;
    this.user = {
      username: '',
      registrationDate: '',
      mail: '',
      id: '',
      subscriptionType: '',
      restaurants: []
    };

    // Clear user data from cookies
    Cookies.remove('userId');
    Cookies.remove('isAuthenticated');
    Cookies.remove('isKeeperMode');
    Cookies.remove('restaurants');
    Cookies.remove('techCards');
    Cookies.remove('tables');
    Cookies.remove('menuItems')
    Cookies.remove('systemUsers')
  }

  setKeeperMode(value) {
    this.isKeeperMode = value;
    Cookies.set('isKeeperMode', value, { expires: 7 });
  }

  loadUserFromCookies() {
    const userId = Cookies.get('userId');
    const isAuthenticated = Cookies.get('isAuthenticated');
    const isKeeperMode = Cookies.get('isKeeperMode') === 'true';

    const restaurants = Cookies.get('restaurants');
    const techCards = Cookies.get('techCards');
    const tables = Cookies.get('tables');

    if (userId && isAuthenticated) {
      this.isAuthenticated = true;
      this.isKeeperMode = isKeeperMode;
      this.getUserById(userId); // Fetch full user data from server

      // Load additional data from cookies if available
      if (restaurants) {
        this.setRestaurants(JSON.parse(restaurants));
      }
      if (techCards) {
        this.setTechCards(JSON.parse(techCards));
      }
      if (tables) {
        this.setTables(JSON.parse(tables));
      }
    }
  }
}

const userStore = new UserStore();
export default userStore;
