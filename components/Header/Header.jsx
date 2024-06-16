import React, { useState, useRef } from 'react';
import Pen from "/images/pen.png"
import Bell from "/images/Notification.png"
import Envelope from "/images/message.png"
import Image from "/images/profile.jpg"
import Chevy from "/images/chevron down.png"
import './header.scss'; // Assuming a CSS file named TopNav.css exists
import { Link } from 'react-router-dom';
import Button from '../Button/Button';

const TopNav = ({toggleVisibility}) => {
  const [userName, setUserName] = useState('Godwin James H.'); // Initial user name
  const [matricNumber, setMatricNumber] = useState('214872'); // Initial matriculation number
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState(Image)


  // API Call to change the user's values in the respective component using the useState
  // second properties

  const callAPIFunct=()=>{
    // setUserName=
    // setMatricNumber=    setUserImage=
  }
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
          <button onClick={toggleVisibility}>
            <img
              src={Pen}
              alt="Pen"
            />
            Registration
          </button>
          
        </div>

        {/* <Button/> */}



        <div className="notifications">
          <div className="notice">
            <img src={Bell} alt="" />
          </div>
          <div className="message">
            <img src={Envelope} alt="" />
          </div>
        </div>

        <div className="profileDetails">
          <div className="image">
            <img src={userImage} alt="" />
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
              src={Chevy}
              alt="Chevron Down"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
