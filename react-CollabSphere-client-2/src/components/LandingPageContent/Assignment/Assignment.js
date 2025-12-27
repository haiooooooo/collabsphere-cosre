import React, { useState, useEffect } from "react";
import AssignmentCards from "./AssignmentCards";
import Cookies from "js-cookie";
import axios from "../../../api/axios";
import Grid from "@mui/material/Grid";
// import AssignmentContent from "./AssignmentContent";
import Button from "@mui/material/Button";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

import "./Assignment.css";
import InAssignment from "./InAssignment";

const token = Cookies.get("token");
const uid = Cookies.get("uid");

const Assignment = () => {
  const [assignmentContent, setAssignmentContent] = useState([]);
  const [pageContent, setPageContent] = useState(<></>);
  let cards;

  useEffect(() => {
    async function getAnnouncements() {
      try {
        const response = await axios.get("/api/assignment/assignments", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            uid: uid,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setAssignmentContent(response.data.assignments);
          cards = response.data.assignments.map(createAssignmentCard);
          setPageContent(response.data.assignments.map(createAssignmentCard));
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else {
          alert("Error Occurred. Try again!");
        }
      }
    }

    getAnnouncements();
  }, []);

  function createAssignmentCard(AssignmentCard) {
    const setInAssignmentPage = () => {
      setPageContent(
        <InAssignment
          id={AssignmentCard._id}
          AssignmentTitle={AssignmentCard.title}
          dueDate={AssignmentCard.dueDate}
          dueTime={AssignmentCard.dueTime}
          setCardsPage={setCardsPage}
          grade={AssignmentCard.grade}
          desc={AssignmentCard.desc}
        />
      );
    };

    var randomNumber = Math.floor(Math.random() * 4);
    return (
      <AssignmentCards
        id={AssignmentCard._id}
        AssignmentTitle={AssignmentCard.title}
        dueDate={AssignmentCard.dueDate}
        dueTime={AssignmentCard.dueTime}
        setInAssignmentPage={setInAssignmentPage}
        randomNumber={randomNumber}
      />
    );
  }

  const setCardsPage = () => {
    setPageContent(cards);
  };

  return (
    <div className="m-3">
      {pageContent}
    </div>
  );
};

export default Assignment;
