import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Helmet } from "react-helmet";
import axiosInstance from "../../../API Instances/AxiosIntances";
import { Link, useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners'; // Import the PulseLoader component
import Cookies from 'js-cookie'; // Import the js-cookie package
import "./login.scss";
import DummySideBar from "../../../components/Sidebar/DummySB";
import Google from "/images/google.png";
import SignLogHeader from "../../../components/Header/SignupLoginHead";
import NetworkStatusIcon from "../../../components/NetworkStatus/Network";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the icons

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

const Login = () => {
  const [loginError, setLoginError] = useState('');
  const [networkError, setNetworkError] = useState(''); // State for network error
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const navigate = useNavigate();
  const endpoint = "https://theegsd.pythonanywhere.com";

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const checkUserDetails = async () => {
    try {
      const response = await axiosInstance.get('/student/details');
      if (response.data && response.data.first_name && response.data.last_name) {
        return true;
      }
      return false;
    } catch (error) {
      //console.error('Error fetching user details:', error);
      return false;
    }
  };

  const checkProgramCompletion = async () => {
    try {
      const response = await axiosInstance.get('/student/programmes/');
      if (response.data && response.data.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      //console.error('Error checking program completion:', error);
      return false;
    }
  };

  const checkProgramRegistration = async () => {
    try {
      const response = await axiosInstance.get('/trainings/registrations');
      //console.log(response.data)
      if (response.data && response.data.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      //console.error('Error checking program registration:', error);
      return false;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.post('/account/login/', values);
      if (response.data && response.data.token) {
        const token = response.data.token;
        // Set cookie with 1-day expiry
        Cookies.set('token', token, { expires: 1 });
        //console.log('Login successful, token:', token);

        const isProfileComplete = await checkUserDetails();
        //console.log('isProfileComplete:', isProfileComplete);

        if (isProfileComplete) {
          const isProgramComplete = await checkProgramCompletion();
          //console.log('isProgramComplete:', isProgramComplete);

          if (isProgramComplete) {
            const isRegisteredForProgram = await checkProgramRegistration();
            //console.log('isRegisteredForProgram:', isRegisteredForProgram);

            if (isRegisteredForProgram) {
              //console.log('User is registered for a program. Redirecting to dashboard.');
              navigate('/registration-portal');
            } else {
              //console.log('User needs to complete program registration. Redirecting to complete-program-registration page.');
              navigate('/register');
            }
          } else {
            //console.log('User needs to complete profile (step 2). Redirecting to complete-profile2 page.');
            navigate('/complete-profile2');
          }
        } else {
          //console.log('User details are incomplete. Redirecting to complete-profile page.');
          navigate('/complete-profile');
        }
      } else {
        setLoginError('Login failed. Unexpected response format.');
        handleErrorTimeout();
      }
    } catch (error) {
      if (!error.response) {
        setNetworkError('Network error. Please check your internet connection and try again.');
      } else if (error.response && error.response.status === 404) {
        setLoginError('User not found in the database.');
      } else {
        //console.error('Login error:', error);
        setLoginError('Invalid email or password!');
      }
      handleErrorTimeout();
    } finally {
      setSubmitting(false);
    }
  };

  const handleErrorTimeout = () => {
    setTimeout(() => {
      setLoginError('');
      setNetworkError(''); // Clear network error after timeout
    }, 5000); // Set timeout for 5 seconds
  };

  return ( 
    <div className="loginPage route-Dash">
      <Helmet>
        <title>ITCC - Login</title>
      </Helmet>
      <DummySideBar />
      <section className="signUp">
        <main>
          <div className="main-container">
            <div className="signUpContainer">
              <SignLogHeader/>
              <NetworkStatusIcon/>
              <div className="signUpForm">
                <div className="todo">Log In</div>
                {loginError && (
                  <div className="signInError">
                    {loginError}
                    <div className="errorCountdown"></div>
                  </div>
                )}
                {networkError && (
                  <div className="signInError">
                    {networkError}
                    <div className="errorCountdown"></div>
                  </div>
                )}
                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={LoginSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="formSignUp" id="signupForm">
                      <div className="email">
                        <Field type="email" name="email" placeholder="Email" autoComplete="on"/>
                        <ErrorMessage name="email" component="div" className="error" />
                      </div>
                      <div className="password">
                        <Field
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                        />
                        <span
                          className="password-toggle-icon"
                          onClick={togglePasswordVisibility}
                        >
                          {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        <ErrorMessage name="password" component="div" className="error" />
                      </div>
                      <button className="signIn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <PulseLoader size={10} color="white"/> : 'Sign In'}
                      </button>
                      <div className="or">
                        <hr/> <span>or</span>
                      </div>
                      <div className="signInWithGoogle">
                        <a href="googleAPIHere" className="googleSign">
                          <img src={Google} alt="Google Image"/>
                          Continue with Google
                        </a>
                      </div>
                      <div className="login">
                        Don't have an account? <span><Link to="/signup">Create an Account</Link></span>
                      </div>
                      <div className="reset">
                        Forgotten Password? <span><Link to="password_reset.html">Reset Password</Link></span>
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
}

export default Login;
