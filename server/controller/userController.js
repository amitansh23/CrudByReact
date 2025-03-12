import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import { setUser } from "../middleware/token.js";
import nodemailer from "nodemailer";
import fs from "fs";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { DateTime } from "luxon";
import OTP from "../model/otpModel.js";
import { google } from "googleapis";

import { sendWelcomeEmail } from "../utils/emailService.js";

import userProfile from "../model/userProfile.js";
import path from "path";
import ejs from "ejs";
import mailSender from "../utils/mailSender.js";
import mongoose from "mongoose";
import { io } from "../index.js";
import Chat from "../model/chatModel.js";
import geoip from "geoip-lite";
// import IpLocation from "../model/iplocation.js";
import  { sendOTP } from "../utils/twilioService.js";
import PhoneOtp from "../model/PhoneOtp.js";
import excelJS from "exceljs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const create = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    const CreatedBy = req.user._id;
    // const userData= new User(req.body);
    if (!email) {
      return res.status(404).json({ msg: "User not Create" });
    }
    const saltRound = 10;
    const hashpassword = await bcrypt.hash(password, saltRound);
    const savedData = await User.create({
      fname,
      lname,
      email,
      password: hashpassword,
      CreatedBy,
    });

    return res.status(200).json({ msg: "Successfull", savedData });
  } catch (error) {
    res.status(404).json(error);
  }
};


export const registration = async (req, res) => {
  try {
    const { fname, lname, email, password, address, phone } = req.body;
    const superAdminEmail = "amitanshchaurasiya@gmail.com"; // Change this to actual SuperAdmin Email

    if (!fname || !lname || !email || !password || !address || !phone) {
          return res.status(403).json({
            success: false,
            message: 'All fields are required',
          });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User already Register',
          });
        }

    

    const saltRound = 10;
    const hashpassword = await bcrypt.hash(password, saltRound);

    const savedData = await User.create({
      fname,
      lname,
      email,
      password: hashpassword,
      address,
      phone,
    });



    // **Path for Welcome Email Template**
    const welcomeTemplatePath = path.join(__dirname, "../views/Welcomeuser.ejs");

    // **Path for SuperAdmin Notification Email Template**
    const adminTemplatePath = path.join(__dirname, "../views/AdminNotification.ejs");

    // **Render Welcome Email for User**
    ejs.renderFile(welcomeTemplatePath, { name: fname }, async (err, userHtml) => {
      if (err) {
        console.error("Error rendering User Welcome Email:", err);
        return res.status(500).json({ msg: "Error generating user email template" });
      }

      // **Email Configuration for User**
      const userMailOptions = {
        from: '"Welcome Team" <officialcheck1234@gmail.com>',
        to: email,
        subject: "Welcome to Our Platform!",
        html: userHtml,
      };

      // **Render Admin Notification Email**
      ejs.renderFile(
        adminTemplatePath,
        { fname, lname, email, phone, address, createdAt: new Date().toLocaleString() },
        async (err, adminHtml) => {
          if (err) {
            console.error("Error rendering Admin Email:", err);
            return res.status(500).json({ msg: "Error generating admin email template" });
          }

          // **Email Configuration for SuperAdmin**
          const adminMailOptions = {
            from: '"New User Notification" <officialcheck1234@gmail.com>',
            to: superAdminEmail,
            subject: "New User Registered on the Platform",
            html: adminHtml,
          };


          try {
            // **Send Emails**
            await sendWelcomeEmail(userMailOptions); // Send User Welcome Email
            await sendWelcomeEmail(adminMailOptions); // Send SuperAdmin Notification Email

            return res.status(200).json({ msg: "User Registered & Emails Sent", savedData });
          } catch (emailError) {
            console.error("Error sending emails:", emailError);
            return res.status(500).json({ msg: "User registered, but emails not sent" });
          }
        }
      );
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};



export const getall = async (req, res) => {
  try {
    const userData = await User.find({ status: 1 });
    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const tauth = async (req, res, next) => {
  try {
    if (req.headers) {
      console.log(req.headers);
    }
  } catch (error) {}
};

export const getbyname = async (req, res) => {
  try {
    const fname = req.params.fname;
    const userData = await User.find({ fname: fname });
    if (!userData) {
      return res.status(404).json({ msg: "User not exisr" });
    }
    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

export const getbyid = async (req, res) => {
  try {
    const id = req.params.id;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { updatedByEmail, ...userData } = req.body; // 🛠 Extract `updatedByEmail` & user data

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const time = { Updated_at: DateTime.now().toUTC().toISO(), UpdatedBy: updatedByEmail };
    const mergedObj = { ...userData, ...time }; 

    const updateData = await User.findByIdAndUpdate(id, mergedObj, { new: true });
    
    res.status(200).json({ msg: "User Updated", updateData });
  } catch (error) {
    res.status(500).json({ msg: "Error updating user", error });
  }
};


export const deleteuser = async (req, res) => {
  try {
    const id = req.params.id;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(400).json({ msg: "User not found" });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    res.status(404).json({ msg: "User not found" });
  }
};









export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid Login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Incorrect password" });
    }

    const token = setUser(user);

    req.session.user = {
      _id: user._id, 
      email: user.email,
      token: token,
      isLoggedIn: true,
    };

    try {
      await req.session.save();
      console.log("Session saved successfully");
    } catch (error) {
      console.error("Error setting session:", error);
      return next(new Error("Error creating user session"));
    }
    const profile = await userProfile.findOne({ userId: new mongoose.Types.ObjectId(user._id) });

    return res.status(200).json({
      success: true,
      msg: "Login Successful",
      user,
      profile,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, msg: "Something went wrong" });
  }
};






export const softdelete = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: 0,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, msg: "User Remove successfully", user });
  } catch (error) {
    res.status(200).json({ msg: "Soft delete not perform" });
  }
};

