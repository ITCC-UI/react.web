import React from 'react';
import './form.scss';
import CloseButton from '/images/closeButton.png';
import { Link } from 'react-router-dom';

const MyForm = ({ isVisible, onClose, formData }) => {
  const { matricNumber, programmeType, faculty, department, session } = formData;

  return (
    <div className={isVisible ? 'visible' : 'hidden'} id='formCase'>
      <div className="confirmation agreed">
        <div className="close" onClick={onClose}>
          <img src={CloseButton} alt="" />
        </div>
        <div className="confirm-warning">
          <div className="confirmThis">Confirm your Programme Details</div>
          <div className="warning">
            Please check to confirm that your <b>matric number</b> is correct. If any information is <span>incorrect</span>, contact ITCC!
          </div>
          <div className="userDetails">
            <div className="matricNumber">Matric Number: <b>{matricNumber}</b></div>
            <div className="dept">Department: <div>{department}</div></div>
            <div className="prog">Programme Type: <div className="prog">{programmeType}</div></div>
            <div className="session">Session of Entry: <div>{session}</div></div>
            <div className="faculty">Faculty: <div>{faculty}</div></div>
          </div>
        </div>
        <Link to="/ims/registration-portal">
          <div className="register_here">Register</div>
        </Link>
      </div>
    </div>
  );
};

export default MyForm;
