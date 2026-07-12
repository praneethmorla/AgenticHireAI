import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  mongoose.set("strictQuery", true);
  try {
    console.log(`Connecting to database at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Database connection successful!");
  } catch (error) {
    console.error(`Failed to connect to MONGODB_URI: ${error.message}`);
    
    const fallbackUri = "mongodb://localhost:27017/agentichire";
    if (uri !== fallbackUri) {
      console.log(`Attempting fallback to local database: ${fallbackUri}...`);
      try {
        await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 3000 });
        console.log("Successfully connected to local MongoDB fallback!");
        return;
      } catch (fallbackError) {
        console.error("Local fallback also failed:", fallbackError.message);
      }
    }
    throw error;
  }
}
