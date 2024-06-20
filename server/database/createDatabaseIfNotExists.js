const { Sequelize } = require("sequelize");

const createDatabaseIfNotExists = async () => {
    try {
        const dbName = process.env.DB_NAME;
        const sequelizeInstance = new Sequelize("", process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: "mysql",
            logging: false 
        });

        await sequelizeInstance.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`Database '${dbName}' created or successfully checked.`);

        await sequelizeInstance.close();

        const sequelize = new Sequelize(dbName, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: "mysql",
            logging: false 
        });
        
    } catch (error) {
        console.error("Error while creating or checking database:", error);
    }
};

module.exports = createDatabaseIfNotExists;
