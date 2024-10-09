import { useState,useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axiosInstance from "../../API Instances/AxiosIntances";
import { PulseLoader } from "react-spinners";
import StatesComboBox from "../../src/pages/Placement/ComboBoxStates";
import CloseIcon from "/images/closeButton.png"

const MultiStepForm = (toggleNewPlacementReq) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [statesOfNigeria, setNewState] =useState([])
    // const [changeOfPlacementRequest, setNewChangeRequest] = useState(false)

    const submitPlacementChange = async (formData) => {
        try {
            const response = await axiosInstance.post('/submit', formData);
            console.log("Form submitted successfully:", response.data);
        } catch (error) {
            console.error("Error submitting form:", error.response ? error.response.data : error.message);
        }
    };

    // const toggleNewPlacementReq=()=>{
    //     setNewChangeRequest (!changeOfPlacementRequest)
    //   }

    const handleNextStep = (values, final = false) => {
        if (final) {
            submitPlacementChange(values);
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };


    const fetchStates =()=>{
        axiosInstance.get(`/states`)
        .then(states =>{
          const newStates=states.data.map(state=>state.name)
          console.log(newStates)
          setNewState(newStates)
          // stateIsLoading(false)
        })
      
        .catch(error=>{
          console.log(error)
          
        })
      }

      useEffect(()=>{
        fetchStates()
      }, [])
    const steps = [
        <StepOne key="step1" next={handleNextStep} toggleNewPlacementReq={toggleNewPlacementReq} />,
        <StepTwo key="step2" next={handleNextStep} prev={handlePrevStep} statesOfNigeria={statesOfNigeria}  toggleNewPlacementReq={toggleNewPlacementReq} />
    ];

    return <div className="newRequestComponent">
  {steps[currentStep]}
    </div>
};

const stepOneValidationSchema = Yup.object().shape({
    request_message: Yup.string().required("Reason for change is required")
});

const StepOne = ({ next, toggleNewPlacementReq }) => {
    const initialValues = {
        request_message:""
    };

    const handleSubmit = (values) => {
        next(values);
    };

    return (
        <div className="newRequestHeader">
        <div className="introductionLetter"> Reason for Change</div>
        <button className="closeButton" onClick={toggleNewPlacementReq} >
      <img src={CloseIcon} alt="Close" />
    </button>
        <div className="requestContent">
        <Formik
            validationSchema={stepOneValidationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {() => (
                <Form>
                    <p>Reason for change</p>
                    <Field name="request_message"/>
                    <ErrorMessage name="request_message" component="div" className="error" />

                    <button type="submit">Next</button>
                </Form>
            )}
        </Formik>

        </div></div>
    );
};

const stepTwoValidationSchema = Yup.object().shape({
    company_name: Yup.string().required("Company name is required"),
    company_contact_name: Yup.string().required("Signatory position is required"),
    company_contact_email: Yup.string().email("Invalid email"),
    company_contact_phone: Yup.string(),
    letter: Yup.mixed().required("Letter is required"),
    company_address: Yup.object().shape({
        building_number: Yup.string(),
        street: Yup.string().required("Street is required"),
        area: Yup.string(),
        city: Yup.string().required("City is required"),
        state_or_province: Yup.string().required("State is required"),
    }),
});

const StepTwo = ({ next, prev, statesOfNigeria, toggleNewPlacementReq }) => {
    const initialValues = {
        letter_type: '',
        letter: null,
        initial_placement: '',
        request_message: " ",
        company_name: '',
        company_address: {
            building_number: "",
            building_name: "",
            street: "",
            area: "",
            city: "",
            state_or_province: "",
            country: "",
            postal_code: "",
        },
        company_contact_name: '',
        company_contact_email: '',
        company_contact_phone: '',
    };

    const handleSubmit = (values, { setSubmitting }) => {
        next(values, true);
        setSubmitting(false);
    };

    return (
        <div className="newRequestHeader">
        <div className="introductionLetter"> Change of Placement Request</div>
        <button className="closeButton" onClick={toggleNewPlacementReq} >
      <img src={CloseIcon} alt="Close" />
    </button>
        <div className="requestContent">
            <Formik
                initialValues={initialValues}
                validationSchema={stepTwoValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form encType="multipart/form-data">
                        <div className="companyAddressedTo warp_contents">
                            <div className="formInput">
                                <label htmlFor="company_name">Company's Name<p>*</p> </label>
                                <Field type="text" name="company_name" placeholder="Enter the name of the company " />
                                <ErrorMessage className="error" name="company_name" component="div" />
                            </div>
                            <div className="formInput">
                                <label htmlFor="company_contact_name">Signatory Position <p>*</p></label>
                                <Field type="text" name="company_contact_name" placeholder="e.g Engr O.A Opadare" />
                                <ErrorMessage className="error" name="company_contact_name" component="div" />
                            </div>
                            <div className="formInput">
                                <label htmlFor="company_contact_email">Company Email </label>
                                <Field type="text" name="company_contact_email" placeholder="Enter the company's email" />
                                <ErrorMessage className="error" name="company_contact_email" component="div" />
                            </div>
                            <div className="formInput">
                                <label htmlFor="company_contact_phone">Signatory Phone Number</label>
                                <Field type="tel" name="company_contact_phone" placeholder="e.g 08066641912" />
                                <ErrorMessage className="error" name="company_contact_phone" component="div" />
                            </div>
                            <div className="formInput move-left">
                                <label htmlFor="letter">Letter <p>*</p></label>
                                <input
                                    id="letter"
                                    name="letter"
                                    type="file"
                                    onChange={(event) => {
                                        setFieldValue("letter", event.currentTarget.files[0]);
                                    }}
                                />
                                <ErrorMessage className="error" name="letter" component="div" />
                            </div>
                        </div>
                        <div className="companyDetails">
                            <div className="company">Company's Address<p>*</p></div>
                            <div className="formInput buildNo">
                                <Field type="text" name="company_address.building_number" placeholder="Building No : No 24" className="buildNo" />
                                <ErrorMessage className="error" name="company_address.building_number" component="div" />
                            </div>
                            <div className="formInput">
                                <Field type="text" name="company_address.street" placeholder="Street, e.g UI Road" />
                                <ErrorMessage className="error" name="company_address.street" component="div" />
                            </div>
                            <div className="formInput">
                                <Field type="text" name="company_address.area" placeholder="Area, e.g. Ojoo" />
                                <ErrorMessage className="error" name="company_address.area" component="div" />
                            </div>
                            <div className="stateofCompany">
                                <div className="formInput">
                                    <Field type="text" name="company_address.city" placeholder="City, e.g Ibadan *" />
                                    <ErrorMessage className="error" name="company_address.city" component="div" />
                                </div>
                                <div className="formInput">
                                    <StatesComboBox
                                        name="company_address.state_or_province"
                                        options={statesOfNigeria}
                                        placeholder="Select a state"
                                    />
                                    <ErrorMessage className="error" name="company_address.state_or_province" component="div" />
                                </div>
                            </div>
                        </div>
                        <button type="button" onClick={prev}>Previous</button>
                        <button type="submit" className="submitting">
                            {isSubmitting ? <PulseLoader size={10} color="white" /> : "Submit"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    </div>
    );
};

export default MultiStepForm;