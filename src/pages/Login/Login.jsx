import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./login.scss";
import DummySideBar from "../../../components/Sidebar/DummySB";

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
const endpoint="https://theegsd.pythonanywhere.com"
  const checkUserDetails = async (token) => {
    try {
      const response = await axios.post(`${endpoint}/api/v1/student/profile`, {
        headers: { Authorization: `Token ${token}` }
      });
      
      // Check if essential details are present
      if (response.data && response.data.first_name && response.data.last_name) {
        return true; // User details are complete
      }
      return false; // User details are incomplete
    } catch (error) {
      console.error('Error fetching user details:', error);
      return false; // Assume details are incomplete if there's an error
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('https://theegsd.pythonanywhere.com/api/v1/account/login/', values);
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        console.log('Login successful, token:', token);

        // Check user details
        const isProfileComplete = await checkUserDetails(token);
        
        if (isProfileComplete) {
          navigate('/dashboard');
        } else {
          navigate('/complete-profile');
        }
      } else {
        setLoginError('Login failed. Unexpected response format.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid email or password!');
    } finally {
      setSubmitting(false);
    }
  };

  return ( 
    <div className="loginPage route-Dash">
      <DummySideBar />
      <section className="signUp">
        <main>
          <div className="main-container">
            <div className="signUpContainer">
              <header>
                <h1>INDUSTRIAL TRAINING COORDINATING CENTER</h1>
                <h3><i>bridging the gap between theory and practical....</i></h3>
                <div className="logo">
                  <img src="../../../../static/assets/images/logo_new.png" alt="University of Ibadan Logo"/>
                </div>
              </header>

              <div className="signUpForm">
                <div className="todo">Sign In</div>
                {loginError && <div className="signInError">{loginError}</div>}
                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={LoginSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="formSignUp" id="signupForm">
                      <Field type="email" name="email" placeholder="Email" autoComplete="on"/>
                      <ErrorMessage name="email" component="div" className="error" />

                      <div className="password">
                        <Field type="password" name="password" placeholder="Password" />
                        <ErrorMessage name="password" component="div" className="error" />
                      </div>

                      <button className="signIn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                      </button>

                      <div className="or">
                        <hr/> <span>or</span>
                      </div>

                      <div className="signInWithGoogle">
                        <a href="googleAPIHere" className="googleSign">
                          <img src="../../../../static/assets/images/google.png" alt="Google Image"/>
                          Continue with Google
                        </a>
                      </div>

                      <div className="login">
                        Don't have an account? <span><a href="/">Create an Account</a></span>
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


// test1@gmail.com
// Test1234

// testing@gmail.com 
// Test1234