export const restore = async (req, res) => {
  try {
    const userData = await User.find({ status: 0 });
    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const backup = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: 1,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, msg: "User Restore successfully", user });
  } catch (error) {
    res.status(200).json({ msg: "Soft delete not perform" });
  }
};

export const store_location = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location data is required" });
    }
    console.log("User Location:", latitude, longitude);
    const userLocation = { latitude, longitude };

    res
      .status(200)
      .json({ message: "Location stored successfully", userLocation });
  } catch (error) {
    res.status(404).json(error);
  }
};

async function mailsend(email) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const readFileAsync = promisify(fs.readFile);
  const htmlTemplate = await readFileAsync("Public\\Mailtemp.html", "utf-8");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "officialcheck1234@gmail.com",
      pass: process.env.SKEY,
    },
  });

  const info = await transporter.sendMail({
    from: '" 👋😊 "<officialcheck1234@gmail.com>', // sender address
    to: "", // list of receivers
    subject: "Registration", // Subject line
    text: "Hello world?", // plain text body
    html: htmlTemplate,
    attachments: [
      {
        filename: "download (2).jpeg",
        path: path.join(__dirname, "./download (2).jpeg"),
        cid: "logo",
      },

      {
        filename: "document.pdf",
        path: path.join(__dirname, "document.pdf"), // Path to the PDF file
        contentType: "application/pdf",
      },
    ], // html body
  });

  console.log("Message sent: %s", info.messageId);
}



export const regis = async (req, res) => {
  try {
    const { fname, lname, email, password, address, phone, birthday, unsubscribe, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and Password are required" });
    }

    // ✅ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, msg: "User already exists" });
    }

    // ✅ Hash password
    const saltRound = 10;
    const hashpassword = await bcrypt.hash(password, saltRound);

    // ✅ Create new user
    const newUser = new User({
      fname,
      lname,
      email,
      password: hashpassword,
      address,
      phone,
      role: role || 2, // ✅ Default role: User (2)
      birthday,
      unsubscribe,
    });

    await newUser.save();

    return res.status(201).json({ success: true, msg: "User registered successfully", user: newUser });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const forgotpassword = async (req, res) => {
  const { email } = req.body;
  const { otp } = req.body;
  const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
  if (response.length === 0 || otp !== response[0].otp) {
    return res.status(400).json({
      success: false,
      message: "The OTP is not valid",
    });
  }
  return res.status(200).json({ msg: "OTP verified", email });
};

export const updatepassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.updateOne(
      { email }, // Find user by email
      { $set: { password: hashPassword } } // Update only password
    );

    if (updatedUser.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or password already updated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the password",
      error: error.message,
    });
  }
};

export const uploadfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded", status: "error" });
    }
  //   if (!req.session?.user?._id) {
  //     return res.status(401).json({ msg: "Unauthorized: User not logged in", status: "error" });
  // }

    
    console.log("Multer", req?.file?.filename);
    console.log("Connected successfully to database");



    const result = await userProfile.insertOne({
      filename: req?.file?.filename,
      userId: req.user._id, // Convert to ObjectId
      uploadedAt: new Date(),
    });
    

    res
      .status(200)
      .json({
        msg: "File uploaded and filename stored successfully",
        status: "success",
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error", status: "error" });
  }
};


