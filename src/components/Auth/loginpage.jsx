import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { UserContext } from "../../context/UserContext";  // ✅ Import UserContext

const socket = io("http://localhost:5000");

function Login() {
  const { setUserData } = useContext(UserContext);  // ✅ Extract setUserData
  if (!setUserData) {
    console.error("❌ setUserData is undefined! Check UserProvider wrapping in App.js");
  }

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      setMessage(data.msg);
      setUserData(data?.user);

      if (data.success) {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        socket.emit("new-user", email);

          // ✅ Store MongoDB user data in context

        if (data.user.role === 1) {
          navigate("/home");
        } else if (data.user.role === 2) {
          navigate("/home");
        } else {
          navigate("/home");
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
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
