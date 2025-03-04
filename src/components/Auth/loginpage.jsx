import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";

// ✅ Create Socket Connection (Only Once)
const socket = io("http://localhost:8000", { 
  transports: ["websocket", "polling"], 
  withCredentials: true, 
  autoConnect: false 
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [load, setLoad] = useState(false);
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), 
        credentials: "include",
      });

      const data = await response.json();
      setLoad(false);
      setMessage(data.msg);

      if (data.success) {
        localStorage.setItem("token", data?.token);
        localStorage.setItem("userData", JSON.stringify(data?.user));
        localStorage.setItem("userProfile",JSON.stringify(data?.profile))

        // ✅ Emit "join" event only after successful login
        socket.emit("join", { userId: data.user._id });

        console.log("🎉 User Logged In:", data.user.fname, "- Socket ID:", socket.id);

        if (data.user.role === 1) {
          navigate("/registration");
        } else if (data.user.role === 2) {
          navigate("/user");
        } else {
          navigate("/superadminregistration");
        }
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      setMessage("An error occurred. Please try again.");
      setLoad(false);
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
        <button type="submit">
          {load ? (
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only"></span>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
