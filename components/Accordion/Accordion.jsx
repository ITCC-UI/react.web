import React, { useState, useRef, useEffect } from 'react';
import Chevy from "/images/Chevron Right.png";
import { Link } from 'react-router-dom';

const AccordionS = ({ initialOpenSection, activeIntro, activeReg, activeDailyLog }) => {
  const [openAccordion, setOpenAccordion] = useState(initialOpenSection);
  const contentRefs = [useRef(null), useRef(null), useRef(null)];

  const toggleAccordion = (index) => {
    setOpenAccordion((prevOpenAccordion) =>
      prevOpenAccordion === index ? null : index
    );
  };

  useEffect(() => {
    const handleResize = () => {
      contentRefs.forEach((ref, index) => {
        if (ref.current && openAccordion === index) {
          ref.current.style.maxHeight = `${ref.current.scrollHeight}px`;
        }
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call the function once on mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [openAccordion]);

  const handlePanelToggle = (index) => {
    const prevOpenAccordion = openAccordion;
    toggleAccordion(index);

    const item = contentRefs[index].current.parentElement;
    const content = contentRefs[index].current;
    const toggle = item.querySelector('.navigation-toggle');
    const header = item.querySelector('.navigation-header');

    if (openAccordion === index) {
      const prevItem = contentRefs[prevOpenAccordion].current.parentElement;
      const prevContent = contentRefs[prevOpenAccordion].current;
      const prevToggle = prevItem.querySelector('.navigation-toggle');
      const prevHeader = prevItem.querySelector('.navigation-header');

      prevHeader.style.color = "white";
      prevContent.style.maxHeight = '0';
      prevToggle.style.transform = 'rotate(90deg)';
      prevToggle.style.filter = 'invert(0)';
    } else {
      header.style.color = "white";
      content.style.maxHeight = '0';
      toggle.style.transform = 'rotate(0deg)';
      // toggle.style.filter = 'invert(1)';
    }

    if (prevOpenAccordion !== null && prevOpenAccordion !== index) {
      const prevItem = contentRefs[prevOpenAccordion].current.parentElement;
      const prevContent = contentRefs[prevOpenAccordion].current;
      const prevToggle = prevItem.querySelector('.navigation-toggle');
      const prevHeader = prevItem.querySelector('.navigation-header');

      prevHeader.style.color = "white";
      prevContent.style.maxHeight = '0';
      prevToggle.style.transform = 'rotate(0deg)';
      prevToggle.style.filter = 'invert(0)';
    }
  };

  return (
    <div className='Accordion'>
      <div className={`navigation-item ${openAccordion === 0 ? 'active' : ''}`}>
        <div className="navigation-header" onClick={() => handlePanelToggle(0)}>
          <h3>Pre-Training</h3>
          <img
            className="navigation-toggle"
            src={Chevy}
            alt="Toggle"
            style={{
              transform: openAccordion === 0 ? 'rotate(270deg)' : 'rotate(90deg)',
            }}
          />
        </div>
        <div
          className="accordion-content"
          ref={contentRefs[0]}
          style={{
            maxHeight: openAccordion === 0 ? `${contentRefs[0].current?.scrollHeight}px` : '0',
          }}
        >
          {/* <a href">Registration</a> */}
          <Link to="/registration-portal" className={activeReg}>Registration</Link>
          <Link to="https://itcc.ui.edu.ng/siwes/dlc/companies" target='_blank'>Browse Companies</Link>
          <Link to="/introduction-letter" className={activeIntro}>Introduction Letter</Link>
        </div>
      </div>

      <div className={`navigation-item ${openAccordion === 1 ? 'active' : ''}`}>
        <div className="navigation-header" onClick={() => handlePanelToggle(1)}>
        {/* <div className="navigation-header null" onClick={null}> */}
          <h3>Training</h3>
          <img
            className="navigation-toggle"
            src={Chevy}
            alt="Toggle"
            style={{
              transform: openAccordion === 1 ? 'rotate(270deg)' : 'rotate(90deg)',
            }}
          />
        </div>
        <div
          className="accordion-content"
          ref={contentRefs[1]}
          style={{
            maxHeight: openAccordion === 1 ? `${contentRefs[1].current?.scrollHeight}px` : '0',
          }}
        >
          <Link to="/job-reporting-form">Job Reporting Form</Link>
          <Link to="/daily-logs" className={activeDailyLog}>Daily logs</Link>
          <Link to="/new-logbook-request"className="null">New Logbook Request</Link>
        </div>
      </div>

      <div className={`navigation-item ${openAccordion === 2 ? 'active' : ''}`}>
        {/* <div className="navigation-header" onClick={() => handlePanelToggle(2)}> */}
        <div className="navigation-header null" onClick={null}>
          <h3>Post-Training</h3>
          <img
            className="navigation-toggle"
            src={Chevy}
            alt="Toggle"
            style={{
              transform: openAccordion === 2 ? 'rotate(270deg)' : 'rotate(90deg)',
            }}
          />
        </div>
        <div
          className="accordion-content"
          ref={contentRefs[2]}
          style={{
            maxHeight: openAccordion === 2 ? `${contentRefs[2].current?.scrollHeight}px` : '0',
          }}
        >
          <Link to="/submit-training-document">Submission of Training Documents</Link>
          <Link to="/results" className='null'>Results</Link>
        </div>
      </div>
    </div>
  );
};

export default AccordionS;
