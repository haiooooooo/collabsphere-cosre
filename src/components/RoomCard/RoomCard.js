import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom"; // Import Link from React Router
import image1 from "../../Assets/React.jpg";
import image2 from "../../Assets/Maths.jpg";
import image3 from "../../Assets/Science.webp";
import image4 from "../../Assets/History.jpg";
import image5 from "../../Assets/English.jpg";
import image6 from "../../Assets/Cloud.jpg";
import image7 from "../../Assets/Node.jpg";
import image8 from "../../Assets/Others.jpg";

import "./RoomCard.css";

export default function RoomCard(props) {
  const items = [image1, image2, image3, image4, image5,image6,image7,image8];

  const randomIndex = Math.floor(Math.random() * items.length);
  var randomItem = items[randomIndex];

  if (props.roomName === 'React') {
    randomItem = items[0];
  } else if (props.roomName === 'Maths') {
    randomItem = items[1];
  } else if (props.roomName === 'Science') {
    randomItem = items[2];
  } else if (props.roomName === 'History') {
    randomItem = items[3];
  } else if (props.roomName === 'English') {
    randomItem = items[4];
  } 
  else if (props.roomName === 'Cloud') {
    randomItem = items[5];
  }
  else if (props.roomName === 'Node') {
    randomItem = items[6];
  }
  else {
    // Handle the case when props.roomName doesn't match any of the specified values
    randomItem = items[7]; // Assign a default value or handle it as per your requirement
  }

  return (
    <Link
      to="/InRoom"
      state={{ roomId: props.roomId, roomCode: props.roomCode }}
      className="RoomCardLink d-flex justify-content-center"
      style={{ width: "100%" }}
    >
      <Card className="my-2 RoomCard">
        <CardMedia sx={{ height: 100 }} image={randomItem} />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {props.roomName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {props.teacherName}
          </Typography>
        </CardContent>
        {/* <CardActions>
        <Button size="small" className="RoomCardButton">
          Remove
        </Button>
      </CardActions> */}
      </Card>
    </Link>
  );
}
