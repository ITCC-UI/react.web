import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Import the spinner component
import "./login.scss";
import DummySideBar from "../../../components/Sidebar/DummySB";
import Google from "/images/google.png";
import SignLogHeader from "../../../components/Header/SignupLoginHead";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

const Login = () => {
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const endpoint = "https://theegsd.pythonanywhere.com";

  const checkUserDetails = async (token) => {
    try {
      const response = await axios.get(`${endpoint}/api/v1/student/details`, {
        headers: { Authorization: `Token ${token}` }
      });
      
      if (response.data && response.data.first_name && response.data.last_name) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return false;
    }
  };

  const checkProgramRegistration = async (token) => {
    try {
      const response = await axios.get(`${endpoint}/api/v1/trainings/registrations`, {
        headers: { Authorization: `Token ${token}` }
      });

      if (response.data && response.data.id) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking program registration:', error);
      return false;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('https://theegsd.pythonanywhere.com/api/v1/account/login/', values);
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Login successful, token:', token);

        const isProfileComplete = await checkUserDetails(token);
        console.log('isProfileComplete:', isProfileComplete);

        if (isProfileComplete) {
          const isRegisteredForProgram = await checkProgramRegistration(token);
          console.log('isRegisteredForProgram:', isRegisteredForProgram);

          if (isRegisteredForProgram) {
            console.log('User is registered for a program. Redirecting to dashboard.');
            navigate('/dashboard');
          } else {
            console.log('User needs to complete program registration. Redirecting to complete-program-registration page.');
            navigate('/complete-program-registration');
          }
        } else {
          console.log('User details are incomplete. Redirecting to complete-profile page.');
          navigate('/complete-profile');
        }
      } else {
        setLoginError('Login failed. Unexpected response format.');
        handleErrorTimeout();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLoginError('User not found in the database.');
      } else {
        console.error('Login error:', error);
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
    }, 5000); // Set timeout for 5 seconds
  };

  return ( 
    <div className="loginPage route-Dash">
      <DummySideBar />
      <section className="signUp">
        <main>
          <div className="main-container">
            <div className="signUpContainer">
              <SignLogHeader/>
              <div className="signUpForm">
                <div className="todo">Log In</div>
                {loginError && (
                  <div className="signInError">
                    {loginError}
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
                        <Field type="password" name="password" placeholder="Password" />
                        <ErrorMessage name="password" component="div" className="error" />
                      </div>
                      <button className="signIn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <ClipLoader size={20} color="inherit"/>  : 'Sign In'}
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
                        Don't have an account? <span><a href="/signup">Create an Account</a></span>
                      </div>
                      <div className="reset">
                        Forgotten Password? <span><a href="password_reset.html">Reset Password</a></span>
                      </div>
                    </Form>
                  )}
                </Formik>
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
}

export default Login;
