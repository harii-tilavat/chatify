const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb Connected :- ", conn.connection.host);
    } catch (error) {
        console.log("Mongo DB Connection error. ", error);
    }
}
module.exports = { connectDB };