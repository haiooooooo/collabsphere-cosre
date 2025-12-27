import React from "react";
import { Button } from "@mui/material";
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBCardFooter,
} from "mdb-react-ui-kit";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import dayjs from "dayjs";
import InAssignment from "./InAssignment";

var bgColor = ["#ffc09f", "#ffee93", "#fcf5c7", "#a0ced9", "#adf7b6"];
var clicked=false;


export default function AssignmentCards(props) {
  return (

    <Button onClick={() => props.setInAssignmentPage()} className="my-2 p-0" style={{background:'transparent',color:'black',minWidth:'100%',maxWidth:'100%',borderRadius:'20px'}}>
    <MDBCard className=" w-100" style={{ backgroundColor: bgColor[props.randomNumber]}}>
      <MDBCardBody className="d-flex justify-content-center align-items-center">
        <div
          className="col-6 d-flex justify-content-start align-items-center"
          style={{ overflow: "hidden" }}
        >
          <AssignmentOutlinedIcon style={{ fontSize: "2.5em" }} />
          <h4
            className="mb-0 mx-2 p-0"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {props.AssignmentTitle}
          </h4>
        </div>

        <div className="col-6 d-flex justify-content-end ">
          <div style={{ textAlign: "right" }}>
            <p
              className="m-0 p-0"
              style={{ fontStyle: "oblique", display: "" }}
            >
              Due on {dayjs(props.dueDate).format('llll')}
            </p>
            <p
              className="m-0 p-0"
              style={{ fontStyle: "oblique", display: "" }}
            >
              {props.dueTime}
            </p>
          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
    </Button>

  );
}
