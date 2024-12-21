import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const getConnectionString = () => {
    let connectionURL;
    if (process.env.NODE_ENV === 'development') {
        connectionURL = process.env.DATABASE_LOCAL;
        if (!connectionURL) {
            throw new Error('DATABASE_LOCAL environment variable is not defined.');
        }
        connectionURL = connectionURL.replace('<username>', process.env.DATABASE_LOCAL_USERNAME);
        connectionURL = connectionURL.replace('<password>', process.env.DATABASE_LOCAL_PASSWORD);
    } else {
        connectionURL = process.env.DATABASE_PROD;
        if (!connectionURL) {
            throw new Error('DATABASE_PROD environment variable is not defined.');
        }
    }
    return connectionURL;
};

const connectDB = async () => {
    const mongoURL = getConnectionString();
    let retries = 5; // Number of retries
    let connected = false;

    while (retries > 0 && !connected) {
        try {
            console.log(`Connecting to the database... Attempt ${6 - retries} of 5`);
            await mongoose.connect(mongoURL, { dbName: process.env.DB_NAME });
            console.log('Connected to the database.');
            connected = true;
        } catch (error) {
            console.error('Error connecting to the database:', error);
            retries--;
            if (retries > 0) {
                console.log(`Retrying connection in 5 seconds... (${retries} retries remaining)`);
                await new Promise(resolve => setTimeout(resolve, 7000)); // Wait for 5 seconds before retrying
            } else {
                throw error; // Throw error if retries are exhausted
            }
        }
    }
};

export default connectDB;