
import { useState } from "react";
import { Col, Container, Form, Image, Row, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import superagent from 'superagent';
import Footer from "./footer";

export default function Register() {

    const [username, setUserName] = useState("");
    const [confirmUsername, setConfirmUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isErr, setErr] = useState(false);
    const [isCreated, setCreated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    let handleRegister = async (e) => {
        e.preventDefault();
        if (username != confirmUsername) {
            setErr(true);
            setErrorMessage("Username and confirm username doesn't match");
        } else {
            superagent
                .post("http://localhost:8001/register")
                .send({
                    username: username,
                    password: password
                })
                .then((response) => {
                    console.log(response);
                    setCreated(true);
                })
                .catch((err) => {
                    setErr(true);
                    setErrorMessage("Server Error Occured");
                })
        }
    }

    let clear = () => {
        document.getElementById('username').value = '';
        setUserName("");
        document.getElementById('confirmUsername').value = '';
        setConfirmUserName("");
        document.getElementById('password').value = '';
        setPassword("");

    }

    return (
        <>
            {isErr ?
                <>
                    <Alert className="container my-4" variant="danger" key="danger">{errorMessage}</Alert>
                    <br />
                </>
                : <div></div>}
            <Container className="my-4">
                {isCreated ?
                    <>
                        <Alert variant="success" key="success">Account created successfully</Alert>
                        <br />
                    </>
                    : <div></div>}
                <Row>
                    <Col sm>
                        <Image
                            src={require("../images/login_page.png")}
                            fluid
                        />
                    </Col>
                    <Col sm>
                        <h2 className="text-secondary">Registration Page</h2>
                        <br />
                        <Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label className="text-secondary">Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="confirmUsername">
                                <Form.Label className="text-secondary">Confirm Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={confirmUsername}
                                    onChange={(e) => setConfirmUserName(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label className="text-secondary">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                            </Form.Group>
                            <div className="text-right pt-0">
                                <span className="text-secondary">Already have an account? <Link to='/'>Sign in</Link></span>
                            </div>
                            <Row className="py-4">
                                <Col>
                                    <button className="btn btn-primary btn-block" type="submit">
                                        Submit
                                    </button>
                                </Col>
                                <Col>
                                    <button onClick={clear} className="btn btn-outline-danger btn-block">
                                        Clear
                                    </button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <br />
        </>
    );
}