import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './formfiller.scss';
import Forward from '/images/icon.png';

const UserDetails = ({ isVisible, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authorization token found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://theegsd.pythonanywhere.com/api/v1/student/programmes/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.data.length > 0) {
          setUserData(response.data[0]); // Assuming you need the first object in the array
        } else {
          setError('No user data available');
        }
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isVisible) {
      fetchData();
    }
  }, [isVisible]);

  const handleBack = () => {
    onClose();
  };

  return (
    <div className={`form-container ${isVisible ? 'visible' : 'hidden'}`} id='formCase'>
      <div className="fillForm">
        <div className="close" onClick={onClose}>
          <img src="/images/closeButton.png" alt="Close" />
        </div>
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : userData ? (
          <div className="confirmation agreed">
            <div className="confirm-warning">
              <div className="confirmThis">
                Confirm your Programme Details
              </div>
              <div className="warning">
                Please check to confirm that your <b>matric number</b> is correct,
                if any information is <span>incorrect</span> contact ITCC!
              </div>
              <div className="userDetails">
                <div className="matricNumber">
                  Matric Number: <b>{userData.matriculation.matric_number}</b>
                </div>
                <div className="dept">
                  Department: <div>{userData.department.toUpperCase()}</div>
                </div>
                <div className="prog">
                  Programme Type: <div className="prog">{userData.programme_type}</div>
                </div>
                <div className="session">
                  Session of Entry: <div>{userData.session_of_entry}</div>
                </div>
                <div className="faculty">
                  Faculty: <div>{userData.faculty}</div>
                </div>
                <div className="schoolEmail">
                  School Email: <div>{userData.matriculation.school_email}</div>
                </div>
              </div>
              <div className="buttons">
                <button className="back-button" onClick={handleBack}>
                  Cancel
                </button>
                <Link to='/registration-portal'>
                  <button className="register_here" onClick={onClose}>
                    Confirm
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="error">No user data available</div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
