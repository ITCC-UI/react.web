import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axiosInstance from "../../API Instances/AxiosIntances";

const MultiStepForm = () => {
    const [data, setData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const submitPlacementChange = async (formData) => {
        try {
            const response = await axiosInstance.post('/submit', formData); // Adjust the URL
            console.log("Form submitted successfully:", response.data);
        } catch (error) {
            console.error("Error submitting form:", error.response ? error.response.data : error.message);
        }
    };

    const [currentStep, setCurrentStep] = useState(0);

    const handleNextStep = (newData, final = false) => {
        setData(prev => ({ ...prev, ...newData }));

        if (final) {
            submitPlacementChange({ ...data, ...newData }); // Combine all form data
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = (newData) => {
        setData(prev => ({ ...prev, ...newData }));
        setCurrentStep(prev => prev - 1);
    };

    const steps = [
        <StepOne next={handleNextStep} data={data} />,
        <StepTwo next={handleNextStep} prev={handlePrevStep} data={data} />
    ];

    return <div className="band">{steps[currentStep]}</div>;
};

const stepOneValidationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
});

const stepTwoValidationSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
});

const StepOne = (props) => {
    const handleSubmit = (values) => {
        props.next(values);
    };

    return (
        <Formik
            validationSchema={stepOneValidationSchema}
            initialValues={props.data}
            onSubmit={handleSubmit}
        >
            {() => (
                <Form>
                    <p>First Name</p>
                    <Field name='first_name' />
                    <ErrorMessage name="first_name" component="div" className="error" />

                    <p>Last Name</p>
                    <Field name='last_name' />
                    <ErrorMessage name="last_name" component="div" className="error" />

                    <button type="submit">Next</button>
                </Form>
            )}
        </Formik>
    );
};

const StepTwo = (props) => {
    const handleSubmit = (values) => {
        props.next(values, true);
    };

    return (
        <Formik
            initialValues={props.data}
            validationSchema={stepTwoValidationSchema}
            onSubmit={handleSubmit}
        >
            {({ values }) => (
                <Form>
                    <p>Email</p>
                    <Field name='email' type='email' />
                    <ErrorMessage name="email" component="div" className="error" />

                    <p>Password</p>
                    <Field name='password' type='password' />
                    <ErrorMessage name="password" component="div" className="error" />

                    <button type="button" onClick={() => props.prev(values)}>Previous</button>
                    <button type="submit">Submit</button>
                </Form>
            )}
        </Formik>
    );
};

export default MultiStepForm;
