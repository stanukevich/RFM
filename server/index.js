const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;

const sequelize = require("./database/database");
const createDatabaseIfNotExists = require("./database/createDatabaseIfNotExists")

const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const app = express();
app.use(cors("*"));
app.use(express.json());
app.use("/api", router);

// Обработка ошибок, последний Middleware
app.use(errorHandler);

const start = async () => {
    try {
        await createDatabaseIfNotExists();
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        
        app.listen(PORT, () => {
            console.log("SERVER STARTED ON PORT = " + PORT);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
