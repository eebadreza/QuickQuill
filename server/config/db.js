const mongoose = require('mongoose');
mongoose.set({ strictQuery: false });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`Database Connected ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;
