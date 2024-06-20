const SERVER_ADDRESS = 'http://192.168.56.1:5000/api'

const USERS_ROUTE = "/users"
const AUTH_ROUTE = "/authenticate"
const REG_ROUTE = "/registration"
const UPD_ROUTE = "/updateUser"
const GET_USER_BY_ID = "/getUserById"

const USER_AUTHENTICATE_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${AUTH_ROUTE}`
const USER_REGISTRATION_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${REG_ROUTE}`
const USER_UPDATE_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${UPD_ROUTE}`
const USER_GET_USER_BY_ID_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${GET_USER_BY_ID}`

const RESTAURANTS_ROUTE = "/restaurants"
const GET_RESTAURANTS_BY_USER_ID_ROUTE = "/getRestaurantsByUserId"
const DELETE_RESTAURANT = "/deleteRestaurant"
const UPDATE_RESTAURANT = "/updateRestaurant"

const USER_GET_RESTAURANTS_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${RESTAURANTS_ROUTE}${GET_RESTAURANTS_BY_USER_ID_ROUTE}`
const USER_ADD_RESTAURANT_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${RESTAURANTS_ROUTE}${REG_ROUTE}`
const USER_DELETE_RESTAURANT_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${RESTAURANTS_ROUTE}${DELETE_RESTAURANT}`
const USER_UPDATE_RESTAURANT_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${RESTAURANTS_ROUTE}${UPDATE_RESTAURANT}`

const TECH_CARD_ROUTE = '/techCards';

const TECH_CARD_BASE_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${RESTAURANTS_ROUTE}${TECH_CARD_ROUTE}`;
const CREATE_TECH_CARD_ROUTE = '/createTechCard';
const DELETE_TECH_CARD_ROUTE = '/deleteTechCard';
const UPDATE_TECH_CARD_ROUTE = '/updateTechCard';
const GET_TECH_CARDS_BY_RESTAURANT_ID_ROUTE = '/getTechCardsByRestaurantId';

const CREATE_TECH_CARD = `${TECH_CARD_BASE_ROUTE}${CREATE_TECH_CARD_ROUTE}`;
const DELETE_TECH_CARD = `${TECH_CARD_BASE_ROUTE}${DELETE_TECH_CARD_ROUTE}`;
const UPDATE_TECH_CARD = `${TECH_CARD_BASE_ROUTE}${UPDATE_TECH_CARD_ROUTE}`;
const GET_TECH_CARDS_BY_RESTAURANT_ID = `${TECH_CARD_BASE_ROUTE}${GET_TECH_CARDS_BY_RESTAURANT_ID_ROUTE}`;

const TABLE_ROUTE = '/tables'

const CREATE_TABLE_ROUTE = '/createTable';
const DELETE_TABLE_ROUTE = '/deleteTable';
const UPDATE_TABLE_ROUTE = '/updateTable';
const GET_TABLES_BY_RESTAURANT_ID_ROUTE = '/getTablesByRestaurantId';
const SYNC_TABLES_ROUTE = '/syncTables';

const TABLE_BASE_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${RESTAURANTS_ROUTE}${TABLE_ROUTE}`;

const CREATE_TABLE = `${TABLE_BASE_ROUTE}${CREATE_TABLE_ROUTE}`
const DELETE_TABLE = `${TABLE_BASE_ROUTE}${DELETE_TABLE_ROUTE}`
const UPDATE_TABLE = `${TABLE_BASE_ROUTE}${UPDATE_TABLE_ROUTE}`
const GET_TABLES_BY_RESTAURANT_ID = `${TABLE_BASE_ROUTE}${GET_TABLES_BY_RESTAURANT_ID_ROUTE}`
const SYNC_TABLES = `${TABLE_BASE_ROUTE}${SYNC_TABLES_ROUTE}`

const MENU_ITEM_ROUTE = '/menuItems'

const CREATE_MENU_ITEM_ROUTE = '/createMenuItem';
const DELETE_MENU_ITEM_ROUTE = '/deleteMenuItem';
const UPDATE_MENU_ITEM_ROUTE = '/updateMenuItem';
const GET_MENU_ITEMS_BY_RESTAURANT_ID_ROUTE = '/getMenuItemsByRestaurantId'

const MENU_ITEM_BASE_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${RESTAURANTS_ROUTE}${MENU_ITEM_ROUTE}`

const CREATE_MENU_ITEM = `${MENU_ITEM_BASE_ROUTE}${CREATE_MENU_ITEM_ROUTE}`;
const DELETE_MENU_ITEM = `${MENU_ITEM_BASE_ROUTE}${DELETE_MENU_ITEM_ROUTE}`;
const UPDATE_MENU_ITEM = `${MENU_ITEM_BASE_ROUTE}${UPDATE_MENU_ITEM_ROUTE}`;
const GET_MENU_ITEMS_BY_RESTAURANT_ID = `${MENU_ITEM_BASE_ROUTE}${GET_MENU_ITEMS_BY_RESTAURANT_ID_ROUTE}`;

const SYSTEM_USERS = '/systemUsers'

const CREATE_SYSTEM_USER_ROUTE = '/createSystemUser'
const DELETE_SYSTEM_USER_ROUTE = '/deleteSystemUser'
const UPDATE_SYSTEM_USER_ROUTE = '/updateSystemUser'
const GET_SYSTEM_USERS_BY_RESTAURANT_ID_ROUTE = '/getSystemUsersByRestaurantId'

const SYSTEM_USER_BASE_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${RESTAURANTS_ROUTE}${SYSTEM_USERS}`

