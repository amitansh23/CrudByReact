import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../adduser/add.css";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";




const socket = io("http://localhost:8000",{ 
  transports: ["websocket", "polling"], 
  withCredentials: true,
  autoConnect: false 
});



const Edit = () => {
  const users = {
    fname: "",
    lname: "",
    email: "",
  };

  const { id } = useParams();
  const [user, setUser] = useState(users);
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log(user);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/getbyid/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();
    const loggedInUser = JSON.parse(localStorage.getItem("userData"));
    const updatedByEmail = loggedInUser?.email || "Unknown";
    
    
    await axios
      .put(`http://localhost:8000/api/update/${id}`,{...user, updatedByEmail})
      .then((res) => {
        socket.connect();
socket.on("connect", () => {
  console.log("✅ Connected to WebSocket, Socket ID:", socket.id);
});

  socket.emit("Update",{userid: id})


        toast.success(res.data.msg, { position: "top-right" });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="addUser">
      <Link to={"/"}>Back</Link>
      <h3>Update User</h3>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="fname">First Name</label>
          <input
            type="text"
            value={user.fname}
            onChange={inputChange}
            id="fname"
            name="fname"
            placeholder="Enter your first name"
            autoComplete="off"
            required
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="lname">Last Name</label>
          <input
            type="text"
            value={user.lname}
            onChange={inputChange}
            id="lname"
            name="lname"
            placeholder="Enter your last name"
            autoComplete="off"
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={inputChange}
            id="email"
            name="email"
            placeholder="Enter your Email"
            autoComplete="off"
            required
          />
        </div>

        <div className="inputGroup">
          <button type="submit">Update User</button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
