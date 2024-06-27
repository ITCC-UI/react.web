import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import DummySideBar from '../../../components/Sidebar/DummySB';
import { ClipLoader } from 'react-spinners';
import './SignUp.scss';
import Google from "/images/google.png";
import SignLogHeader from '../../../components/Header/SignupLoginHead';

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
});

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  return strength;
};

const SignUp = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
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
      if (error.response && error.response.data && error.response.data.email) {
        setStatus({ error: 'User already exists.' });
      } else {
        setStatus({ error: 'Signup failed. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = (e, setFieldValue) => {
    const password = e.target.value;
    setFieldValue('password', password);
    setPasswordStrength(getPasswordStrength(password));
  };

  return (
    <div className="login route-Dash">
      <DummySideBar />
      <section className="signUp">
        <main>
          <div className="main-container">
            <div className="signUpContainer">
              <SignLogHeader />

              <div className="signUpForm">
                <div className="todo">Create Account</div>
                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={SignUpSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, status, setFieldValue }) => (
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
                          onChange={(e) => handlePasswordChange(e, setFieldValue)}
                        />
                        <div className="error">
                          <ErrorMessage name="password" component="div" />
                        </div>
                        <div className={`password-strength strength-${passwordStrength}`}>
                          Password strength: {passwordStrength === 3 ? 'Strong' : passwordStrength === 2 ? 'Medium' : 'Weak'}
                        </div>
                      </div>
                      {status && status.error && <div className="error existingUser">{status.error}</div>}
                      <button className="createAccount" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <ClipLoader size={20} color="inherit" /> : "Sign Up"}
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
