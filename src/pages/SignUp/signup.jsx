import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
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
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], ' ')
    .required(' '),
});

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  return strength;
};

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const verificationToken = searchParams.get('token') || '';

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Include the verification token in the submission
      const submitData = {
        email: values.email.toLowerCase(),
        password: values.password,
        verification_token: verificationToken
      };

      await axiosInstance.post('/account/complete-create/', submitData);
      
      setSuccessMessage('Sign up completed! Redirecting to login page...');
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to complete signup. Please try again.');
        console.log(error)
      }
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = (e, setFieldValue, setFieldTouched, values) => {
    const password = e.target.value;
    setFieldValue('password', password);
    setPasswordStrength(getPasswordStrength(password));
    setPasswordsMatch(password === values.repeatPassword);
    setFieldTouched('password', true, false);
  };

  const handleRepeatPasswordChange = (e, setFieldValue, setFieldTouched, values) => {
    const repeatPassword = e.target.value;
    setFieldValue('repeatPassword', repeatPassword);
    setPasswordsMatch(values.password === repeatPassword);
    setFieldTouched('repeatPassword', true, false);
  };

  return (
    <div className="login route-Dash">
      <Helmet>
        <title>ITCC - Complete Sign Up</title>
      </Helmet>
      <DummySideBar />
      <section className="signUp">
        <main>
          <div className="main-container">
            <div className="signUpContainer">
              <SignLogHeader />

              <div className="signUpForm">
                <div className="todo">Complete Your Account Setup</div>
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
                
                <Formik
                  initialValues={{ 
                    email: email,
                    password: '', 
                    repeatPassword: '' 
                  }}
                  validationSchema={SignUpSchema}
                  validateOnChange={true}
                  validateOnBlur={true}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue, setFieldTouched, values }) => (
                    <Form className="formSignUp" id="signUpForm" noValidate>
                      <div className="email">
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email"
                          disabled
                          className="disabled-input"
                        />
                      </div>
                      
                      <div className="password">
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Create Password"
                          onChange={(e) => handlePasswordChange(e, setFieldValue, setFieldTouched, values)}
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </span>
                        <div className="error">
                          <ErrorMessage name="password" component="div" />
                        </div>
                        <div className="password-strength">
                          <div className={`bar ${passwordStrength >= 1 ? 'filled' : ''}`}></div>
                          <div className={`bar ${passwordStrength >= 2 ? 'filled' : ''}`}></div>
                          <div className={`bar ${passwordStrength >= 3 ? 'filled' : ''}`}></div>
                        </div>
                      </div>
                      
                      <div className="repeat-password">
                        <Field
                          type={showRepeatPassword ? 'text' : 'password'}
                          name="repeatPassword"
                          placeholder="Repeat Password"
                          onChange={(e) => handleRepeatPasswordChange(e, setFieldValue, setFieldTouched, values)}
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={toggleRepeatPasswordVisibility}
                        >
                          {showRepeatPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </span>
                        <div className="error">
                          <ErrorMessage name="repeatPassword" component="div" />
                        </div>
                        {!passwordsMatch && (
                          <div className="error">Passwords do not match</div>
                        )}
                      </div>

                      <button className="createAccount" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <PulseLoader size={10} color="white" /> : "Complete Signup"}
                      </button>
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

export default SignUp;