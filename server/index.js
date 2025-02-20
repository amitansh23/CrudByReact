import route from './routes/userRoute.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http ,{createServer} from 'http';
import {Server} from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { fileURLToPath } from "url";


const app= express();

const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Change to your React app URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("new-user", (email) => {
        console.log(`New user logged in: ${email}` );
        // io.emit("user-joined", `${username} has joined the chat`);
      });
  
    socket.on("message", (data) => {
      console.log("Message from client:", data);
      io.emit("message", data); // Broadcast to all clients
    });
  
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
  
  server.listen(5000, () => {
    console.log("Server is running on port 5000");
  });



app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:3000', credentials: true}));

dotenv.config();

app.use(session({
  name: 'sessionId',
    secret: 'Amitansh',
    
    
    // maxAge: 1000 * 60 * 60 * 1,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {maxAge: 1000 * 60 * 60 * 1,
    secure: false,
    httpOnly: true,
    }
  }));


app.use('/api',route);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log('Database connected');
        
    })
})


