import mongoose from "mongoose";

let isConnected = false; // Track the connection status

// Create a connection to MongoDB
export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('Already connected to the database');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "promptopia", // Optional: specify the database name here
        });
        isConnected = true;
        console.log('Connected to the database');

        // Optional: Add event listeners for better monitoring
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
            isConnected = false;
        });

    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1); // Exit the process with a failure code
    }
};
