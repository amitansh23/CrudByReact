import route from './routes/userRoute.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http ,{createServer} from 'http';
import {Server} from 'socket.io';

// import path from 'path';




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
app.use(cors());
dotenv.config();
app.use('/api',route);



app.use(express.urlencoded({ extended: false }));





const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log('Database connected');
        
    })
})
