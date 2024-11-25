//App.js

// Import React
import React from "react";
// Import Logo
import logo from "./logo.svg";
// Import Bootstrap
import { Nav, Navbar, Container, Row, Col }
    from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

// Import Custom CSS
import "./App.css";

// Import from react-router-dom
import {
    BrowserRouter as Router, Routes,
    Route, Link
} from "react-router-dom";

// Import other React Component
import CreateStudent from "./Components/create-student.component.js";
import EditStudent from
    "./Components/edit-student.component.js";
import StudentList from
    "./Components/student-list.component.js";

// App Component
const App = () => {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Navbar bg="dark" variant="dark">
                        <Container>
                            <Navbar.Brand>
                                <Link to={"/create-student"} className="nav-link"> <img src={logo} alt="Logo" 
                                    width={150} height={100} style={{ backgroundColor: "white" }} /> My Class
                                </Link>
                            </Navbar.Brand>

                            <Nav className="justify-content-end">
                                <Nav>
                                    <Link to={"/create-student"}
                                        className="nav-link">
                                        Create Student
                                    </Link>
                                </Nav>

                                <Nav>
                                    <Link to={"/student-list"}
                                        className="nav-link">
                                        Student List
                                    </Link>
                                </Nav>
                            </Nav>
                        </Container>
                    </Navbar>
                </header>

                <Container>
                    <Row>
                        <Col md={12}>
                            <div className="wrapper">
                                <Routes>
                                    <Route exact path="/"
                                        Component={CreateStudent} />
                                    <Route path="/create-student"
                                        Component={CreateStudent} />
                                    <Route path="/edit-student/:id"
                                        Component={EditStudent} />
                                    <Route path="/student-list"
                                        Component={StudentList} />
                                </Routes>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Router>
    );
};

export default App;
