import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./User.css";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { DateTime } from "luxon";
import { io } from "socket.io-client";
// import Chat from "../Chat";

const User = () => {

  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [count, setCount] = useState(5);
  const [total, setTotal] = useState(0);
  const [sortField, setSortField] = useState("Created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRole, setSelectedRole] = useState("");

  // const [selectedAdmin, setSelectedAdmin] = useState(null);
  // const [receiverSocketId, setReceiverSocketId] = useState("");
  // const [chatOpen, setChatOpen] = useState(false);

  


  
  const fetchData =useCallback(async (limit, query, field, order, role) => {
    // const token = localStorage.getItem("token");

    // const res = await axios.get('http://localhost:8000/api/getall',{ headers : {
    //   'auth': token}})
    // setUsers(res.data)
try {
  const res = await axios.get(
    `http://localhost:8000/api/getlimiteddata?count=${limit}&search=${query}&sortField=${field}&sortOrder=${order}&role=${role}`,
    {
      // headers: {
      //   auth: token,
      // },
      withCredentials: true
    }

  );
  setUsers(res?.data?.userData);
  setTotal(res?.data?.total);
  

  
} catch (error) {
  console.error("Error fetching data:", error);
  navigate('/login')
  
  
}},[navigate]);


// const [adminList, setAdminList] = useState([]); // ✅ Store Admins List


// const fetchAdmins = useCallback(async () => {
//   try {
//     const res = await axios.get(`http://localhost:8000/api/getusers?roles=1`, {
//       withCredentials: true
      
//     }
//   );

//     setAdminList(res?.data?.users);
//   } catch (error) {
//     console.error("Error fetching admins:", error);
//   }
// }, []);

// useEffect(() => {
//   fetchAdmins();
  
// }, [fetchAdmins]);



const socket = io("http://localhost:8000",{ 
  transports: ["websocket", "polling"], 
  withCredentials: true,
  autoConnect: false 
});
  

  const toggleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    // fetchData(count, search, field, newOrder);
  }

  const handlenext = () => {
    setCount(count + 5);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    fetchData(5, query);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
     
    }
    

    fetchData(count, search, sortField, sortOrder, selectedRole);
  }, [count, search, sortField, sortOrder, selectedRole, fetchData]);


const [socketId, setSocketId] = useState("");

// ✅ Ensure Socket Connects Once & Updates socketId
useEffect(() => {
  if(!socketId){
  socket.connect(); 

  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket, Socket ID:", socket.id);
    setSocketId(socket.id); 
  });

  socket.on("updatedata",(data)=>{
    new window.Notification(data)
    console.log("updatedata");
  })

  
  socket.emit("join",{userId: user?._id});
  socket.on("msg",(data)=>{
    console.log(data);
  })
  socket.on("privateMessage",(data)=>{
    console.log(data);
    new window.Notification(`${data}`)
  })
}

  

  return () => {
    // socket.off("connect");
    // socket.off("disconnect");
  };
}, [user, socketId,socket]);



// const handleAdminSelect = async (e) => {
//   const adminId = e.target.value;
//   setSelectedAdmin(adminId);

//   if(adminId){
//     try {
//       const response = await axios.get(`http://localhost:8000/api/admin/${adminId}`);
//       setReceiverSocketId(response.data.socketId);
//       // setChatOpen(true);
      
//     } catch (error) {
//       console.error("Error fetching receiver socket ID:", error);
      
//     }
//   }}

  


  const DELETE = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        perdelete(userId);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const perdelete = async (userId) => {
    await axios
      .patch(`http://localhost:8000/api/deleteuser/${userId}`)
      .then((res) => {
        setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
        toast.success(res.data.msg, { positioin: "top-center" });
        setTotal((prevTotal) => prevTotal - 1);

        
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const SOFTDELETE = async (userId) => {
    await axios
      .put(`http://localhost:8000/api/softdelete/${userId}`)
      .then((res) => {
        setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
        toast.success(res.data.msg, { position: "top-center" });
      });
  };

  return (
    <div className="userTable">





      <p>
        <strong>Total Items:</strong> {total}
      </p>
      <p>
        <strong>SocketId:</strong> {socketId}
      </p>
      <h2>{user ? `${user.fname} ${user.lname}` : ""}</h2>
      <Link to={"/add"} className="addButton">
        Add User
      </Link>
      <Link to={"/restore"} className="addButton">
        RESTORE
      </Link>
      
      <input
        type="text"
        placeholder="  Search items.."
        value={search}
        onChange={handleSearch}
      />
     
      <div className="dropbox">
      <select onChange= {handleRoleChange} value={selectedRole}>
        <option value="">All</option>
        <option value="0">SuperAdmin</option>
        <option value="1">Admin</option>
        <option value="2">User</option>
      </select>
      </div>

      {/* <div className="dropbox">
  <label><strong>Chat with:</strong></label>
  <select onChange={handleAdminSelect} >
    <option value="">Admins</option>
    {adminList.map((admin) => (
      <option key={admin._id} value={admin._id}>
        {admin.fname} {admin.lname} ({admin.email})
      </option>
    ))}
  </select>
</div>

{chatOpen && selectedAdmin && receiverSocketId && (
        <Chat userId={user._id} receiverId={receiverSocketId} />
      )} */}
 




      <table border={1} cellPadding={15} cellSpacing={8}>
        <thead>
          <tr>
            <th>S.NO.</th>
            <th>Name</th>
            <th>Email{" "}<span onClick={()=>{toggleSort("email")}} style={{cursor:"pointer"}}>
            {sortField === "email" ? (sortOrder === "asc" ? "▲" :"▼"): "↕" }
            </span>
            
            </th>
            <th>Role</th>
            <th>CreatedBy</th>
            <th>CreatedAt{" "}<span onClick={()=>{toggleSort("Created_at")}} style={{cursor:"pointer"}}>
            {sortField === "Created_at" ? (sortOrder === "asc" ? "▲" :"▼"): "↕" }
            </span>
            </th>
            <th>UpdatedAt</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {user.fname} {user.lname}
              </td>
              <td>{user.email}</td>
              <td>
                {user.role === 1
                  ? "Admin"
                  : user.role === 0
                  ? "SuperAdmin"
                  : "User"}
              </td>
              <td>{user?.CreatedBy?.fname? user.CreatedBy.fname : "NA"}</td>

              <td>{DateTime.fromISO(user.Created_at).toFormat("dd LLL yyyy, hh:mm a")}</td>
              <td>{DateTime.fromISO(user.Updated_at).toFormat("dd LLL yyyy, hh:mm a")}</td>


              <td className="actionButton">
                <button
                  onClick={() => {
                    DELETE(user._id);
                  }}
                >
                  DELETE
                </button>

                <button
                  onClick={() => {
                    SOFTDELETE(user._id);
                  }}
                >
                  {" "}
                  REMOVE{" "}
                </button>

                <Link to={"/edit/" + user._id}>EDIT</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="addButton" onClick={handlenext} >
        Next
      </button>
    </div>
  );
};


export default User;


   