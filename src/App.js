import './App.css';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import User from './components/getuser/User';
import Edit from './components/updateuser/Edit';
// import Add from './components/adduser/add';
import AddV from './components/adduser/vadd';
import Login from './components/Auth/loginpage';
import RegistrationPage from './components/Auth/registration';
import Restore from './components/getuser/restore';
import Home from './components/Home'
import SuperAdminRegistration from './components/Roles/SuperAdminRegistration';
// import { io } from "socket.io-client";
// import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Calender from './components/EventSelector/calender';
import Uploadprofile from './components/Uploadprofile';
import BookingSystem from './Hotel/booking';
import Profile from './components/profile';
import UploadMultipleImages from './components/uploadmultifile';
import GetmultiFile from './components/getmultifile';
import Chat from './components/Chat';
import AdminDashboard from './components/Admin/admindashboard';





function App() {

  // const isLaggedIn = localStorage.getItem("userData");
  // console.log(isLaggedIn)


  return (

  <>
    <BrowserRouter>
    <Home />
       
    <Routes>
  
      <Route path="/" element={<Login />} />
     
      <Route path="/registration" element={<RegistrationPage />} />
      
      <Route path="/uploadfile" element={<Uploadprofile />} />
      <Route path="/booking" element={<BookingSystem />} />
      <Route path="/login" element={<Login />} />
      
      

      

      
     <Route element={<ProtectedRoute />}>

     
            <Route path="/superadminregistration" element={<SuperAdminRegistration />} />
            <Route path="/user" element={<User />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/add" element={<AddV />} />
            <Route path="/restore" element={<Restore />} />

            <Route path="/calender" element={<Calender />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/uploadmultifile" element={<UploadMultipleImages />} />
            <Route path="/getmultifile" element={<GetmultiFile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />



    </Route>

    </Routes>
  </BrowserRouter>
  </>
      
    
      
   
   
    
    
    
  );

}

export default App;

