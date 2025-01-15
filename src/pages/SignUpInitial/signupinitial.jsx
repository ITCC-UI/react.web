import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import DummySideBar from '../../../components/Sidebar/DummySB';
import './SignUp.scss';
import Google from '/images/google.png';
import SignLogHeader from '../../../components/Header/SignupLoginHead';
import { Helmet } from 'react-helmet';
import axiosInstance from '../../../API Instances/AxiosIntances';

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const SignUpInitial = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      values.email = values.email.toLowerCase();
      await axiosInstance.post("/student/signup/initiate/", values);
      setSubmittedEmail(values.email);
      setShowVerificationModal(true);
      startResendTimer();
    } catch (error) {
     {
        setErrorMessage(error.response.data.detail);
        
      }
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendTimer > 0) return;
    
    try {
      await axiosInstance.post("/student/signup/initiate/", { email: submittedEmail });
      startResendTimer();
    } catch (error) {
      setErrorMessage('Failed to resend verification email. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const VerificationModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <button 
          className="modal-close-button"
          onClick={() => setShowVerificationModal(false)}
        >
          ×
        </button>
        
        <h2>Verify your Email</h2>
        
        <p>
          We've sent a verification email to{' '}
          <strong>{submittedEmail}</strong>. Please check your inbox
          and click the verification link to complete your
          registration.
        </p>
        
        <p className="note">
          <strong>Note:</strong> You won't be able to access your
          account until your email is verified.
        </p>

        <div className="modal-actions">

          
          <button 
            className="resend-button"
            onClick={handleResendEmail}
            disabled={resendTimer > 0}
          >
            Resend Email
          </button>
          
          
          <button 
            className="change-button"
            onClick={() => setShowVerificationModal(false)}
          >
            Change Email
          </button>
        </div>

        {resendTimer > 0 && (
          <p className="timer">
            You can request for a new link in {resendTimer} seconds
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="login route-Dash">
      <Helmet>
        <title>ITCC - Sign Up</title>
      </Helmet>
      <DummySideBar />
      <section className="signUp">
        <main>
          <div className="main-container">
            <div className="signUpContainer">
              <SignLogHeader />

              <div className="signUpForm">
                <div className="todo">Create Account</div>
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}

                <Formik
                  initialValues={{ email: '' }}
                  validationSchema={SignUpSchema}
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
                          required
                        />
                        <div className="error">
                          <ErrorMessage name="email" component="div" />
                        </div>
                      </div>

                      <button 
                        className="createAccount" 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <PulseLoader size={10} color="white" />
                        ) : (
                          "Sign Up"
                        )}
                      </button>

                      <div className="or">
                        <hr /> <span>or</span>
                      </div>

                      <div className="signInWithGoogle">
                        <a href="googleAPIHere" className="googleSign">
                          <img src={Google} alt="Google Image" />
                          Continue with Google
                        </a>
                      </div>

                      <div className="login">
                        Already have an account?{' '}
                        <span><Link to="/login">Login</Link></span>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </main>
      </section>

      {showVerificationModal && <VerificationModal />}
    </div>
  );
};

export default SignUpInitial;