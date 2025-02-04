import './App.css';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import User from './components/getuser/User';

import Edit from './components/updateuser/Edit';
// import Add from './components/adduser/add';
import AddV from './components/adduser/vadd';
import Login from './components/Auth/loginpage';
import RegistrationPage from './components/Auth/registration';
import Restore from './components/getuser/restore';
import Home from './components/Home'
import SuperAdminRegistration from './components/Roles/SuperAdminRegistration';
// import SuperAdminDash from './components/Roles/SuperAdminDash';

// import Map from './components/MapIndia/Map';
import { io } from "socket.io-client";
import { useEffect, useState } from 'react';

const socket = io("http://localhost:5000");


function App() {

  const route = createBrowserRouter([
    {
      path: '/',
      element: <User/>,
    },
    {
      path: '/add',
      element: <AddV />,
    },
    {
      path: '/edit/:id',
      element: <Edit/>,
    },
    {
      path: '/login',
      element: <Login />

    },
    {
      path: '/registration',
      element: <RegistrationPage/>

    },
    {
      path: '/restore',
      element: <Restore/>
    },
    {
      path: '/home',
      element: <Home/>

    },
    {
      path: '/superadmindashboard',
      element: <SuperAdminRegistration />
    },
    {
      path: '*',
      element: <div>Page not found</div>
    }
    
    

  ]
  )

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
    <div> 
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
      {/* {connected ? "Connected to Server ✅" : "Not Connected ❌"} */}
    </div>
   
  );






  // return (
  //   <div className="App">
  //     <RouterProvider router={route}></RouterProvider>
  //   </div>
  // );
}

export default App;

