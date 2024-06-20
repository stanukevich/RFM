const ApiError = require("../error/ApiError");
const { Table, Restaurant } = require("../models/models");

class TableController {
    async createTable(req, res, next) {
        const { tableNumber, xCoordinate, yCoordinate, restaurantId } = req.body;

        try {
            if (!tableNumber || !restaurantId) {
                return next(ApiError.badRequest("Table number and restaurant ID are required to create a table"));
            }

            const existingRestaurant = await Restaurant.findByPk(restaurantId);
            if (!existingRestaurant) {
                return next(ApiError.notFound("Restaurant with specified ID not found"));
            }

            const table = await Table.create({ tableNumber, xCoordinate, yCoordinate, restaurantId });

            return res.json({ message: "Table created successfully!", table });
        } catch (error) {
            console.error("Error during table creation:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async deleteTable(req, res, next) {
        const { tableId } = req.body;

        try {
            if (!tableId) {
                return next(ApiError.badRequest("Table ID is required"));
            }

            const table = await Table.findByPk(tableId);

            if (!table) {
                return next(ApiError.notFound("Table not found"));
            }

            await table.destroy();

            return res.json({ message: "Table successfully deleted" });
        } catch (error) {
            console.error("Error while deleting table:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async updateTable(req, res, next) {
        const { tableId, tableNumber, xCoordinate, yCoordinate } = req.body;

        try {
            const table = await Table.findByPk(tableId);

            if (!table) {
                return next(ApiError.notFound("Table not found"));
            }

            if (!tableNumber && !xCoordinate && !yCoordinate) {
                return next(ApiError.badRequest("No data provided for update"));
            }

            if (tableNumber) {
                table.tableNumber = tableNumber;
            }
            if (xCoordinate !== undefined) {
                table.xCoordinate = xCoordinate;
            }
            if (yCoordinate !== undefined) {
                table.yCoordinate = yCoordinate;
            }

            await table.save();

            return res.json({ message: "Table data successfully updated", table });
        } catch (error) {
            console.error("Error while editing table data:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async getTablesByRestaurantId(req, res, next) {
        const { restaurantId } = req.body;

        try {
            const tables = await Table.findAll({ where: { restaurantId } });

            // console.log("TABLES:", tables)

            // if (!tables || tables.length === 0) {
            //     return next(ApiError.notFound("Tables not found for the specified restaurant"));
            // }


            return res.json({ tables });
        } catch (error) {
            console.error("Error while fetching tables data by restaurant ID:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async syncTables(req, res, next) {
        const { tables, restaurantId } = req.body;

        try {
            if (!restaurantId) {
                return next(ApiError.badRequest("Restaurant ID is required"));
            }

            const existingRestaurant = await Restaurant.findByPk(restaurantId);
            if (!existingRestaurant) {
                return next(ApiError.notFound("Restaurant with specified ID not found"));
            }

            const existingTables = await Table.findAll({ where: { restaurantId } });

            const existingTableMap = {};
            existingTables.forEach(table => {
                existingTableMap[table.id] = table;
            });

            for (let newTable of tables) {
                const { id, tableNumber, xCoordinate, yCoordinate } = newTable;

                if (id && existingTableMap[id]) {
                    const existingTable = existingTableMap[id];

                    if (
                        existingTable.tableNumber !== tableNumber ||
                        existingTable.xCoordinate !== xCoordinate ||
                        existingTable.yCoordinate !== yCoordinate
                    ) {
                        existingTable.tableNumber = tableNumber;
                        existingTable.xCoordinate = xCoordinate;
                        existingTable.yCoordinate = yCoordinate;
                        await existingTable.save();
                    }

                    delete existingTableMap[id];
                } else {
                    await Table.create({ tableNumber, xCoordinate, yCoordinate, restaurantId });
                }
            }

            for (let tableId in existingTableMap) {
                await existingTableMap[tableId].destroy();
            }

            return res.json({ message: "Tables synced successfully!" });
        } catch (error) {
            console.error("Error during table sync:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }
}

module.exports = new TableController();
