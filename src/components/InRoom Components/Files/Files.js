import React, { useState, useEffect } from "react";
import FileCard from "./FileCard";
import FileContent from "./FileContent";
import Cookies from "js-cookie";
import axios from "../../../api/axios";
import { nanoid } from "nanoid";
import { useDropzone } from "react-dropzone";
import Button from "@mui/material/Button";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

const token = Cookies.get("token");
const uid = Cookies.get("uid");

function FileCreate(File) {
  return (
    <FileCard
      fileName={File.originalname}
      fileType={File.mimetype}
      creationDate={File.creationDate}
      fileLink={File._id}
    />
  );
}

const Files = (props) => {
  const [open, setOpen] = useState(false);
  const [FileContent, setFileContent] = useState([]);
  const [files, setFiles] = useState(null);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    async function getAnnouncements() {
      try {
        const response = await axios.post(
          "/api/teams/teamFiles",
          JSON.stringify({ teamid: props?.roomId }),
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
          console.log(response.data[0].files);
          setFileContent(response.data[0].files);
          // setIsAdmin(response.data.isAdmin);
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

  const addFiles = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFiles(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf,.doc,.docx,.jpg,.png",
    onDrop: (acceptedFiles) => {
      // Handle the dropped file(s) here
      setFiles(acceptedFiles);
      console.log(files);
    },
  });

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("teamID", props?.roomId);
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      const response = await axios.post(
        "/api/teams/teamUploadFiles",
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
        setUpdate(update + 1);
        handleClose();
      }
    } catch (error) {
      if (!error.response) {
        alert("Network error. Try again!");
      } else {
        alert("Server error. Try Again!");
      }
    }
  };

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
        onClick={addFiles}
      >
        <AddCircleOutlinedIcon style={{ color: "ff7f7f", fontSize: "50px" }} />
      </Button>
      {FileContent.length == 0 ? (
        <div
          className="container d-flex nothing-here"
          style={{ height: "90vh", alignItems: "center" }}
        >
          <div className="mx-auto">Looks Like there are no files here!</div>
        </div>
      ) : (
        FileContent.map(FileCreate)
      )}
      {/* {FileContent.map(FileCreate)} */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Files:</DialogTitle>
        <DialogContent>
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
            onClick={handleUpload}
            color="primary"
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Files;
