// PrintPreview.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ProfileHead from '../Profile Header/ProfileHeader';
// import axiosInstance from '../utils/axiosInstance'; // Adjust the path to your axiosInstance
import Logo from "/images/UI_logo.png";
import ProfilePic from "/images/profile.png";
import "../Confirmation Form/confirmRegister.scss";
import axiosInstance from '../../API Instances/AxiosIntances';
import { Link } from 'react-router-dom';

const PrintPreview = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get('https://theegsd.pythonanywhere.com/api/v1/student/details/');
        setSubmittedData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    fetchProfileData();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  if (!submittedData) {
    return <div>Loading please wait...</div>;
  }

  return (
    <div className='PrintPreview'>
        <div className="formButtons">
<button onClick={handlePrint} className='print-button'>Download form</button>
<Link to="/dashboard">Proceed to Dashboard</Link>
</div>
      <div ref={printRef} className='reviewPage thisConfirmation'>
        <div className="formHeading">
          <h1 className="headings">INDUSTRIAL TRAINING COORDINATING CENTRE</h1>
          <h2 className="headings">UNIVERSITY OF IBADAN, IBADAN.</h2>
        </div>
        <div className="logoHeadType">
          <div className="logo justLogo">
            <img src={Logo} className='reviewLogo' alt="University Logo" />
          </div>
          <div className="formType">
            STUDENT INDUSTRIAL TRAINING REGISTRATION FORM (IT-UI-011)
          </div>
          <div className="profile">
            <img src={submittedData.passport} alt="Profile" />
          </div>
        </div>
        <ProfileHead headings={"Personal Information"} duration={"- 3 months"} />
        <div className="firstRow rowIdea">
          <p>Last Name: <span>{`${submittedData.first_name} ${submittedData.middle_name} ${submittedData.last_name}`}</span></p>
          <p>Other Names: <span>{`${submittedData.first_name} ${submittedData.middle_name} `}</span></p>
          <p>Sex: <span> {submittedData.current_level}</span></p>
          <p>Date of Birth: <span>{submittedData.marital_status}</span></p>
        </div>

        <div className="firstRow rowIdea">
          <p>Phone Number: <span>{`${submittedData.first_name} ${submittedData.middle_name} ${submittedData.last_name}`}</span></p>
          <p>Marital Status: <span>{`${submittedData.first_name} ${submittedData.middle_name} `}</span></p>
          <p>Languages other than English: <span>{submittedData.marital_status}</span></p>
        </div>

        <div className="firstRow rowIdea">
          <p>Email: <span>{`${submittedData.first_name} ${submittedData.middle_name} ${submittedData.last_name}`}</span></p>
          <p>Permanent Home Address: <span>{`${submittedData.first_name} ${submittedData.middle_name} `}</span></p>
          <p>Nationality: <span> {submittedData.current_level}</span></p>
          
        </div>

        <div className="firstRow rowIdea">
          <p>Any Previous work experience?: <span>{`${submittedData.first_name} ${submittedData.middle_name} ${submittedData.last_name}`}</span></p>
          <p>If yes, Where?: <span>{`${submittedData.first_name} ${submittedData.middle_name} `}</span></p>
          <p>Any Physical Disabilities?: <span> {submittedData.current_level}</span></p>
        
        </div>










        <ProfileHead headings={"Department Information"} />
        <div className="rowIdea">
          <p>Matric No: <span>{submittedData.language}</span></p>
          <p>Session: <span>{submittedData.language}</span></p>
          <p>Faculty: <span>{submittedData.language}</span></p>
        </div>

        <div className="rowIdea">
          <p>Department: <span>{submittedData.language}</span></p>
          <p>Level: <span>{submittedData.language}</span></p>
          <p>Session into the department: <span>{submittedData.language}</span></p>
        </div>






        <ProfileHead headings={"Next of Kin Information"} />
        <div className="rowIdea">
            <p>Name: <span>{submittedData.next_of_kin_name}</span></p>
          <p>Address: <span>{submittedData.next_of_kin_address}</span></p>
            </div>

            <div className="rowIdea">
            <p>Relationship: <span>{submittedData.next_of_kin_relationship}</span></p>
          <p>Phone Number: <span>{submittedData.next_of_kin_phone_number}</span></p>
     
            </div>

            <ProfileHead headings={"Bank Information"}/>
        <div className="rowIdea">
          <p>Bank Name: <span>{submittedData.bank}</span></p>
          <p>Account Number: <span>{submittedData.bank_account_number}</span></p>
          <p>Bank Sort Code: <span>{submittedData.bank_sort_code}</span></p>
        </div>
      </div>

    </div>
  );
};

export default PrintPreview;
