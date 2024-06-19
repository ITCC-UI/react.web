import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./confirmRegister.scss";

const DisplayedComponent = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const initialValues = {
    level: '',
    maritalStatus: '',
    disability: '',
    language: '',
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    field6: '',
    field7: ''
  };

  const validationSchemas = [
    Yup.object({
      level: Yup.string().required('Required'),
    }),
    Yup.object({
      maritalStatus: Yup.string().required('Required'),
      disability: Yup.string().required('Required'),
      language: Yup.string().required('Required'),
    }),
    Yup.object({
      field1: Yup.string().required('Required'),
      field2: Yup.string().required('Required'),
      field3: Yup.string().required('Required'),
      field4: Yup.number().required('Required').typeError('Must be a number'),
    }),
    Yup.object({
      field5: Yup.string().required('Required'),
      field6: Yup.string().required('Required'),
      field7: Yup.string().required('Required'),
    }),
  ];

  const handleSubmit = (values, actions) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    } else {
      setIsSubmitted(true);
      setSubmittedData(values);
    }
  };

  const handlePrevious = (setTouched) => {
    setTouched({});
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="backgroundOverlay">
      <div className='registrationConfirmation'>
        {!isSubmitted ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[currentStep - 1]}
            onSubmit={handleSubmit}
          >
            {({ isValid, touched, setTouched }) => (
              <Form>
                <h2>Step {currentStep}</h2>
                {currentStep === 1 && (
                  <div>
                    <label htmlFor="level">Level</label>
                    <Field as="select" name="level">
                      <option value="">Select Level</option>
                      <option value="Level 1">Level 1</option>
                      <option value="Level 2">Level 2</option>
                      <option value="Level 3">Level 3</option>
                    </Field>
                    <ErrorMessage name="level" component="div" className="error" />
                  </div>
                )}
                {currentStep === 2 && (
                  <>
                    <div>
                      <label htmlFor="maritalStatus">Marital Status</label>
                      <Field as="select" name="maritalStatus">
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                      </Field>
                      <ErrorMessage name="maritalStatus" component="div" className="error" />
                    </div>
                    <div>
                      <label htmlFor="disability">Disability</label>
                      <Field name="disability" type="text" />
                      <ErrorMessage name="disability" component="div" className="error" />
                    </div>
                    <div>
                      <label htmlFor="language">Language</label>
                      <Field name="language" type="text" />
                      <ErrorMessage name="language" component="div" className="error" />
                    </div>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <div>
                      <label htmlFor="field1">Field 1</label>
                      <Field name="field1" type="text" />
                      <ErrorMessage name="field1" component="div" className="error" />
                    </div>
                    <div>
                      <label htmlFor="field2">Field 2</label>
                      <Field name="field2" type="text" />
                      <ErrorMessage name="field2" component="div" className="error" />
                    </div>
                    <div>
                      <label htmlFor="field3">Field 3</label>
                      <Field name="field3" type="text" />
                      <ErrorMessage name="field3" component="div" className="error" />
                    </div>
                    <div>
                      <label htmlFor="field4">Field 4 (Number)</label>
                      <Field name="field4" type="number" />
                      <ErrorMessage name="field4" component="div" className="error" />
                    </div>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <div>
                      <label htmlFor="field5">Field 5 (Dropdown)</label>
                      <Field as="select" name="field5">
                        <option value="">Select Option</option>
                        <option value="Option 1">Option 1</option>
                        <option value="Option 2">Option 2</option>
                        <option value="Option 3">Option 3</option>
                      </Field>
                      <ErrorMessage name="field5" component="div" className="error" />
                    </div>
                    <div>
                      <label htmlFor="field6">Field 6</label>
                      <Field name="field6" type="text" />
                      <ErrorMessage name="field6" component="div" className="error" />
                    </div>
                    <div>
                      <label htmlFor="field7">Field 7</label>
                      <Field name="field7" type="text" />
                      <ErrorMessage name="field7" component="div" className="error" />
                    </div>
                  </>
                )}
                <div>
                  <button
                    type="button"
                    disabled={currentStep === 1}
                    onClick={() => handlePrevious(setTouched)}
                  >
                    Previous
                  </button>
                  <button type="submit" disabled={!isValid} className='next-button'>
                    {currentStep === 4 ? 'Submit': 'Next'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div>
            <h2>Submitted Data</h2>
            <p>Level: {submittedData.level}</p>
            <p>Marital Status: {submittedData.maritalStatus}</p>
            <p>Disability: {submittedData.disability}</p>
            <p>Language: {submittedData.language}</p>
            <p>Field 1: {submittedData.field1}</p>
            <p>Field 2: {submittedData.field2}</p>
            <p>Field 3: {submittedData.field3}</p>
            <p>Field 4: {submittedData.field4}</p>
            <p>Field 5: {submittedData.field5}</p>
            <p>Field 6: {submittedData.field6}</p>
            <p>Field 7: {submittedData.field7}</p>
          </div>
        )}
        <div className="close" onClick={onClose}>Close</div>
      </div>
    </div>
  );
};

export default DisplayedComponent;
