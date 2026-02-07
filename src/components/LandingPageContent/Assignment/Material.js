import React from "react";
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBCardFooter,
} from "mdb-react-ui-kit";
import FilePresentIcon from "@mui/icons-material/FilePresent";


export default function Material(props) {
  return (
    <MDBBtn
      href=""
      className="p-0 mx-2 "
      style={{
        backgroundColor: "transparent",
        boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
      }}
    >
      <FilePresentIcon
        style={{ fontSize: "50px", color: "#FF7F7F" }}
      ></FilePresentIcon>
      <p style={{ color: "#FF7F7F" }}>{props.fileName}</p>
    </MDBBtn>
  );
}
