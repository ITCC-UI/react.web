import React, { useState } from 'react';
import { Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UpdateProfileSchema = Yup.object().shape({
  matric: Yup.string()
    .required('Matric No is required')
    .length(7, 'Matric No must be 7 characters'),
  fName: Yup.string().required('First Name is required'),
  mName: Yup.string(),
  lName: Yup.string().required('Last Name is required'),
  pNumber: Yup.number().required('Phone Number is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  nationality: Yup.string(),
  hAddress: Yup.string(),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.date().required('Date of Birth is required'),
  disability: Yup.string(),
  language: Yup.string(),
  mStatus: Yup.string().required('Marital Status is required'),
  studentType: Yup.string().required('Student Type is required'),
  // Add validation for passport and signature files (if needed)
  entry: Yup.number().required('Year of Entry is required'),
  level: Yup.string().required('Level is required'),
  faculty: Yup.string().required('Faculty is required'),
  department: Yup.string().required('Department is required'),
  nextofKinName: Yup.string().required('Next of Kin Name is required'),
  nextofKinAddress: Yup.string().required('Next of Kin Address is required'),
  relationship: Yup.string().required('Relationship is required'),
  nokPhone: Yup.number().required('Next of Kin Phone Number is required'),
});

const UpdateProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    // Simulate API call
    console.log('Submitting form data:', values);
    setSubmitting(false);
    resetForm();
  };

  return (
    <div className="formWrapper">
      <div className="formCase">
        <Form initialValues={{}} validationSchema={UpdateProfileSchema} onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="personalInformation section">
            <div className="formContents top">
              <label htmlFor="matric">Matric No</label>
              <Field type="text" name="matric" id="matric" maxLength="7" />
              <ErrorMessage name="matric" component="div" className="error" />
            </div>
            {/* ... Other personal information fields ... */}
          </div>

          {/* Department Information Section */}
          {/* ... Similar structure for department information fields ... */}

          {/* Next of Kin Information Section */}
          {/* ... Similar structure for next of kin information fields ... */}

          <div className="button-container">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
