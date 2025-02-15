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
  const [networkError, setNetworkError] = useState(''); 
  const [passwordVisible, setPasswordVisible] = useState(false); 
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
      
      return false;
    }
  };

  const checkProgramRegistration = async () => {
    try {
      const response = await axiosInstance.get('/trainings/registrations');
      
      if (response.data && response.data.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      
      return false;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.post('/account/login/', values);
      if (response.data && response.data.token) {
        const token = response.data.token;
        
        Cookies.set('token', token, { expires: 1 });
        

        const isProfileComplete = await checkUserDetails();
        

        if (isProfileComplete) {
          const isProgramComplete = await checkProgramCompletion();
          

          if (isProgramComplete) {
            const isRegisteredForProgram = await checkProgramRegistration();
            

            if (isRegisteredForProgram) {
              
              navigate('/registration-portal');
            } else {
              
              navigate('/register');
            }
          } else {
            
            navigate('/complete-profile2');
          }
        } else {
          
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
       
        setLoginError(error.response.data.non_field_errors[0]);
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
                        Don't have an account? <span><Link to="/init-signup">Create an Account</Link></span>
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
}

export default Login;
