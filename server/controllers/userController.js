const ApiError = require("../error/ApiError");
const { User } = require("../models/models");

const bcrypt = require("bcrypt");

const saltRounds = parseInt(process.env.SALT_ROUNDS); 

class UserController {
    async registration(req, res, next) {
        const { username, email, password } = req.body;
        
        try {
            if (!username || !email || !password) {
                return next(ApiError.badRequest("Incorrect data!"));
            }
    
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                return next(ApiError.badRequest("User with this email already exists"));
            }
    
            const passwordHash = await bcrypt.hash(password, saltRounds);

            await User.create({ username, email, passwordHash });

            return res.json({ message: "User " + username + " successfully registered!" });
        } catch (error) {
            return next(error);
        }
    }
  
    async authenticate(req, res, next) {
        const { email, password } = req.body;
    
        try {
            if (!email || !password) {
                return next(ApiError.badRequest("Incorrect data!"));
            }
    
            const user = await User.findOne({
                where: { email }
            });
    
            if (!user) {
                return next(ApiError.notFound("User with specified email not found"));
            }
    
            const passwordMatch = await bcrypt.compare(password, user.passwordHash);
            if (!passwordMatch) {
                return next(ApiError.unauthorized("Incorrect password"));
            }
    
            return res.json({ message: "Authentication successful!", user });
        } catch (error) {
            console.error("Error during user authentication:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }
    

    async deleteUser(req, res, next) {
        const { email, userId } = req.body;

        try {
            if (!email && !userId) {
                return next(ApiError.badRequest("You need to specify an email or user ID for deletion"));
            }

            let user;
            if (email) {
                user = await User.findOne({ where: { email } });
            } else {
                user = await User.findByPk(userId);
            }

            if (!user) {
                return next(ApiError.notFound("User not found"));
            }

            await user.destroy();

            return res.json({ message: "User successfully deleted" });
        } catch (error) {
            console.error("Error while deleting user:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async updateUser(req, res, next) {
        const { userId, username, email, password } = req.body;

        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return next(ApiError.notFound("User not found"));
            }

            if (!username && !email && !password) {
                return next(ApiError.badRequest("No data provided for update"));
            }

            if (username) {
                user.username = username;
            }
            if (email) {
                user.email = email;
            }
            if (password) {
                user.passwordHash = await bcrypt.hash(password, saltRounds);
            }

            await user.save();

            return res.json({ message: "User data successfully updated", user });
        } catch (error) {
            console.error("Error while editing user data:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

    async getUserById(req, res, next) {
        const { userId } = req.body; 
        try {
            if (!userId) {
                return next(ApiError.badRequest("User ID is required"));
            }
    
            const user = await User.findOne({
                where: { id: userId }
            });
    
            if (!user) {
                return next(ApiError.notFound("User not found"));
            }
    
            return res.json({ user });
        } catch (error) {
            console.error("Error while fetching user data:", error);
            return next(ApiError.internal("Internal server error"));
        }
    }

}

module.exports = new UserController();
