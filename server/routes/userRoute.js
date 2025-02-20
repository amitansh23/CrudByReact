import express from 'express';
import {create, getall, getbyname, getbyid, update, deleteuser, login, tauth, softdelete, restore, backup, registration, regis, forgotpassword, updatepassword, uploadfile, getlimiteddata, createEvent, logout} from '../controller/userController.js';
const route = express.Router();
import signup from '../controller/authController.js';
import sendOTP from '../controller/otpController.js';
import multer from 'multer';
import { getUser } from '../middleware/token.js';


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
});

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

route.post('/sendotp',sendOTP);
route.post('/signup', signup);

route.post('/forgotpassword', forgotpassword);
route.put('/updatepassword', updatepassword);
route.post('/uploadfile', upload.single("file"),getUser ,uploadfile)
route.get('/getlimiteddata', getUser,getlimiteddata)

route.get('/createEvent', createEvent);

route.post('/logout', logout);


export default route;

