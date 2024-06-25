import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './update_profile.css';

const PersonalDetailsSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  middle_name: Yup.string(),
  phone_number: Yup.string().required('Phone Number is required'),
  dob: Yup.date().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  nationality: Yup.string().required('Nationality is required'),
  address: Yup.string().required('Address is required'),
  next_of_kin: Yup.string(),
  next_of_kin_address: Yup.string(),
  next_of_kin_relationship: Yup.string(),
  next_of_kin_phone_number: Yup.string(),
  campus_address: Yup.string(),
  language: Yup.string().required('Language is required'),
  passport: Yup.mixed().required('Passport is required'),
  signature: Yup.mixed().required('Signature is required'),
});

const DepartmentDetailsSchema = Yup.object().shape({
  matric_number: Yup.string().required('Matric Number is required'),
  faculty: Yup.string().required('Faculty is required'),
  department: Yup.string().required('Department is required'),
  programme_type: Yup.string().required('Programme Type is required'),
  session_of_entry: Yup.string()
    .matches(/^\d{4}\/\d{4}$/, 'Session of Entry must be in the format YYYY/YYYY')
    .required('Session of Entry is required'),
  school_email: Yup.string()
    .email('Invalid email address')
    .matches(/^[a-zA-Z0-9._%+-]+@ui\.edu\.ng$/, 'Email must be a valid UI email address')
    .required('School Email is required'),
});