export const uploadMultiFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "No files uploaded", status: "error" });
    }

    console.log("Multer Files:", req.files.map(file => file.filename));

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      userId: req.user._id,
      uploadedAt: new Date(),
    }));

    await userProfile.insertMany(uploadedFiles);

    res.status(200).json({
      msg: "Files uploaded and stored successfully",
      status: "success",
      uploadedFiles
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error", status: "error" });
  }
};


export const getMultiFiles = async (req, res) => {
    try {
      const userId = req.user._id; // ✅ Get user ID from session
  
      const images = await userProfile.find({ userId });
  
      if (!images || images.length === 0) {
        return res.status(404).json({ msg: "No images found", success: false });
      }
  
      // ✅ Create URLs for all images
      const imageUrls = images.map(img => `http://localhost:8000/uploads/${img.filename}`);
  
      res.status(200).json({ images: imageUrls });
  
    } catch (error) {
      console.error("Error fetching user images:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
};


// export const getlimiteddata = async (req, res) => {
//   try {
//     let { count, search } = req.query;
//     count = parseInt(count) || 5;
//     const sortField = req.query.sortField || "Created_at";
//     const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
//     const role = req.query.role || "all";


//     let filter = {};
//     if (search) {
//         const searchWords = search.split(" ").filter(word => word.trim() !== "");
//       filter.$or = searchWords.map(word => ({
//         $or: [
//           { fname: { $regex: word, $options: "i" } },
//           { email: { $regex: word, $options: "i" } },
//         ],
//       }));
      
//     }

//     if(role && ["0","1","2"].includes(role)){
//       filter.role = parseInt(role);
//     }

//     const totalItems = await User.countDocuments(filter); // Get total count
//     const userData = await User.find(filter).limit(count).populate({
//       path: "CreatedBy",
//       // select: "fname"
//     }).sort({ [sortField]: sortOrder });

//     res.status(200).json({ userData, total: totalItems });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ msg: "Error fetching data" });
//   }
// };

// export const getlimiteddata = async (req, res) => {
//   try {
//     let { page, limit, search, sortField, sortOrder, role } = req.query;

//     page = parseInt(page) || 1; // Default to page 1
//     limit = parseInt(limit) || 5; // Default limit per page
//     const skip = (page - 1) * limit; // Calculate how many records to skip

//     sortField = sortField || "Created_at"; // Default sorting field
//     sortOrder = sortOrder === "asc" ? 1 : -1; // Sorting order

//     let filter = {};
    
//     // Search filter
//     if (search) {
//       const searchWords = search.split(" ").filter(word => word.trim() !== "");
//       filter.$or = searchWords.map(word => ({
//         $or: [
//           { fname: { $regex: word, $options: "i" } },
//           { email: { $regex: word, $options: "i" } },
//         ],
//       }));
//     }

//     // Role filter
//     if (role && ["0", "1", "2"].includes(role)) {
//       filter.role = parseInt(role);
//     }

//     // Get total number of documents for pagination
//     const totalItems = await User.countDocuments(filter);
//     const totalPages = Math.ceil(totalItems / limit); // Calculate total pages

//     // Fetch paginated user data
//     const userData = await User.find(filter)
//       .sort({ [sortField]: sortOrder })
//       .skip(skip)
//       .limit(limit)
//       .populate({
//         path: "CreatedBy",
//       });

//     res.status(200).json({ 
//       userData, 
//       total: totalItems, 
//       totalPages, 
//       currentPage: page 
//     });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ msg: "Error fetching data" });
//   }
// };

// export const getlimiteddata = async (req, res) => {
//   try {
//     let { page, limit, search, sortField, sortOrder, role } = req.query;

//     page = parseInt(page) > 0 ? parseInt(page) : 1; // Ensure valid page number
//     limit = parseInt(limit) > 0 ? parseInt(limit) : 5; // Default limit per page
//     const skip = (page - 1) * limit;

//     sortField = sortField || "Created_at";
//     sortOrder = sortOrder === "asc" ? 1 : -1;

//     let filter = {};

//     // ✅ Search Filter
//     if (search) {
//       const searchRegex = new RegExp(search, "i"); // Case-insensitive regex
//       filter.$or = [{ fname: searchRegex }, { email: searchRegex }];
//     }

//     // ✅ Role Filter
//     if (role && ["0", "1", "2"].includes(role)) {
//       filter.role = parseInt(role);
//     }

//     // ✅ Get total count for pagination
//     const totalItems = await User.countDocuments(filter);
//     const totalPages = Math.ceil(totalItems / limit);

//     // ✅ Fetch filtered & paginated data
//     const userData = await User.find(filter)
//       .sort({ [sortField]: sortOrder })
//       .skip(skip)
//       .limit(limit)
//       .populate({ path: "CreatedBy" });

//     res.status(200).json({
//       success: true,
//       userData,
//       total: totalItems,
//       totalPages,
//       currentPage: page,
//     });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ success: false, msg: "Error fetching data" });
//   }
// };





export const getlimiteddata = async (req, res) => {
  try {
    let { page, count, search, sortField, sortOrder, role } = req.query;

    page = parseInt(page) > 0 ? parseInt(page) : 1; // Ensure valid page number
    // limit = parseInt(count) > 0 ? parseInt(count) : 5; // Default limit per page
    // console.log("Limit:", limit);
    const skip = (page - 1) * count;

    sortField = sortField || "Created_at";
    sortOrder = sortOrder === "asc" ? 1 : -1;

    let filter = {};

    
    if (search) {
      const searchRegex = new RegExp(search, "i"); 
      filter.$or = [{ fname: searchRegex }, { email: searchRegex }];
    }

    
    if (role && ["0", "1", "2"].includes(role)) {
      filter.role = parseInt(role);
    }

   
    const totalItems = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / count);

    
    const userData = await User.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(count)
      .populate({ path: "CreatedBy" });

    res.status(200).json({
      success: true,
      userData,
      total: totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: count, 
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, msg: "Error fetching data" });
  }
};








export const createEvent = async (req, res) => {
  try {
    const { eventName, location, description, startDateTime, endDateTime , usermail} = req.body;

    if (!eventName || !startDateTime || !endDateTime || !description || !location) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      null,
      GOOGLE_PRIVATE_KEY,
      ["https://www.googleapis.com/auth/calendar.events"]
    );

    await jwtClient.authorize(); // 🔥 Ensure client is authorized before making requests

    const calendar = google.calendar({ version: "v3", auth: jwtClient });

    const event = {
      summary: eventName,
      location: location,
      description: description,
      start: {
        dateTime: startDateTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Asia/Kolkata",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 30 },
          { method: "popup", minutes: 10 },
        ],
      },
    //   attendees: [
    //     {email: 'amitanshchaurasia@gmail.com'},
    // ]
      
    };

    
    const response =  calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      resource: event,
      sendUpdates: 'all', 
    });

    res.status(200).json({ msg: "Event successfully created!" });

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ msg: "Failed to create event", error: error.message });
  }
};




