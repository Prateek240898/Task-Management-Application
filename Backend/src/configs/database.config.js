import mongoose from "mongoose";

async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected : ${mongoose.connection.host}`);
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

export default connectDatabase;