import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../API Instances/AxiosIntances';
import Forward from '/images/icon.png';
import FormHeader from '../Header/FormHeader';
import "../../src/pages/Complete Profile/form.scss"
import { Helmet } from 'react-helmet';
import { PulseLoader } from 'react-spinners';

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
    const savedValues = JSON.parse(localStorage.getItem('formValues'));
    if (savedValues) {
      setFormValues(savedValues);
    }
  }, []);

  const fetchFacultyData = async () => {
    try {
      const response = await axiosInstance.get('lookups/programmes/faculties/');
      setFacultyData(response.data);
    } catch (error) {
     
    }
  };

  const fetchProgrammeType = async () => {
    try {
      const response = await axiosInstance.get('student/programmes/types/lookup/');
      setProgrammeData(response.data);
    } catch (error) {
     
    }
  };

  const fetchDepartmentData = async (facultyId) => {
    try {
      const response = await axiosInstance.get(`lookups/programmes/faculties/${facultyId}/departments/`);
      setDepartmentData(response.data);
    } catch (error) {
     
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

  const [formValues, setFormValues] = useState(initialValues);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setIsLoading(true);
    setFormError('');
    try {
      const response = await axiosInstance.post('student/programmes/', values);

      if (response.status === 201) {
        setSubmittedValues(values);
        setShowForm(false);
        navigate('/register');
        localStorage.removeItem('formValues');
      } else {
      
        setFormError('There was an error submitting your form. Please try again.');
      }
    } catch (error) {
     
      if (error.response && error.response.status === 500) {
        setFormError('An unexpected error occured. Please try again.');
      } else if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        const errorMessage = Object.values(apiErrors).flat().join(', ');
        setFormError(errorMessage);
      } else {
        setFormError('There was an error submitting your form. Please try again.');
      }
      setTimeout(() => {
        setFormError('');
      }, 5000); // 5000 milliseconds = 5 seconds
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleFormChange = (values) => {
    setFormValues(values);
    localStorage.setItem('formValues', JSON.stringify(values));
  };

  return (
    <div className="formWrapper">
      <Helmet>
        <title>
          ITCC - Update Profile
        </title>
      </Helmet>
      <FormHeader />
      <div className="formCase">
        {formError && <div className="formerror">{formError}</div>}
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : (
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form id='regForm'>
               <div className="section">
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
                        handleFormChange({ ...values, faculty: e.target.value, department: '' });
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
                    <Field as="select" name="department" onChange={(e) => handleFormChange({ ...values, department: e.target.value })}>
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
                    <Field as="select" name="programme_type" onChange={(e) => handleFormChange({ ...values, programme_type: e.target.value })}>
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
                    <Field type="text" name="session_of_entry" placeholder="2018/2019" onChange={(e) => handleFormChange({ ...values, session_of_entry: e.target.value })}/>
                    <ErrorMessage name="session_of_entry" component="div" className="error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="school_email">School Email</label>
                    <Field name="school_email" type="email" placeholder="studentid@stu.ui.edu.ng" onChange={(e) => handleFormChange({ ...values, school_email: e.target.value })}/>
                    <ErrorMessage name="school_email" component="div" className="error" />
                  </div>
                </div>
              <div className="button-container">
              <button type="submit" disabled={isSubmitting} className="register_here">
                  {isSubmitting ? <PulseLoader size={10} color='white' /> : <><span>Submit</span> <img src={Forward} alt="" /></>}
                </button>
              </div>
               </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default FormCase;
