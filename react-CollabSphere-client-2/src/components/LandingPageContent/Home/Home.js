import React, { useState, useEffect } from "react";
import RoomCard from "../../RoomCard/RoomCard";
// import roomCollection from "../../RoomCard/roomCollection";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import Cookies from "js-cookie";
import axios from "../../../api/axios";
// import zIndex from "@mui/material/styles/zIndex";

function createRoom(room) {
  return (
    <Grid
      className="d-flex justify-content-center"
      xs={12}
      sm={6}
      md={4}
      lg={3}
      key={room.id}
    >
      <RoomCard
        className=""
        roomId={room._id}
        roomCode={room.code}
        roomName={room.name}
        teacherName={room.createdBy.name}
        image={room.image}
      />
    </Grid>
  );
}

const token = Cookies.get("token");
const uid = Cookies.get("uid");

function Home() {
  const navigate = useNavigate();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [joinAlert, setJoinAlert] = useState(false);
  const [createAlert, setCreateAlert] = useState(false);
  const [roomCollection, setRoomCollection] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    async function getTeams() {
      try {
        const response = await axios.post(
          "/api/teams/getTeams",
          {},
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
          setRoomCollection(response.data);
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else if (error.response.status === 500) {
          alert("Error Occurred. Try Again!");
        }
      }
    }
    getTeams();
  }, [update]);

  function hasWhiteSpace(s) {
    return /\s/g.test(s);
  }

  const handleOpenJoinDialog = () => {
    setJoinDialogOpen(true);
  };

  const handleCloseJoinDialog = () => {
    setJoinAlert(false);
    setClassCode("");
    setJoinDialogOpen(false);
  };

  const handleJoinClass = async () => {
    // Handle joining the class with the entered classCode
    if (classCode.length !== 6) {
      setJoinAlert(
        <Alert severity="error">Code should be 6 character long!</Alert>
      );
      console.error("Code should be 6 character long!");
    } else if (hasWhiteSpace(classCode)) {
      setJoinAlert(
        <Alert severity="error">Code should not contain spaces!</Alert>
      );
    } else {
      setJoinAlert(false);
      try {
        const response = await axios.put(
          "/api/teams/joinTeam",
          JSON.stringify({ code: classCode }),
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
          handleCloseJoinDialog();
          // window.location.reload();
          setUpdate(update + 1);
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else if (error.response.status === 400) {
          alert("You have already joined this room!");
        } else if (error.response.status === 404) {
          alert("Room does not exists!");
        } else {
          alert("Server Error. Try Again Later!");
        }
      }
    }
  };

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [roomName, setRoomName] = useState("");

  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateAlert(false);
    setRoomName("");
    setCreateDialogOpen(false);
  };

  const handleCreateRoom = async () => {
    // Handle creating the room with the entered roomName
    if (roomName.length === 0) {
      setCreateAlert(
        <Alert severity="error">Room name should not be empty!</Alert>
      );
    } else {
      setCreateAlert();
      try {
        const response = await axios.post(
          "/api/teams/createTeams",
          JSON.stringify({ name: roomName }),
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
          // navigate("/landingpage");
          // window.location.reload();
          setUpdate(update + 1);
          handleCloseCreateDialog();
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else if (error.response.status === 500) {
          alert("Error occured. Try Again!");
        }
      }
    }
  };

  return (
    <div>
      <div
        className="floating-palet"
        style={{
          width: "150px",
          height: "60px",
          background: "transparent",
          display: "flow-root",
          position: "fixed",
          right: "20px",
          bottom: "25px",
          zIndex: "3",
        }}
      >
        <Button
          className="mx-1 p-1 join-room"
          style={{
            background: "white",
            borderRadius: "90%",
            height: "60px",
            width: "60px",
            boxShadow: "0px 0px 1px 1px #ff7f7f",
          }}
          onClick={handleOpenJoinDialog}
        >
          <svg
            width="50px"
            height="50px"
            viewBox="0 0 24.00 24.00"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ff7f7f"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#CCCCCC"
              stroke-width="0.192"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g clip-path="url(#clip0_429_11126)">
                {" "}
                <path
                  d="M9 4.00018H19V18.0002C19 19.1048 18.1046 20.0002 17 20.0002H9"
                  stroke="#ff7f7f"
                  stroke-width="1.032"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  d="M12 15.0002L15 12.0002M15 12.0002L12 9.00018M15 12.0002H5"
                  stroke="#ff7f7f"
                  stroke-width="1.032"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>{" "}
              <defs>
                {" "}
                <clipPath id="clip0_429_11126">
                  {" "}
                  <rect width="24" height="24" fill="white"></rect>{" "}
                </clipPath>{" "}
              </defs>{" "}
            </g>
          </svg>
        </Button>

        <Button
          className="mx-1 p-1 create-room"
          style={{
            background: "white",
            borderRadius: "90%",
            height: "60px",
            width: "60px",
            boxShadow: "0px 0px 1px 1px #ff7f7f",
          }}
          onClick={handleOpenCreateDialog}
        >
          <PersonAddAltRoundedIcon
            style={{ fontSize: "40px", color: "#ff7f7f" }}
          />
        </Button>
      </div>

      <Grid className="m-0 w-100" container spacing={3}>
        {roomCollection.length != 0 ? (
          roomCollection.map(createRoom)
        ) : (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "100vh" }}
          >
            <Grid item xs={3}>
              <div>Looks Like you haven't joined any room!</div>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Dialog
        class="join-room-dialog "
        open={joinDialogOpen}
        onClose={handleCloseJoinDialog}
        style={{}}
      >
        {joinAlert}
        <DialogTitle>Join Class</DialogTitle>
        <DialogContent className="dialog-content ">
          <TextField
            className="mt-3 text-field-dialog"
            label="Class Code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            className="DialogButtonCancel"
            onClick={handleCloseJoinDialog}
            type="reset"
          >
            Cancel
          </Button>
          <Button
            className="DialogButtonJoin"
            onClick={handleJoinClass}
            color="primary"
            type="submit"
          >
            Join
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog}>
        {createAlert}
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            className="mt-3 text-field-dialog"
            label="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            className="DialogButtonCancel"
            onClick={handleCloseCreateDialog}
          >
            Cancel
          </Button>
          <Button
            className="DialogButtonCreate"
            onClick={handleCreateRoom}
            type="submit"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
