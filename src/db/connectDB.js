import mongoose from "mongoose";

const MAX_RETRIES = 5; // Maximum retry attempts
const RETRY_DELAY = 5000; // Delay between retries (in ms)

async function connectDB() {
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        try {
            console.log(`Attempting to connect to the database (Attempt ${attempts + 1}/${MAX_RETRIES})...`);
            const connection = await mongoose.connect(process.env.DATABASE_LOCAL);
            console.log(`MongoDB connected: ${connection.connection.host}`);
            return; // Exit the function once connected
        } catch (error) {
            attempts++;
            console.error(`Database connection failed. Error: ${error.message}`);
            if (attempts < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            } else {
                console.error("Maximum retry attempts reached. Exiting the application.");
                process.exit(1);
            }
        }
    }
}

export default connectDB;