export const logout = async (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, msg: "Logout failed" });
      }
      res.clearCookie("example"); // Ensure the session cookie is cleared
      return res.status(200).json({ success: true, msg: "Logout successful" });
    });
  } else {
    return res.status(400).json({ success: false, msg: "No active session" });
  }
};


export const getUserProfile = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }

    const userId = req.user._id;
   

    const profile = await userProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const unsubscribe = async(req,res)=> {
  try {
      await User.findByIdAndUpdate(req.params.id, { unsubscribe: true });
      res.send("You have successfully unsubscribed.");
  } catch (error) {
      res.status(500).send("Error unsubscribing.");
  }
};



export const getUsersByRole = async (req, res) => {
  try {
    const { roles } = req.query;

    if (!roles) {
      return res.status(400).json({ success: false, msg: "Roles parameter is required" });
    }

    const roleArray = roles.split(",").map(Number);

    const users = await User.find({ role: { $in: roleArray } }).select("fname lname email role");

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};



export const adminid = async (req, res) => {
  try {
      const admin = await User.findById(req.params.id);
      if (!admin) {
          return res.status(404).json({ msg: "Admin not found" });
      }
      res.json({ socketId: admin.socketId });
  } catch (error) {
      res.status(500).json({ msg: "Server Error" });
  }
};




export const sendMessages =  async (req, res) => {
  try {
      const { senderId, receiverId, message } = req.body;

      const chatMessage = new Chat({
          senderId,
          receiverId,
          message,
      });

      await chatMessage.save();
      res.status(200).json({ success: true, msg: "Message Saved" });
  } catch (error) {
      res.status(500).json({ success: false, msg: "Message not saved" });
  }
};


export const getMessages = async (req, res) => {
  try {
      const { senderId, receiverId } = req.params;

      const messages = await Chat.find({
          $or: [
              { senderId, receiverId },
              { senderId: receiverId, receiverId: senderId },
          ],
      }).sort({ timestamp: 1 });

      res.status(200).json({ success: true, messages });
  } catch (error) {
      res.status(500).json({ success: false, msg: "Error loading messages" });
  }
};



// Generate and send OTP
export const send_otp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
      return res.status(400).json({ success: false, msg: "Phone number is required" });
  }

  try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP in database
      await PhoneOtp.create({ phoneNumber, otp });

      // Send OTP using Twilio
      const response = await sendOTP(phoneNumber, otp);

      if (!response.success) {
          return res.status(500).json({ success: false, msg: "Failed to send OTP" });
      }

      res.status(200).json({ success: true, msg: "OTP sent successfully" });
  } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ success: false, msg: "Error sending OTP" });
  }
};

