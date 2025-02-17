import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import { setUser } from "../middleware/token.js";
import nodemailer from "nodemailer";
import fs from "fs";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import { DateTime } from "luxon";
import OTP from "../model/otpModel.js";
import { google } from "googleapis";
// import assert from "assert";
// import { MongoClient, ObjectId } from "mongodb";
// import csv from "csvtojson";
import userProfile from "../model/userProfile.js";

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
      address,
      phone,
    });


    return res.status(200).json({ msg: "Successfull", savedData });
  } catch (error) {
    res.status(404).json(error);
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

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }
    const time = { Updated_at: DateTime.now().toUTC().toISO() };
    const mergedObj = { ...req.body, ...time };

    const updateData = await User.findByIdAndUpdate(id, mergedObj, {
      new: true,
    });
    res.status(200).json({ msg: "User Updated", updateData });
  } catch (error) {
    res.status(404).json({ msg: "user not found" });
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

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid Login" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Incorrect password" });
    }

    const token = setUser(user);

    req.session.user = {
      user: user,
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

    const profile = await userProfile.findOne({ userId: user._id })
    console.log("Profile:", profile);
      

    return res.status(200).json({
      success: true,
      msg: "Login Successful",
      user,
      // token,
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
    const { fname, lname, email, password, address, phone, role } = req.body;
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
      address,
      phone,
      role,
    });

    return res.status(200).json({ msg: "Successfull", savedData });
  } catch (error) {
    res.status(404).json(error);
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
      // userId: req.session.user._id, // Convert to ObjectId
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

export const getlimiteddata = async (req, res) => {
  try {
    let { count, search } = req.query;
    count = parseInt(count) || 5;

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { fname: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    const totalItems = await User.countDocuments(filter); // Get total count
    const userData = await User.find(filter).limit(count).populate({
      path: "CreatedBy",
      // select: "fname"
    });

    res.status(200).json({ userData, total: totalItems });
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Error fetching data" });
  }
};

export const createEvent = async (req, res) => {
  const SCOPES = process.env.SCOPES;
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(
    new RegExp("\\\\n", "g"),
    "\n"
  );
  const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
  const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER;
  const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

  const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
  );

  const calendar = google.calendar({
    version: "v3",
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient,
  });

  var event = {
    summary: "My first event!",
    location: "Hyderabad,India",
    description: "First event with nodeJS!",
    start: {
      dateTime: "2025-03-04T09:00:00-07:00",
      timeZone: "Asia/Dhaka",
    },
    end: {
      dateTime: "2025-03-05T17:00:00-07:00",
      timeZone: "Asia/Dhaka",
    },
    attendees: [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.keyFile,
    scopes: "https://www.googleapis.com/auth/calendar",
  });
  auth.getClient().then((a) => {
    calendar.events.insert(
      {
        auth: a,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: event,
      },
      function (err, event) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        console.log("Event created");

        res.jsonp("Event successfully created!");
      }
    );
  });
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
