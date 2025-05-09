import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

// This runs ONCE before any tests in this file
beforeAll( async () => {
    jest.setTimeout(10000);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mongoServer = await MongoMemoryServer.create(); // Start in-memory DB
    const uri = mongoServer.getUri(); // Get DB URI 
    await mongoose.connect(uri) // Connect Mongoose
})


afterAll(async () => {
    await mongoose.connection.close(); // Close Mongoose connection
    await mongoServer.stop(); // Shutdown in-memory DB
})

