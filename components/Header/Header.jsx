import React, { useState } from 'react';
import Pen from "/images/pen.png";
import Bell from "/images/Notification.png";
import Envelope from "/images/message.png";
import Image from "/images/profile.jpg";
import Chevy from "/images/chevron down.png";
import './header.scss';

const TopNav = ({ toggleVisibility, isVisible }) => {
  const [userName, setUserName] = useState('Godwin James H.');
  const [matricNumber, setMatricNumber] = useState('214872');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState(Image);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="topNav">
      <div className="greetDate">
        <div className="greet">Welcome</div>
        <div className="date">{new Date().toLocaleDateString()}</div>
      </div>
      <div className="actionsLog">
        <div className="registration">
          <button onClick={toggleVisibility}>
            {/* {isVisible ? 'Hide Form' : 'Show Form'} */}
            <img src={Pen} alt="Pen" />
            Registration
          </button>
        </div>
        <div className="notifications">
          <div className="notice">
            <img src={Bell} alt="Notification Bell" />
          </div>
          <div className="message">
            <img src={Envelope} alt="Envelope" />
          </div>
        </div>
        <div className="profileDetails">
          <div className="image">
            <img src={userImage} alt="Profile" />
          </div>
          <div className="conDetails">
            <div className="name">{userName}</div>
            <div className="matricNum">Matric No: {matricNumber}</div>
            <div className="profileOpt" style={{ display: isDropdownOpen ? 'flex' : 'none' }}>
              <a href="#profile">Profile</a>
              <a href="#logout">Logout</a>
            </div>
          </div>
          <div className="chevy" onClick={handleDropdownClick}>
            <img src={Chevy} alt="Chevron Down" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
