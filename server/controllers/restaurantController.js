const ApiError = require("../error/ApiError");
const { Restaurant, User } = require("../models/models");

class RestaurantController {
    async registration(req, res, next) {
        const { name, accessKey, userId } = req.body;
    
        try {
            if (!name || !accessKey || !userId) {
                return next(ApiError.badRequest("All fields are required for restaurant registration"));
            }
    
            const existingUser = await User.findByPk(userId);
            if (!existingUser) {
                return next(ApiError.notFound("User with specified ID not found"));
            }
    
            const existingRestaurant = await Restaurant.findOne({ where: { name } });
            if (existingRestaurant) {
                return next(ApiError.badRequest("Restaurant with this name already exists"));
            }
    
            const restaurant = await Restaurant.create({ name, accessKey, userId });
    
            return res.json({ message: "Restaurant registration successful!", restaurant });
        } catch (error) {
            console.error("Error during restaurant registration:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async getRestaurantById(req, res, next) {
        const { restaurantId } = req.body;

        try {
            if (!restaurantId) {
                return next(ApiError.badRequest("Restaurant ID is required"));
            }

            const restaurant = await Restaurant.findByPk(restaurantId);

            if (!restaurant) {
                return next(ApiError.notFound("Restaurant not found"));
            }

            return res.json({ restaurant });
        } catch (error) {
            console.error("Error while fetching restaurant data:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async deleteRestaurant(req, res, next) {
        const { restaurantId } = req.body;

        try {
            if (!restaurantId) {
                return next(ApiError.badRequest("Restaurant ID is required"));
            }

            const restaurant = await Restaurant.findByPk(restaurantId);

            if (!restaurant) {
                return next(ApiError.notFound("Restaurant not found"));
            }

            await restaurant.destroy();

            return res.json({ message: "Restaurant successfully deleted" });
        } catch (error) {
            console.error("Error while deleting restaurant:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async updateRestaurant(req, res, next) {
        const { restaurantId, name, accessKey } = req.body;
    
        try {
            const restaurant = await Restaurant.findByPk(restaurantId);
    
            if (!restaurant) {
                return next(ApiError.notFound("Restaurant not found"));
            }
    
            if (!name && !accessKey) {
                return next(ApiError.badRequest("No data provided for update"));
            }
    
            if (name && name !== restaurant.name) {
                const existingRestaurant = await Restaurant.findOne({ where: { name } });
                if (existingRestaurant && existingRestaurant.id !== restaurantId) {
                    return next(ApiError.badRequest("Restaurant with this name already exists"));
                }
            }
    
            if (name) {
                restaurant.name = name;
            }
            if (accessKey) {
                restaurant.accessKey = accessKey;
            }
    
            await restaurant.save();
    
            return res.json({ message: "Restaurant data successfully updated", restaurant });
        } catch (error) {
            console.error("Error while editing restaurant data:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async getRestaurantsByUserId(req, res, next) {
        const { userId } = req.body;

        try {
            const restaurants = await Restaurant.findAll({ where: { userId } });

            return res.json({ restaurants });
        } catch (error) {
            console.error("Error while fetching restaurants data by user ID:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }
    
}

module.exports = new RestaurantController();
