import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Login from '../Login/Login';
import { Link } from 'react-router-dom';
// import './SignUp.scss';

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const SignUp = () => {
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await axios.post('https://theegsd.pythonanywhere.com/api/v1/student/signup/', values);
      console.log('Signup successful', response.data);
      // Handle successful signup (e.g., redirect or show success message)
    } catch (error) {
      console.error('Signup failed', error);
      setStatus({ error: 'Signup failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="signUp">
      <div className="barsDesktop">
        <div className="gold-bar"></div>
        <div className="purple-bar"></div>
      </div>

      <main>
        <div className="main-container">
          <div className="signUpContainer">
            <header>
              <h1>INDUSTRIAL TRAINING COORDINATING CENTER</h1>
              <h3><i>bridging the gap between theory and practical....</i></h3>
              <div className="logo">
                <img src="/static/assets/images/logo_new.png" alt="University of Ibadan Logo" />
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
                      Create Account
                    </button>
                    {status && status.error && <div className="error">{status.error}</div>}

                    <div className="or">
                      <hr /> <span>or</span>
                    </div>

                    <div className="signInWithGoogle">
                      <a href="googleAPIHere" className="googleSign">
                        <img src="/static/assets/images/google.png" alt="Google Image" />
                        Continue with Google
                      </a>
                    </div>

                    <div className="login">Already have an account? <span><Link to="/login">Login</Link></span></div>
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
  );
};

export default SignUp;




// aeorck@gmail.con
// 1234Abcdef