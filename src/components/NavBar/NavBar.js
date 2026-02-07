import logo from "../../Assets/CollabSphereLogoLinear.svg";
import "./NavBar.css";
import React, { useState } from "react";

import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from "mdb-react-ui-kit";
import Cookies from "js-cookie";

function NavBar({ currentTab, onTabChange }) {
  const [showBasic, setShowBasic] = useState(false);

  // Function to handle tab click and update the currentTab state
  const handleTabClick = (tab) => {
    onTabChange(tab); // Call the onTabChange prop to update the currentTab state
    setShowBasic(false); // Close the navbar after a tab is clicked
  };

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('uid')
    Cookies.remove('email')
    Cookies.remove('name')
    window.location.reload()
  };

  const hello = {
    width: "0px",
    cssText: 'width: 0px !important',
  };

  return (
    <MDBNavbar expand="lg" light bgColor="light" className="p-0">
      <img
        src={logo}
        style={{
          position: "absolute",
          height: "50px",
          top: "-3px",
          left: "5px",
        }}
      />
      <MDBContainer fluid>
        <MDBNavbarBrand href="#">
          <img height="32" alt="" />
        </MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className="justify-content-center next mb-2 mb-lg-0">
            <MDBNavbarItem>
              <MDBNavbarLink
                active={currentTab === "home"} // Set active based on currentTab
                onClick={() => handleTabClick("home")}
              >
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink
                active={currentTab === "assignment"} // Set active based on currentTab
                onClick={() => handleTabClick("assignment")}
              >
                Assignment
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink
                active={currentTab === "chat"} // Set active based on currentTab
                onClick={() => handleTabClick("chat")}
              >
                Chat
              </MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink
                active={currentTab === "docs"}
                onClick={() => handleTabClick("docs")}
              >
                Docs
              </MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle
                  tag="a"
                  className={`nav-link ${
                    currentTab === "whiteboard" || currentTab === "diagram"
                      ? "active"
                      : ""
                  }`}
                  role="button"
                >
                  Tools
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link onClick={() => handleTabClick("whiteboard")}>
                    Whiteboard
                  </MDBDropdownItem>
                  <MDBDropdownItem link onClick={() => handleTabClick("diagram")}>
                    Diagram
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink
                active={currentTab === "ai"}
                onClick={() => handleTabClick("ai")}
              >
                AI
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>
          <MDBNavbarNav className="w-0 justify-content-end next mb-2 mb-lg-0 " style={hello} >
            <MDBNavbarItem className="justify-content-end">
              <MDBNavbarLink onClick={handleLogout}>Logout</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>

          <form className="d-flex input-group w-auto"></form>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default NavBar;
