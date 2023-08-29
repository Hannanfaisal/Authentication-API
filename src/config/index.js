const dotenv = require("dotenv")
dotenv.config();

const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

module.exports = {
    PORT,
    CONNECTION_STRING,
    JWT_SECRET_KEY,
    EMAIL_HOST ,EMAIL_PORT, 
    EMAIL_USER, 
    EMAIL_PASS, 
    EMAIL_FROM
};