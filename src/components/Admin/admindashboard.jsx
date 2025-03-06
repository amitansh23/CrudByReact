import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const AdminDashboard = () => {
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));

    // if (storedUser?.role === 1) {
      socket.connect();
      
      socket.on("connect", () => {
        console.log("✅ Admin connected:", socket.id);
        socket.emit("admin-join", storedUser._id); // ✅ Send Admin ID
      });
      socket.on("msg" , (data)=>{
        console.log(data);

      })
      socket.on("hii" , (data)=>{
        console.log(data);

      })
      socket.on("kaiseho" , (data)=>{
        console.log(data);

      })

      // ✅ Notification When User Logs In
      socket.on("login", (data) => {
        new window.Notification(data.name);
        console.log(data.name);
        // alert(`User Logged In: ${data._id}`);
      });

      return () => {
        // socket.off("connect");
        // socket.off("userLoggedIn");
        // socket.disconnect();
      };
    }
  , []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Real-time Notifications Enabled ✅</p>
    </div>
  );
};

export default AdminDashboard;
