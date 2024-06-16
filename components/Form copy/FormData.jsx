// MyForm.js
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./form.scss"

const StepOneSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
});

const StepTwoSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
});

const MyForm = ({isVisible}) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = (step) => {
    switch (step) {
      case 1:
        return (
          <Formik
            initialValues={{ firstName: '', lastName: '' }}
            validationSchema={StepOneSchema}
            onSubmit={nextStep}
          >
            {({ isValid }) => (
              <Form>
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <Field name="firstName" />
                  <ErrorMessage name="firstName" component="div" />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <Field name="lastName" />
                  <ErrorMessage name="lastName" component="div" />
                </div>
                <button type="submit" disabled={!isValid}>
                  Next
                </button>
              </Form>
            )}
          </Formik>
        );
      case 2:
        return (
          <Formik
            initialValues={{ email: '', phone: '' }}
            validationSchema={StepTwoSchema}
            onSubmit={nextStep}
          >
            {({ isValid }) => (
              <Form>
                <div>
                  <label htmlFor="email">Email</label>
                  <Field name="email" type="email" />
                  <ErrorMessage name="email" component="div" />
                </div>
                <div>
                  <label htmlFor="phone">Phone</label>
                  <Field name="phone" />
                  <ErrorMessage name="phone" component="div" />
                </div>
                <button type="button" onClick={prevStep}>
                  Previous
                </button>
                <button type="submit" disabled={!isValid}>
                  Next
                </button>
              </Form>
            )}
          </Formik>
        );
      case 3:
        return (
          <div>
            <h1>Form Submitted!</h1>
            <button type="button" onClick={prevStep}>
              Previous
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={isVisible? 'hidden': 'visible'} id='formCase'>{renderStep(step)}</div>;
};

export default MyForm;
