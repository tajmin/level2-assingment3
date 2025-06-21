import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

const PORT = 5000;

let server: Server;

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://dbadmin:dbadmin@cluster0.7xlcz.mongodb.net/librarydb?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB Using Mongoose!!");
    server = app.listen(PORT, () => {
      console.log(`on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
