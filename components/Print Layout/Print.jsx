// PrintPreview.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ProfileHead from '../Profile Header/ProfileHeader';
import Logo from "/images/UI_Print.png";
import "../Confirmation Form/confirmRegister.scss";
import axiosInstance from '../../API Instances/AxiosIntances';
import { Link, useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

const PrintPreview = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  const { registrationId } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
          
        const printoutResponse = await axiosInstance.get(`/trainings/registrations/${registrationId}/form/printout-data/`);
        
        setSubmittedData(printoutResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setError('Failed to fetch data. Please try again.');
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  if (isLoading) {
    return <PulseLoader color='green'/>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }
  
  if (!submittedData) {
    return <div>No data available.</div>;
  }

  return (
    <div className='PrintPreview'>
      <div className="formButtons">
        <button onClick={handlePrint} className='print_button'>Download form</button>
        <Link to="/registration-portal" className='dash'>Proceed to Dashboard</Link>
      </div>
      <div ref={printRef} className='reviewPage thisConfirmation'>
        {/* Form header */}
        <div className="formHeading">
          <h1 className="headings">INDUSTRIAL TRAINING COORDINATING CENTRE</h1>
          <h2 className="headings">UNIVERSITY OF IBADAN, IBADAN.</h2>
        </div>
        {/* Logo and form type */}
        <div className="logoHeadType">
          <div className="logo justLogo">
            <img src={Logo} className='reviewLogo' alt="University Logo" />
          </div>
          <div className="formType">
            STUDENT INDUSTRIAL TRAINING REGISTRATION<br/>
            {`${submittedData.session} REGISTRATION FORM (${submittedData.form_code})`}
          </div>
          <div className="profile">
            <img src={submittedData.passport} alt="Profile" />
          </div>
        </div>
        {/* Personal Information */}
        <ProfileHead headings={"Personal Information"} duration={` ${submittedData.training_type_duration===12? "3 - ": "6 - "} Months`} />
        <div className="firstRow rowIdea">
          <p>First Name: <span>{submittedData.first_name}</span></p>
          <p>Middle Name: <span>{`${submittedData.middle_name || 'N/A'}`}</span></p>
          <p>Last Name: <span>{`${submittedData.last_name}`}</span></p>
          <p>Gender: <span>{submittedData.gender}</span></p>
          <p>Date of Birth: <span>{submittedData.dob}</span></p>
        </div>
        <div className="firstRow rowIdea">
          <p>Phone Number: <span>{submittedData.phone_number}</span></p>
          <p>Marital Status: <span>{submittedData.marital_status}</span></p>
          <p>Language(s) other than English: <span>{submittedData.language}</span></p>
        </div>
        <div className="firstRow rowIdea">
          <p>Email: <span className='email'>{submittedData.email}</span></p>
          <p>Permanent Home Address: <span>{submittedData.home_address}</span></p>
          <p>Nationality: <span>{submittedData.nationality}</span></p>
        </div>
        <div className="firstRow rowIdea">
          <p>Previous work experience: <span>{submittedData.previous_company_of_attachment || "N/A"}</span></p>
          <p>Disability: <span>{submittedData.disability}</span></p>
        </div>

        {/* Programme Information */}
        <ProfileHead headings={"Programme Information"} />
        <div className="rowIdea">
          <p>Matric Number: <span>{submittedData.matric_number}</span></p>
          <p>School Email: <span>{submittedData.school_email || "N/A"}</span></p>
          <p>Faculty: <span>{submittedData.faculty_name}</span></p>
        </div>
        <div className="rowIdea">
          <p>Department: <span>{submittedData.department_name}</span></p>
          <p>Current Level: <span>{`${submittedData.current_level}`}</span></p>
          <p>Session of entry: <span>{submittedData.session}</span></p>
        </div>
        <div className="rowIdea">
          <p>Course Code: <span>{submittedData.course_code}</span></p>
          <p>Course Unit: <span>{submittedData.course_unit}</span></p>
        </div>

        {/* Next of Kin Information */}
        <ProfileHead headings={"Next of Kin Information"} />
        <div className="rowIdea">
          <p>Name: <span>{submittedData.next_of_kin}</span></p>
          <p>Address: <span>{submittedData.next_of_kin_address}</span></p>
        </div>
        <div className="rowIdea">
          <p>Relationship: <span>{submittedData.next_of_kin_relationship}</span></p>
          <p>Phone Number: <span>{submittedData.next_of_kin_phone_number}</span></p>
        </div>

        {/* Bank Information - only show if training_duration is 24 */}
        {submittedData.training_type_duration === 24 && (
          <>
            <ProfileHead headings={"Bank Information"}/>
            <div className="rowIdea">
              <p>Bank Name: <span>{submittedData.bank_name}</span></p>
              <p>Account Number: <span>{submittedData.bank_account_number}</span></p>
              <p>Bank Sort Code: <span>{submittedData.bank_sort_code}</span></p>
            </div>
          </>
        )}

        <div className="signature">
            <img src={submittedData.signature} className='signature' alt="Signature" />
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;