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
import cron from 'node-cron';
import nodemailer from 'nodemailer'
import userModel from './model/userModel.js';


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



app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log('Database connected');
        
    })
})


app.use("/uploads", express.static("uploads")); 


// Get the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));





const sendBirthdayEmail = async () => {
  try {
    const today = new Date()

   
    const usersWithBirthdayToday = await userModel.find({
      $expr: {
          $and: [
              { $eq: [{ $dayOfMonth: "$birthday" }, today.getDate()] },
              { $eq: [{ $month: "$birthday" }, today.getMonth() + 1] } 
          ]
      }
  });

  if (usersWithBirthdayToday.length > 0) {
      let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: "officialcheck1234@gmail.com",
              pass: process.env.SKEY
          }
      });

      for (let user of usersWithBirthdayToday) {
          let messageOptions = {
              from: 'officialcheck1234@gmail.com',
              to: user.email,
              subject: `Happy Birthday, ${user.fname}! 🎉`,
              text: `Dear ${user.fname},\n\nWishing you a very Happy Birthday! 🎂🎉 Have a wonderful day!\n\nBest Regards,\n Team`
          };

          await transporter.sendMail(messageOptions);
          console.log(`Birthday email sent to: ${user.email}`);
      }
  } else {
      console.log(" No birthdays today.");
  }

} catch (error) {
  console.error("Error sending birthday emails:", error);
}
};
// cron.schedule("49 13 * * *", sendBirthdayEmail);