const UpdateProfileForm = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [facultyData, setFacultyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [programmeTypeData, setProgrammeTypeData] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch the faculty, department, and programme type data from the backend
    const fetchData = async () => {
      try {
        const [facultyRes, departmentRes, programmeTypeRes] = await Promise.all([
          axios.get('https://theegsd.pythonanywhere.com/api/v1/lookups/faculties', {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get('https://theegsd.pythonanywhere.com/api/v1/lookups/departments', {
            headers: { Authorization: `Token ${token}` },
          }),
         
        ]);
        setFacultyData(facultyRes.data);
        setDepartmentData(departmentRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmitPersonalDetails = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] instanceof File) {
          formData.append(key, values[key], values[key].name);
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });
  
      // Log the form data
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      const response = await axios.post(
        'https://theegsd.pythonanywhere.com/api/v1/student/profile',
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
  
      console.log('Response:', response);
  
      if (response.status === 200) {
        console.log('Personal details submitted successfully');
        return true; // Indicate successful submission
      } else {
        console.error('Unexpected response status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error in handleSubmitPersonalDetails:');
      if (error.response) {
        // console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Error config:', error.config);
      return false;
    }
  };
  

  const handleSubmitDepartmentDetails = async (values) => {
    try {
      const response = await axios.post(
        'https://theegsd.pythonanywhere.com/api/v1/student/programmes',
        values,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate('/profile-success');
      }
    } catch (error) {
      console.error('Error updating department details:', error);
    }
  };

  return (
    <div className="formWrapper">
      <div className="formCase">
        <h1>Update Profile Information</h1>
        <Formik
          initialValues={{
            first_name: '',
            middle_name: '',
            phone_number: '',
            dob: '',
            gender: '',
            nationality: '',
            address: '',
            next_of_kin: '',
            next_of_kin_address: '',
            next_of_kin_relationship: '',
            next_of_kin_phone_number: '',
            campus_address: '',
            language: '',
            passport: null,
            signature: null,
            matric_number: '',
            faculty: '',
            department: '',
            programme_type: '',
            session_of_entry: '',
            school_email: '',
          }}
          validationSchema={currentSection === 0 ? PersonalDetailsSchema : DepartmentDetailsSchema}
          onSubmit={async (values, { setSubmitting }) => {
            if (currentSection === 0) {
              await handleSubmitPersonalDetails(values);
            } else {
              await handleSubmitDepartmentDetails(values);
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form id="regForm">
              {currentSection === 0 && (
                <div className="section">
                  <h2>Personal Details</h2>
                  <div className="formContents">
                    <label htmlFor="first_name">First Name</label>
                    <Field type="text" name="first_name" placeholder="First Name" />
                    <ErrorMessage name="first_name" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="middle_name">Middle Name</label>
                    <Field type="text" name="middle_name" placeholder="Middle Name" />
                    <ErrorMessage name="middle_name" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="phone_number">Phone Number</label>
                    <Field type="text" name="phone_number" placeholder="Mobile Number" />
                    <ErrorMessage name="phone_number" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="dob">Date of Birth</label>
                    <Field type="date" name="dob" />
                    <ErrorMessage name="dob" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="gender">Gender</label>
                    <Field as="select" name="gender">
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="nationality">Nationality</label>
                    <Field type="text" name="nationality" placeholder="Nationality" />
                    <ErrorMessage name="nationality" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="address">Address</label>
                    <Field type="text" name="address" placeholder="Home Address" />
                    <ErrorMessage name="address" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="next_of_kin">Next of Kin</label>
                    <Field type="text" name="next_of_kin" placeholder="Name of Next of Kin" />
                    <ErrorMessage name="next_of_kin" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="next_of_kin_address">Next of Kin Address</label>
                    <Field type="text" name="next_of_kin_address" placeholder="Address of Next of Kin" />
                    <ErrorMessage name="next_of_kin_address" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="next_of_kin_relationship">Next of Kin Relationship</label>
                    <Field type="text" name="next_of_kin_relationship" placeholder="Relationship with Next of Kin" />
                    <ErrorMessage name="next_of_kin_relationship" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="next_of_kin_phone_number">Next of Kin Phone Number</label>
                    <Field type="text" name="next_of_kin_phone_number" placeholder="Phone Number of Next of Kin" />
                    <ErrorMessage name="next_of_kin_phone_number" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="campus_address">Campus Address</label>
                    <Field type="text" name="campus_address" placeholder="Campus Address" />
                    <ErrorMessage name="campus_address" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="language">Language</label>
                    <Field type="text" name="language" placeholder="Language" />
                    <ErrorMessage name="language" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="passport">Passport</label>
                    <input type="file" name="passport" onChange={(event) => setFieldValue('passport', event.currentTarget.files[0])} />
                    <ErrorMessage name="passport" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="signature">Signature</label>
                    <input type="file" name="signature" onChange={(event) => setFieldValue('signature', event.currentTarget.files[0])} />
                    <ErrorMessage name="signature" component="div" className="error" />
                  </div>
                </div>
              )}

              {currentSection === 1 && (
                <div className="section">
                  <h2>Department Details</h2>
                  <div className="formContents">
                    <label htmlFor="matric_number">Matric Number</label>
                    <Field type="text" name="matric_number" placeholder="Matric Number" />
                    <ErrorMessage name="matric_number" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="faculty">Faculty</label>
                    <Field as="select" name="faculty">
                      <option value="">Select Faculty</option>
                      {facultyData.map((faculty) => (
                        <option key={faculty.id} value={faculty.name}>
                          {faculty.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="faculty" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="department">Department</label>
                    <Field as="select" name="department">
                      <option value="">Select Department</option>
                      {departmentData.map((department) => (
                        <option key={department.id} value={department.name}>
                          {department.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="department" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="programme_type">Programme Type</label>
                    <Field as="select" name="programme_type">
                      <option value="">Select Programme Type</option>
                      {programmeTypeData.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="programme_type" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="session_of_entry">Session of Entry</label>
                    <Field type="text" name="session_of_entry" placeholder="YYYY/YYYY" />
                    <ErrorMessage name="session_of_entry" component="div" className="error" />
                  </div>
                  <div className="formContents">
                    <label htmlFor="school_email">School Email</label>
                    <Field type="email" name="school_email" placeholder="example@ui.edu.ng" />
                    <ErrorMessage name="school_email" component="div" className="error" />
                  </div>
                </div>
              )}

              <div className="button-container">
                {currentSection > 0 && (
                  <button type="button" onClick={() => setCurrentSection(currentSection - 1)}>
                    Previous
                  </button>
                )}
                {currentSection < 1 ? (
                  <button type="submit" disabled={isSubmitting}>
                    Next
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
