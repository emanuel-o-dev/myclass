// //src/Components/edit-student.component.js

// EditStudent Component for update student data
// Import Modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentForm from "./StudentForm";
import { useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
// EditStudent Component
const EditStudent = (props) => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    rollno: "",
  });
  const location = useLocation().pathname;
  const id = location.split("/edit-student/", -1)[1];

  const navigate = useNavigate();

  //onSubmit handler
  const onSubmit = (studentObject) => {
    axios
      .put("https://dev.myclass.com:4000/students/students/" + id, studentObject)
      .then((res) => {
        if (res.status === 200) {
          alert("Student successfully updated");
          navigate("/student-list");
        } else Promise.reject();
      })
      .catch((err) => alert("Something went wrong"));
  };

  // Load data from server and reinitialize student form
  useEffect(() => {
    axios
      .get("https://dev.myclass.com:4000/students/students/" + id)
      .then((res) => {
        const { name, email, rollno } = res.data;
        setFormValues({
          name,
          email,
          rollno,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  // Return student form
  return (
    <StudentForm
      initialValues={formValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      Update Student
    </StudentForm>
  );
};

// Export EditStudent Component
export default EditStudent;
