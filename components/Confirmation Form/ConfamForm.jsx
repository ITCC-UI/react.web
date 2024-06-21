import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./confirmRegister.scss";
import Close from "/images/closeButton.png";
import Mark from "/images/succesfull circle.svg"

const DisplayedComponent = ({ onClose }) => {
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

  const handleSubmit = (values, actions) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    } else {
      setIsSubmitted(true);
      setSubmittedData(values);
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
            <div className='reviewPage thisConfirmation'>
              <h2>Submitted Data</h2>
              <p>Level: {submittedData.level}</p>
              <p>Marital Status: {submittedData.maritalStatus}</p>
              <p>Disability: {submittedData.disability}</p>
              <p>Language: {submittedData.language}</p>
              <p>Name: {submittedData.nokName}</p>
              <p>Address: {submittedData.nokAddress}</p>
              <p>Relationship: {submittedData.nokRelationship}</p>
              <p>Phone Number: {submittedData.nokPhoneNumber}</p>
              <p>Bank Name: {submittedData.bankName}</p>
              <p>Account Number: {submittedData.nuban}</p>
              <p>Bank Sort Code: {submittedData.bankSortCode}</p>
            </div>
          )
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[currentStep - 1]}
            onSubmit={handleSubmit}
          >
            {({ isValid, touched, setTouched }) => (
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
                    {currentStep === 4 ? 'Confirm' : 'Next'}
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
