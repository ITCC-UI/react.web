import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Forward from "/images/icon.png";
import FormHeader from '../Header/FormHeader';
// import "./thisForm.scss";

const FormCase = () => {
  const navigate = useNavigate();
  const [submittedValues, setSubmittedValues] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [facultyData, setFacultyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const response = await axios.get('https://theegsd.pythonanywhere.com/api/v1/lookups/faculties/');
      setFacultyData(response.data);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
    }
  };

  const fetchDepartmentData = async (facultyId) => {
    try {
      const response = await axios.get(`https://theegsd.pythonanywhere.com/api/v1/lookups/faculties/${facultyId}/departments/`);
      setDepartmentData(response.data);
    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };

  const validationSchema = Yup.object({
    matric_number: Yup.string()
      .required('Matric Number is required'),
    programme_type: Yup.string().required('Programme Type is required'),
    faculty: Yup.string().required('Faculty is required'),
    department: Yup.string().required('Department is required'),
    session_of_entry: Yup.string().required('Session of entry is required'),
    school_email: Yup.string()
      .email('Invalid email address')
      .test('is-ui-email', 'Please use your student email ending with .ui.edu.ng', 
        value => value && value.endsWith('.ui.edu.ng'))
      .required('School email is required'),
  });

  const initialValues = {
    matric_number: '',
    programme_type: '',
    // faculty: '',
    department: '',
    session_of_entry: '',
    school_email: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        "https://theegsd.pythonanywhere.com/api/v1/student/programmes/", 
        values,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setSubmittedValues(values);
        setShowForm(false);
        navigate('/dashboard'); // Navigate to dashboard on success
      } else {
        console.error('Error submitting form:', response);
        alert('There was an error submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setShowForm(true);
  };

  return (
    <><FormHeader/>
    <div className={`form-container`} id='newformCase'>
      
      <div className="fillForm">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className='form'>
                <div className="details">
                  Programme Details
                </div>
                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="matric_number">Matric Number</label>
                    <Field name="matric_number" type="text" placeholder="Matric Number"/>
                    <ErrorMessage name="matric_number" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="programme_type">Programme Type</label>
                    <Field as="select" name="programme_type">
                      <option value="">Select Programme Type</option>
                      <option value="DLC">DLC</option>
                      <option value="REGULAR">REGULAR</option>
                      <option value="POSTGRADUATE">POSTGRADUATE</option>
                    </Field>
                    <ErrorMessage name="programme_type" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="faculty">Faculty</label>
                    <Field as="select" name="faculty" onChange={(e) => {
                      setFieldValue("faculty", e.target.value);
                      setFieldValue("department", "");
                      fetchDepartmentData(e.target.value);
                    }}>
                      <option value="">Select Faculty</option>
                      {facultyData.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="faculty" component="div" className="error" />
                  </div>
                </div>

                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <Field as="select" name="department">
                      <option value="" name="department">Select Department</option>
                      {departmentData.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="department" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="session_of_entry">Session of Entry</label>
                    <Field as="select" name="session_of_entry">
                      <option value="">Select Session</option>
                      <option value="2019/2020">2019/2020</option>
                      <option value="2020/2021">2020/2021</option>
                      <option value="2021/2022">2021/2022</option>
                    </Field>
                    <ErrorMessage name="session_of_entry" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="school_email">School Email</label>
                    <Field 
                      name="school_email" 
                      type="email" 
                      placeholder="studentid@stu.ui.edu.ng"
                    />
                    <ErrorMessage name="school_email" component="div" className="error" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className='register_here'>
                  {isSubmitting ? 'Submitting...' : <><span>Submit</span> <img src={Forward} alt="" /></>}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
    </>
  );
};

export default FormCase;