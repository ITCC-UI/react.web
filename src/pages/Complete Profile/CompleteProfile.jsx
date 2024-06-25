import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './complete_profile.scss';

const PersonalInfoSchema = Yup.object().shape({
  matric: Yup.string().required('Matric Number is required'),
  fName: Yup.string().required('First Name is required'),
  lName: Yup.string().required('Last Name is required'),
  pNumber: Yup.string().required('Phone Number is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  nationality: Yup.string().required('Nationality is required'),
  hAddress: Yup.string().required('Home Address is required'),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.date().required('Date of Birth is required'),
  disability: Yup.string().required('Disability is required'),
  language: Yup.string().required('Languages other than English are required'),
  mStatus: Yup.string().required('Marital Status is required'),
  studentType: Yup.string().required('Type of Student is required'),
  passport: Yup.mixed().required('Passport is required'),
  signature: Yup.mixed().required('Signature is required')
});

const DepartmentInfoSchema = Yup.object().shape({
  entry: Yup.number().required('Year of Entry is required'),
  level: Yup.string().required('Level is required'),
  faculty: Yup.string().required('Faculty is required'),
  department: Yup.string().required('Department is required')
});

const NextOfKinInfoSchema = Yup.object().shape({
  nextofKinName: Yup.string().required('Next of Kin Name is required'),
  nextofKinAddress: Yup.string().required('Next of Kin Address is required'),
  relationship: Yup.string().required('Relationship is required'),
  nokPhone: Yup.string().required('Next of Kin Phone Number is required')
});

const validationSchemas = [PersonalInfoSchema, DepartmentInfoSchema, NextOfKinInfoSchema];

const CompleteProfile = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [error, setError] = useState('');

  const showSection = (index) => {
    document.querySelectorAll('.section').forEach((section, i) => {
      section.style.display = i === index ? 'block' : 'none';
    });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://api.example.com/update-profile', values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Form submitted successfully', response.data);
    } catch (error) {
      setError('Submission failed. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = (validateForm, values) => {
    validateForm().then(errors => {
      if (Object.keys(errors).length === 0) {
        setCurrentSection(currentSection + 1);
      }
    });
  };

  const handlePrev = () => {
    setCurrentSection(currentSection - 1);
  };

  return (
    <div className="formWrapper">
      <div className="formCase">
        <Formik
          initialValues={{
            matric: '',
            fName: '',
            mName: '',
            lName: '',
            pNumber: '',
            email: '',
            nationality: '',
            hAddress: '',
            gender: '',
            dob: '',
            disability: '',
            language: '',
            mStatus: '',
            studentType: '',
            passport: null,
            signature: null,
            entry: '',
            level: '',
            faculty: '',
            department: '',
            nextofKinName: '',
            nextofKinAddress: '',
            relationship: '',
            nokPhone: ''
          }}
          validationSchema={validationSchemas[currentSection]}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, validateForm, values }) => (
            <Form id="regForm">
              {currentSection === 0 && (
                <div className="personalInformation section">
                  <div className="formContents top">
                    <label htmlFor="matric">Matric No</label>
                    <Field type="text" name="matric" id="matric" placeholder="Matric Number" />
                    <ErrorMessage name="matric" component="div" className="error" />
                  </div>
                  <div className="h2">Personal Details</div>
                  <div className="personalDetails">
                    <div className="formContents">
                      <label htmlFor="fName">First Name</label>
                      <Field type="text" name="fName" id="fName" placeholder="First Name" />
                      <ErrorMessage name="fName" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="mName">Middle Name</label>
                      <Field type="text" name="mName" id="mName" placeholder="Middle Name" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="lName">Last Name</label>
                      <Field type="text" name="lName" id="lName" placeholder="Last Name" />
                      <ErrorMessage name="lName" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="pNumber">Phone Number</label>
                      <Field type="text" name="pNumber" id="pNumber" placeholder="Mobile Number" />
                      <ErrorMessage name="pNumber" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="email">Email</label>
                      <Field type="email" name="email" id="email" placeholder="Email" autoComplete="email" />
                      <ErrorMessage name="email" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="nationality">Nationality</label>
                      <Field type="text" name="nationality" id="nationality" placeholder="Nationality" />
                      <ErrorMessage name="nationality" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="hAddress">Home Address</label>
                      <Field type="text" name="hAddress" id="hAddress" placeholder="Home Address" />
                      <ErrorMessage name="hAddress" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="gender">Gender</label>
                      <Field as="select" name="gender" id="gender">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="dob">Date of Birth</label>
                      <Field type="date" name="dob" id="dob" />
                      <ErrorMessage name="dob" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="disability">Disability</label>
                      <Field type="text" name="disability" id="disability" placeholder="Disability NA if not applicable" />
                      <ErrorMessage name="disability" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="language">Languages other than English</label>
                      <Field type="text" name="language" id="language" placeholder="Languages other than English" />
                      <ErrorMessage name="language" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="mStatus">Marital Status</label>
                      <Field as="select" name="mStatus" id="mStatus">
                        <option value="">Select Status</option>
                        <option value="married">Married</option>
                        <option value="single">Single</option>
                        <option value="divorced">Divorced</option>
                      </Field>
                      <ErrorMessage name="mStatus" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="studentType">Type of Student</label>
                      <Field as="select" name="studentType" id="studentType">
                        <option value="">Select Type</option>
                        <option value="dlc">Part-Time</option>
                        <option value="main">Full-Time</option>
                      </Field>
                      <ErrorMessage name="studentType" component="div" className="error" />
                    </div>
                    <div className="passport">
                      <input
                        type="file"
                        name="passport"
                        id="passport"
                        className="inputfile inputfile-1"
                        onChange={(event) => {
                          setFieldValue("passport", event.currentTarget.files[0]);
                        }}
                      />
                      <label htmlFor="passport" className="passport">
                        <img src="../../../../static/assets/images/profile-svg.svg" alt="" />
                        <span>Upload Passport <span style={{ color: 'red' }}>*</span></span>
                      </label>
                      <ErrorMessage name="passport" component="div" className="error" />
                    </div>
                    <div>
                      <input
                        type="file"
                        name="signature"
                        id="signature"
                        className="inputfile inputfile-1"
                        onChange={(event) => {
                          setFieldValue("signature", event.currentTarget.files[0]);
                        }}
                      />
                      <label htmlFor="signature">
                        <img src="../../../../static/assets/images/signature.jpg" alt="" />
                        <span>Upload Signature <span style={{ color: 'red' }}>*</span></span>
                      </label>
                      <ErrorMessage name="signature" component="div" className="error" />
                    </div>
                  </div>
                </div>
              )}
              {currentSection === 1 && (
                <div className="departmentInformation section">
                  <div className="h2">Department Information</div>
                  <div className="personalDetails">
                    <div className="formContents">
                      <label htmlFor="entry">Year of Entry</label>
                      <Field type="number" name="entry" id="entry" placeholder="2021/2022" />
                      <ErrorMessage name="entry" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="level">Level</label>
                      <Field as="select" name="level" id="level">
                        <option value="">Select Level</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                      </Field>
                      <ErrorMessage name="level" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="faculty">Faculty</label>
                      <Field as="select" name="faculty" id="faculty">
                        <option value="">Select Faculty</option>
                        <option value="science">Science</option>
                      </Field>
                      <ErrorMessage name="faculty" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="department">Department</label>
                      <Field as="select" name="department" id="department">
                        <option value="">Select Department</option>
                        <option value="computer_science">Computer Science</option>
                      </Field>
                      <ErrorMessage name="department" component="div" className="error" />
                    </div>
                  </div>
                </div>
              )}
              {currentSection === 2 && (
                <div className="nextOfKinInformation section">
                  <div className="h2">Next of Kin Information</div>
                  <div className="personalDetails">
                    <div className="formContents">
                      <label htmlFor="nextofKinName">Name</label>
                      <Field type="text" name="nextofKinName" id="nextofKinName" placeholder="Name of Next of Kin" />
                      <ErrorMessage name="nextofKinName" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="nextofKinAddress">Address</label>
                      <Field type="text" name="nextofKinAddress" id="nextofKinAddress" placeholder="Address of Next of Kin" />
                      <ErrorMessage name="nextofKinAddress" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="relationship">Relationship</label>
                      <Field type="text" name="relationship" id="relationship" placeholder="Relationship with next of kin" />
                      <ErrorMessage name="relationship" component="div" className="error" />
                    </div>
                    <div className="formContents">
                      <label htmlFor="nokPhone">Phone Number</label>
                      <Field type="text" name="nokPhone" id="nokPhone" placeholder="Phone number of Next of kin" />
                      <ErrorMessage name="nokPhone" component="div" className="error" />
                    </div>
                  </div>
                </div>
              )}
              <div className="button-container">
                {currentSection > 0 && (
                  <button type="button" id="prevBtn" className="prev-btn" onClick={handlePrev}>
                    <img src="../../../../static/assets/images/Forward%20Button.png" style={{ transform: 'rotate(180deg)' }} alt="" />
                    Previous
                  </button>
                )}
                {currentSection < validationSchemas.length - 1 && (
                  <button type="button" id="nextBtn" className="next-btn" onClick={() => handleNext(validateForm, values)}>
                    Next
                    <img src="../../../../static/assets/images/Forward%20Button.png" alt="" />
                  </button>
                )}
                {currentSection === validationSchemas.length - 1 && (
                  <button type="submit" id="submitBtn" disabled={isSubmitting}>
                    Submit
                  </button>
                )}
              </div>
              {error && <div className="error-popup">{error}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CompleteProfile;
