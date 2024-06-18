import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './formfiller.scss';

// Dummy data for the dropdowns
const programmeTypes = ['Undergraduate', 'Postgraduate'];
const faculties = ['Faculty of Science', 'Faculty of Arts', 'Faculty of Engineering'];
const departments = ['Department of Computer Science', 'Department of Mathematics', 'Department of Physics'];
const sessions = ['2019/2020', '2020/2021', '2021/2022'];

const UserForm = ({ isVisible, onClose, onSubmit }) => {
  const validationSchema = Yup.object({
    matricNumber: Yup.string().matches(/^E?\d+$/, 'Invalid matric number').required('Matric Number is required'),
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

  return (
    <div className={`form-container ${isVisible ? 'visible' : 'hidden'}`} id='formCase'>
      <div className="fillForm">
        <div className="close" onClick={onClose}>
          <img src="/images/closeButton.png" alt="Close" />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className='form'>
            <div className="details">
              Programme Details
            </div>
            <div className="form-group">
              <label htmlFor="matricNumber">Matric Number</label>
              <Field name="matricNumber" type="text" />
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
              <Field name="schoolEmail" type="email" />
              <ErrorMessage name="schoolEmail" component="div" className="error" />
            </div>
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default UserForm;
