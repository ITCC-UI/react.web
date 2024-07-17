import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pen from "/images/pen.png";
import Bell from "/images/Notification.png";
import Chevy from "/images/chevron down.png";
import './header.scss';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import NetworkStatusIcon from '../NetworkStatus/Network';
import { ToastContainer } from 'react-toastify';

const TopNav = ({ disableReg, toggleVisibility, isVisible, setVisible, regVisible }) => {
  const [userName, setUserName] = useState(' ');
  const [matricNumber, setMatricNumber] = useState(' ');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userImage, setUserImage] = useState(" ");
  const [hasActiveRegistration, setHasActiveRegistration]=useState(false);
  // const [setVisible, setRegLinkVisibility] =useState(fas)

  const navigate = useNavigate();

  const LogOut = () => {
    Cookies.remove('token'); // Remove token from cookies
    navigate('/ims/login');
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('token'); // Get token from cookies
        const response = await axios.get('https://theegsd.pythonanywhere.com/api/v1/student/details', {
          headers: {
            Authorization: `Token ${token}`
          }
        });

        const { matric_number, passport, first_name, last_name } = response.data;
        setMatricNumber(matric_number);
        setUserImage(passport);
        setUserName(`${first_name.charAt(0)}.${last_name}`);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // const checkActiveRegistration = async () => {
    //   try {
    //     const token = Cookies.get('token'); // Get token from cookies
    //     const response = await axios.get('https://theegsd.pythonanywhere.com/api/v1/trainings/registrations', {
    //       headers: {
    //         Authorization: `Token ${token}`
    //       }
    //     });
    //     console.log(response.data)
    //     response.data.forEach(training => {
    //       if(training.status ==='ACTIVE'){
    //         setHasActiveRegistration(true);
    //         return true;
    //       }
    //     });
    //   } catch (error) {
    //     console.error('Error checking program registration:', error);
    //     return false;
    //   }
    // };

    fetchUserData();
    // checkActiveRegistration();
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
      <NetworkStatusIcon/>
      <div className="actionsLog">
        <div className={disableReg}>
          <button onClick={toggleVisibility} className={regVisible}>
            <img src={Pen} alt="Pen" />
            Registration
          </button>

          <button className={setVisible} id='notvisible'>
         <img src={Pen} alt="Pen" />
         <Link to="/ims/registration-portal">Registration</Link>
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
