import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axiosInstance from "../../API Instances/AxiosIntances";
import { PulseLoader } from "react-spinners";
import {AcceptanceLetterAdressee } from "../../src/pages/Placement/AcceptanceAddressee"; // Corrected imports
import CloseIcon from "/images/closeButton.png";
import FullScreenSuccessMessage from "../../src/pages/Placement/Successful/Successful";
import FullScreenFailureMessage from "../../src/pages/Placement/Failed/FullScreenFailureMessage";

const MultiStepForm = ({ toggleNewRequest }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [statesOfNigeria, setNewState] = useState([]);
    const [formData, setFormData] = useState({});
    const [id, setProgrammeId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [placementId, setPlacementId] = useState(null);

    const [showChangeSuccess, setShowChangeSuccess] = useState(false);
    const [showChangeFailure, setShowChangeFailure] = useState(false);
    const [changeOfPlacementFailureMessage, setChangeOfPlacementFailureMessage] = useState("");

    const [addressOptions, setAddressOptions] = useState([]); // Corrected setter name

    // Fetch Programme ID
    const fetchProgrammeId = async () => {
        try {
            const response = await axiosInstance.get(`/trainings/registrations/`);
            if (response.data.length > 0) {
                const fetchedId = response.data[0].id;
                setProgrammeId(fetchedId);
            }
        } catch (error) {
            console.error("Error fetching programme ID:", error);
        }
    };

    useEffect(() => {
        fetchProgrammeId();
    }, []);

    // Fetch Placement ID
    const fetchPlacementId = async () => {
        try {
            const response = await axiosInstance.get(`/trainings/registrations/${id}/placements`);
            if (response.data.length > 0) {
                const fetchedPlacementId = response.data[0].id;
                console.log("Fetched Placement ID:", fetchedPlacementId);
                setPlacementId(fetchedPlacementId);
            }
        } catch (error) {
            console.error("Error fetching placement ID:", error);
            setShowChangeFailure(true);
            setChangeOfPlacementFailureMessage("Failed to fetch placement ID.");
        }
    };

    useEffect(() => {
        if (id) {
            fetchPlacementId();
        }
    }, [id]);

    // Fetch Addressee
    const fetchAddressee = (type) => { // Accept 'type' as a parameter
        axiosInstance.get(`/option-types/${type}/options`)
            .then(titles => {
                const addressee = titles.data.map(title => title.name);
                console.log("Addressee", addressee);
                setAddressOptions(addressee); // Corrected setter name
            })
            .catch(error => {
                console.log("Error fetching addressee options:", error);
            });
    };

    // Fetch Addressee on Component Mount or when 'type' changes
    useEffect(() => {
        const type = "addressee_type"; // Define the correct type here
        fetchAddressee(type);
    }, []); // Add 'type' to dependencies if dynamic

    // Fetch States
    const fetchStates = () => {
        axiosInstance.get(`/states`)
            .then(states => {
                const newStates = states.data.map(state => state.name);
                setNewState(newStates);
            })
            .catch(error => {
                console.log("Error fetching states:", error);
            });
    };

    useEffect(() => {
        fetchStates();
    }, []);

    // Submit Placement Change
    const submitPlacementChange = async (dataToSend) => {
        try {
            const formDataToSend = new FormData();

            // Append all form fields to FormData
            Object.keys(dataToSend).forEach(key => {
                if (key === 'company_address') {
                    Object.keys(dataToSend[key]).forEach(addressKey => {
                        formDataToSend.append(`company_address.${addressKey}`, dataToSend[key][addressKey]);
                    });
                } else if (key === 'acceptance_letter_file') {
                    formDataToSend.append('acceptance_letter_file', dataToSend[key]);
                } else if (key === 'request_placement') {
                    formDataToSend.append('request_placement', dataToSend[key]); // Append as boolean directly
                } else {
                    formDataToSend.append(key, dataToSend[key]);
                }
            });

            // **Debugging Log**
            console.log("Form Data to Send:");
            for (let pair of formDataToSend.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            // Ensure placementId is available
            if (!placementId) {
                throw new Error("Placement ID is not available.");
            }

            const response = await axiosInstance.post(`/trainings/registrations/placements/${placementId}/change-request/`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Form submitted successfully:", response.data);

            // Show Success Modal
            setShowChangeSuccess(true);
        } catch (error) {
            console.error("Error submitting form:", error.response ? error.response.data : error.message);
            setShowChangeFailure(true);
            // Safeguard against undefined error messages
            setChangeOfPlacementFailureMessage(error.response?.data?.detail || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Next Step
    const handleNextStep = (values, final = false) => {
        const updatedData = { ...formData, ...values };
        setFormData(updatedData);
        
        if (currentStep === 1) { // Step 2: Placement Choice
            if (values.request_placement) {
                // If user chooses 'Yes', submit the form
                setIsSubmitting(true);
                submitPlacementChange(updatedData);
                return;
            } else {
                // If user chooses 'No', proceed to Step 3
                setCurrentStep(prev => prev + 1);
                return;
            }
        }

        if (final) {
            setIsSubmitting(true);
            submitPlacementChange(updatedData);
            return;
        }

        setCurrentStep(prev => prev + 1);
    };

    // Handle Previous Step
    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const steps = [
        <StepOne 
            key="step1" 
            next={handleNextStep} 
            toggleNewPlacementReq={toggleNewRequest} 
            initialValues={formData} 
        />,
        <StepTwo 
            key="step2" 
            next={handleNextStep} 
            isSubmitting={isSubmitting} 
            toggleNewPlacementReq={toggleNewRequest} // Added if needed
        />,
        <StepThree 
            key="step3" 
            next={handleNextStep} 
            prev={handlePrevStep} 
            statesOfNigeria={statesOfNigeria} 
            toggleNewPlacementReq={toggleNewRequest} 
            initialValues={formData} 
            addressOptions={addressOptions} // Pass addressOptions if needed
        />
    ];

    return (
        <div className="newRequestComponent">
            {currentStep < steps.length ? steps[currentStep] : null}

            {/* Failure Modal */}
            <FullScreenFailureMessage
                isOpen={showChangeFailure}
                message={changeOfPlacementFailureMessage}
                onClose={() => {
                    setShowChangeFailure(false);
                    toggleNewRequest(); // Close the form after closing the modal
                }}
            />

            {/* Success Modal */}
            <FullScreenSuccessMessage
                isOpen={showChangeSuccess}
                message="Your placement change request was successful!"
                onClose={() => {
                    setShowChangeSuccess(false);
                    toggleNewRequest(); // Close the form after closing the modal
                }}
            />
        </div>
    );
};

// Validation Schemas
const stepOneValidationSchema = Yup.object().shape({
    request_message: Yup.string().required("Reason for change is required")
});

const stepTwoValidationSchema = Yup.object().shape({
    letter_type: Yup.string()
        .oneOf(['UNDERTAKING', 'ACCEPTANCE'], 'Invalid letter type')
        .required('Letter type is required'),
    company_name: Yup.string().required("Company name is required"),
    company_contact_name: Yup.string().required("Signatory position is required"),
    company_contact_email: Yup.string().email("Invalid email"),
    company_contact_phone: Yup.string(),
    acceptance_letter_file: Yup.mixed().required("Letter is required"),
    company_address: Yup.object().shape({
        building_number: Yup.string(),
        street: Yup.string().required("Street is required"),
        area: Yup.string(),
        city: Yup.string().required("City is required"),
        state_or_province_id: Yup.string().required("State is required"),
    }),
});

// Step One Component
const StepOne = ({ next, toggleNewPlacementReq, initialValues }) => {
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
                            <div className="formInput">
                                <Field 
                                    name="request_message" 
                                    as="textarea" 
                                    className="placement_letter" 
                                    placeholder="Reason for change of placement" 
                                />
                                <ErrorMessage name="request_message" component="div" className="error" />
                            </div>
                            <button type="submit" className="continueClass">Continue</button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

// Step Two Component
const StepTwo = ({ isSubmitting, next, toggleNewPlacementReq }) => {
    const handlePlacementChoice = (choice) => {
        next({ request_placement: choice }); // Ensure choice is a boolean
    };

    return (
        <div className="newRequestHeader">
            <div className="introductionLetter"> Placement Choice</div>
            <button className="closeButton" onClick={toggleNewPlacementReq}>
                <img src={CloseIcon} alt="Close" />
            </button>
            <div className="requestContent">
                <div className="nestedButton">
                    <button 
                        onClick={() => handlePlacementChoice(false)} 
                        className="acceptanceLetter" 
                        disabled={isSubmitting} // Disable button when submitting
                    >
                        Submit an Acceptance Letter
                    </button>
                    <button 
                        onClick={() => handlePlacementChoice(true)} 
                        className="continueClass" 
                        disabled={isSubmitting} // Disable button when submitting
                    >
                        {isSubmitting ? <PulseLoader size={10} color="white" /> : "Request to be Posted"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Step Three Component
const StepThree = ({ next, prev, statesOfNigeria, toggleNewPlacementReq, initialValues, addressOptions }) => { // Added addressOptions as a prop
    const combinedInitialValues = {
        ...initialValues,
        letter_type: '',
        acceptance_letter_file: null,
        company_name: '',
        addressee: '', // Added if needed
        company_address: {
            building_number: "",
            building_name: "",
            street: "",
            area: "",
            city: "",
            state_or_province_id: "",
            country: "",
            postal_code: "",
        },
        company_contact_name: '',
        company_contact_email: '',
        company_contact_phone: '',
    };

    const handleSubmit = (values, { setSubmitting }) => {
        const finalValues = {
            ...initialValues,  // This includes data from Step 1 and 2
            ...values,         // This includes data from Step 3
        };
        next(finalValues, true);
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
                   initialValues={combinedInitialValues}
                   validationSchema={stepTwoValidationSchema}
                   onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form encType="multipart/form-data">
                            <div className="companyAddressedTo warp_contents">
                                <div className="formInput">
                                    <label htmlFor="company_name">Company's Name <p>*</p> </label>
                                    <Field 
                                        type="text" 
                                        name="company_name" 
                                        placeholder="Enter the name of the company " 
                                    />
                                    <ErrorMessage className="error" name="company_name" component="div" />
                                </div>
                                <div className="formInput">
                                    <label htmlFor="addressee">Addressee <p>*</p></label>
                                    <AcceptanceLetterAdressee
                                        name="addressee"
                                        options={addressOptions}
                                        placeholder="Title/Position to address letter to, e.g The Managing Director"
                                    />
                                    <ErrorMessage className="error" name="addressee" component="div" />
                                </div>
                                <div className="formInput">
                                    <label htmlFor="company_contact_email">Company Email </label>
                                    <Field 
                                        type="text" 
                                        name="company_contact_email" 
                                        placeholder="Enter the company's email" 
                                    />
                                    <ErrorMessage className="error" name="company_contact_email" component="div" />
                                </div>
                                <div className="formInput">
                                    <label htmlFor="company_contact_phone">Signatory Phone Number</label>
                                    <Field 
                                        type="tel" 
                                        name="company_contact_phone" 
                                        placeholder="e.g 08066641912" 
                                    />
                                    <ErrorMessage className="error" name="company_contact_phone" component="div" />
                                </div>

                                <div className="formInput">
                                    <label htmlFor="letter_type">Letter Type <p>*</p></label>
                                    <Field as="select" name="letter_type">
                                        <option value="">Select Letter Type</option>
                                        <option value="UNDERTAKING">UNDERTAKING</option>
                                        <option value="ACCEPTANCE">ACCEPTANCE LETTER</option>
                                    </Field>
                                    <ErrorMessage className="error" name="letter_type" component="div" />
                                </div>
                                <div className="formInput move-left">
                                    <label htmlFor="acceptance_letter_file">Letter <p>*</p></label>
                                    <input
                                        id="acceptance_letter_file"
                                        name="acceptance_letter_file"
                                        type="file"
                                        onChange={(event) => {
                                            setFieldValue("acceptance_letter_file", event.currentTarget.files[0]);
                                        }}
                                    />
                                    <ErrorMessage className="error" name="acceptance_letter_file" component="div" />
                                </div>
                            </div>
                            <div className="companyDetails">
                                <div className="company">Company's Address <p>*</p></div>
                                <div className="formInput buildNo">
                                    <Field 
                                        type="text" 
                                        name="company_address.building_number" 
                                        placeholder="Building No : No 24" 
                                        className="buildNo" 
                                    />
                                    <ErrorMessage className="error" name="company_address.building_number" component="div" />
                                </div>
                                <div className="formInput">
                                    <Field 
                                        type="text" 
                                        name="company_address.street" 
                                        placeholder="Street, e.g UI Road" 
                                    />
                                    <ErrorMessage className="error" name="company_address.street" component="div" />
                                </div>
                                <div className="formInput">
                                    <Field 
                                        type="text" 
                                        name="company_address.area" 
                                        placeholder="Area, e.g. Ojoo" 
                                    />
                                    <ErrorMessage className="error" name="company_address.area" component="div" />
                                </div>
                                <div className="stateofCompany">
                                    <div className="formInput">
                                        <Field 
                                            type="text" 
                                            name="company_address.city" 
                                            placeholder="City, e.g Ibadan *" 
                                        />
                                        <ErrorMessage className="error" name="company_address.city" component="div" />
                                    </div>
                                    <div className="formInput">
                                        <AcceptanceLetterAdressee
                                            name="company_address.state_or_province_id"
                                            options={statesOfNigeria}
                                            placeholder="Select a state"
                                        />
                                        <ErrorMessage className="error" name="company_address.state_or_province_id" component="div" />
                                    </div>
                                </div>
                            </div>
                            {/* <button type="button" onClick={prev}>Previous</button> */}
                            <button 
                                type="submit" 
                                className="submitting continueClass submitButton" 
                                disabled={isSubmitting}
                            >
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
