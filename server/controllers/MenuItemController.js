const ApiError = require("../error/ApiError");
const { MenuItem, Restaurant, TechCard, MenuItemTechCard } = require("../models/models");

class MenuItemController {
    async createMenuItem(req, res, next) {
        const { name, category, price, restaurantId, techCards } = req.body;
    
        try {
            if (!name || !category || !price || !restaurantId || !techCards || techCards.length === 0) {
                return next(ApiError.badRequest("All fields must be filled, and at least one tech card must be selected"));
            }
    
            const existingRestaurant = await Restaurant.findByPk(restaurantId);
            if (!existingRestaurant) {
                return next(ApiError.notFound("Restaurant with specified ID not found"));
            }
    
            if (techCards.length === 0) {
                return next(ApiError.badRequest("At least one tech card must be selected"));
            }
    
            const existingTechCards = await TechCard.findAll({ where: { id: techCards.map(techCard => techCard.id) } });
            if (existingTechCards.length !== techCards.length) {
                return next(ApiError.notFound("One or more specified tech cards not found"));
            }
    
            const menuItem = await MenuItem.create({ name, category, price, restaurantId });
    
            const techCardAssociations = techCards.map(techCard => ({
                menuItemId: menuItem.id,
                techCardId: techCard.id,
                quantity: techCard.quantity || 1
            }));
            await MenuItemTechCard.bulkCreate(techCardAssociations);
    
            return res.json({ message: "Menu item created successfully!", menuItem });
        } catch (error) {
            console.error("Error during menu item creation:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }
    
    async deleteMenuItem(req, res, next) {
        const { menuItemId } = req.body;

        try {
            if (!menuItemId) {
                return next(ApiError.badRequest("Menu item ID is required"));
            }

            const menuItem = await MenuItem.findByPk(menuItemId);

            if (!menuItem) {
                return next(ApiError.notFound("Menu item not found"));
            }

            await menuItem.destroy();

            return res.json({ message: "Menu item successfully deleted" });
        } catch (error) {
            console.error("Error while deleting menu item:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async updateMenuItem(req, res, next) {
        const { menuItemId, name, category, price, techCardIds } = req.body;

        try {
            const menuItem = await MenuItem.findByPk(menuItemId);

            if (!menuItem) {
                return next(ApiError.notFound("Menu item not found"));
            }

            if (!name && !category && !price && (!techCardIds || techCardIds.length === 0)) {
                return next(ApiError.badRequest("No data provided for update"));
            }

            if (name) {
                menuItem.name = name;
            }
            if (category) {
                menuItem.category = category;
            }
            if (price) {
                menuItem.price = price;
            }

            await menuItem.save();

            if (techCardIds && techCardIds.length > 0) {
                await MenuItemTechCard.destroy({ where: { menuItemId: menuItem.id } });

                const techCardAssociations = techCardIds.map(techCardId => ({
                    menuItemId: menuItem.id,
                    techCardId,
                    quantity: 1 
                }));
                await MenuItemTechCard.bulkCreate(techCardAssociations);
            }

            return res.json({ message: "Menu item data successfully updated", menuItem });
        } catch (error) {
            console.error("Error while editing menu item data:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async getMenuItemsByRestaurantId(req, res, next) {
        const { restaurantId } = req.body;

        try {
            const menuItems = await MenuItem.findAll({ where: { restaurantId }, include: TechCard });

            // if (!menuItems || menuItems.length === 0) {
            //     return next(ApiError.notFound("Menu items not found for the specified restaurant"));
            // }

            return res.json({ menuItems });
        } catch (error) {
            console.error("Error while fetching menu items data by restaurant ID:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }
}

module.exports = new MenuItemController();
