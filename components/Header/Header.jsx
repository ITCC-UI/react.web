import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios: npm install axios
import Pen from "/images/pen.png";
import Bell from "/images/Notification.png";
import Chevy from "/images/chevron down.png";
import './header.scss';
import { useNavigate } from 'react-router-dom';

const TopNav = ({ disableReg, toggleVisibility, isVisible }) => {
  const [userName, setUserName] = useState(' ');
  const [matricNumber, setMatricNumber] = useState(' ');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState(" ");
  // const [passport, setPassport] = useState({pass});

  const navigate = useNavigate();
const LogOut=()=>{
  localStorage.removeItem('token');
  navigate('/login');
}

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the auth token in localStorage
        const response = await axios.get('https://theegsd.pythonanywhere.com/api/v1/student/details', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        const { matric_number, passport, first_name, last_name, } = response.data;
        setMatricNumber(matric_number);
        
          setUserImage(passport);
      
          setUserName(first_name.charAt(0)+"."+last_name);
        
        

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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
        <div className={disableReg}>
          <button onClick={toggleVisibility}>
            <img src={Pen} alt="Pen" />
            Registration
          </button>
        </div>
        <div className="notifications">
          <div className="notice">
            <img src={Bell} alt="Notification Bell" />
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
              <div className="logout" onClick={LogOut}>Log Out</div>
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