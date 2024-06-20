const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.passwordHash = await bcrypt.hash(user.password, saltRounds);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.passwordHash = await bcrypt.hash(user.password, saltRounds);
            }
        },
        beforeDestroy: async (user, options) => {
            try {
                const restaurants = await Restaurant.findAll({ where: { userId: user.id } });
                await Promise.all(restaurants.map(async (restaurant) => {
                    await restaurant.destroy();
                }));
            } catch (error) {
                console.error("Error while deleting associated restaurants:", error);
                throw error;
            }
        }
    }
});

const Restaurant = sequelize.define("restaurant", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    accessKey: { type: DataTypes.STRING, allowNull: false }
}, {
    hooks: {
        beforeDestroy: async (restaurant, options) => {
            try {
                const orders = await Order.findAll({ where: { restaurantId: restaurant.id } });
                await Promise.all(orders.map(async (order) => {
                    await order.destroy();
                }));

                const techCards = await TechCard.findAll({ where: { restaurantId: restaurant.id } });
                await Promise.all(techCards.map(async (techCard) => {
                    await techCard.destroy();
                }));

                const tables = await Table.findAll({ where: { restaurantId: restaurant.id } });
                await Promise.all(tables.map(async (table) => {
                    await table.destroy();
                }));

                const menuItems = await MenuItem.findAll({ where: { restaurantId: restaurant.id } });
                await Promise.all(menuItems.map(async (menuItem) => {
                    await menuItem.destroy();
                }));

                const systemUsers = await SystemUser.findAll({ where: { restaurantId: restaurant.id } });
                await Promise.all(systemUsers.map(async (systemUser) => {
                    await systemUser.destroy();
                }));
            } catch (error) {
                console.error("Error while deleting associated orders, tech cards, tables, menu items, and system users:", error);
                throw error;
            }
        }
    }
});

const TechCard = sequelize.define("techCard", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    productOutput: { type: DataTypes.FLOAT, allowNull: false },
    cost: { type: DataTypes.FLOAT, allowNull: false }
}, {
    hooks: {
        beforeDestroy: async (techCard, options) => {
            try {
                const menuItems = await MenuItem.findAll({ include: [{ model: TechCard, where: { id: techCard.id } }] });
                await Promise.all(menuItems.map(async (menuItem) => {
                    await menuItem.destroy();
                }));
            } catch (error) {
                console.error("Error while deleting associated menu items:", error);
                throw error;
            }
        }
    }
});

const Table = sequelize.define("table", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tableNumber: { type: DataTypes.INTEGER, allowNull: false },
    xCoordinate: { type: DataTypes.FLOAT, allowNull: true },
    yCoordinate: { type: DataTypes.FLOAT, allowNull: true }
});

const MenuItem = sequelize.define("menuItem", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }
});

const MenuItemTechCard = sequelize.define("MenuItemTechCard", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
});

const SystemUser = sequelize.define("systemUser", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    accessCode: { type: DataTypes.STRING, allowNull: false },
    systemAccess: { type: DataTypes.BOOLEAN, defaultValue: false },
    orderInteraction: { type: DataTypes.BOOLEAN, defaultValue: false },
    precheckInteraction: { type: DataTypes.BOOLEAN, defaultValue: false },
    payInteraction: { type: DataTypes.BOOLEAN, defaultValue: false },
    // discountAccess: { type: DataTypes.BOOLEAN, defaultValue: false },
    restaurantId: {
        type: DataTypes.INTEGER,
        references: {
            model: Restaurant,
            key: 'id'
        }
    }
});

const Order = sequelize.define("order", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    paymentStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
    precheckStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
    paymentType: { type: DataTypes.STRING, defaultValue: "UNKNOWN" },
    amountPrice: {type: DataTypes.INTEGER, allowNull: true, defaultValue: null},
    systemUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SystemUser,
            key: 'id'
        }
    },
    tableId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Table,
            key: 'id'
        },
        defaultValue: null
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Restaurant,
            key: 'id'
        }
    }
});

const OrderMenuItem = sequelize.define("OrderMenuItem", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: "1" },
    sendingStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    menuItemId: { type: DataTypes.INTEGER, allowNull: false }
});

Order.hasMany(OrderMenuItem, { foreignKey: 'orderId' });
OrderMenuItem.belongsTo(Order, { foreignKey: 'orderId' });

MenuItem.hasMany(OrderMenuItem, { foreignKey: 'menuItemId' });
OrderMenuItem.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

User.hasMany(Restaurant, { foreignKey: 'userId' });
Restaurant.belongsTo(User, { foreignKey: 'userId' });

Restaurant.hasMany(TechCard, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
TechCard.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Restaurant.hasMany(Table, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
Table.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

TechCard.belongsToMany(MenuItem, { through: MenuItemTechCard, onDelete: 'CASCADE' });
MenuItem.belongsToMany(TechCard, { through: MenuItemTechCard, onDelete: 'CASCADE' });

Restaurant.hasMany(SystemUser, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
SystemUser.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Restaurant.hasMany(Order, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

SystemUser.hasMany(Order, { foreignKey: 'systemUserId', allowNull: true });
Order.belongsTo(SystemUser, { foreignKey: 'systemUserId', allowNull: true });

Table.hasMany(Order, { foreignKey: 'tableId', allowNull: true, onDelete: 'CASCADE' }); 
Order.belongsTo(Table, { foreignKey: 'tableId', allowNull: true });

// Order.hasMany(OrderMenuItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });

module.exports = {
    User,
    Restaurant,
    TechCard,
    Table,
    MenuItem,
    MenuItemTechCard,
    SystemUser,
    Order,
    OrderMenuItem 
};
