import React, { useState } from "react";
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./placement.scss";
import Empty from "/images/empty_dashboard.png";
import CloseIcon from "/images/closeButton.png"; // Make sure you have an appropriate close icon

const IntroductionLetter = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);

  const toggleNewRequest = () => {
    setShowNewRequest(!showNewRequest);
  };

  return (
    <div className="introductionLetter">
      <SideBar
        dashboardClass={"dashy"}
        placementClass={"active-accordion placement filterPlacement"}
        init={0}
        activer={"activen"}
      />
      {showNewRequest && (
        <div className="newRequestComponent">
          <div className="newRequestHeader">
            <div className="introductionLetter">
              Request for Introduction Letter
            </div>
            <button className="closeButton" onClick={toggleNewRequest}>
              <img src={CloseIcon} alt="Close" />
            </button>
          </div>
          {/* Replace the following with your actual component */}
          <div className="requestContent">
            {/* Your form or other content goes here */}
            <p>Here is the content for the new request.</p>
          </div>
        </div>
      )}
      <main>
        <TopNav disableReg={"registration disable"} />
        <div className="container">
          <div className="topHead">
            <div className="heading">INTRODUCTION LETTERS</div>
            <button className="newReq" onClick={toggleNewRequest}>
              + New Request
            </button>
          </div>
          <div className="image">
            <img src={Empty} alt="" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntroductionLetter;
