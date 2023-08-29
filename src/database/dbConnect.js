const mongoose = require("mongoose");

const dbConnect = async(url) =>{
    try {
        const conn = await mongoose.connect(url);
        console.log(`Connection successful to host: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error is: ${error}`);
    }
}

module.exports = dbConnect;