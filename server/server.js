import express from "express";
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from "./Config/mongodb.js";
import authRouter from './routes/authRoute.js'
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    Credential: true
}));
connectDB()
    //API endpoints
app.get('/', (req, res) => {
    res.send("API working");
})
app.use('/api/auth', authRouter)
app.listen(port, () => {
    console.log("Server started!")
})