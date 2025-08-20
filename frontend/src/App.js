// App.js

import React from "react";
import logo from "./logo.svg";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Card
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import CreateStudent from "./Components/create-student.component.js";
import EditStudent from "./Components/edit-student.component.js";
import StudentList from "./Components/student-list.component.js";

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <header className="App-header">
          <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
              <Navbar.Brand as={Link} to="/create-student" className="d-flex align-items-center">
                <img
                  src={logo}
                  alt="Logo"
                  width={50}
                  height={50}
                  className="me-2 rounded bg-white p-1"
                />
                <span className="fw-bold fs-4">My Class</span>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav>
                  <Nav.Link as={Link} to="/create-student">
                    Create Student
                  </Nav.Link>
                  <Nav.Link as={Link} to="/student-list">
                    Student List
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        {/* Conteúdo */}
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <Card className="shadow-lg my-4">
                <Card.Body>
                  <Routes>
                    <Route path="/" element={<CreateStudent />} />
                    <Route path="/create-student" element={<CreateStudent />} />
                    <Route path="/edit-student/:id" element={<EditStudent />} />
                    <Route path="/student-list" element={<StudentList />} />
                  </Routes>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
};

export default App;
