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
  MDBCollapse,
} from "mdb-react-ui-kit";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './InRoomNav.css'

function NavBar({ tabs, currentTabIndex, onTabChange }) {
  const [showBasic, setShowBasic] = useState(false);

  // Function to handle tab click and update the currentTabIndex state
  const handleTabClick = (index) => {
    onTabChange(index); // Call the onTabChange prop to update the currentTabIndex state
    setShowBasic(false); // Close the navbar after a tab is clicked
  };

  return (
    <div>
   
    <MDBNavbar expand="lg" light bgColor="light" className='p-0' >
    
      <MDBContainer fluid>
        <MDBNavbarBrand href="/#/LandingPage" style={{ height:'40px'}}>
          <ArrowBackIcon/>
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
            {tabs.map((tab, index) => (
              <MDBNavbarItem key={index}>
                <MDBNavbarLink
                  active={currentTabIndex === index} // Set active based on currentTabIndex
                  onClick={() => handleTabClick(index)}
                >
                  {tab.label}
                </MDBNavbarLink>
              </MDBNavbarItem>
            ))}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
    </div>
  );
}

export default NavBar;
