import React, { useState, useEffect } from "react";
import AssignmentCards from "./AssignmentCards";
// import AssignmentContent from "./AssignmentContent";
import Button from "@mui/material/Button";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import Dropzone from "react-dropzone";
import { Box } from "@mui/material";
import Cookies from "js-cookie";
import axios from "../../../api/axios";
import "./Assignment.css";
import InAssignment from "./InAssignment";
import card from "@material-tailwind/react/theme/components/card";
import { nanoid } from "nanoid";

const token = Cookies.get("token");
const uid = Cookies.get("uid");

const Assignment = (props) => {
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

  const [AssignmentContent, setAssignmentContent] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageContent, setPageContent] = useState(null);
  const [update, setUpdate] = useState(0);
  let cards;

  useEffect(() => {
    async function getAnnouncements() {
      try {
        const response = await axios.post(
          "/api/teams/teamAssignments",
          JSON.stringify({ teamID: props?.roomId }),
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
          setIsAdmin(response.data.isAdmin);
          setAssignmentContent(response.data.teamAssignments);
          setPageContent(
            response.data.teamAssignments.map(createAssignmentCard)
          );
          cards = response.data.teamAssignments.map(createAssignmentCard);
          // setAnnouncementContent(response.data.teamPosts);
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else {
          alert("Server error. Try Again!");
        }
      }
    }

    getAnnouncements();
  }, [update]);

  const setCardsPage = () => {
    setPageContent(cards);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    dateAndTime: null,
    grade: "",
    files: [],
  });
  const currentDateTime = getDateTime();

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAssignmentData({
      ...assignmentData,
      [name]: value,
    });
  };

  const handleDueDateChange = (date) => {
    setAssignmentData({
      ...assignmentData,
      dateAndTime: date,
    });
  };

  const handleDueTimeChange = (time) => {
    setAssignmentData({
      ...assignmentData,
      dueTime: time,
    });
  };

  const handleFilesDrop = (files) => {
    setAssignmentData({
      ...assignmentData,
      files: files,
    });
  };

  const handleAddAssignment = async () => {
    // Handle adding the assignment data to your content or API here
    console.log(assignmentData.dateAndTime);
    const formData = new FormData();
    formData.append("teamID", props?.roomId);
    formData.append("title", assignmentData.title);
    formData.append("description", assignmentData.description);
    formData.append("grade", assignmentData.grade);
    formData.append("dueDate", assignmentData.dateAndTime);
    formData.append("files", assignmentData.files[0]);

    try {
      const response = await axios.post(
        "/api/assignment/createAssignment",
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
        setAssignmentData({
          title: "",
          description: "",
          dateAndTime: null,
          grade: "",
          files: [],
        });
        setIsDialogOpen(false);
        setUpdate(update + 1);
      }
    } catch (error) {
      if (!error.response) {
        alert("Network error. Try again!");
      } else {
        alert("Server error. Try Again!");
      }
    }
    // Clear the form and close the dialog
  };

  const addAssignmentButton = (
    <Button
      className="mx-1 p-1 add-assignment "
      style={{
        display: "flow-root",
        position: "fixed",
        right: "20px",
        bottom: "25px",
        zIndex: "3",
        background: "white",
        borderRadius: "90%",
        height: "60px",
        width: "60px",
        boxShadow: "0px 0px 1px 1px #ff7f7f",
      }}
      onClick={handleDialogOpen}
    >
      <AddCircleOutlinedIcon style={{ color: "ff7f7f", fontSize: "50px" }} />
    </Button>
  );
  const [showAddAssginmentButton, setshowAddAssginmentButton] =
    useState(addAssignmentButton);

  function getDateTime() {
    const temp = new Date();
    const day = temp.getUTCDay();
    const month = temp.getUTCMonth();
    const year = temp.getFullYear();
    const hours = temp.getHours();
    const minutes = temp.getMinutes();
    const seconds = temp.getSeconds();

    return `"${year}-${month}-${day} ${hours}:${minutes}:${seconds}"`;
  }

  return (
    <div>
      {/* {pageContent == cards ? addAssignmentButton : <></>} */}

      <div className="m-3">{pageContent}</div>

      {isAdmin ? addAssignmentButton : <></>}

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={assignmentData.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={assignmentData.description}
            onChange={handleInputChange}
          />

          <TextField
            margin="dense"
            name="grade"
            label="Grade"
            type="number"
            fullWidth
            value={assignmentData.grade}
            onChange={handleInputChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              className="my-2"
              format="DD-MM-YYYY HH:mm "
              label="Due Date"
              slotProps={{
                textField: {
                  helperText: "MM/DD/YYYY",
                },
              }}
              value={assignmentData.dateAndTime}
              onChange={(newValue) =>
                setAssignmentData({
                  ...assignmentData,
                  dateAndTime: newValue,
                })
              }
              minDateTime={dayjs(currentDateTime)}
              // defaultValue={currentDateTime}
            />
          </LocalizationProvider>

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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} style={{ color: "black" }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddAssignment}
            className="DialogButtonAnnouncement"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Assignment;
