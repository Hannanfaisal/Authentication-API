const dotenv = require("dotenv")
dotenv.config();

const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = {
    PORT,
    CONNECTION_STRING,
    JWT_SECRET_KEY
};