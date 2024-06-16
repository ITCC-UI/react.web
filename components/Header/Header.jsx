import React, { useState, useRef } from 'react';
import './header.scss'; // Assuming a CSS file named TopNav.css exists

const TopNav = () => {
  const [userName, setUserName] = useState('Godwin James H.'); // Initial user name
  const [matricNumber, setMatricNumber] = useState('214872'); // Initial matriculation number
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle the state on click
  };

  const toggleDropdown = () => {
    isDropdownOpen.current = !isDropdownOpen.current;
  };

  return (
    <nav className="topNav">
      <div className="greetDate">
        <div className="greet">Welcome</div>
        <div className="date">{new Date().toLocaleDateString()}</div>
      </div>

      <div className="actionsLog">
        <div className="registration">
          <button>
            <img
              src="../../../../static/assets/images/pen.png"
              alt="Pen"
            />
            Registration
          </button>
        </div>

        <div className="notifications">
          <div className="notice">
            <img src="../../../../static/assets/images/Notification.png" alt="" />
          </div>
          <div className="message">
            <img src="../../../../static/assets/images/message.png" alt="" />
          </div>
        </div>

        <div className="profileDetails">
          <div className="image">
            <img src="../../../../static/assets/images/profile.jpg" alt="" />
          </div>
          <div className="conDetails">
            <div className="name">{userName}</div>
            <div className="matricNum">Matric No: {matricNumber}</div>
          
            <div
    className="profileOpt"
    style={{ display: isDropdownOpen ? 'flex' : 'none' }}

  >
    <a href="#profile">Profile</a>
    <a href="#logout">Logout</a>
  </div>
          </div>
          <div className="chevy" id="chevron"    onClick={handleDropdownClick}>
            <img
              src="../../../../static/assets/images/chevron down.png"
              alt="Chevron Down"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
