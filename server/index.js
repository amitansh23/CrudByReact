import route from './routes/userRoute.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


const app= express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
app.use('/api',route);


const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log('Database connected');
        
    })
})
