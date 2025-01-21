import express from 'express';
import {create, getall, getbyname, getbyid, update} from '../controller/userController.js';
const route = express.Router();

route.post('/create',create);
route.get('/getall',getall);
route.get('/getbyname/:fname',getbyname);
route.get('/getbyid/:id',getbyid);
route.put('/update/:id',update);

export default route;

