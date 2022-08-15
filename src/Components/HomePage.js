import { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import TopBar from "./Navbar";
import superagent from "superagent";
import Cookies from "universal-cookie";
import { Link, Navigate } from "react-router-dom";

export default function HomePage(props) {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumebr] = useState("");
  const [componentName, setComponentname] = useState("");
  const [componentType, setComponentType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isPriorityRequest, setPriorityRequest] = useState(false);
  const [show, setShow] = useState(false);
  const [returnOrderRequest, setReturnOrderRequest] = useState([]);
  const handleClose = () => setShow(false);
  const cookies = new Cookies();
  const token = cookies.get('token');
  const isLoggedIn = cookies.get('isValid');

  let handleRequest = async (e) => {
    e.preventDefault();
    if (document.getElementById('componentType').value === "Choose") {
      window.alert("Please select a component type");
    } else {
      console.log(token);
      superagent
        .post('http://localhost:8004/processdetails')
        .send({
          name: name,
          contactNumber: contactNumber,
          componentName: componentName,
          componentType: componentType,
          quantity: quantity,
          priorityRequest: isPriorityRequest,
        }).set("Authorization", `Bearer ${token}`)
        .accept("application/json")
        .then(
          res => {
            console.log(res);
            setReturnOrderRequest(res.body);
            setShow(true);
            cookies.set('name',name)
            cookies.set('componentName',componentName);
            cookies.set('quantity',quantity);
            setName("");
            setContactNumebr("");
            setComponentname("");
            setComponentType("");
            setQuantity("");
            setPriorityRequest(false);
          })
          .catch(err => console.log(err));
        }
      };
      
      let validate = async (e) => {
        e.preventDefault();
        console.log(token);
        superagent
        .get("http://localhost:8001/validate")
        .set("Authorization", `Bearer ${token}`)
        .accept("application/json")
        .then(res => console.log(res))
        .catch(err => console.log(err));
      };
      
      let toggleChange = () => {
        if (componentType === "Accessory") {
          window.alert("Accessory can not be a priority request");
          setPriorityRequest(false);
        } else {
          setPriorityRequest(!isPriorityRequest);
        }
      };
      
      let payment = () => {
        console.log(cookies.remove('request'));
        cookies.set('request', returnOrderRequest);
      }

  let clearAll = () => {
    document.getElementById('componentType').value = 'Choose';
    document.getElementById('name').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('componentName').value = '';
    document.getElementById('qty').value = '';
    setPriorityRequest(false);
  }

  setTimeout(() => {
    window.alert(
      "Session about to expire in 10 seconds please logout and login again"
    );
    this.setState = {
      token: "",
      isLoggedIn: false,
    };
  }, 1000 * 60 * 29.9);

  return (
    <>{isLoggedIn ?
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Request Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 className="text-secondary">Please complete the transaction to confirm your request</h4>
            <p className="lead">
              Request/Tracking Id: {returnOrderRequest.requestId}
            </p>

            <p className="lead">Delivery Charge: {returnOrderRequest.packagingAndDeliveryCharge}</p>
            <p className="lead">Procssing Charge: {returnOrderRequest.processingCharge}</p>
            <p className="lead">Date of Delivery: {returnOrderRequest.dateOfDelivery ? returnOrderRequest.dateOfDelivery.split('T')[0] : ''}</p>
            <p className="lead">Total Charge: ₹{returnOrderRequest.processingCharge + returnOrderRequest.packagingAndDeliveryCharge}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Link className="btn btn-outline-primary" to='/transaction' onClick={payment}>
              Make Payment
            </Link>
          </Modal.Footer>
        </Modal>
        <TopBar />
        <Container>
          <h3 className="text-secondary">Return Order Form</h3>
          <br />
          <Form onSubmit={handleRequest}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Your Name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Contact number</Form.Label>
              <Form.Control
                type="tel"
                onChange={(e) => setContactNumebr(e.target.value)}
                placeholder="Your Contact Number"
                pattern="[0-9]{10}"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="componentName">
              <Form.Label>Component name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setComponentname(e.target.value)}
                placeholder="Component Name"
                required
              />
            </Form.Group>
            <div className="form-group">
              <label htmlFor="componentType">Component Type</label>
              <select
                className="custom-select"
                id="componentType"
                aria-label="Choose a component type"
                required
                onChange={(e) => {
                  setComponentType(e.target.value);
                  if (e === "Accessory") {
                    document.getElementById("priorityRequest").disabled = true;
                  }
                }}
              >
                <option value="Choose">
                  Choose a Component Type
                </option>
                <option value="Accessory">Accessory</option>
                <option value="Integral">Integral</option>
              </select>
              <Form.Text className="text-muted">
                Note: Accessory can not be a priority request
              </Form.Text>
            </div>

            <Form.Group className="mb-3" controlId="qty">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                min={1}
                required
                placeholder="Quantity"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="priorityRequest">
              <Form.Check
                type="checkbox"
                label="Priority request"
                checked={isPriorityRequest}
                onChange={toggleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button className="my-4 my-md-3 mx-2 px-3" onClick={clearAll} variant="danger">Clear</Button>
          </Form>
        </Container>
        <br />
        <div className="d-flex flex-column mt-5 mt-md-0 flex-md-row text-center text-md-start justify-content-between bg-primary text-white px-3 py-3 mb-0">
          Copyright © 2022. All rights reserved.
        </div>
      </> : <Navigate to='/login' />
    }
    </>
  );
}
