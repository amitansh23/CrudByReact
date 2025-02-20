
// // Login.js:
// import React, { useState } from 'react';
// import { Form, Button, Container, Row, Col } from 'react-bootstrap';
// import {  useNavigate, Link } from "react-router-dom";
// import {io} from "socket.io-client";

// const socket = io("http://localhost:5000"); 

// function Login() {

//     console.log(socket)
//     const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState("");


//   const handleLogin = async(event) => {
//     event.preventDefault();
//     try {
//         const response = await fetch("http://localhost:8000/api/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         });
  
//         const data = await response.json();
//         setMessage(data.msg);
//         if (data.success) {
//           localStorage.setItem("token", data?.token)
//           socket.emit("new-user", email);
          
  
    
//           navigate("/");
          
  
//           }
//         // navigate('/')
        
  
//       } catch (error) {
//         console.error("Error:", error);
//         setMessage("An error occurred. Please try again.");
//       }
    
    
//   };

//   return (

    
//     <Container>

//     <Link to={'/registration'} >Registration</Link>

//       <Row className="justify-content-md-center mt-5">
//         <Col xs={12} md={6}>
//           <h2 className="text-center mb-4">Login</h2>
//           <Form onSubmit={handleLogin}>
//             <Form.Group className="mb-3" controlId="formBasicEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formBasicPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </Form.Group>

//             <Button variant="danger" type="submit" className="w-100" style={{height:"45px"}} >
//               Login
//             </Button>
//           </Form>
//           {message && <p>{message}</p>}
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Login;




import React, { useState } from "react";
import { useNavigate } from "react-router";
// import LoginIcon from '@mui/icons-material/Login';

import axios from "axios";
// import { AuthContext } from "../Context/AuthContext";
const Login = () => {
  const navigate = useNavigate();
  // const { setUser } = useContext(AuthContext); // Use context to store user data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const [step, setStep] = useState("login"); 
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const Login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", { email, password },
        {withCredentials:true}
      );
      if  (response.data.user) {
        navigate("/Table")
    
       
        // setUser(response.data.user);
        //  Update user context
        navigate("/Upgrade");
        // localStorage.setItem("token", response.data.token);
        // localStorage.setItem("user", JSON.stringify(response.data.user));

      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Check Credentials");
    }
  };

  const handleRequestOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/sendotp", { email });
      setMessage(response.data.message);
      setStep("otp"); // Move to OTP step after success
    } catch (error) {
      setMessage(error.response?.data?.message || "Error requesting OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/forgotpassword", { email, otp });
      setMessage(response.data.message);
      setStep("reset"); // Move to reset step after success
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP. Try again.");
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.put("http://localhost:8000/api/updatepassword", { email, newPassword });
      setMessage(response.data.message);
      setStep("login"); // Move back to login after success
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-100">
      <div className="w-full max-w-sm p-6 bg-white border border-purple-300 rounded-lg shadow-md">
        
        {/* Login Form */}
        {step === "login" && (
          <form className="space-y-6" onSubmit={Login}>
            {/* <h5 className="text-xl font-medium text-purple-900">Sign in   < LoginIcon/>  </h5> */}
            {message && <p className="text-red-600 text-sm">{message}</p>}

            <div>
              <label className="block mb-2 text-sm font-medium text-purple-900">Your email</label>
              <input
                type="email" name="email" id="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="name@gmail.com" required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-purple-900">Your password</label>
              <input
                type="password" name="password" id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full p-2 border rounded" required
              />
              <div className="text-right text-gray-600">
                <span className="text-purple-700 hover:underline cursor-pointer"
                  onClick={() => setStep("email")}>
                  Forgot Password?
                </span>
              </div>
            </div>

            <button type="submit" className="w-full bg-purple-700 text-white p-2 rounded">LogIn
            </button>

            <div className="text-sm text-gray-600">
              Not registered? 
              <a href="/Register" className="text-purple-700 hover:underline"> Create account </a>
            </div>
          </form>
        )}

        {/* Forgot Password - Enter Email */}
        {step === "email" && (
          <div>
            <h5 className="text-xl font-medium text-purple-900">Forgot Password</h5>
            <input
              type="email" placeholder="Enter your email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded mb-2" required
            />
            <button onClick={handleRequestOtp} className="w-full bg-purple-500 text-white p-2 rounded">
              Send OTP
            </button>
            <p onClick={() => setStep("login")} className="mt-3 text-red-500 text-sm cursor-pointer">
              Back to Login
            </p>
          </div>
        )}

        {/* OTP Verification */}
        {step === "otp" && (
          <div>
            <h5 className="text-xl font-medium text-purple-900">Enter OTP</h5>
            <input
              type="text" placeholder="Enter OTP" value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button onClick={handleVerifyOtp} className="w-full bg-green-500 text-white p-2 rounded">
              Verify OTP
            </button>
            <p onClick={() => setStep("email")} className="mt-3 text-red-500 text-sm cursor-pointer">
              Back
            </p>
          </div>
        )}

        {/* Reset Password */}
        {step === "reset" && (
          <div>
            <h5 className="text-xl font-medium text-purple-900">Reset Password</h5>
            <input
              type="password" placeholder="Enter new password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button onClick={handleResetPassword} className="w-full bg-purple-500 text-white p-2 rounded">
              Reset Password
            </button>
            <p onClick={() => setStep("login")} className="mt-3 text-red-500 text-sm cursor-pointer">
              Back to Login
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;