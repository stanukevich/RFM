const ApiError = require("../error/ApiError");
const { Order, SystemUser, Table, Restaurant, MenuItem, OrderMenuItem } = require("../models/models");

class OrderController {

    async createEmptyOrder(req, res, next) {
        const { systemUserId, restaurantId, tableId } = req.body;
    
        try {
            if (!systemUserId || !restaurantId) {
                return next(ApiError.badRequest("System user ID and restaurant ID are required to create an empty order"));
            }
    
            const existingRestaurant = await Restaurant.findByPk(restaurantId);
            if (!existingRestaurant) {
                return next(ApiError.notFound("Restaurant with specified ID not found"));
            }
    
            const existingSystemUser = await SystemUser.findByPk(systemUserId);
            if (!existingSystemUser) {
                return next(ApiError.notFound("System user with specified ID not found"));
            }
    
            if (tableId) {
                const existingTable = await Table.findByPk(tableId);
                if (!existingTable) {
                    return next(ApiError.notFound("Table with specified ID not found"));
                }
            }
    
            const orderData = {
                systemUserId,
                restaurantId
            };
    
            if (tableId) {
                orderData.tableId = tableId;
            }
    
            const order = await Order.create(orderData);
    
            return res.json({ message: "Empty order created successfully!", order });
        } catch (error) {
            console.error("Error during empty order creation:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }    

    async deleteOrder(req, res, next) {
        const { orderId } = req.body;

        try {
            if (!orderId) {
                return next(ApiError.badRequest("Order ID is required"));
            }

            const order = await Order.findByPk(orderId);
            if (!order) {
                return next(ApiError.notFound("Order not found"));
            }

            await order.destroy();

            return res.json({ message: "Order successfully deleted" });
        } catch (error) {
            console.error("Error while deleting order:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async updateOrder(req, res, next) {
        const { id, paymentStatus, precheckStatus, paymentType, systemUserId, tableId, restaurantId, amountPrice } = req.body;

        try {
            const order = await Order.findByPk(id);
            if (!order) {
                return next(ApiError.notFound("Order not found"));
            }

            if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;
            if (precheckStatus !== undefined) order.precheckStatus = precheckStatus;
            if (paymentType !== undefined) order.paymentType = paymentType;
            if (systemUserId !== undefined) order.systemUserId = systemUserId;
            if (tableId !== undefined) order.tableId = tableId;
            if (restaurantId !== undefined) order.restaurantId = restaurantId;
            if (amountPrice !== undefined) order.amountPrice = amountPrice;

            await order.save();

            return res.json({ message: "Order data successfully updated", order });
        } catch (error) {
            console.error("Error while editing order data:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async getOrdersByRestaurantId(req, res, next) {
        const { restaurantId } = req.body;
    
        try {
            const orders = await Order.findAll({
                where: { restaurantId },
                include: [
                    { 
                        model: SystemUser,
                        attributes: ['name'] 
                    },
                    { 
                        model: Table,
                        attributes: ['tableNumber'] 
                    }, 
                    {
                        model: OrderMenuItem,
                        include: [
                            {
                                model: MenuItem,
                                attributes: ['id', 'name', 'price']
                            }
                        ],
                        attributes: ['id', 'quantity', 'sendingStatus']
                    }
                ]
            });
    
            return res.json({ orders });
        } catch (error) {
            console.error("Error while fetching orders by restaurant ID:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async calculateOrderTotal(req, res, next) {
        const { orderId } = req.body;

        try {
            const order = await Order.findByPk(orderId, {
                include: {
                    model: MenuItem,
                    through: { attributes: ['quantity'] }
                }
            });

            if (!order) {
                return next(ApiError.notFound("Order not found"));
            }

            const total = order.MenuItems.reduce((sum, item) => {
                return sum + item.price * item.OrderMenuItem.quantity;
            }, 0);

            return res.json({ total });
        } catch (error) {
            console.error("Error during order total calculation:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async createOrderMenuItem(req, res, next) {
        const { orderId, menuItemId, quantity } = req.body;

        try {
            const order = await Order.findByPk(orderId);
            if (!order) {
                return next(ApiError.notFound("Order not found"));
            }

            const menuItem = await MenuItem.findByPk(menuItemId);
            if (!menuItem) {
                return next(ApiError.notFound("Menu item not found"));
            }

            const orderMenuItem = await OrderMenuItem.create({
                orderId,
                menuItemId,
                quantity: quantity || 1
            });

            return res.json({ message: "Order menu item created successfully!", orderMenuItem });
        } catch (error) {
            console.error("Error during order menu item creation:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async updateOrderMenuItem(req, res, next) {
        const { id, orderId, menuItemId, quantity, sendingStatus } = req.body;

        try {
            const orderMenuItem = await OrderMenuItem.findByPk(id);
            if (!orderMenuItem) {
                return next(ApiError.notFound("Order menu item not found"));
            }

            if (orderId !== undefined) {
                orderMenuItem.orderId = orderId;
            }
            if (menuItemId !== undefined) {
                orderMenuItem.menuItemId = menuItemId;
            }
            if (quantity !== undefined) {
                orderMenuItem.quantity = quantity > 0 ? quantity : 1;
            }
            if (sendingStatus !== undefined) {
                orderMenuItem.sendingStatus = sendingStatus;
            }

            await orderMenuItem.save();

            return res.json({ message: "Order menu item updated successfully!", orderMenuItem });
        } catch (error) {
            console.error("Error during order menu item update:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async updateOrderMenuItems(req, res, next) {
        const { updatedItems } = req.body;

        try {
            if (!Array.isArray(updatedItems)) {
                return next(ApiError.badRequest("Updated items should be provided as an array"));
            }

            const promises = updatedItems.map(async item => {
                const { id, orderId, menuItemId, quantity, sendingStatus } = item;
                const orderMenuItem = await OrderMenuItem.findByPk(id);
                if (!orderMenuItem) {
                    return next(ApiError.notFound("Order menu item not found"));
                }

                if (orderId !== undefined) {
                    orderMenuItem.orderId = orderId;
                }
                if (menuItemId !== undefined) {
                    orderMenuItem.menuItemId = menuItemId;
                }
                if (quantity !== undefined) {
                    orderMenuItem.quantity = quantity > 0 ? quantity : 1;
                }
                if (sendingStatus !== undefined) {
                    orderMenuItem.sendingStatus = sendingStatus;
                }

                await orderMenuItem.save();
            });

            await Promise.all(promises);

            return res.json({ message: "Order menu items updated successfully!" });
        } catch (error) {
            console.error("Error during order menu items update:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async deleteOrderMenuItem(req, res, next) {
        const { id } = req.body; 

        try {
            const orderMenuItem = await OrderMenuItem.findOne({ where: { id } });
            if (!orderMenuItem) {
                return next(ApiError.notFound("Order menu item not found"));
            }

            await orderMenuItem.destroy();

            return res.json({ message: "Order menu item deleted successfully" });
        } catch (error) {
            console.error("Error during order menu item deletion:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

}

module.exports = new OrderController();
