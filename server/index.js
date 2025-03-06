import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import nodemailer from "nodemailer";
import userModel from "./model/userModel.js";
import route from "./routes/userRoute.js";

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ CORS Setup (API & Socket.io)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    name: "sessionId",
    secret: "Amitansh",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, collectionName: "sessions" }),
    cookie: { maxAge: 1000 * 60 * 60 * 1, secure: false, httpOnly: true },
}));

// ✅ Static File Handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connection
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Socket.io Setup (Fixed Configuration)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    },
    pingInterval: 25000, // ✅ Every 25 sec server ping karega
    pingTimeout: 60000   // ✅ 60 sec tak response na mile to disconnect karega
});

app.set("io", io)



// ✅ Store Connected Users in a Map
const onlineUsers = new Map();

// ✅ Handle Socket.io Connection
io.on("connection", (socket) => {
    console.log(`🔵 New User Connected: ${socket.id}`);

    socket.on("join", async ({ userId }) => {
        const user = await userModel.findById(userId);
        if (!user) return;

        
        if (user.role === 1 || user.role === 0) {
            socket.join("admins");
            console.log(`✅ Admin ${userId} joined 'admins' room`);
        }


       
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
    });

    




    socket.on("admin-join", (adminId) => {
        socket.join("admins"); // ✅ Admins Room
        console.log(`🟢 Admin ${adminId} joined`);
    });

    

    socket.emit("msg", "mhjh")
    socket.emit("hii", "hii")
    socket.emit("kaiseho", "kaise ho??")
    
    socket.on("userLoggedIn", (data) => {
       
            console.log(" User Logged In", data.user);
    
           if(socket){
            io.emit("login", {name:data.user} );
            console.log("user login....")
           }
    
       
    });

    socket.on("Update", async(data)=>{
        console.log("update",data?.userid)
        const user = await userModel.findById(data?.userid)
        if(user){
            const usersoc= user.socketId;
            console.log(usersoc)
            socket.to(usersoc).emit("updatedata","Profile Update")
        }

    })
    
    
    
  
    socket.on("private-message", async ({ senderId, receiverId, message }) => {
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-message", { senderId, message });
        }
    });
    

    // ✅ Handle User Disconnect
    // socket.on("disconnect", async () => {
    //     console.log(`🔴 User Disconnected: ${socket.id}`);

        // ✅ Find User by Socket ID & Remove It
//         const user = await userModel.findOneAndUpdate(
//             { socketId: socket.id },
//             { socketId: "" },
//             { new: true }
//         );

//         if (user) {
//             onlineUsers.delete(user._id.toString());
//             console.log(`✅ Removed socketId for user ${user._id}`);
//         }
//     });
});

export {io};


app.use("/api", route);



const sendBirthdayEmail = async () => {
    try {
        const today = new Date();
        const usersWithBirthdayToday = await userModel.find({
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: "$birthday" }, today.getDate()] },
                    { $eq: [{ $month: "$birthday" }, today.getMonth() + 1] },
                ],
            },
        });

        if (usersWithBirthdayToday.length > 0) {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: "officialcheck1234@gmail.com", pass: process.env.SKEY },
            });

            for (let user of usersWithBirthdayToday) {
                let messageOptions = {
                    from: "officialcheck1234@gmail.com",
                    to: user.email,
                    subject: `Happy Birthday, ${user.fname}! 🎉`,
                    text: `Dear ${user.fname},\n\nWishing you a very Happy Birthday! 🎂🎉 Have a wonderful day!\n\nBest Regards,\nTeam`,
                };

                await transporter.sendMail(messageOptions);
                console.log(`🎉 Birthday email sent to: ${user.email}`);
            }
        } else {
            console.log("❌ No birthdays today.");
        }
    } catch (error) {
        console.error("❌ Error sending birthday emails:", error);
    }
};


// cron.schedule("0 0 * * *", sendBirthdayEmail);



