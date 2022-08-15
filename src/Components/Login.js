import { Button, Col, Container, Form, Row, Image, Alert } from "react-bootstrap";
import Footer from "./footer";
import "../css/login.css";
import { useState } from "react";
import Cookie from 'universal-cookie';
import superagent from 'superagent';
import { Link, Navigate } from "react-router-dom";

export default function Login(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [isValid, setValid] = useState(false);
  const [isUnauth, setUnAuth] = useState(false);
  const cookie = new Cookie();

  let login = async (username, password) => {
    superagent
      .post("http://localhost:8001/authenticate")
      .send({
        username: username,
        password: password
      })
      .then((response) => {
        if (response.body.token) {
          setToken(response.body.token);
          cookie.set('token', response.body.token, { path: '/',maxAge: 1800 })
          cookie.set('isValid', response.body.validStatus, { path: '/',maxAge:1800 })
          setValid(response.body.validStatus);
        }
      })
      .catch((err) => {
        console.log(err);
        setUnAuth(true);
      });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };
  return (
    <>
      {isValid ? (
        <Navigate to='/home' />
      ) : (
        <div>
          <Container className="login" fluid>
            {(isUnauth ?
              <>
                <Alert variant="danger" key="danger">Invalid Credentials, try again</Alert>
                <br />
              </>
              : <div></div>)}
            <Row>
              <Col sm>
                <Image
                  src={require("../images/login_page.png")}
                  fluid
                />
              </Col>
              <Col sm>
                <h2 className="text-secondary">Login Page</h2>
                <br />
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="text-secondary">Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="text-secondary">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <Form.Text className="text-muted px-1">
                      Note: The login validity is for only 30 minutes
                    </Form.Text>
                  </Form.Group>
                  <div className="text-right">
                  <span className="text-secondary">Don't have an account? <Link to='/register'>Create now</Link></span>
                  </div>
                  <br />
                  <button className="btn btn-primary btn-block" type="submit">
                    Submit
                  </button>
                </Form>
              </Col>
            </Row>
          </Container>
          <Footer />
        </div>
      )}
    </>
  );
}
