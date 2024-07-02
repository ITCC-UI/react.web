import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // Import axios for API requests
import "./confirmRegister.scss";
import Close from "/images/closeButton.png";
import Mark from "/images/succesfull circle.svg";
import ProfileHead from '../Profile Header/ProfileHeader';
import Logo from "/images/UI_logo.png";
import ProfilePic from "/images/profile.png";
import PrintButton from '../Print/Print';

const DisplayedComponent = ({ onClose, headings, duration }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [viewForm, setViewForm] = useState(false);

  const initialValues = {
    level: '',
    maritalStatus: '',
    disability: '',
    language: '',
    nokName: '',
    nokAddress: '',
    nokRelationship: '',
    nokPhoneNumber: '',
    bankName: '',
    nuban: '',
    bankSortCode: ''
  };

  const validationSchemas = [
    Yup.object({
      level: Yup.string().required('Required'),
    }),
    Yup.object({
      maritalStatus: Yup.string().required('Required'),
      disability: Yup.string().required('Required'),
      language: Yup.string().required('Required'),
    }),
    Yup.object({
      nokName: Yup.string().required('Required'),
      nokAddress: Yup.string().required('Required'),
      nokRelationship: Yup.string().required('Required'),
      nokPhoneNumber: Yup.number().required('Required').typeError('Must be a number'),
    }),
    Yup.object({
      bankName: Yup.string().required('Required'),
      nuban: Yup.string()
        .min(10, "Number must be more than 10")
        .max(11, "Number must be less than or equal to 11")
        .required("Required"),
      bankSortCode: Yup.string().required('Required'),
    }),
  ];

  const handleSubmit = async (values, actions) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    } else {
      try {
        const response = await axios.post('https://theegsd.pythonanywhere.com/api/v1/trainings/registrations/', values); // Replace 'YOUR_API_ENDPOINT' with your actual endpoint
        if (response.status === 200) {
          setIsSubmitted(true);
          setSubmittedData(values);
        } else {
          console.error('Error submitting the form');
        }
      } catch (error) {
        console.error('Error submitting the form', error);
      }
    }
  };

  const handlePrevious = (setTouched) => {
    setTouched({});
    setCurrentStep(currentStep - 1);
  };

  const handleViewForm = () => {
    setViewForm(true);
  };

  return (
    <div className="backgroundOverlay">
      <div className='registrationConfirmation'>
        {isSubmitted ? (
          !viewForm ? (
            <div className='thisConfirmation cheers'>
              <img src={Mark} alt="success" />
              <h2 className="success">Registration Successful!</h2>
              <p>You have successfully registered for TIT 223</p> {/*API collect the course type*/}
              <button onClick={handleViewForm} className='viewReg'>View Registration Form</button>
            </div>
          ) : (
            <PrintButton>
              <div className='reviewPage thisConfirmation'>
                <div className="formHeading">
                  <h1 className="headings"> INDUSTRIAL TRAINING COORDINATING CENTRE</h1>
                  <h2 className="headings"> UNIVERSITY OF IBADAN, IBADAN.</h2>
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
                  <p>Name: <span>{submittedData.nokName}</span></p>
                  <p>Level: <span> {submittedData.level}</span></p>
                  <p>Marital Status: <span>{submittedData.maritalStatus}</span></p>
                  <p>Disability: <span>{submittedData.disability}</span></p>

                </div>

                <ProfileHead headings={"Department Information"} />
                <div className="rowIdea">

                  <p>Language: <span>{submittedData.language}</span></p>
                </div>


                <ProfileHead headings={"Next of Kin Information"} />


                <div className="rowIdea">
                  <p>Address: <span>{submittedData.nokAddress}</span></p>
                  <p>Relationship: <span>{submittedData.nokRelationship}</span></p>

                  <p>Phone Number: <span>{submittedData.nokPhoneNumber}</span></p>
                </div>

                <div className="rowIdea"><p>Bank Name: <span>{submittedData.bankName}</span></p>
                  <p>Account Number: <span>{submittedData.nuban}</span></p>
                  <p>Bank Sort Code: <span>{submittedData.bankSortCode}</span></p>
                </div>


              </div>
            </PrintButton>
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
                  <div className='registration_form'>
                    <div className="close closer" onClick={onClose}><img src={Close} alt="close" /></div>
                    <div className="details">Select your current Level</div>
                    <div className="formInput">
                      <label htmlFor="level">Level</label>
                      <Field as="select" name="level">
                        <option value="">Select Level</option>
                        <option value="200">200 Level</option>
                        <option value="300">300 Level</option>
                        <option value="400">400 Level</option>
                        <option value="500">500 Level</option>
                      </Field>
                      <ErrorMessage name="level" component="div" className="error" />
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className='registration_form'>
                    <div className="close closer" onClick={onClose}><img src={Close} alt="close" /></div>
                    <div className="details">Registration Form</div>
                    <div className='formInput'>
                      <label htmlFor="maritalStatus">Marital Status</label>
                      <Field as="select" name="maritalStatus">
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                      </Field>
                      <ErrorMessage name="maritalStatus" component="div" className="error" />
                    </div>
                    <div className='formInput'>
                      <label htmlFor="disability">Disability</label>
                      <Field name="disability" type="text" placeholder='Input "NA" if not applicable' />
                      <ErrorMessage name="disability" component="div" className="error" />
                    </div>
                    <div className='formInput'>
                      <label htmlFor="language">Language</label>
                      <Field name="language" type="text" placeholder="Any other language aside English?" />
                      <ErrorMessage name="language" component="div" className="error" />
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className='registration_form'>
                    <div className="close closer" onClick={onClose}><img src={Close} alt="close" /></div>
                    <div className="details">Registration Form</div>
                    <p>Next of Kin Information</p>
                    <div className='formInput'>
                      <label htmlFor="nokName">Name</label>
                      <Field name="nokName" type="text" />
                      <ErrorMessage name="nokName" component="div" className="error" />
                    </div>
                    <div className='formInput'>
                      <label htmlFor="nokAddress">Address</label>
                      <Field name="nokAddress" type="text" />
                      <ErrorMessage name="nokAddress" component="div" className="error" />
                    </div>
                    <div className='formInput'>
                      <label htmlFor="nokRelationship">Relationship</label>
                      <Field name="nokRelationship" type="text" />
                      <ErrorMessage name="nokRelationship" component="div" className="error" />
                    </div>
                    <div className='formInput'>
                      <label htmlFor="nokPhoneNumber">Phone Number</label>
                      <Field name="nokPhoneNumber" type="number" />
                      <ErrorMessage name="nokPhoneNumber" component="div" className="error" />
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div className='registration_form'>
                    <div className="close closer" onClick={onClose}><img src={Close} alt="close" /></div>
                    <div className="details">Registration Form</div>
                    <p>Bank Details</p>
                    <div className='formInput'>
                      <label htmlFor="bankName">Bank Name</label>
                      <Field name="bankName" type="text" />
                      <ErrorMessage name="bankName" component="div" className="error" />
                    </div>
                    <div className='formInput'>
                      <label htmlFor="nuban">Account Number</label>
                      <Field name="nuban" type="number" />
                      <ErrorMessage name="nuban" component="div" className="error" />
                    </div>
                    <div className='formInput'>
                      <label htmlFor="bankSortCode">Bank Sort Code</label>
                      <Field name="bankSortCode" type="text" />
                      <ErrorMessage name="bankSortCode" component="div" className="error" />
                    </div>
                  </div>
                )}
                <div className='buttonContainer'>
                  <button
                    type="button"
                    disabled={currentStep === 1}
                    onClick={() => handlePrevious(setTouched)}
                    className='prev-button'
                  >
                    Previous
                  </button>
                  <button type="submit" disabled={!isValid} className='next-button'>
                    {currentStep === 3 && values.level !== '500' ? 'Submit' : currentStep === 4 ? 'Confirm' : 'Next'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default DisplayedComponent;
