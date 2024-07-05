// DisplayedComponent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useReactToPrint } from 'react-to-print';
import "./confirmRegister.scss";
import Close from "/images/closeButton.png";
import Mark from "/images/succesfull circle.svg";
import ProfileHead from '../Profile Header/ProfileHeader';
import Logo from "/images/UI_logo.png";
import ProfilePic from "/images/profile.png";
import PrintButton from '../Print/Print';
import axiosInstance from '../../API Instances/AxiosIntances';

const DisplayedComponent = ({ onClose, headings, duration, selectedCourse, isSubmitting }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [viewForm, setViewForm] = useState(false);
  const [banks, setBanks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const printRef = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axiosInstance.get('https://theegsd.pythonanywhere.com/api/v1/trainings/department/trainings/registrations/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        console.log("data:", response.data);
      } catch (error) {
        console.error('Error fetching training data', error);
      }
    };


    fetchTrainingData(); fetchBanks();
  }, []);


  const fetchBanks = async () => {
    try {
      const response = await axiosInstance.get('https://theegsd.pythonanywhere.com/api/v1/lookups/banks/');
      setBanks(response.data);
    } catch (error) {
      console.error('Error fetching banks', error);
    }
  };



  // Log selected course data
  useEffect(() => {
    if (selectedCourse) {
      console.log('Selected Course Data:', selectedCourse);
    }
  }, [selectedCourse]);

  const initialValues = {
    current_level: '',
    marital_status: '',
    disability: '',
    language: '',
    next_of_kin: '',
    next_of_kin_address: '',
    next_of_kin_relationship: '',
    next_of_kin_phone_number: '',
    bank: '',
    bank_account_number: '',
    bank_sort_code: '',
    training: selectedCourse.training,
    department_training: selectedCourse.department_training,
    programme: selectedCourse.programme
  };

  const validationSchemas = [
    Yup.object({
      current_level: Yup.string().required('Required'),
    }),
    Yup.object({
      marital_status: Yup.string().required('Required'),
      disability: Yup.string().required('Required'),
      language: Yup.string().required('Required'),
    }),
    Yup.object({
      next_of_kin: Yup.string().required('Required'),
      next_of_kin_address: Yup.string().required('Required'),
      next_of_kin_relationship: Yup.string().required('Required'),
      next_of_kin_phone_number: Yup.number().required('Required').typeError('Must be a number').min(11, "Phone number too short"),
    }),
    Yup.object({
      bank: Yup.string().required('Required'),
      bank_account_number: Yup.string()
        .min(10, "Number must be more than 10")
        .max(11, "Number must be less than or equal to 11")
        .required("Required"),
      bank_sort_code: Yup.string().required('Required'),
    }),
  ];

  const handleSubmit = async (values, actions) => {
    if (currentStep < 3 || (currentStep === 3 && values.current_level === '400')) {
      setCurrentStep(currentStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    } else {
      try {
        console.log('Submitting values:', values);
        const response = await axiosInstance.post('https://theegsd.pythonanywhere.com/api/v1/trainings/registrations/', values);
        if (response.status === 201) {
          setIsSubmitted(true);
          setErrorMessage(''); // Clear any previous error messages
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          console.error('Unexpected response status:', response.status);
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
        if (error.response) {
          console.error('Server response:', error.response.data);
          // Set a more specific error message based on the server response
          setErrorMessage(error.response.data.message || 'An error occurred while submitting the form. Please check your inputs and try again.');
        } else {
          setErrorMessage('An error occurred while submitting the form. Please check your internet connection and try again.');
        }
      }
      actions.setSubmitting(false);
    }
  };

  const handlePrevious = (setTouched) => {
    setTouched({});
    setCurrentStep(currentStep - 1);
  };

  const handleViewForm = () => {
    setViewForm(true);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="backgroundOverlay">
      <div className='registrationConfirmation'>
        {isSubmitted ? (
          !viewForm ? (
            <div className='thisConfirmation cheers'>
              <img src={Mark} alt="success" />
              <h2 className="success">Registration Successful!</h2>
              <p>You have successfully registered for TIT 223</p>
              <button onClick={handleViewForm} className='viewReg'>View Registration Form</button>
            </div>
          ) : (
            <div>
              <div ref={printRef} className='reviewPage thisConfirmation'>
                <div className="formHeading">
                  <h1 className="headings">INDUSTRIAL TRAINING COORDINATING CENTRE</h1>
                  <h2 className="headings">UNIVERSITY OF IBADAN, IBADAN.</h2>
                </div>
                <div className="logoHeadType">
                  <div className="logo">
                    <img src={Logo} className='reviewLogo' alt="" />
                  </div>
                  <div className="formType">
                    STUDENT INDUSTRIAL TRAINING REGISTRATION FORM (IT-UI-011)
                  </div>
                  <div className="profile">
                    <img src={ProfilePic} alt="" />
                  </div>
                </div>
                <ProfileHead headings={"Personal Information"} duration={"- 3 months"} />
                <div className="firstRow rowIdea">
                  <p>Name: <span>{submittedData.next_of_kin}</span></p>
                  <p>Level: <span> {submittedData.current_level}</span></p>
                  <p>Marital Status: <span>{submittedData.marital_status}</span></p>
                  <p>Disability: <span>{submittedData.disability}</span></p>
                </div>
                <ProfileHead headings={"Department Information"} />
                <div className="rowIdea">
                  <p>Language other than English: <span>{submittedData.language}</span></p>
                </div>
                <ProfileHead headings={"Next of Kin Information"} />
                <div className="rowIdea">
                  <p>Address: <span>{submittedData.next_of_kin_address}</span></p>
                  <p>Relationship: <span>{submittedData.next_of_kin_relationship}</span></p>
                  <p>Phone Number: <span>{submittedData.next_of_kin_phone_number}</span></p>
                </div>
                <div className="rowIdea">
                  <p>Bank Name: <span>{submittedData.bank}</span></p>
                  <p>Account Number: <span>{submittedData.bank_account_number}</span></p>
                  <p>Bank Sort Code: <span>{submittedData.bank_sort_code}</span></p>
                </div>
              </div>
              <button onClick={handlePrint} className='print-button'>Print</button>
            </div>
          )
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[currentStep - 1]}
            onSubmit={handleSubmit}
          >
            {({ isValid, touched, setTouched, values }) => (
              <Form className='thisConfirmation thisForm'>
                {currentStep === 1 && (
                  <>
                    <div className="close closer" onClick={onClose}><img src={Close} alt="close" /></div>
                    <div className='registration_form'>
                      <div className="details">Select your current Level</div>
                      <div className="formInput">
                        <label htmlFor="current_level">Level</label>
                        <Field as="select" name="current_level">
                          <option value="">Select Level</option>
                          <option value="200">200 Level</option>
                          <option value="300">300 Level</option>
                          <option value="400">400 Level</option>
                          <option value="500">500 Level</option>
                          <option value="FNG">FNG</option>
                          {/* <option value="600">PG</option> */}

                        </Field>
                        <ErrorMessage name="current_level" component="div" className="error" />
                      </div>
                    </div>
                    <div className='buttonContainer'>
                      <button
                        type="button"
                        onClick={() => handlePrevious(setTouched)}
                        className='prev-button disable'
                        disabled={true}
                      >
                        Previous
                      </button>
                      <button type="submit" disabled={!isValid} className='next-button'>
                        Next
                      </button>
                    </div>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <div className="close closer" onClick={onClose}><img src={Close} alt="close" /></div>
                    <div className='registration_form'>
                      <div className="details">Fill in your personal details</div>
                      <div className="formInput">
                        <label htmlFor="marital_status">Marital Status</label>
                        <Field as="select" name="marital_status">
                          <option value="">Select Marital Status</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                          <option value="divorced">Divorced</option>
                        </Field>
                        <ErrorMessage name="marital_status" component="div" className="error" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="disability">Disability</label>
                        <Field as="select" name="disability">
                          <option value="">Select</option>
                          <option value="no">No</option>
                          <option value="hearing_impaired">Hearing Impaired</option>
                          <option value="vision_impaired">Vision Impaired</option>
                          <option value="mobility_impaired">Mobility Impaired</option>
                          <option value="cognitive_disability">Cognitive Disability</option>
                          <option value="mental_health_disability">Mental Health Disability</option>
                          <option value="speech_impairment">Speech Impairment</option>
                          <option value="learning_disability">Learning Disability</option>
                          <option value="chronic_illness">Chronic Illness</option>
                          <option value="autism_spectrum_disorder">Autism Spectrum Disorder</option>
                          <option value="intellectual_disability">Intellectual Disability</option>
                          <option value="multiple_disabilities">Multiple Disabilities</option>
                          <option value="other">Other</option>
                        </Field>
                        <ErrorMessage name="disability" component="div" className="error" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="language">Language other than English</label>
                        <Field type="text" name="language" />
                        <ErrorMessage name="language" component="div" className="error" />
                      </div>
                    </div>
                    <div className='buttonContainer'>
                      <button
                        type="button"
                        onClick={() => handlePrevious(setTouched)}
                        className='prev-button'
                      >
                        Previous
                      </button>
                      <button type="submit" disabled={!isValid} className='next-button'>
                        Next
                      </button>
                    </div>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <div className="close closer" onClick={onClose}><img src={Close} alt="close" /></div>
                    <div className='registration_form'>
                      <div className="details">Fill in your Next of Kin Information</div>
                      <div className="formInput">
                        <label htmlFor="next_of_kin">Next of Kin</label>
                        <Field type="text" name="next_of_kin" />
                        <ErrorMessage name="next_of_kin" component="div" className="error" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="next_of_kin_address">Next of Kin Address</label>
                        <Field type="text" name="next_of_kin_address" />
                        <ErrorMessage name="next_of_kin_address" component="div" className="error" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="next_of_kin_relationship">Next of Kin Relationship</label>
                        <Field type="text" name="next_of_kin_relationship" />
                        <ErrorMessage name="next_of_kin_relationship" component="div" className="error" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="next_of_kin_phone_number">Next of Kin Phone Number</label>
                        <Field type="text" name="next_of_kin_phone_number" />
                        <ErrorMessage name="next_of_kin_phone_number" component="div" className="error" />
                      </div>
                    </div>
                    <div className='buttonContainer'>
                      <button
                        type="button"
                        onClick={() => handlePrevious(setTouched)}
                        className='prev-button'
                      >
                        Previous
                      </button>
                      <button type="submit" disabled={!isValid} className='next-button'>
                        Next
                      </button>
                    </div>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <div className="close closer" onClick={onClose}><img src={Close} alt="close" /></div>
                    {errorMessage && (
                      <div className="error-message">
                        {errorMessage}
                      </div>
                    )}
                    <div className='registration_form'>
                      <div className="details">Fill in your Bank Information</div>
                      <div className="formInput">
                        <label htmlFor="bank">Bank Name</label>
                        <Field as="select" name="bank">
                          <option value="">Select Bank</option>
                          {banks.map((bank) => (
                            <option key={bank.id} value={bank.id}>
                              {bank.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="bank" component="div" className="error" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="bank_account_number">Bank Account Number</label>
                        <Field type="text" name="bank_account_number" />
                        <ErrorMessage name="bank_account_number" component="div" className="error" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="bank_sort_code">Bank Sort Code</label>
                        <Field type="text" name="bank_sort_code" />
                        <ErrorMessage name="bank_sort_code" component="div" className="error" />
                      </div>
                    </div>
                    <div className='buttonContainer'>
                      <button
                        type="button"
                        onClick={() => handlePrevious(setTouched)}
                        className='prev-button'
                      >
                        Previous
                      </button>
                      <button 
  type="submit" 
  disabled={!isValid || isSubmitting} 
  className='next-button'
>
  {isSubmitting ? 'Submitting Data...' : 'Submit'}
</button>
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default DisplayedComponent;