export const verifyotp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, msg: "Phone number and OTP are required" });
  }

  try {
      // Find the latest OTP for the given phone number
      const otpRecord = await PhoneOtp.findOne({ phoneNumber }).sort({ createdAt: -1 });

      if (!otpRecord || otpRecord.otp !== otp) {
          return res.status(400).json({ success: false, msg: "Invalid or expired OTP" });
      }

      // OTP is valid - Delete it after verification
      await PhoneOtp.deleteOne({ _id: otpRecord._id });

      res.status(200).json({ success: true, msg: "OTP verified successfully" });
  } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ success: false, msg: "Error verifying OTP" });
  }
};



// export const excel =  async (req, res) => {
//   try {
//     const users = await User.find().populate("CreatedBy", "fname lname");

//     // Create a new Excel Workbook
//     const workbook = new excelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Users Data");

//     // Define columns
//     worksheet.columns = [
//         { header: "Name", key: "name", width: 35 },
//         { header: "Email", key: "email", width: 35 },
//         { header: "Role", key: "role", width: 35 },
//         { header: "Created By", key: "createdBy", width: 35 },
//     ];
//     // STYLING
//     worksheet.getRow(1).eachCell((cell) => {
//       cell.fill = {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "000000" }, 
//       };
    
//       cell.font = {
//         bold: true,
//         color: { argb: "FFFFFF" }, 
//         size: 12,
//       };
    
//       cell.alignment = { horizontal: "center", vertical: "middle" }; 
//     });

//     // Add data rows
//     users.forEach(user => {
//         worksheet.addRow({
//             name: `${user.fname} ${user.lname}`,
//             email: user.email,
//             role: user.role === 1 ? "Admin" : user.role === 0 ? "SuperAdmin" : "User",
//             createdBy: user?.CreatedBy ? `${user.CreatedBy.fname} ${user.CreatedBy.lname}` : "NA"
//         });
//     });

//     // Create file path
//     const filePath = path.join(__dirname, "../exports", "Users_Data.xlsx");

//     // Ensure directory exists
//     if (!fs.existsSync(path.dirname(filePath))) {
//         fs.mkdirSync(path.dirname(filePath), { recursive: true });
//     }

//     // Write file to disk and send response
//     await workbook.xlsx.writeFile(filePath);
//     res.download(filePath, "Users_Data.xlsx", (err) => {
//         if (err) {
//             console.error("File Download Error:", err);
//             res.status(500).json({ success: false, msg: "Error downloading file" });
//         }

//         // Delete file after sending (optional)
//         setTimeout(() => fs.unlinkSync(filePath), 5000);
//     });

// } catch (error) {
//     console.error("Excel Export Error:", error);
//     res.status(500).json({ success: false, msg: "Failed to export Excel file" });
// }
// };

export const excel = async (req, res) => {
  try {
    const { search, role, sortField, sortOrder } = req.query;

    let filter = {};
    if (role !== undefined && role !== "") {
      const roleNumber = Number(role);
      if (!isNaN(roleNumber)) {
        filter.role = roleNumber;
      }
    }
    if (search) {
      filter.$or = [
        { fname: { $regex: search, $options: "i" } },
        { lname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    let users = await User.find(filter)
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .select("fname lname email role CreatedBy");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users Data");

    worksheet.columns = [
      { header: "S.NO.", key: "index", width: 25 },
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Role", key: "role", width: 25 },
      { header: "Created By", key: "createdBy", width: 25 },
    ];

    users.forEach((user, index) => {
      worksheet.addRow({
        index: index + 1,
        name: `${user.fname} ${user.lname}`,
        email: user.email,
        role: user.role === 1 ? "Admin" : user.role === 0 ? "SuperAdmin" : "User",
        createdBy: user.CreatedBy?.fname || "NA",
      });
    });

   
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "00000000" } };
      cell.alignment = { horizontal: "center" };
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Filtered_Users_Data.xlsx"
    );
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
