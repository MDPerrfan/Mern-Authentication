import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from "./Config/mongodb.js";
import authRouter from './routes/authRoute.js'
import userRouter from "./routes/userRoute.js";
const app = express();
const port = process.env.PORT || 4000;
dotenv.config();
const allowedOrigins = [
    'http://localhost:5173',
    'https://mern-authentication-nu.vercel.app',
    'https://mern-authentication-1-5yjz.onrender.com'
]
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
connectDB()
    //API endpoints
app.get('/', (req, res) => {
    res.send("API working");
})


app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log("Server started!")
})