import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InRoomNav from "../../components/InRoom Components/InRoom Nav Bar/InRoomNav";
import Assignment from "../../components/InRoom Components/Assignment/Assignment";
import Announcement from "../../components/InRoom Components/Announcement/Announcement";

import Files from "../../components/InRoom Components/Files/Files";
import Members from "../../components/InRoom Components/Members/Members";
import { MDBContainer } from "mdb-react-ui-kit";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const uid = Cookies.get("uid");

function InRoom(props) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0); // Initialize the current tab index
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(()=>{
    if(token && uid){
      // navigate('/InRoom')
    }else{
      navigate('/')
    }
  },[])
  
  useEffect(() => {
    if (state === null) {
      navigate("/LandingPage");
    }
  }, []);

  // Define an array of tab items with labels and associated content components
  const tabs = [
    { label: "Announcement", content: <Announcement roomId={state?.roomId} /> },
    { label: "Assignment", content: <Assignment roomId={state?.roomId} /> },
    { label: "Files", content: <Files roomId={state?.roomId}/> },
    { label: "Members", content: <Members roomId={state?.roomId}/> },
  ];
  // XZcTFO

  // Function to update the currentTabIndex state
  const handleTabChange = (index) => {
    setCurrentTabIndex(index);
  };

  const classCode = state?.roomCode;
  return (
    <div>
      <div
        className="d-flex justify-content-center "
        style={{ background: "white" }}
      >
        <p className="m-0 p-0">Class Code: {classCode}</p>
      </div>
      <InRoomNav
        tabs={tabs}
        currentTabIndex={currentTabIndex}
        onTabChange={handleTabChange}
      />
      <MDBContainer className="">
        {tabs[currentTabIndex].content}{" "}
        {/* Render the content based on the currentTabIndex */}
      </MDBContainer>
    </div>
  );
}

export default InRoom;
