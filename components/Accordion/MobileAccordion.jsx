// MobileAccordion.jsx
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MobileAccordion = ({ title, items, closeMenu }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${title}-content`}
        id={`${title}-header`}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.link} 
                color="inherit" 
                underline="hover"
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default MobileAccordion;