import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from "../../../API Instances/AxiosIntances";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import DummySideBar from '../../../components/Sidebar/DummySB';
import './SignUp.scss';
import SignLogHeader from '../../../components/Header/SignupLoginHead';
import { Helmet } from 'react-helmet';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPassword = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the token from the query parameters
  const token = new URLSearchParams(location.search).get('token');

  


  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.patch(`/account/complete-password-reset/`, {
        token, // Include the token from the URL
        new_password: values.password, // Use the correct key for the new password
      });
  
      
  
      setSuccessMessage('Password reset successfully! Redirecting to login page...');
      setTimeout(() => navigate('/login'), 5000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to reset password. Please try again.');
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

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    return strength;
  };

  return (
    <div className="login route-Dash">
      <Helmet>
        <title>
          ITCC - Reset Password
        </title>
      </Helmet>
      <DummySideBar />
      <section className="signUp">
        <main>
          <div className="main-container">
            <div className="signUpContainer">
              <SignLogHeader />

              <div className="signUpForm">
                <div className="todo">Reset Password</div>
                {errorMessage && <div className="signInError">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <Formik
                  initialValues={{ password: '', repeatPassword: '' }}
                  validationSchema={ResetPasswordSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue, setFieldTouched, values }) => (
                    <Form className="formSignUp" id="signUpForm" noValidate>
                      <div className="password">
                        <Field
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="New Password"
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
                        {isSubmitting ? <PulseLoader size={10} color="white" /> : "Reset Password"}
                      </button>
                      <div className="login">
                        Remember your login details? <span><Link to="/login">Login</Link></span>
                      </div>
                      <div className="reset">
                        Forgotten Password? <span><Link to="/password_reset">Reset Password</Link></span>
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

export default ResetPassword;
