// src/components/FormCase.js
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../API Instances/AxiosIntances';
import Forward from '/images/icon.png';
import FormHeader from '../Header/FormHeader';
import './pageForm.scss';

const FormCase = () => {
  const navigate = useNavigate();
  const [submittedValues, setSubmittedValues] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [facultyData, setFacultyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [formError, setFormError] = useState('');
  const [programmeData, setProgrammeData] = useState([]);

  useEffect(() => {
    fetchFacultyData();
    fetchProgrammeType();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const response = await axiosInstance.get('lookups/programmes/faculties/');
      setFacultyData(response.data);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
    }
  };

  const fetchProgrammeType = async () => {
    try {
      const response = await axiosInstance.get('student/programmes/types/lookup/');
      setProgrammeData(response.data);
    } catch (error) {
      console.error('Error fetching programme data:', error);
    }
  };

  const fetchDepartmentData = async (facultyId) => {
    try {
      const response = await axiosInstance.get(`lookups/programmes/faculties/${facultyId}/departments/`);
      setDepartmentData(response.data);
    } catch (error) {
      console.error('Error fetching department data:', error);
    }
  };

  const validationSchema = Yup.object({
    matric_number: Yup.string().required('Matric Number is required'),
    programme_type: Yup.string().required('Programme Type is required'),
    faculty: Yup.string().required('Faculty is required'),
    department: Yup.string().required('Department is required'),
    session_of_entry: Yup.string().required('Session of entry is required'),
    school_email: Yup.string()
      .email('Invalid email address')
      // .test('is-ui-email', 'Please use your student email ending with .ui.edu.ng', 
      //   value => value && value.endsWith('.ui.edu.ng')),
  });

  const initialValues = {
    matric_number: '',
    programme_type: '',
    faculty: '',
    department: '',
    session_of_entry: '',
    school_email: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setFormError('');
    try {
      const response = await axiosInstance.post('student/programmes/', values);

      if (response.status === 201) {
        setSubmittedValues(values);
        setShowForm(false);
        navigate('/register'); // Navigate to dashboard on success
      } else {
        console.error('Error submitting for:', response);
        setFormError('There wa ahs an error submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('There was an error submitting your form. Please try again.');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className={`form-container`} id="newformCase">
      <FormHeader />
      <div className="fillForm">
        {formError && <div className="error">{formError}</div>}
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
              <Form className="form">
                <div className="details">Programme Details</div>
                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="matric_number">Matric Number</label>
                    <Field name="matric_number" type="text" placeholder="Matric Number" />
                    <ErrorMessage name="matric_number" component="div" className="error" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="faculty">Faculty</label>
                    <Field
                      as="select"
                      name="faculty"
                      onChange={(e) => {
                        setFieldValue('faculty', e.target.value);
                        setFieldValue('department', '');
                        fetchDepartmentData(e.target.value);
                      }}
                    >
                      <option value="">Select Faculty</option>
                      {facultyData.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="faculty" component="div" className="error" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <Field as="select" name="department">
                      <option value="" name="department">
                        Select Department
                      </option>
                      {departmentData.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="department" component="div" className="error" />
                  </div>
                </div>

                <div className="formTop">
                  <div className="form-group">
                    <label htmlFor="programme_type">Programme Type</label>
                    <Field as="select" name="programme_type">
                      <option value="" name="programme_type">
                        Programme Type
                      </option>
                      {programmeData.map((programme) => (
                        <option key={programme.id} value={programme.id}>
                          {programme.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="programme_type" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="session_of_entry">Session of Entry</label>
                    <Field as="select" name="session_of_entry">
                      <option value="">Select Session</option>
                      <option value="2019/2020">2017/2018</option>
                      <option value="2019/2020">2018/2019</option>
                      <option value="2019/2020">2019/2020</option>
                      <option value="2020/2021">2020/2021</option>
                      <option value="2021/2022">2021/2022</option>
                    </Field>
                    <ErrorMessage name="session_of_entry" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="school_email">School Email</label>
                    <Field name="school_email" type="email" placeholder="studentid@stu.ui.edu.ng" />
                    <ErrorMessage name="school_email" component="div" className="error" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="register_here">
                  {isSubmitting ? 'Submitting...' : <><span>Submit</span> <img src={Forward} alt="" /></>}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default FormCase;
