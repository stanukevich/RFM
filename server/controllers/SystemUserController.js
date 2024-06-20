const ApiError = require("../error/ApiError");
const { SystemUser, Restaurant } = require("../models/models");

class SystemUserController {
    async createSystemUser(req, res, next) {
        const { name, accessCode, systemAccess, orderInteraction, precheckInteraction, payInteraction, restaurantId } = req.body;
    
        try {
            if (!name || !accessCode || !restaurantId) {
                return next(ApiError.badRequest("Name, access code and restaurant ID are required to create a system user"));
            }
    
            const existingRestaurant = await Restaurant.findByPk(restaurantId);
            if (!existingRestaurant) {
                return next(ApiError.notFound("Restaurant with specified ID not found"));
            }
    
            const existingSystemUser = await SystemUser.findOne({ where: { accessCode, restaurantId } });
            if (existingSystemUser) {
                return next(ApiError.badRequest("A system user with this access code already exists for the specified restaurant"));
            }
    
            const systemUser = await SystemUser.create({
                name,
                accessCode,
                systemAccess: systemAccess || false,
                orderInteraction: orderInteraction || false,
                precheckInteraction: precheckInteraction || false,
                payInteraction: payInteraction || false,
                // discountAccess: discountAccess || false,
                restaurantId
            });
    
            return res.json({ message: "System user created successfully!", systemUser });
        } catch (error) {
            console.error("Error during system user creation:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }
    
    async deleteSystemUser(req, res, next) {
        const { systemUserId } = req.body;

        try {
            if (!systemUserId) {
                return next(ApiError.badRequest("System user ID is required"));
            }

            const systemUser = await SystemUser.findByPk(systemUserId);

            if (!systemUser) {
                return next(ApiError.notFound("System user not found"));
            }

            await systemUser.destroy();

            return res.json({ message: "System user successfully deleted" });
        } catch (error) {
            console.error("Error while deleting system user:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async updateSystemUser(req, res, next) {
        const { systemUserId, name, accessCode, systemAccess, orderInteraction, precheckInteraction, payInteraction} = req.body;
    
        try {
            const systemUser = await SystemUser.findByPk(systemUserId);
    
            if (!systemUser) {
                return next(ApiError.notFound("System user not found"));
            }
    
            if (!name && !accessCode && systemAccess === undefined && orderInteraction === undefined && precheckInteraction === undefined && payInteraction === undefined) {
                return next(ApiError.badRequest("No data provided for update"));
            }
    
            if (accessCode && accessCode !== systemUser.accessCode) {
                const existingUser = await SystemUser.findOne({ where: { accessCode, restaurantId: systemUser.restaurantId } });
                if (existingUser) {
                    return next(ApiError.badRequest("Access code must be unique within the restaurant"));
                }
            }
    
            if (name) systemUser.name = name;
            if (accessCode) systemUser.accessCode = accessCode;
            if (systemAccess !== undefined) systemUser.systemAccess = systemAccess;
            if (orderInteraction !== undefined) systemUser.orderInteraction = orderInteraction;
            if (precheckInteraction !== undefined) systemUser.precheckInteraction = precheckInteraction;
            if (payInteraction !== undefined) systemUser.payInteraction = payInteraction;
            // if (discountAccess !== undefined) systemUser.discountAccess = discountAccess;
    
            await systemUser.save();
    
            return res.json({ message: "System user data successfully updated", systemUser });
        } catch (error) {
            console.error("Error while editing system user data:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async getSystemUsersByRestaurantId(req, res, next) {
        const { restaurantId } = req.body;

        try {
            const systemUsers = await SystemUser.findAll({ where: { restaurantId } });

            // if (!systemUsers || systemUsers.length === 0) {
            //     // Если пользователи системы не найдены, возвращаем ошибку "Not Found"
            //     return next(ApiError.notFound("System users not found for the specified restaurant"));
            // }

            return res.json({ systemUsers });
        } catch (error) {
            console.error("Error while fetching system users data by restaurant ID:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }
}

module.exports = new SystemUserController();
