import React, { useEffect, useState } from "react";
import MemberInfoCard from "./MemberInfoCard";
import { MDBCard, MDBCardTitle } from "mdb-react-ui-kit";
import Cookies from "js-cookie";
import axios from "../../../api/axios";
import Button from "@mui/material/Button";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import UserListItem from "../../../Assets/UserListItem";
import { styled, Typography, List } from "@mui/material";
import Alert from "@mui/material";
const token = Cookies.get("token");
const uid = Cookies.get("uid");

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const Members = (props) => {
  const handleDeleteUser = (Contact) => {
    if (isAdmin === true) {
      const result = window.confirm(
        Contact.name + " will be removed from the team. Are you sure?"
      );
      if (result) {
        const removeMember = async () => {
          try {
            const response = await axios.delete(
              "/api/teams/removeMember",

              {
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Token ${token}`,
                  uid: uid,
                  teamid: props?.roomId,
                  member: Contact._id,
                },
              }
            );
            if (response.status === 200) {
              alert("User removed successfully");
              setUpdate((prev) => prev + 1);
            }
          } catch (error) {
            if (!error.response) {
              alert("Network error. Try again!");
            } else if (error.response.status === 404) {
              alert("Unauthorized to remove!");
            } else {
              alert("Server error. Try Again!");
            }
          }
        };
        removeMember();
      } else {
        console.log("Deletion cancelled");
      }
    } else {
      console.log("Naughty ho raha hai");
    }
  };
  function CreateCard(Contact) {
    return (
      <div
        style={{ width: "100%", margin: "0" }}
        onClick={() => {
          handleDeleteUser(Contact);
        }}
      >
        <MemberInfoCard
          type={Contact.type}
          name={Contact.name}
          email={Contact.email}
        />
      </div>
    );
  }
  function CreateCardAdmin(Contact) {
    return (
      <MemberInfoCard
        type={Contact.type}
        name={Contact.name}
        email={Contact.email}
      />
    );
  }
  const [RoomLeadersContent, setRoomLeadersContent] = useState([]);
  const [RoomMembersContent, setRoomMembersContent] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialog2Open, setIsDialog2Open] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [searchUsers, setSearchUsers] = useState("");
  const [update, setUpdate] = useState(0);
  async function getAnnouncements() {
    const response = await axios.post(
      "/api/teams/teamMembers",
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
      setRoomLeadersContent(response.data.teamMembers.admin);
      setRoomMembersContent(response.data.teamMembers.members);
    }
  }

  useEffect(() => {
    async function getAnnouncements() {
      try {
        const response = await axios.post(
          "/api/teams/teamMembers",
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
          setRoomLeadersContent(response.data.teamMembers.admin);
          setRoomMembersContent(response.data.teamMembers.members);
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

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get("/api/auth/searchUsers", {
          params: {
            search: searchUsers,
          },
          headers: {
            "Content-Type": "application/json",
            authorization: `Token ${token}`,
          },
        });

        if (response.status === 200) {
          // console.log(response.data);
          setUsersList(response.data);
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else {
          alert("Server error. Try Again!");
        }
      }
    }

    getUsers();
  }, [searchUsers]);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialog2Open = () => {
    setIsDialog2Open(true);
  };

  const handleDialog2Close = () => {
    setIsDialog2Open(false);
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

  function createUsers(user) {
    async function handleCreateChat() {
      try {
        const response = await axios.put(
          "/api/teams/addMember",
          JSON.stringify({
            member: [user._id],
            teamID: props?.roomId,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Token ${token}`,
              uid,
            },
          }
        );
        if (response.status === 200) {
          // setSelectedChat(response.data);
          setUpdate(update + 1);
          setIsDialogOpen(false);
        }
      } catch (error) {
        if (!error.response) {
          alert("Network error. Try again!");
        } else if (error.response.status === 400) {
          alert("Member already exist in room!")
        } else {
          alert("Server error. Try Again!");
        }
      }
    }
    // async function removeMember() {
    //   const response = await axios.delete("/api/teams/removeMember", {
    //     headers: {
    //       "Content-Type": "application/json",
    //       authorization: `Token ${token}`,
    //       uid,
    //       teamid: props?.roomId,
    //       member: user._id,
    //     },
    //   });
    //   if (response.status === 200) {
    //     // setSelectedChat(response.data);
    //     setUpdate(update + 1);
    //     setIsDialogOpen(false);
    //   }
    // }
    return (
      <Button onClick={handleCreateChat}>
        <UserListItem
          className=""
          id={user._id}
          email={user.email}
          name={user.name}
        />
      </Button>
    );
  }

  return (
    <div>
      <MDBCard className="m-2 p-2">
        <div className="d-flex justify-content-center">
          <MDBCardTitle>Room Leaders</MDBCardTitle>
        </div>
        {RoomLeadersContent.map(CreateCardAdmin)}
      </MDBCard>

      <MDBCard className="m-2 p-2">
        <div className="d-flex justify-content-center">
          <MDBCardTitle>Members</MDBCardTitle>
        </div>
        {RoomMembersContent.map(CreateCard)}
      </MDBCard>

      {isAdmin ? addAssignmentButton : <></>}

      <Dialog open={isDialog2Open} onClose={handleDialog2Close}>
        <DialogTitle>Remove User</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleDialog2Close} style={{ color: "black" }}>
            Cancel
          </Button>
          <Button
            // onClick={handleAddAssignment}
            className="DialogButtonAnnouncement"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Users</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="users"
            label="Search Users:"
            type="text"
            fullWidth
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <Typography sx={{ mt: 0, mb: 0 }} variant="h6" component="div">
            Users:
          </Typography>
          <Demo>
            <List>{usersList?.map(createUsers)}</List>
          </Demo>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} style={{ color: "black" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Members;
