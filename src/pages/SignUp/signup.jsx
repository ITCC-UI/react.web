import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import DummySideBar from '../../../components/Sidebar/DummySB';
import './SignUp.scss';
import Google from "/images/google.png"
import UILogo from "/images/UI_logo.png"

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const SignUp = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await axios.post('https://theegsd.pythonanywhere.com/api/v1/student/signup/', values);
      console.log('Signup successful', response.data);
      setSuccessMessage('Sign up successful! Redirecting to login page...');
      setTimeout(() => {
        setSuccessMessage('');
        navigate("/login");
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (error) {
      console.error('Signup failed', error);
      setStatus({ error: 'Signup failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login route-Dash">
      <DummySideBar />
      <section className="signUp">
        <main>
          <div className="main-container">
            <div className="signUpContainer">
              <header>
                <h1>INDUSTRIAL TRAINING COORDINATING CENTER</h1>
                <h3><i>bridging the gap between theory and practical....</i></h3>
                <div className="logo">
                  <img src={UILogo} alt="University of Ibadan Logo" />
                </div>
              </header>

              <div className="signUpForm">
                <div className="todo">Create Account</div>
                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={SignUpSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, status }) => (
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
                      <div className="password">
                        <Field
                          type="password"
                          name="password"
                          placeholder="Password"
                        />
                        <div className="error">
                          <ErrorMessage name="password" component="div" />
                        </div>
                      </div>
                      <button className="createAccount" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Signing up...": "Sign Up"}
                      </button>
                      {status && status.error && <div className="error">{status.error}</div>}

                      <div className="or">
                        <hr /> <span>or</span>
                      </div>

                      <div className="signInWithGoogle">
                        <a href="googleAPIHere" className="googleSign">
                          <img src={Google} alt="Google Image" />
                          Continue with Google
                        </a>
                      </div>

                      <div className="login">Already have an account? <span><Link to="/login">Login</Link></span></div>
                    </Form>
                  )}
                </Formik>
                {successMessage && (
                  <div className="success-message">
                    {successMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <div className="barsMobile">
          <div className="purpleBar"></div>
          <div className="goldBar"></div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;