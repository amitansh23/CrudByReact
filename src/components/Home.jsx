import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import Login from './Auth/loginpage';
import LoginModal from './Auth/LoginModal'


  



function ColorSchemesExample() {

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            
            <Button variant="primary" onClick={handleShow}>
        Login
      </Button>

      <Modal  show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>LOGIN</Modal.Title>
        </Modal.Header>
        < LoginModal/>
      </Modal>




            <Nav.Link href="registration">Registration</Nav.Link>
            <Nav.Link href="modal">Modal</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
     
    </>
  );
}

export default ColorSchemesExample;