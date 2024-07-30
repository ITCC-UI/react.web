import React, { useState } from "react";
import { CssBaseline, Drawer, IconButton, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import './Msidebar.scss';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import LogOutIcon from "/images/Logout.png";
import Logo from "/images/UI_logo.png";

const Sidebar = ({ accordions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const navigate = useNavigate();
  
  const LogOut = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div className="Sidebar">
      <CssBaseline />
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleSidebar}
        className="menuButton"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        className="drawer"
      >
        <List>
          <div className="logoContainer">
            <img src={Logo} alt="Logo" />
          </div>
          {accordions.map((accordion, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleAccordionChange(index)}
              disabled={accordion.disabled}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{accordion.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {accordion.links.map((link, idx) => (
                    <ListItem button key={idx} component={link.target ? "a" : Link} to={link.to} href={link.to} target={link.target}>
                      <ListItemText primary={link.label} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
          <div className="logoutContainer">
            <div className="logOut" onClick={LogOut}>
              <img src={LogOutIcon} alt="LogOut" /> Log Out
            </div>
          </div>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
