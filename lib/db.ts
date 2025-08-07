import mongoose from "mongoose"



const MONGODB_URI = process.env.MONGODB_URI
const connect = async () =>{
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
        console.log("Already connected to MongoDB");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting to MongoDB...");
        return;
    }

    try{
        mongoose.connect(MONGODB_URI!, {
            dbName: "feasai",
            bufferCommands: true,
        });
       
    }
     catch (error: unknown) {
            console.error("Error connecting to MongoDB:", error);
             throw new Error("Failed to connect to MongoDB");
        }
};
export default connect;
