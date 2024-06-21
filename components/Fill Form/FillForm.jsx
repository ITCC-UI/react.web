import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import './formfiller.scss';
import Forward from "/images/icon.png"

// Dummy data for the dropdowns
const programmeTypes = ['Undergraduate', 'Postgraduate'];
const faculties = ['Faculty of Science', 'Faculty of Arts', 'Faculty of Engineering'];
const departments = ['Department of Computer Science', 'Department of Mathematics', 'Department of Physics'];
const sessions = ['2019/2020', '2020/2021', '2021/2022'];

const UserForm = ({ isVisible, onClose }) => {
  const [submittedValues, setSubmittedValues] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const validationSchema = Yup.object({
    matricNumber: Yup.number()
    // .min(5, "Minimum matric number is 6")
    // .max(7, "Maximum matric number is 7")
    .required('Matric Number is required'),
    programmeType: Yup.string().required('Programme Type is required'),
    faculty: Yup.string().required('Faculty is required'),
    department: Yup.string().required('Department is required'),
    session: Yup.string().required('Session of entry is required'),
    schoolEmail: Yup.string().email('Invalid email address').required('School email is required'),
  });

  const initialValues = {
    matricNumber: '',
    programmeType: '',
    faculty: '',
    department: '',
    session: '',
    schoolEmail: '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    setIsLoading(true);
    setTimeout(() => {
      setSubmittedValues(values);
      setIsLoading(false);
      setShowForm(false);
      setSubmitting(false);
    }, 2000); // Simulate a 2 second delay for loading
  };

  const handleBack = () => {
    setShowForm(true);
  };
  const next= `Next ${<img src={Forward}/>}`

  return (
    <div className={`form-container ${isVisible ? 'visible' : 'hidden'}`} id='formCase'>
      <div className="fillForm">
        <div className="close" onClick={onClose}>
          <img src="/images/closeButton.png" alt="Close" />
        </div>
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : showForm ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className='form'>
                <div className="details">
                  Programme Details
                </div>
                <div className="form-group">
                  <label htmlFor="matricNumber">Matric Number</label>
                  <Field name="matricNumber" type="number" placeholder="Matric Number"/>
                  <ErrorMessage name="matricNumber" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="programmeType">Programme Type</label>
                  <Field as="select" name="programmeType">
                    <option value="">Select Programme Type</option>
                    {programmeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="programmeType" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="faculty">Faculty</label>
                  <Field as="select" name="faculty">
                    <option value="">Select Faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="faculty" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <Field as="select" name="department">
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="department" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="session">Session of Entry</label>
                  <Field as="select" name="session">
                    <option value="">Select Session</option>
                    {sessions.map((session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="session" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="schoolEmail">School Email</label>
                  <Field name="schoolEmail" type="email" placeholder="myemail@stu.ui.edu.ng"/>
                  <ErrorMessage name="schoolEmail" component="div" className="error" />
                </div>
                <button type="submit" disabled={isSubmitting} className='register_here'>
                  {isSubmitting ? 'Submitting...' : <><span>Next</span> <img src={Forward} alt="" srcSet="" /></>}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="confirmation agreed">
            <div className="confirm-warning">
              <div className="confirmThis">
                Confirm your Programme Details
              </div>
              <div className="warning">
                Please check to confirm that your <b>matric number</b> is correct,
                if any information is <span>incorrect</span> contact ITCC!
              </div>
              <div className="userDetails">
                <div className="matricNumber">
                  Matric Number: <b>{submittedValues.matricNumber}</b>
                </div>
                <div className="dept">
                  Department: <div>{submittedValues.department}</div>
                </div>
                <div className="prog">
                  Programme Type: <div className="prog">{submittedValues.programmeType}</div>
                </div>
                <div className="session">
                  Session of Entry: <div>{submittedValues.session}</div>
                </div>
                <div className="faculty">
                  Faculty: <div>{submittedValues.faculty}</div>
                </div>
                <div className="schoolEmail">
                  School Email: <div>{submittedValues.schoolEmail}</div>
                </div>
              </div>
              <div className="buttons">
                <button className="back-button" onClick={handleBack}>
                  Cancel
                </button>
              
  <Link to ='/registration_portal'>
  <button className="register_here" onClick={onClose}>
     Confirm
   </button>
  </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;
