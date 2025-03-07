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
import Chat from "./model/chatModel.js";
import requestIp from "request-ip";
import iplocation from "./model/iplocation.js";


dotenv.config();

const app = express();
const server = createServer(app);


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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

server.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});


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
        if (userId) {
            onlineUsers.set(userId, socket.id);
            await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            console.log(`User ${userId} is online with Socket ID: ${socket.id}`);
        }
    });

    




    socket.on("admin-join", (adminId) => {
        socket.join("admins"); // ✅ Admins Room
        console.log(`🟢 Admin ${adminId} joined`);
    });

    

    // socket.emit("msg", "mhjh")
    // socket.emit("hii", "hii")
    // socket.emit("kaiseho", "kaise ho??")
    
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
    
    
    
    socket.on("private-message", ({ senderSocketId, receiverSocketId, message }) => {
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-message", { senderSocketId, message });
        }
    });
    
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
                    subject: `Happy Birthday, ${user.fname}!`,
                    text: `Dear ${user.fname},\n\nWishing you a very Happy Birthday!  Have a wonderful day!\n\nBest Regards,\nTeam`,
                };

                await transporter.sendMail(messageOptions);
                console.log(` Birthday email sent to: ${user.email}`);
            }
        } else {
            console.log("No birthdays today.");
        }
    } catch (error) {
        console.error("Error sending birthday emails:", error);
    }
};


// cron.schedule("0 0 * * *", sendBirthdayEmail);

app.use(requestIp.mw());

app.use(async (req, res, next) => {
    const clientIp = req.clientIp || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    
    if (!clientIp) {
        console.error("❌ No IP detected");
        return res.status(400).json({ success: false, msg: "IP Address not found" });
    }

    console.log("✅ Client IP:", clientIp);
    
    // ✅ Proceed to next middleware or route
    next();
});

app.use(async (req, res, next) => {
    const clientIp = req.clientIp || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (!clientIp) return res.status(400).json({ success: false, msg: "IP Address not found" });

    console.log("Client IP:", clientIp);

    try {
        const { data } = await axios.get(`https://ipapi.co/${clientIp}/json/`);
        console.log("Fetched IP Data:", data);

        const newIpLocation = new iplocation({
            ipAddress: clientIp,
            country: data.country_name || "Unknown",
            city: data.city || "Unknown",
            latitude: data.latitude || 0,
            longitude: data.longitude || 0
        });

        await newIpLocation.save();
        console.log(" Data stored in MongoDB:", newIpLocation);
    } catch (error) {
        console.error("Error storing IP:", error);
    }

    next(); // Continue processing request
});