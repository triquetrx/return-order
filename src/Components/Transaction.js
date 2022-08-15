import TopBar from "./Navbar";
import '../css/CreditCard.css'
import { Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import superagent from 'superagent';
import { useState } from "react";

export default function Transaction() {

    const [holderName, setHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cvv, setCvv] = useState("");
    const [expiry, setExpiry] = useState("");
    const [paymentDone, setPaymentDone] = useState(false);
    const [deducted, setDeducted] = useState("");
    const [available, setAvailable] = useState("");

    const cookies = new Cookies();
    const request = cookies.get('request');
    const token = cookies.get('token');
    const valid = cookies.get('isValid');
    
    let cancelRequest = () => {
        cookies.remove('request');
    }
    
    let processPayment = async (e) => {
        e.preventDefault();
        superagent.post(`http://localhost:8004/completeprocessing/${request.requestId}`)
            .send({
                creditCardHolder: holderName,
                creditCardNumber: cardNumber,
                cvv: cvv,
                totalCharge: request.processingCharge + request.packagingAndDeliveryCharge
            })
            .set("Authorization", `Bearer ${token}`)
            .then((res) => {
                setDeducted(res.text.split(" ")[0] + ": " + "₹ " + res.text.split(" ")[1]);
                setAvailable(res.text.split(" ")[2] + " " + res.text.split(" ")[3] + ":" + " ₹ " + (res.text.split(" ")[6]).split(",")[1]);
                setPaymentDone(true);
            }).catch(err => { console.log(err) })
    }

    let expiryDate = (e) => {
        if (e.target.value.length === 4) {
            e.target.value += '/'
            document.getElementById('cardExpiry').value = e.target.value
        }
        if (e.target.value.length === 6 || e.target.value.length === 7) {
            setExpiry(e.target.value)
        }
    }

    let home = () => {
        cookies.remove('request');
        cookies.remove('quantity');
        cookies.remove('componentName');
        cookies.remove('name');
    }


    return (
        <>{valid ?
            <>
                <Modal
                    show={paymentDone}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header>
                        <Modal.Title>Payment <span className="text-success">Successful</span></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-secondary h5">
                            Tracking Id: {request.requestId}
                        </p>
                        <p className="text-secondary h5">
                            {deducted}
                        </p>
                        <p className="text-secondary h5">
                            {available}
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Link className="btn btn-outline-primary" to='/home' onClick={home}>
                            Home Page
                        </Link>
                    </Modal.Footer>
                </Modal>
                <TopBar />
                {!cookies.get('request') ? <Navigate to='/login' /> :
                    <>
                        <Container className="mb-5 p-2 p-md-0">
                            <Row className="p-3 p-md-0" id="creditCardStyle">
                                <Col sm>
                                    <br />
                                    <h4 className="p-2 py-4">
                                        <span className="fa fa-check-square"></span> <b>TRIQUETRX</b>
                                        <span className="text-secondary"> |</span>
                                        <span className="ps-2 text-secondary"> Pay</span>
                                    </h4>
                                    <Container>
                                        <h5 className="text-secondary mb-2">Order Summary</h5>
                                        <Table striped className="mb-3 text-secondary">
                                            <tbody className="text-secondary h6">
                                                <tr>
                                                    <td>Name</td>
                                                    <td className="text-right">{cookies.get('name')}</td>
                                                </tr>
                                                <tr>
                                                    <td>Component Name</td>
                                                    <td className="text-right">{cookies.get('componentName')}</td>
                                                </tr>
                                                <tr>
                                                    <td>Quantity</td>
                                                    <td className="text-right">{cookies.get('quantity')}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <h5 className="mb-2 text-secondary">Payment Summary</h5>
                                        <Table className="mb-3 text-secondary" striped>
                                            <tbody className="text-secondary h6">
                                                <tr>
                                                    <td>Request/Tracking Id</td>
                                                    <td className="text-right">{request.requestId}</td>
                                                </tr>
                                                <tr>
                                                    <td>Delivery Charge</td>
                                                    <td className="text-right">{request.packagingAndDeliveryCharge}</td>
                                                </tr>
                                                <tr>
                                                    <td>Procssing Charge</td>
                                                    <td className="text-right">{request.processingCharge}</td>
                                                </tr>
                                                <tr>
                                                    <td>Date of Delivery</td>
                                                    <td className="text-right">{request.dateOfDelivery ? request.dateOfDelivery.split('T')[0] : ''}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <div className="py-2">
                                            <h5 className="m-0 p-0">Total Charge<span className="text-muted lead">*</span>: ₹ {request.processingCharge + request.packagingAndDeliveryCharge}</h5>
                                            <p className="text-muted">*Note: Credit Card charges will be added to this</p>
                                        </div>
                                    </Container>
                                </Col>
                                <div className="border-left border-md-none"></div>
                                <Col className="pt-0 pt-md-3 d-flex justify-content-center mt-0 mt-md-5" sm>
                                    <Form onSubmit={processPayment}>
                                        <div className="p-2">
                                            <br />
                                            <div className="card-body">
                                                <span className="fa fa-card"></span>
                                                <h5 className="mb-4 text-secondary ">Enter your card details</h5>

                                                <div className="form-outline mb-3">
                                                    <input onChange={(e) => setCardNumber(e.target.value)} type="text" id="cardNumber" className="form-control"
                                                        placeholder="1234 5678 1234 5678" required />
                                                </div>
                                                <div className="form-outline mb-3">
                                                    <input type="text" id="holderName" onChange={(e) => setHolderName(e.target.value)} className="form-control"
                                                        placeholder="Holder Name" required />
                                                </div>

                                                <div className="row mb-3">
                                                    <div className="col-6">
                                                        <div className="form-outline">
                                                            <input type="text" onChange={expiryDate} id="cardExpiry" className="form-control"
                                                                placeholder="YYYY/MM" minLength='6' pattern="(\d{4}[/]\d{1,2})" maxLength='7' required />
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="form-outline">
                                                            <input type="password" id="cardCVV" onChange={(e) => setCvv(e.target.value)} className="form-control" placeholder="CVV" required />
                                                        </div>
                                                    </div>
                                                </div>

                                                <button className="btn btn-primary btn-block">Pay ₹{request.processingCharge + request.packagingAndDeliveryCharge}</button>
                                                <Link to='/home' className="btn btn-outline-danger btn-block" onClick={cancelRequest}>Cancel Payment</Link>
                                            </div>
                                            <br />
                                        </div>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                        <div className="d-flex flex-column mt-5 mt-md-0 flex-md-row text-center text-md-start justify-content-between bg-primary text-white px-3 py-3 mb-0">
                            Copyright © 2022. All rights reserved.
                        </div>
                    </>
                }
            </> : <Navigate to="/login" />
        }
        </>
    );
}