import { useState } from "react";
import { Container, Button, Nav, Navbar, Modal } from "react-bootstrap";
import '../css/navbar.css'
import { Link, Navigate, NavLink } from "react-router-dom";
import Cookie from 'universal-cookie';
import Cookies from "universal-cookie";

export default function TopBar(props) {
  let activeStyle = {
    color: "#000000",
    borderBottom: "0.1rem solid #007bff",
    textDecoration: "none",
    padding: "0.2rem",
    transition: "0.5s",
  };

  let inActiveStyle = {
    color: "#6c757d",
    padding: "0.2rem",
    textDecoration: "none",
    transition: "0.5s",
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const cookie = new Cookies();
  const logout = () => {
    setShow(false);
    cookie.remove('isValid');
    cookie.remove('token');
  }

  return (
    <>
      <Navbar variant="light">
        <Container>
          <Navbar.Brand href="/home">
            <h3 className="text-primary">Re<span className="text-secondary">turno</span></h3>
          </Navbar.Brand>
          <Nav className="me-auto">
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : inActiveStyle)}
              to="/home"
            >
              Home
            </NavLink>
            <NavLink
              style={({ isActive }) => (isActive ? activeStyle : inActiveStyle)}
              to="/trackrequest"
            >
              Track Request
            </NavLink>
            <a
              className="logoutButton"
              style={inActiveStyle}
              onClick={handleShow}
            >
              Logout
            </a>
          </Nav>
        </Container>
      </Navbar>
      <br />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sure you want to log out</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={logout} href='/'>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
