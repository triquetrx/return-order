
import { useState } from "react";
import { Alert, Container, Form } from "react-bootstrap";
import TopBar from "./Navbar";
import Cookies from "universal-cookie";
import superagent from "superagent";
import { Navigate } from "react-router-dom";

export default function TrackRequest() {

    const [searchText, setSearchText] = useState("");
    const [isValid, setValid] = useState(false);
    const [result, setResult] = useState("");
    const [err, setErr] = useState(false);
    const cookies = new Cookies();
    const isAuth = cookies.get('isValid');
    const token = cookies.get('token');

    const search = (e) => {
        e.preventDefault();
        superagent
            .get(`http://localhost:8004/trackrequest/${searchText}`)
            .set("Authorization", `Bearer ${token}`)
            .then(
                (res) => {
                    console.log(res.text);
                    setValid(true);
                    setResult(res.text);
                })
            .catch(err => {
                console.log(err);
                setErr(true);
            })
    }
    return (<>{
        !isAuth ?
            <Navigate to="/login" />
            :
            <>
                <TopBar />
                <Container>
                    {err ?
                        <>
                            <Alert variant="warning" key="warning">Invalid Request, Invalid tracking id</Alert>
                            <br />
                        </> : <></>}
                    <Form onSubmit={search}>
                        <div className="input-group rounded">
                            <input type="search" className="form-control rounded" onChange={(e) => setSearchText(e.target.value)} placeholder="Enter the Tracking Id" aria-label="Search" aria-describedby="search-addon" />
                            <button className="input-group-text border-0" id="search-addon">
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </Form>
                    <br />
                    {isValid ? <div className="result">
                        <h3 className="text-secondary">Status for item with Tracking Id: {searchText}</h3>
                        <h6>Your product will be delivered by {result.split(" ")[3]}</h6>
                    </div> : <br />}

                </Container>
            </>
    }
    </>);

}