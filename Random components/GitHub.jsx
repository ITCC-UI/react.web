import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './MultiStepForm.css'; // Add your CSS file for styling

// Validation schema
const validationSchema = Yup.object().shape({
  level: Yup.string().required('Level is required'),
  maritalStatus: Yup.string().required('Marital Status is required'),
  disability: Yup.string().required('Disability is required'),
  language: Yup.string().required('Language is required'),
});

const levels = ['Level 1', 'Level 2', 'Level 3'];
const maritalStatusOptions = ['Single', 'Married', 'Divorced'];
const disabilityOptions = ['Yes', 'No'];
const languageOptions = ['English', 'French', 'Spanish'];

const GitHub = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const initialValues = {
    level: '',
    maritalStatus: '',
    disability: '',
    language: '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 400);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className='form'>
            <div className="form-group">
              <label htmlFor="level">Level</label>
              <Field as="select" name="level">
                <option value="">Select Level</option>
                {levels.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="level" component="div" className="error" />
            </div>
            <button type="button" onClick={nextStep}>
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <label htmlFor="maritalStatus">Marital Status</label>
              <Field as="select" name="maritalStatus">
                <option value="">Select Marital Status</option>
                {maritalStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="maritalStatus" component="div" className="error" />
            </div>
            <button type="button" onClick={prevStep}>
              Previous
            </button>
            <button type="button" onClick={nextStep}>
              Next
            </button>
          </>
        );
      case 3:
        return (
          <>
            <div className="form-group">
              <label htmlFor="disability">Disability</label>
              <Field as="select" name="disability">
                <option value="">Select Disability</option>
                {disabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="disability" component="div" className="error" />
            </div>
            <button type="button" onClick={prevStep}>
              Previous
            </button>
            <button type="button" onClick={nextStep}>
              Next
            </button>
          </>
        );
      case 4:
        return (
          <>
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <Field as="select" name="language">
                <option value="">Select Language</option>
                {languageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="language" component="div" className="error" />
            </div>
            <button type="button" onClick={prevStep}>
              Previous
            </button>
            <button type="submit">Submit</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="multi-step-form">
          {renderStepContent()}
          {isSubmitting && <p>Loading...</p>}
        </Form>
      )}
    </Formik>
  );
};

export default GitHub;
