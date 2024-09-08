import mongoose, { mongo } from "mongoose";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Kết nối database thành công!");
    } catch (error) {
        console.log("Kết nối database thất bại!");
    }
}