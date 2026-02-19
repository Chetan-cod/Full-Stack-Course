import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://garg21154_db_user:Chetangarg%4044@cluster0.i8zplof.mongodb.net/Playingcards?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};
