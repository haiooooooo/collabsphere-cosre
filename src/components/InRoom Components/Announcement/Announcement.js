import React, { useState, useEffect } from "react";
import AnnouncementCards from "./AnnouncementCards";
// import AnnouncementContent from "./AnnouncementContent";
import Button from "@mui/material/Button";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { Alert } from "@mui/material";
import "./Announcement.css";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";
import axios from "../../../api/axios";
import { nanoid } from "nanoid";

const token = Cookies.get("token");
const uid = Cookies.get("uid");

const Announcement = (props) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [announcementAlert, setAnnouncementAlert] = useState(false);
  const [AnnouncementContent, setAnnouncementContent] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [update, setUpdate] = useState(0);

  function createAnnouncementCards(AnnouncementCard) {
    return (
      <AnnouncementCards
        postID={AnnouncementCard._id}
        senderName={AnnouncementCard.createdBy.name}
        createdBy={AnnouncementCard.createdBy._id}
        message={AnnouncementCard.content}
        fileName={AnnouncementCard?.files[0]?.originalname}
        fileId={AnnouncementCard.files[0]?._id}
        isAdmin={isAdmin}
        onFunctionCall={handleFunctionCall}
      />
    );
  }

  const handleFunctionCall = () => {
    setUpdate(update + 1);
  };

  useEffect(() => {
    setAnnouncementContent([]);
    async function getAnnouncements() {
      try {
        const response = await axios.post(
          "/api/teams/teamPosts",
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
          console.log(response.data);
          setIsAdmin(response.data.isAdmin);
          setAnnouncementContent(response.data.teamPosts);
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

  const announceMessage = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setAnnouncementAlert(false);
    setOpen(false);
    setMessage("");
    setFile(null);
  };

  const handleSendMessage = async () => {
    // Handle sending the message and file here
    // You can use 'message' and 'file' state values
    // Reset the form and close the dialog afterward
    if (message.length === 0) {
      setAnnouncementAlert(
        <Alert severity="error">Message should not be empty!</Alert>
      );
    } else {
      const formData = new FormData();
      formData.append("teamID", props?.roomId);
      formData.append("content", message);
      formData.append("files", file);
      console.log(file);

      try {
        const response = await axios.post("/api/post/createPost", formData, {
          headers: {
            authorization: `Token ${token}`,
            uid: uid,
            uploadid: nanoid(),
          },
        });

        if (response.status === 200) {
          setAnnouncementAlert(false);
          setMessage("");
          setFile(null);
          setOpen(false);
          setUpdate(update + 1);
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else {
          alert("Server error. Try Again!");
        }
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf,.doc,.docx,.jpg,.png",
    onDrop: (acceptedFiles) => {
      // Handle the dropped file(s) here
      setFile(acceptedFiles[0]);
    },
  });

  return (
    <div>
      <Button
        className="mx-1 p-1 announcement"
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
        onClick={announceMessage}
      >
        <CampaignRoundedIcon style={{ color: "ff7f7f", fontSize: "40px" }} />
      </Button>

      {AnnouncementContent.length == 0 ? (
        <div
          className="container d-flex nothing-here"
          style={{ height: "90vh", alignItems: "center" }}
        >
          <div className="mx-auto">Looks Like there are no posts here!</div>
        </div>
      ) : (
        AnnouncementContent.map(createAnnouncementCards)
      )}

      <Dialog open={open} onClose={handleClose}>
        {announcementAlert}
        <DialogTitle>Announcement</DialogTitle>
        <DialogContent>
          <TextField
            className="mt-2 mb-2"
            label="Create an announcement"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag and drop files here, or click to select files</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "black" }}>
            Cancel
          </Button>
          <Button
            className="DialogButtonAnnouncement"
            onClick={handleSendMessage}
            color="primary"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Announcement;
