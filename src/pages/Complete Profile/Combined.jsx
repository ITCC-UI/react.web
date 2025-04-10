import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Forward from "/images/icon.png";
import "./form.scss"

const CombinedForm = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [facultyData, setFacultyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const token = localStorage.getItem('token');

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

  const PersonalDetailsSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    middle_name: Yup.string(),
    phone_number: Yup.string().required('Phone Number is required'),
    last_name: Yup.string().required('Last Name is required'),
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

  const ProgrammeDetailsSchema = Yup.object().shape({
    matric_number: Yup.string().required('Matric Number is required'),
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
    // Personal Details
    first_name: '',
    last_name: '',
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
    // Programme Details
    matric_number: '',
    programme_type: '',
    faculty: '',
    department: '',
    session_of_entry: '',
    school_email: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const personalDetailsFormData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] instanceof File) {
          personalDetailsFormData.append(key, values[key], values[key].name);
        } else if (values[key] !== undefined && values[key] !== null) {
          personalDetailsFormData.append(key, values[key]);
        }
      });

      const programmeDetails = {
        matric_number: values.matric_number,
        programme_type: values.programme_type,
        faculty: values.faculty,
        department: values.department,
        session_of_entry: values.session_of_entry,
        school_email: values.school_email,
      };

      const [personalResponse, programmeResponse] = await Promise.all([
        axios.post(
          'https://theegsd.pythonanywhere.com/api/v1/student/profile/',
          personalDetailsFormData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        ),
        axios.post(
          "https://theegsd.pythonanywhere.com/api/v1/student/programmes/", 
          programmeDetails,
          {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
      ]);

      if (personalResponse.status === 200 && programmeResponse.status === 200) {
    
        navigate('/dashboard');
      } else {
        console.error('Unexpected response status');
        alert('There was an error saving your data. Please try again.');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('There was an error submitting your forms. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="formWrapper">
      <div className="formCase">
        <h1>{page === 1 ? "Update Profile Information" : "Programme Details"}</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={page === 1 ? PersonalDetailsSchema : ProgrammeDetailsSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form id="regForm">
              {page === 1 ? (
                // Personal Details Form
                <div className="section">
                  <h2>Personal Details</h2>
                  {/* Add all the personal details fields here */}
                  {/* ... */}
<div className="formTop">
  
<div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <Field type="text" name="first_name" placeholder="First Name" />
                  <ErrorMessage name="first_name" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <Field type="text" name="last_name" placeholder="Last Name" />
                  <ErrorMessage name="last_name" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="middle_name">Middle Name</label>
                  <Field type="text" name="middle_name" placeholder="Middle Name" />
                  <ErrorMessage name="middle_name" component="div" className="error" />
                </div>
</div>


               <div className="formTop">
               <div className="form-group">
                  <label htmlFor="phone_number">Phone Number</label>
                  <Field type="text" name="phone_number" placeholder="Mobile Number" />
                  <ErrorMessage name="phone_number" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <Field type="date" name="dob" />
                  <ErrorMessage name="dob" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <Field as="select" name="gender">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="error" />
                </div>
               </div>

               
             <div className="formTop">
             <div className="form-group">
                  <label htmlFor="nationality">Nationality</label>
                  <Field type="text" name="nationality" placeholder="Nationality" />
                  <ErrorMessage name="nationality" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <Field type="text" name="address" placeholder="Home Address" />
                  <ErrorMessage name="address" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="next_of_kin">Next of Kin</label>
                  <Field type="text" name="next_of_kin" placeholder="Name of Next of Kin" />
                  <ErrorMessage name="next_of_kin" component="div" className="error" />
                </div>
             </div>


              <div className="formTop">
                <div className="form-group">
                  <label htmlFor="next_of_kin_address">Next of Kin Address</label>
                  <Field type="text" name="next_of_kin_address" placeholder="Address of Next of Kin" />
                  <ErrorMessage name="next_of_kin_address" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="next_of_kin_relationship">Next of Kin Relationship</label>
                  <Field type="text" name="next_of_kin_relationship" placeholder="Relationship with Next of Kin" />
                  <ErrorMessage name="next_of_kin_relationship" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="next_of_kin_phone_number">Next of Kin Phone Number</label>
                  <Field type="text" name="next_of_kin_phone_number" placeholder="Phone Number of Next of Kin" />
                  <ErrorMessage name="next_of_kin_phone_number" component="div" className="error" />
                </div>

                </div>

                <div className="formTop">
                <div className="form-group">
                  <label htmlFor="campus_address">Campus Address</label>
                  <Field type="text" name="campus_address" placeholder="Campus Address" />
                  <ErrorMessage name="campus_address" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="language">Language</label>
                  <Field type="text" name="language" placeholder="Language" />
                  <ErrorMessage name="language" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="passport">Passport</label>
                  <input type="file" name="passport" onChange={(event) => setFieldValue('passport', event.currentTarget.files[0])} />
                  <ErrorMessage name="passport" component="div" className="error" />
                </div>
                </div>
                <div className="formTop">
                <div className="form-group">
                  <label htmlFor="signature">Signature</label>
                  <input type="file" name="signature" onChange={(event) => setFieldValue('signature', event.currentTarget.files[0])} />
                  <ErrorMessage name="signature" component="div" className="error" />
                </div>
                </div>


                  <div className="button-container">
                    <button type="button" onClick={() => setPage(2)}><img src={Forward}/>Next</button>
                  </div>
                </div>
              ) : (
                // Programme Details Form
                <div className="section">
                  <h2>Programme Details</h2>
                  {/* Add all the programme details fields here */}
                  {/* ... */}

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
                  <div className="button-container container2">
                    <button type="button" onClick={() => setPage(1)}>Previous</button>
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : <><span>Submit</span> <img src={Forward} alt="" /></>}
                    </button>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CombinedForm;