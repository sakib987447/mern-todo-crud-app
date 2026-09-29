import express from "express";
import dotenv from "dotenv";
import dns from "node:dns";
import cors from "cors"
import mongoose from "mongoose";
import todoroutes from "./routes/todoroutes.js"

dns.setServers(["1.1.1.1"]);

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());



const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDb is connected");
    } catch (error) {
        console.error("Mongo db connection is failed", error.message);
    }
};

connectDb();

app.use("/api/todos", todoroutes);
// app.get("/", (req, res) => {
//     res.send("hello this is the home page");
// })
app.listen(PORT, () => {
    console.log(`Server running on:${PORT}`);
});
