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
import { io } from "socket.io-client";
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';





const socket = io("http://localhost:5000");


function App() {

  const isLaggedIn = localStorage.getItem("userData");
  console.log(isLaggedIn)

  
   
 
  
  

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  console.log(connected ? "Connected to Server ✅" : "Not Connected ❌")

  return (

  <>
    <BrowserRouter>
    <Home />
       
    <Routes>

      
    
      <Route path="/" element={<User />} />
      <Route path="/login" element={<Login />} />
      <Route path="/superadminregistration" element={<SuperAdminRegistration />} />
      

      

      
     <Route element={<ProtectedRoute />}>
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/user" element={<User />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/add" element={<AddV />} />
            <Route path="/restore" element={<Restore />} />

    </Route>

    </Routes>
  </BrowserRouter>
  </>
      
    
      
   
   
    
    
    
  );

}

export default App;

