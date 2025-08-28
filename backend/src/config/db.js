import mongoose from "mongoose"
import {ENV} from "./env.js"

export const connectDB = async()=>{
    try {
        await mongoose.connect(ENV.MONGO_URL);
        console.log("connect sucessfully")
        
    } catch (error) {
        console.log("error connecting to mongoDB:",error)
        process.exit(1);
    }
}