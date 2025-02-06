import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LoginModal from './Auth/LoginModal';
import { useNavigate } from 'react-router-dom';

const Home=()=> {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    console.log(storedUser)
    if (storedUser) {
      setUser(JSON.parse(storedUser));  
    }
  }, []);

  function clearStorage() {
    localStorage.removeItem("userData");
    localStorage.removeItem('token');
    setUser(null); // Clear user state
    navigate("/login"); // Redirect to login page
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    setShow(false); // Close the modal on successful login
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Modal show={show} onHide={() => setShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title>LOGIN</Modal.Title>
              </Modal.Header>
              <LoginModal onLoginSuccess={handleLoginSuccess} />
            </Modal>

            <Nav.Link href="registration">Registration</Nav.Link>
            <Nav.Link href="superadminregistration">S Registration</Nav.Link>
            <Nav.Link href="registration">A Registration</Nav.Link>
            <Nav.Link href="user">User</Nav.Link>
            

            {!user ? (
              <Button variant="primary" onClick={() => setShow(true)}>
                Login
              </Button>
            ) : (
              <Button onClick={clearStorage}>Logout</Button>
            )}
          </Nav>
        </Container>
      </Navbar>

      <h2>{user ? `${user.fname} ${user.lname}` : ""}</h2>
    </>
  );
}

export default Home;
