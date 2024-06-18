import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UserDataForm = () => {
    const initialValues = {
        name: '',
        email: '',
        phone: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phone: Yup.string().required('Phone is required')
    });

    const [submittedValues, setSubmittedValues] = useState(null);

    const onSubmit = (values) => {
        console.log(values);
        setSubmittedValues(values);
    };

    return (
        <div>
            {submittedValues ? (
                <div>
                    <h2>Submitted Details:</h2>
                    <p>Name: {submittedValues.name}</p>
                    <p>Email: {submittedValues.email}</p>
                    <p>Pone: {submittedValues.phone}</p>
                    <button>Confirm</button>
                </div>
            ) : (
                <div>
                    <h1>User Data Form</h1>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        <Form>
                            <div>
                                <label htmlFor="name">Name:</label>
                                <Field type="text" id="name" name="name" />
                                <ErrorMessage name="name" component="div" />
                            </div>

                            <div>
                                <label htmlFor="email">Email:</label>
                                <Field type="email" id="email" name="email" />
                                <ErrorMessage name="email" component="div" />
                            </div>

                            <div>
                                <label htmlFor="phone">Phone:</label>
                                <Field type="tel" id="phone" name="phone" />
                                <ErrorMessage name="phone" component="div" />
                            </div>

                            <button type="submit">Submit</button>
                        </Form>
                    </Formik>
                </div>
            )}
        </div>
    );
};

export default UserDataForm;