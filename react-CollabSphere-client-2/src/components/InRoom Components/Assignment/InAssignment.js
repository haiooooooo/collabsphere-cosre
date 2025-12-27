import React from "react";
import { useState, useEffect } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import "./Assignment.css";
import Material from "./Material";
import Dropzone from "react-dropzone";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../api/axios";
import Cookies from "js-cookie";

import SubmittedBy from "./SubmittedBy";
import NotSubmittedBy from "./NotSubmittedBy";

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardLink,
  MDBCardFooter,
} from "mdb-react-ui-kit";
import dayjs from "dayjs";
import { nanoid } from "nanoid";

const token = Cookies.get("token");
const uid = Cookies.get("uid");

function createFileCards(file) {
  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/download`, {
        responseType: "blob",
        headers: {
          authorization: `Token ${token}`,
          fileid: file._id,
        },
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalname; // Set the desired file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (!error.response) {
        alert("Network error. Try again!");
      } else {
        alert("Server error. Try Again!");
      }
    }
  };
  return (
    <Button onClick={handleDownload}>
      <Material fileName={file.originalname} />
    </Button>
  );
}

const InAssignment = (props) => {
  const navigate = useNavigate();
  const [assignmentData, setAssignmentData] = useState({
    files: [],
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    async function getAnnouncements() {
      try {
        const response = await axios.post(
          "/api/assignment/getAssignment",
          JSON.stringify({
            assignmentID: props.id,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
              uid: uid,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setAssignmentData(response.data.assignment);
          setIsAdmin(response.data.isAdmin);
          console.log(response.data);
          // setAssignmentContent(response.data.assignments);
          if (response.data.assignment.submitted == true) {
            setButtonText("Un-Submit");
          }
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else if (error.response.status === 404) {
          alert("Assignment Not Found!");
        } else {
          alert("Server error. Try Again!");
        }
      }
    }

    getAnnouncements();
  }, []);

  const handleFilesDrop = (files) => {
    setAssignmentData({
      ...assignmentData,
      files: files,
    });
  };

  const handleSubmit = async () => {
    if (buttonText === "Submit") {
      const formData = new FormData();
      formData.append("assignmentID", assignmentData._id);
      for (let i = 0; i < assignmentData.files.length; i++) {
        formData.append("files", assignmentData.files[i]);
      }
      try {
        const response = await axios.post(
          "/api/assignment/submitAssignment",
          formData,
          {
            headers: {
              authorization: `Token ${token}`,
              uid: uid,
              uploadid: nanoid(),
            },
          }
        );

        if (response.status === 200) {
          setButtonText("Un-Submit");
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else if (error.response.status === 500) {
          alert("Error submitting assignment!");
        } else {
          alert("Server error. Try Again!");
        }
      }
    } else {
      try {
        const response = await axios.put(
          "/api/assignment/unSubmitAssignment",
          {},
          {
            headers: {
              authorization: `Token ${token}`,
              uid: uid,
              assid: assignmentData._id,
            },
          }
        );
        if (response.status === 200) {
          setButtonText("Submit");
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else if (error.response.status === 500) {
          alert("Error un-submitting assignment!");
        } else {
          alert("Server error. Try Again!");
        }
      }
    }
  };

  const [studentList, setStudentList] = useState(<></>);

  return (
    <div>
      <MDBContainer>
        <Button
          className="DialogButtonAnnouncement p-0 m-0 justify-content-start "
          onClick={props.setCardsPage}
          style={{ minWidth: "0" }}
        >
          <ArrowBackIcon />
        </Button>

        <MDBCard className="my-2">
          <MDBCardBody>
            <div className="d-flex justify-content-between align-items-center">
              <MDBCardTitle style={{ fontSize: "1.7em" }}>
                {props.AssignmentTitle}
              </MDBCardTitle>

              <MDBCardSubTitle>
                Graded out of {assignmentData.grade}
              </MDBCardSubTitle>
            </div>

            <MDBCardSubTitle style={{ fontSize: ".8em", fontStyle: "oblique" }}>
              Due on {dayjs(props.dueDate).format("llll")}
            </MDBCardSubTitle>
            <br></br>
            <MDBCardText>{assignmentData.description}</MDBCardText>
            {isAdmin ? (
              <></>
            ) : (
              <Dropzone onDrop={handleFilesDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div
                      {...getRootProps()}
                      style={{ padding: "20px", border: "2px dashed #aaa" }}
                    >
                      <input {...getInputProps()} />
                      <p>Drag and drop files here, or click to select files</p>
                      {assignmentData.files.map((file) => (
                        <Box key={file.name}>
                          {file.name} - {file.size} bytes
                        </Box>
                      ))}
                    </div>
                  </section>
                )}
              </Dropzone>
            )}
          </MDBCardBody>
          {assignmentData.files.length != 0 ? (
            <MDBCardFooter>
              <MDBCardSubTitle>Material</MDBCardSubTitle>
              {assignmentData.files.map(createFileCards)}
            </MDBCardFooter>
          ) : (
            <></>
          )}
          {isAdmin ? (
            <></>
          ) : (
            <Button className="DialogButtonAnnouncement" onClick={handleSubmit}>
              {buttonText}
            </Button>
          )}
        </MDBCard>

        {isAdmin ? (
          <MDBCard className="my-2">
            <div className="d-flex justify-content-center">
              <Button
                className="DialogButtonAnnouncement "
                onClick={() => {
                  setStudentList(
                    <SubmittedBy list={assignmentData.submittedBy} />
                  );
                }}
              >
                Submitted BY
              </Button>
              <Button
                className="DialogButtonAnnouncement "
                onClick={() => {
                  setStudentList(
                    <NotSubmittedBy list={assignmentData.notSubmittedBy} />
                  );
                }}
              >
                Not Submitted BY
              </Button>
            </div>
            {studentList}
          </MDBCard>
        ) : (
          <></>
        )}
      </MDBContainer>
    </div>
  );
};

export default InAssignment;
