import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBCardFooter,
} from "mdb-react-ui-kit";

import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Material from "./Material";
import { Button } from "@mui/material";
import axios from "../../../api/axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const uid = Cookies.get("uid");

export default function AnnouncementCards(props) {
  const [deleteEnable, setDeleteEnable] = useState(false);

  useEffect(() => {
    if (uid === props.createdBy || props.isAdmin) {
      setDeleteEnable(true);
    }
  }, []);

  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `/api/post/deletePost`,
        JSON.stringify({ postID: props?.postID }),
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Token ${token}`,
            uid,
          },
          validateStatus: () => true,
        }
      );
      if (response.status === 200) {
        props.onFunctionCall();
      }
    } catch (error) {
      if (!error.response) {
        alert("Network error. Try again!");
      } else {
        alert("Server error. Try Again!");
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/download`, {
        responseType: "blob",
        headers: {
          authorization: `Token ${token}`,
          fileid: props.fileId,
        },
      });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = props.fileName; // Set the desired file name
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
    <MDBCard className="my-2">
      <MDBCardHeader className="d-flex p-1 m-1 justify-content-between align-items-center">
        <div className="container d-flex align-items-center">
          <AccountCircleIcon className="mx-1" style={{ fontSize: "40px" }} />
          <MDBCardTitle className="m-0 p-0" style={{ display: "inline-block" }}>
            {props.senderName}{" "}
          </MDBCardTitle>
        </div>
        {deleteEnable ? (
          <MDBBtn
            href=""
            className="p-0 mx-2 "
            onClick={handleDelete}
            style={{
              background: "transparent",
              boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
            }}
          >
            <DeleteForeverOutlinedIcon style={{ color: "rgb(79, 79, 79)" }} />
          </MDBBtn>
        ) : (
          <></>
        )}
      </MDBCardHeader>

      <MDBCardBody>
        <MDBCardText>{props.message}</MDBCardText>
      </MDBCardBody>
      {props.fileName === undefined ? (
        <></>
      ) : (
        <MDBCardFooter>
          <Button onClick={handleDownload}>
            <Material fileName={props.fileName} />
          </Button>
        </MDBCardFooter>
      )}
    </MDBCard>
  );
}
