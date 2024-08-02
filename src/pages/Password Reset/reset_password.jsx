import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import { Helmet } from 'react-helmet';
import DummySideBar from '../../../components/Sidebar/DummySB';
import './SignUp.scss';
import SignLogHeader from '../../../components/Header/SignupLoginHead';
import { Link } from 'react-router-dom';

const RequestPasswordResetSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const RequestPasswordReset = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('/api/v1/account/reset-password/', { email: values.email });
      setSuccessMessage('A password reset link has been sent to your email.');
    } catch (error) {
      setErrorMessage('Failed to send reset link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login route-Dash">
      <Helmet>
        <title>
          ITCC - Request Password Reset
        </title>
      </Helmet>
      <DummySideBar />
      <section className="signUp">
        <main>
          <div className="main-container">
            <div className="signUpContainer">
              <SignLogHeader />

              <div className="signUpForm">
                <div className="todo">Request Password Reset</div>
                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <Formik
                  initialValues={{ email: '' }}
                  validationSchema={RequestPasswordResetSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="formSignUp" id="signUpForm" noValidate>
                      <div className="email">
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email"
                          autoComplete="on"
                        />
                        <div className="error">
                          <ErrorMessage name="email" component="div" />
                        </div>
                      </div>
                      <button className="createAccount" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <PulseLoader size={10} color="white" /> : "Send Reset Link"}
                      </button>

                      <div className="login">
                        Don't have an account? <span><Link to="/signup">Create an Account</Link></span>
                      </div>
                      <div className="reset">
                        Have an account? <span><Link to="/login">Log In</Link></span>
                      </div>

                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default RequestPasswordReset;