const CREATE_SYSTEM_USER = `${SYSTEM_USER_BASE_ROUTE}${CREATE_SYSTEM_USER_ROUTE}`
const DELETE_SYSTEM_USER = `${SYSTEM_USER_BASE_ROUTE}${DELETE_SYSTEM_USER_ROUTE}`
const UPDATE_SYSTEM_USER = `${SYSTEM_USER_BASE_ROUTE}${UPDATE_SYSTEM_USER_ROUTE}`
const GET_SYSTEM_USERS_BY_RESTAURANT_ID = `${SYSTEM_USER_BASE_ROUTE}${GET_SYSTEM_USERS_BY_RESTAURANT_ID_ROUTE}`


const ORDERS = '/orders'

const GET_ORDERS_BY_RESTAURANT_ID_ROUTE = '/getOrdersByRestaurantId'
const CREATE_NEW_EMPTY_ORDER_ROUTE = '/createEmptyOrder'
const DELETE_ORDER_ROUTE = '/deleteOrder'
const CREATE_ORDER_MENU_ITEM_ROUTE = '/createOrderMenuItem'
const DELETE_ORDER_MENU_ITEM_ROUTE = '/deleteOrderMenuItem'
const UPDATE_ORDER_MENU_ITEM_ROUTE = '/updateOrderMenuItem'
const UPDATE_ORDER_MENU_ITEMS_ROUTE = '/updateOrderMenuItems'
const UPDATE_ORDER_ROUTE = '/updateOrder'
const CALCULATE_ORDER_TOTAL_ROUTE ='/calculateOrderTotal'

const ORDERS_BASE_ROUTE = `${SERVER_ADDRESS}${USERS_ROUTE}${RESTAURANTS_ROUTE}${ORDERS}`

const GET_ORDERS_BY_RESTAURANT_ID = `${ORDERS_BASE_ROUTE}${GET_ORDERS_BY_RESTAURANT_ID_ROUTE}`
const CREATE_EMPTY_ORDER = `${ORDERS_BASE_ROUTE}${CREATE_NEW_EMPTY_ORDER_ROUTE}`
const DELETE_ORDER = `${ORDERS_BASE_ROUTE}${DELETE_ORDER_ROUTE}`
const CREATE_ORDER_MENU_ITEM = `${ORDERS_BASE_ROUTE}${CREATE_ORDER_MENU_ITEM_ROUTE}`
const DELETE_ORDER_MENU_ITEM = `${ORDERS_BASE_ROUTE}${DELETE_ORDER_MENU_ITEM_ROUTE}`
const UPDATE_ORDER_MENU_ITEM = `${ORDERS_BASE_ROUTE}${UPDATE_ORDER_MENU_ITEM_ROUTE}`
const UPDATE_ORDER_MENU_ITEMS = `${ORDERS_BASE_ROUTE}${UPDATE_ORDER_MENU_ITEMS_ROUTE}`
const UPDATE_ORDER = `${ORDERS_BASE_ROUTE}${UPDATE_ORDER_ROUTE}`
const CALCULATE_ORDER_TOTAL = `${ORDERS_BASE_ROUTE}${CALCULATE_ORDER_TOTAL_ROUTE}`

export {
    USER_AUTHENTICATE_ROUTE,
    USER_REGISTRATION_ROUTE,
    USER_UPDATE_ROUTE,
    USER_GET_USER_BY_ID_ROUTE,

    USER_GET_RESTAURANTS_ROUTE, 
    USER_ADD_RESTAURANT_ROUTE,
    USER_DELETE_RESTAURANT_ROUTE, 
    USER_UPDATE_RESTAURANT_ROUTE,

    CREATE_TECH_CARD,
    DELETE_TECH_CARD,
    UPDATE_TECH_CARD,
    GET_TECH_CARDS_BY_RESTAURANT_ID,

    CREATE_TABLE,
    DELETE_TABLE,
    UPDATE_TABLE,
    GET_TABLES_BY_RESTAURANT_ID,
    SYNC_TABLES,

    CREATE_MENU_ITEM,
    DELETE_MENU_ITEM,
    UPDATE_MENU_ITEM,
    GET_MENU_ITEMS_BY_RESTAURANT_ID,

    CREATE_SYSTEM_USER,
    DELETE_SYSTEM_USER,
    UPDATE_SYSTEM_USER,
    GET_SYSTEM_USERS_BY_RESTAURANT_ID,

    GET_ORDERS_BY_RESTAURANT_ID,
    CREATE_EMPTY_ORDER,
    DELETE_ORDER,
    CREATE_ORDER_MENU_ITEM,
    DELETE_ORDER_MENU_ITEM,
    UPDATE_ORDER_MENU_ITEM,
    UPDATE_ORDER_MENU_ITEMS,
    UPDATE_ORDER,
    CALCULATE_ORDER_TOTAL
}