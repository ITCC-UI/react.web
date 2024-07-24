import React, { useState } from "react";
import { CssBaseline, Drawer, IconButton, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import './Msidebar.scss';

const Sidebar = ({ accordions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
          {accordions.map((accordion, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleAccordionChange(index)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{accordion.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {accordion.links.map((link, idx) => (
                    <ListItem button key={idx} component="a" href={link.href}>
                      <ListItemText primary={link.label} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
