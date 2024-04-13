import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connect to database success");
    } catch (error) {
        console.log("Error to conect to database : ",error );
    }
}