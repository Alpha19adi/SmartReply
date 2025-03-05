import mongoose from 'mongoose';


let isConnected= false;

export const connectDb = async () => {
    if(isConnected){
        console.log("Using existing connection");
        return;
    }

    try {
        if (!process.env.MongoDB_URL) {
            throw new Error("MongoDB URL is not defined");
        }
        await mongoose.connect(process.env.MongoDB_URL);
        isConnected = true;
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error connecting to DB", error);
    }
}