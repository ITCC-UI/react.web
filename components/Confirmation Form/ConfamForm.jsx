import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import axiosInstance from '../../API Instances/AxiosIntances';
import Close from "/images/closeButton.png";
import Mark from "/images/succesfull circle.svg";
import "./confirmRegister.scss";

const DisplayedComponent = ({ onClose, selectedCourse }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [banks, setBanks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
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

  const validationSchemas = [
    Yup.object({
      current_level: Yup.string().required('Required'),
    }),
    Yup.object({
      marital_status: Yup.string().required('Required'),
      disability: Yup.string().required('Required'),
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
      bank_sort_code: Yup.string().required('Required').min(9, "Bank sort code must be at least 9 digits"),
    }),
  ];

  const handleSubmit = async (values, actions) => {
    if (currentStep < 3 || (currentStep === 3 && is400Level)) {
      setCurrentStep(currentStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    } else {
      try {
        const response = await axiosInstance.post('https://theegsd.pythonanywhere.com/api/v1/trainings/registrations/', values);
        if (response.status === 201) {
          setIsSubmitted(true);
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
      actions.setSubmitting(false);
    }
  };

  const handlePrevious = (setTouched) => {
    setTouched({});
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="backgroundOverlay">
      <div className='registrationConfirmation'>
        {isSubmitted ? (
          <div className='thisConfirmation cheers'>
            <img src={Mark} alt="success" />
            <h2 className="success">Registration Successful!</h2>
            <p>You have successfully registered {selectedCourse.course_code}</p>
            <button onClick={() => navigate('/page_print')} className='viewReg'>View Registration Form</button>
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
                      <div className="details">Next of Kin Information</div>
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
                      <button 
  type={is400Level ? "button" : "submit"}
  onClick={is400Level ? () => setCurrentStep(currentStep + 1) : undefined}
  disabled={!isValid} 
  className='next-button'
>
  {is400Level ? 'Next' : 'Submit'}
</button>
                    </div>
                  </>
                )}
                {currentStep === 4 && (
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
