import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardLink,
  MDBCardFooter,
} from "mdb-react-ui-kit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const MemberInfoCard = (props) => {

  var bgColor = "white";
  if (props.type === "Leader") {
    bgColor = "#ffcaca";
  } else {
    bgColor = "white";
  }

  return (
    <div
      className="d-flex my-1 p-1 "
      style={{
        background: bgColor,
        border: "0.5px solid black",
        borderRadius: "20px",
      }}
    >
      <div className="col-6 d-flex justify-content-start align-items-center">
        <AccountCircleIcon style={{ fontSize: "40px" }} />
        <MDBCardSubTitle className="p-0 m-0" style={{whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"}}>{props.name}</MDBCardSubTitle>
      </div>
      <div className="col-6 d-flex justify-content-end align-items-center">
        <MDBCardSubTitle
          className="p-0 mx-2 my-0"
          style={{ fontStyle: "oblique", fontWeight: "lighter" ,whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"}}
        >
          {props.email}
        </MDBCardSubTitle>
      </div>
    </div>
  );
};

export default MemberInfoCard;
