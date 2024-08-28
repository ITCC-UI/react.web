import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import axiosInstance from '../../API Instances/AxiosIntances';
import Close from "/images/closeButton.png";
import Mark from "/images/succesfull circle.svg";
import "./confirmRegister.scss";
import PulseLoader from "react-spinners/PulseLoader"; // Import PulseLoader

const DisplayedComponent = ({ onClose, selectedCourse }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [banks, setBanks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axiosInstance.get('https://theegsd.pythonanywhere.com/api/v1/lookups/banks/');
        setBanks(response.data);
      } catch (error) {
        console.error('Error fetching banks', error);
      }
    };

    fetchBanks();
  }, []);

  const initialValues = {
    current_level: '',
    marital_status: '',
    disability: '',
    any_work_experience: '',
    previous_company_of_attachment: '',
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

  const is400Level = selectedCourse.level === 400;
  const is6MonthIT = selectedCourse.training_type_duration === 24;
  const skipPreviousAttachment = false; // Check if user has previous training records

  const validationSchemas = [
    Yup.object({
      current_level: Yup.string().required('Required'),
    }),
    Yup.object({
      marital_status: Yup.string().required('Required'),
      disability: Yup.string().required('Required'),
    }),
    Yup.object({
      any_work_experience: Yup.string().required('Required'),
      previous_company_of_attachment: Yup.string().optional(),
    }),
    Yup.object({
      next_of_kin: Yup.string().required('Required'),
      next_of_kin_address: Yup.string().required('Required'),
      next_of_kin_relationship: Yup.string().required('Required'),
      next_of_kin_phone_number: Yup.string()
        .matches(/^0[0-9]{10}$/, `Phone number is not in a correct format. \nIt must start with '0' and be exactly 11 digits.`)
        .required('Phone Number is required'),
    }),
    Yup.object({
      bank: Yup.string().required('Required'),
      bank_account_number: Yup.string()
        .min(10, "Number must be more than 10")
        .max(11, "Number must be less than or equal to 11")
        .required("Required"),
      bank_sort_code: Yup.string().required('Bank sort code is Required').min(9, "Bank sort code must be at least 9 digits"),
    }),
  ];

  const handleSubmit = async (values, actions) => {
    if (currentStep < 4 || (currentStep === 4 && is6MonthIT)) {
      let step = 1;
      if (currentStep == 2 && skipPreviousAttachment)
        step++;

      setCurrentStep(currentStep + step);
      actions.setTouched({});
      actions.setSubmitting(false);
    } else {
      setIsSubmitting(true); // Set submitting state to true
      try {
        const response = await axiosInstance.post('https://theegsd.pythonanywhere.com/api/v1/trainings/registrations/', values);
        if (response.status === 201) {
          setIsSubmitted(true);
          setRegistrationId(response.data.id);
          setErrorMessage('');
        } else {
          console.error('Unexpected response status:', response.status);
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting the form:', error);
        if (error.response) {
          console.error('Server response:', error.response.data);
          setErrorMessage(error.response.data.message || 'An error occurred while submitting the form. Please check your inputs and try again.');
        } else {
          setErrorMessage('An error occurred while submitting the form. Please check your internet connection and try again.');
        }
      }
      setIsSubmitting(false); // Set submitting state back to false
      actions.setSubmitting(false);
    }
  };

  const handlePrevious = (setTouched) => {
    let step = 1;
    if (currentStep == 4 && skipPreviousAttachment)
      step++;
    setTouched({});
    setCurrentStep(currentStep - step);
  };

  return (
    <div className="backgroundOverlay">
      <div className='registrationConfirmation'>
        {isSubmitting ? (
          <div className="loadingOverlay">
            <PulseLoader color="white" loading={isSubmitting} size={10} />
          </div>
        ) : isSubmitted ? (
          <div className='thisConfirmation cheers'>
            <img src={Mark} alt="success" />
            <h2 className="success">Registration Successful!</h2>
            <p>You have successfully registered {selectedCourse.course_code}</p>
            <button onClick={() => navigate(`/page_print/${registrationId}`)} className='viewReg'>View Registration Form</button>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[currentStep - 1]}
            onSubmit={handleSubmit}
          >
            {({ isValid, touched, setTouched }) => (
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
                          <option value="700">700 Level</option>
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
                      <div className="details">Personal Information</div>
                      <div className="formInput">
                        <label htmlFor="marital_status">Marital Status</label>
                        <Field as="select" name="marital_status">
                          <option value="">Select Marital Status</option>
                          <option value="single">Single</option>
                          <option value="married">Married</option>
                        </Field>
                        <ErrorMessage name="marital_status" component="div" className="error" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="disability">Disability</label>
                        <Field as="select" name="disability">
                          <option value="">Select Disability</option>
                          <option value="none">None</option>
                          <option value="physical">Physical</option>
                          <option value="visual">Visual</option>
                          <option value="hearing">Hearing</option>
                          <option value="mental">Mental</option>
                        </Field>
                        <ErrorMessage name="disability" component="div" className="error" />
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
                      <div className="details">Previous Training</div>
                      <div className="formInput">
                        <label htmlFor="any_work_experience">Previous Attachment Work Experience?</label>
                        <Field as="select" name="any_work_experience">
                          <option value="">Select an Option</option>
                          <option value="none">Yes</option>
                          <option value="physical">No</option>
                        </Field>
                        <ErrorMessage name="any_work_experience" component="div" className="error" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="previous_company_of_attachment">If yes, where?</label>
                        <Field type="text" name="previous_company_of_attachment"></Field>
                        <ErrorMessage name="previous_company_of_attachment" component="div" className="error" />
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
                    <div className='registration_form'>
                      <div className="details">Next of Kin Information</div>
                      <div className="formInput">
                        <label htmlFor="next_of_kin">Name of Next of Kin</label>
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
                        <Field
                          type="tel"
                          name="next_of_kin_phone_number"
                          
                          onKeyPress={(e) => {
                            if (!/^[0-9]$/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        <ErrorMessage name="next_of_kin_phone_number" className="error" component="div">
                          {(msg) => (
                            <div className="error" component="div">
                              {msg.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  {index < msg.split('\n').length - 1 && <br />}
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </ErrorMessage>
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
                        type={is6MonthIT ? "button" : "submit"}
                        onClick={is6MonthIT ? () => setCurrentStep(currentStep + 1) : undefined}
                        disabled={!isValid}
                        className='next-button'
                      >
                        {is6MonthIT ? 'Next' : 'Submit'}
                      </button>
                    </div>
                  </>
                )}
                {currentStep === 5 && (
                  <>
                    <div className="close closer" onClick={onClose}><img src={Close} alt="close" /></div>
                    <div className='registration_form'>
                      <div className="details">Bank Information</div>
                      <div className="formInput">
                        <label htmlFor="bank">Bank</label>
                        <Field as="select" name="bank">
                          <option value="">Select Bank</option>
                          {banks.map((bank) => (
                            <option key={bank.id} value={bank.id}>{bank.name}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="bank" component="div" className="error" />
                      </div>


                      



                      <div className="formInput">
                        <label htmlFor="bank_account_number">Bank Account Number</label>
                        <Field
                          type="tel"
                          name="bank_account_number"
                          onKeyPress={(e) => {
                            if (!/^[0-9]$/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                         
                         <ErrorMessage name="bank_account_number" className="error" component="div">
                          {(msg) => (
                            <div className="error" component="div">
                              {msg.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  {index < msg.split('\n').length - 1 && <br />}
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                      <div className="formInput">
                        <label htmlFor="bank_sort_code">Bank Sort Code</label>
                        <Field
                          type="tel"
                          name="bank_sort_code"
                          onKeyPress={(e) => {
                            if (!/^[0-9]$/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        <ErrorMessage name="bank_sort_code" className="error" component="div">
                          {(msg) => (
                            <div className="error" component="div">
                              {msg.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  {index < msg.split('\n').length - 1 && <br />}
                                </React.Fragment>
                              ))}
                            </div>
                          )}
                        </ErrorMessage>
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
                        Submit
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
