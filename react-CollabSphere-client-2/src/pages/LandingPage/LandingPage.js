import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Home from "../../components/LandingPageContent/Home/Home";
import Assignment from "../../components/LandingPageContent/Assignment/Assignment";
import { MDBContainer } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import ChatSocket from "../../components/LandingPageContent/ChatSocket/ChatSocket";
import TextEditor from "../Tools/TextEditor";
import AIAssistant from "../Tools/AIAssistant";
import Whiteboard from "../Tools/Whiteboard";
import Diagram from "../Tools/Diagram";

function LandingPage() {
  const [currentTab, setCurrentTab] = useState("home"); // Initialize the current tab
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    const uid = Cookies.get("uid");
    if (!token || !uid) navigate("/");
  }, [navigate]);
  // Function to update the currentTab state
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  let content;

  switch (currentTab) {
    case "home":
      content = <Home />;
      break;
    case "assignment":
      content = <Assignment />;
      break;
    case "chat":
      content = <ChatSocket />;
      break;
    case "docs":
      content = <MDBContainer style={{ paddingTop: 12 }}><TextEditor /></MDBContainer>;
      break;
    case "whiteboard":
      content = <MDBContainer style={{ paddingTop: 12 }}><Whiteboard /></MDBContainer>;
      break;
    case "diagram":
      content = <MDBContainer style={{ paddingTop: 12 }}><Diagram /></MDBContainer>;
      break;
    case "ai":
      content = <MDBContainer style={{ paddingTop: 12 }}><AIAssistant /></MDBContainer>;
      break;
    // case "chat":
    //   content = <ChatComponent />;
    //   break;
    default:
      content = <Home />; // Default to Home if currentTab doesn't match any case
  }

  return (
    <div>
      <NavBar currentTab={currentTab} onTabChange={handleTabChange} />
      {content} {/* Render the determined content */}
    </div>
  );
}

export default LandingPage;
