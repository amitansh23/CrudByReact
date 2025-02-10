import express from 'express';
import {create, getall, getbyname, getbyid, update, deleteuser, login, tauth, softdelete, restore, backup, registration, regis} from '../controller/userController.js';
const route = express.Router();
import signup from '../controller/authController.js';
import sendOTP from '../controller/otpController.js';


route.post('/create',create);
route.get('/getall',getall);
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


export default route;

