// MyForm.js
import React, { useState } from 'react';
import "./form.scss"
import CloseButton from "/images/closeButton.png"
import { Link } from 'react-router-dom';

const MyForm = ({isVisible, onClose}) => {
  const matricNumber= "214871"
  const department = "Industrial Engineering"
  const progType="Regular"
  const yOE ="2021/2022"
  const faculty ="Technology"
  return <div className={isVisible? 'visible': 'hidden'} id='formCase'>

  <div className="confirmation agreed">
    <div className="close" onClick={onClose}>
<img src={CloseButton} alt="" />
    </div>
    <div className="confirm-warning">

      <div className="confirmThis">
      Confirm your Programme Details
      </div>

      <div className="warning">
      please check to confirm that your <b>matric number</b> is correct,
      if any information is <span>incorrect</span> contact ITCC!
      </div>

      <div className="userDetails">
        <div className="matricNumber">
          Matric Number: <b>{matricNumber} </b>
        </div>
        <div className="dept">
          Department: <div>{department}</div>
        </div>
        <div className="prog">
          Programme Type: <div className="prog">{progType} </div>
        </div>

        <div className="session">
          Session of Entry: <div>{yOE}</div>
        </div>

        <div className="faculty">
          Faculty: <div>{faculty}</div>
        </div>
      </div>
    </div>

    <Link to= "/registration_portal">
    <div className="register_here">
     
     Register</div></Link>
  </div>
  </div>;
};

export default MyForm;
