import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PulseLoader } from 'react-spinners';
import axiosInstance from '../../../API Instances/AxiosIntances';
import CloseIcon from "/images/closeButton.png";
import FullScreenFailureMessage from './Failed/FullScreenFailureMessage';
import FullScreenSuccessMessage from './Successful/Successful';

const validationSchema = Yup.object().shape({
  request_message: Yup.string().required('Message is required'),
});

const MessageComponent = ({ message }) => {
  if (!message) return null;
  
  const isSuccess = message.type === 'success';
  
  return (
    <div className={`message ${isSuccess ? 'success' : 'error'}`}>
      {message.text}
    </div>
  );
};

const PersistentFormComponent = ({ showNewRequest, toggleNewRequest, id }) => {
  const [formValues, setFormValues] = useState({ request_message: '' });
  const [message, setMessage] = useState(null);
  const [placementSubmissionStatus, setPlacementSubmissionStatus] = useState("");
  const [placementSuccessMessage, setPlacementSuccessMessage] = useState("");
  const [showPlacementSuccessful, setShowPlacementSuccessful] = useState(false);
  const [showPlacementFailure, setShowPlacementFailure] = useState(false);

  const handlePlacementRequestsSubmit = async (values, { setSubmitting, setErrors }) => {
    setMessage(null); // Clear any previous messages
    try {
      const response = await axiosInstance.post(`/trainings/registrations/${id}/placement-requests/`, values);
      setMessage({ type: 'success', text: "Your Placement Request has been submitted successfully!" });
      setFormValues({ request_message: '' });
      setTimeout(() => {
        setMessage(null);
        toggleNewRequest(); // Close the form after success
      }, 5000);
    } catch (error) {
      let errorMessage = "Failed to submit placement request. Please try again.";
      if (error.response && error.response.data) {
        errorMessage = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
          setPlacementSuccessMessage(errorMessage)
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="newRequestComponent">
        <div className="newRequestHeader">
          <div className="introductionLetter">Request for Placement</div>
          <button className="closeButton" onClick={toggleNewRequest}>
            <img src={CloseIcon} alt="Close" />
          </button>
          <div className="requestContent">
            <Formik
              initialValues={formValues}
              validationSchema={validationSchema}
              onSubmit={handlePlacementRequestsSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="placement_form">
                  <div className="companyDetails">
                    <div className="formInput">
                      <label htmlFor="request_message"></label>
                      <Field
                        as="textarea"
                        name="request_message"
                        className="placement_letter"
                        placeholder="Type your message to support your request with State and City (location) of choice"
                      />
                      <ErrorMessage className="error" name="request_message" component="div" />
                    </div>
                  </div>
                  <MessageComponent message={message} />
                  <button type="submit" className="submitting submit_placement_request">
                    {isSubmitting ? <PulseLoader size={10} color="white" /> : "Submit"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <FullScreenSuccessMessage
        isOpen={showPlacementSuccessful}
        message={placementSuccessMessage}
        onClose={() => setShowPlacementSuccessful(false)}
      />

      </>
    )}

export default PersistentFormComponent;