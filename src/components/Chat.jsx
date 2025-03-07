import React, { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [receiverSocketId, setReceiverSocketId] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [userList, setUserList] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch users based on role
  const fetchUsersByRole = useCallback(async () => {
    if (!user) return;

    try {
      let roleQuery = user?.role === 2 ? "1" : user?.role === 1 ? "2" : "1,2";
      const res = await axios.get(`http://localhost:8000/api/getusers?roles=${roleQuery}`, {
        withCredentials: true,
      });

      setUserList(res?.data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [user]);

  useEffect(() => {
    
    fetchUsersByRole();
  }, [fetchUsersByRole]);

  // Setup WebSocket Connection
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8000", {
        autoConnect: false,
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      socketRef.current.connect();

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket:", socketRef.current.id);
      });

      socketRef.current.on("new-message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        // socketRef.current.disconnect();
      };
    }
  }, []);

  // Handle selection of a user or admin
  const handleUserSelect = async (e) => {
    const receiverId = e.target.value;
    setSelectedReceiver(receiverId);

    if (receiverId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/getbyid/${receiverId}`);
        setReceiverSocketId(response.data.socketId);
        setChatOpen(true);

        // Fetch chat history
        const chatResponse = await axios.get(`http://localhost:8000/api/messages/${user._id}/${receiverId}`);
        setMessages(chatResponse.data.messages);
        
      } catch (error) {
        console.error("Error fetching receiver socket ID:", error);
      }
    }
  };

  // Send message
  const sendMessage = async () => {
    if (message.trim() && user?._id && receiverSocketId) {
      socketRef.current.emit("private-message", {
        senderId: user._id,
        receiverId: selectedReceiver,
        message,
      });

      setMessages([...messages, { senderId: user._id, message }]);
      setMessage("");

      await axios.post("http://localhost:8000/api/messages", {
        senderId: user._id,
        receiverId: selectedReceiver,
        message,
      });
    }
  };

  return (
    <div>
      <h2>Chat</h2>

      <div className="dropbox">
        <label>Chat with:</label>
        <select onChange={handleUserSelect}>
          <option value="">Select a {user?.role === 1 ? "User" : "Admin"}</option>
          {userList.map((chatUser) => (
            <option key={chatUser._id} value={chatUser._id}>
              {chatUser.fname} {chatUser.lname} ({chatUser.email})
            </option>
          ))}
        </select>
      </div>

      {chatOpen && user && selectedReceiver && receiverSocketId && (
        <div>
          <div
            style={{
              border: "1px solid black",
              height: "300px",
              overflowY: "scroll",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.senderId === user._id ? "right" : "left",
                  padding: "5px",
                }}
              >
                <p>{msg.message}</p>
              </div>
            ))}
          </div>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
