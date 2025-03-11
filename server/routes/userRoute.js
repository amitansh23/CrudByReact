import express from 'express';
import {create, getall, getbyname, getbyid, update, deleteuser, login, tauth, softdelete, restore, backup, registration, regis, forgotpassword, updatepassword, uploadfile, getlimiteddata, createEvent, logout, getUserProfile, uploadMultiFiles, getMultiFiles,unsubscribe, getUsersByRole,adminid, sendMessages, getMessages, verifyotp, send_otp, excel} from '../controller/userController.js';
const route = express.Router();
import { book, available_slots } from '../HotelController/hotel.js'; 

import signup from '../controller/authController.js';
import multer from 'multer';
import { getUser } from '../middleware/token.js';
import registrationotp from '../controller/RegistrationotpController.js';
import forgetotp from '../controller/ForgetotpController.js';
import { isAdmin } from '../middleware/token.js';


const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, JPG, PNG) are allowed"), false);
    }
};
var filename = null;
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
        filename = Date.now() + "-" + file.originalname;
        cb(null, filename);
    },
});

var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});
var multipleUpload = upload.array("files", 3);




route.post('/create', create);
route.get('/getall',getUser,getall);
route.get('/getbyname/:fname',getbyname);
route.get('/getbyid/:id',getbyid);
route.put('/update/:id',update);
route.patch('/deleteuser/:id',deleteuser);
route.post('/login',login);
route.post('/auth',tauth);
route.put('/softdelete/:id',softdelete);
route.get('/restore',restore);
route.put('/backup/:id',backup);
route.post('/registration',registration);
route.post('/regis',regis)

route.post('/forgetotp', forgetotp);
route.post('/registrationotp', registrationotp);
route.post('/signup', signup);

route.post('/forgotpassword', forgotpassword);
route.put('/updatepassword', updatepassword);
route.post('/uploadfile', upload.single("file"),getUser ,uploadfile)
route.post('/uploadmultifile', multipleUpload, getUser, uploadMultiFiles);

route.get('/getlimiteddata', getUser,getlimiteddata)

route.post('/createEvent',getUser, createEvent);

route.post('/logout', logout);


route.get("/getUserProfile",getUser, getUserProfile);
route.get("/getmultifile",getUser, getMultiFiles);








route.post('/book', book);
route.get('/available_slots', available_slots);


route.get('/unsubscribe/:id', unsubscribe); 
route.get("/getusers", getUsersByRole); 
route.get("/admin/:id", adminid);

route.post("/messages",sendMessages);
route.get("/messages/:senderId/:receiverId", getMessages);

// route.get("/ip-locations", getUserIpLocations);

route.post("/send-otp", send_otp);
route.post("/verify-otp", verifyotp);
route.get("/export-users", excel);




export default route;

