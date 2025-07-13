import mongoose from "mongoose";
let isConnected = false;
export const connectToDB = async () => {
    mongoose.set("strictQuery", false);
    if (!process.env.MONGODB_URI) {
        console.log("MONGODB_URI not found in .env file");
        return
    }
    if (isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }


    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        isConnected = true
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};