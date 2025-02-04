
// Login.js:
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import {  useNavigate, Link } from "react-router-dom";
import {io} from "socket.io-client";

const socket = io("http://localhost:5000"); 

function Login() {

    console.log(socket)
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");


  const handleLogin = async(event) => {
    event.preventDefault();
    try {
        const response = await fetch("http://localhost:8000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        setMessage(data.msg);
        if (data.success) {
          localStorage.setItem("token", data?.token)
          socket.emit("new-user", email);
          
  
    
          navigate("/");
          
  
          }
        // navigate('/')
        
  
      } catch (error) {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again.");
      }
    
    
  };

  return (

    
    <Container>

    <Link to={'/registration'} >Registration</Link>

      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="danger" type="submit" className="w-100" style={{height:"45px"}} >
              Login
            </Button>
          </Form>
          {message && <p>{message}</p>}
        </Col>
      </Row>
    </Container>
  );
}

export default Login;