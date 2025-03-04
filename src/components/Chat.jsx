import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8000", { autoConnect: false });

const Chat = ({ userId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.emit("join", { userId });

        socket.on("new-message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => socket.disconnect();
    }, [userId]);

    const sendMessage = async () => {
        if (message.trim()) {
            socket.emit("private-message", { senderId: userId, receiverId, message });
            setMessages([...messages, { senderId: userId, message }]);
            setMessage("");

            // Save in database (optional)
            await axios.post("http://localhost:3000/api/messages", { senderId: userId, receiverId, message });
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div style={{ border: "1px solid black", height: "300px", overflowY: "scroll" }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.senderId === userId ? "right" : "left" }}>
                        <p>{msg.message}</p>
                    </div>
                ))}
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
