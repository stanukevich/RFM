const ApiError = require("../error/ApiError");
const { TechCard, Restaurant } = require("../models/models");

class TechCardController {
    async createTechCard(req, res, next) {
        const { name, productOutput, cost, restaurantId } = req.body;

        try {
            if (!name || !productOutput || !cost || !restaurantId) {
                return next(ApiError.badRequest("All fields are required to create a tech card"));
            }

            const existingRestaurant = await Restaurant.findByPk(restaurantId);
            if (!existingRestaurant) {
                return next(ApiError.notFound("Restaurant with specified ID not found"));
            }

            const techCard = await TechCard.create({ name, productOutput, cost, restaurantId });

            return res.json({ message: "Tech card created successfully!", techCard });
        } catch (error) {
            console.error("Error during tech card creation:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async deleteTechCard(req, res, next) {
        const { techCardId } = req.body;

        try {
            if (!techCardId) {
                return next(ApiError.badRequest("Tech card ID is required"));
            }

            const techCard = await TechCard.findByPk(techCardId);

            if (!techCard) {
                return next(ApiError.notFound("Tech card not found"));
            }

            await techCard.destroy();

            return res.json({ message: "Tech card successfully deleted" });
        } catch (error) {
            console.error("Error while deleting tech card:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async updateTechCard(req, res, next) {
        const { techCardId, name, productOutput, cost } = req.body;

        try {
            const techCard = await TechCard.findByPk(techCardId);

            if (!techCard) {
                return next(ApiError.notFound("Tech card not found"));
            }

            if (!name && !productOutput && !cost) {
                return next(ApiError.badRequest("No data provided for update"));
            }

            if (name) {
                techCard.name = name;
            }
            if (productOutput) {
                techCard.productOutput = productOutput;
            }
            if (cost) {
                techCard.cost = cost;
            }

            await techCard.save();

            return res.json({ message: "Tech card data successfully updated", techCard });
        } catch (error) {
            console.error("Error while editing tech card data:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async getTechCardsByRestaurantId(req, res, next) {
        const { restaurantId } = req.body;

        try {
            const techCards = await TechCard.findAll({ where: { restaurantId } });

            // if (!techCards || techCards.length === 0) {
            //     // Если технические карты не найдены, возвращаем ошибку "Not Found"
            //     return next(ApiError.notFound("Tech cards not found for the specified restaurant"));
            // }

            return res.json({ techCards });
        } catch (error) {
            console.error("Error while fetching tech cards data by restaurant ID:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }
}

module.exports = new TechCardController();
