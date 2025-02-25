import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000");

function Login() {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [load,setload] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setload(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      setload(false);
      
      setMessage(data.msg);
      

      if (data.success) {
        // console.log(data)
        localStorage.setItem("token", data?.token);
        localStorage.setItem("userData", JSON.stringify(data?.user));
        localStorage.setItem("userProfile", JSON.stringify(data?.profile));
        
        

        socket.emit("new-user", email);

          

        if (data.user.role === 1) {
          navigate("/registration");
        } else if (data.user.role === 2) {
          navigate("/user");
        } else {
          navigate("/superadminregistration");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Link to={"/registration"}>Registration</Link>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">{load ? <div class="spinner-border text-primary" role="status">
  <span class="sr-only"></span>
</div>: "Login"} </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
