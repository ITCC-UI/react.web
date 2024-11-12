import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axiosInstance from "../../API Instances/AxiosIntances";
import { PulseLoader } from "react-spinners";
import CloseIcon from "/images/closeButton.png";
import FullScreenSuccessMessage from "../../src/pages/Placement/Successful/Successful";
import FullScreenFailureMessage from "../../src/pages/Placement/Failed/FullScreenFailureMessage";

const MultiStepForm = ({ toggleNewRequest, onFormSubmit }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [statesOfNigeria, setNewState] = useState([]);
    const [formData, setFormData] = useState({});
    const [id, setProgrammeId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [placementID, setPlacementId] = useState(null);

    const [showChangeSuccess, setShowChangeSuccess] = useState(false);
    const [showChangeFailure, setShowChangeFailure] = useState(false);
    const [changeOfPlacementFailureMessage, setChangeOfPlacementFailureMessage] = useState("");

    const [addressOptions, setAddressOptions] = useState([]); 
    const [refreshPlacementTable, setRefreshPlacementTable]= useState(false)
    
    const fetchProgrammeId = async () => {
        try {
            const response = await axiosInstance.get(`/trainings/registrations/`);
            if (response.data.length > 0) {
                const fetchedId = response.data[0].id;
                setProgrammeId(fetchedId);
            }
        } catch (error) {
            
        }
    };

    useEffect(() => {
        fetchProgrammeId();
    }, []);

    
    const fetchPlacementLetterID = async () => {
        try {
            const registrationResponse = await axiosInstance.get("trainings/registrations/");
            const registrations = registrationResponse.data;
            const id = registrations[0]?.id; 
            if (id) {
                const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/placements`);
                const requests = requestsResponse.data;
                const placementId = requests[0]?.id;
                setPlacementId(placementId);
                

            } else {

            }
        } catch (error) {

        }
    };

    useEffect(() => {
        if (id) fetchPlacementLetterID();
    }, [id]);

    
    const type="ADDRESSEE"
    const fetchAddressee = () => { 
        axiosInstance.get(`/option-types/${type}/options`)
            .then(titles => {
                const addressee = titles.data.map(title => title.name);

                setAddressOptions(addressee); 
            })
            .catch(error => {

            });
    };

    
    useEffect(() => {
        
        fetchAddressee();
    }, []); 

    
    const fetchStates = async ()=>{
        try{
          const states= await axiosInstance.get("/states")
          
          
          setNewState(states.data)
      
        }
      
        catch{
          
        }
      }
      

    useEffect(() => {
        fetchStates();
    }, []);

    
    const submitPlacementChange = async (dataToSend) => {
        try {
            const formDataToSend = new FormData();
    setIsSubmitting(true)
            
            Object.keys(dataToSend).forEach((key) => {
                if (key === 'acceptance_letter') {
                    const letterData = dataToSend[key];
                    formDataToSend.append('acceptance_letter.letter_type', letterData.letter_type);
                    formDataToSend.append('acceptance_letter.company_name', letterData.company_name);
                    formDataToSend.append('acceptance_letter.addressee', letterData.addressee);
                    formDataToSend.append('acceptance_letter.company_contact_name', letterData.company_contact_name);
                    formDataToSend.append('acceptance_letter.company_contact_email', letterData.company_contact_email);
                    formDataToSend.append('acceptance_letter.company_contact_phone', letterData.company_contact_phone);
    
                    
                    Object.keys(letterData.company_address).forEach((addressKey) => {
                        formDataToSend.append(
                            `acceptance_letter.company_address.${addressKey}`,
                            letterData.company_address[addressKey]
                        );
                    });
                } else if (key === 'acceptance_letter_file') {
                    formDataToSend.append('acceptance_letter_file', dataToSend[key]);
                } else {
                    formDataToSend.append(key, dataToSend[key]);
                }
            });
    
            const response = await axiosInstance.post(
                `/trainings/registrations/placements/${placementID}/change-request/`,
                formDataToSend,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
    
            setShowChangeSuccess(true);
        
            onFormSubmit()
        } catch (error) {
            setShowChangeFailure(true);
            setChangeOfPlacementFailureMessage(error.response?.data?.detail || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };
    

    
    const handleNextStep = (values, final = false) => {
        const updatedData = { ...formData, ...values };
        setFormData(updatedData);

        if (currentStep === 1) { 
            if (values.request_placement) {
                
                setIsSubmitting(true);
                submitPlacementChange(updatedData);
                return;
            } else {
                
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
            toggleNewPlacementReq={toggleNewRequest} 
        />,
        <StepThree
            key="step3"
            next={handleNextStep}
            prev={handlePrevStep}
            statesOfNigeria={statesOfNigeria}
            toggleNewPlacementReq={toggleNewRequest}
            initialValues={formData}
            addressOptions={addressOptions} 
        />
    ];

    return (
        <div className="newRequestComponent reqChange">
            {currentStep < steps.length ? steps[currentStep] : null}

            <FullScreenFailureMessage
                isOpen={showChangeFailure}
                message={changeOfPlacementFailureMessage}
                onClose={() => {
                    setShowChangeFailure(false);
                    toggleNewRequest(); 
                }}
            />

            <FullScreenSuccessMessage
                isOpen={showChangeSuccess}
                message="Your placement change request was successful!"
                onClose={() => {
                    setShowChangeSuccess(false);
                    toggleNewRequest(); 
                }}
            />
        </div>
    );
};


const stepOneValidationSchema = Yup.object().shape({
    request_message: Yup.string().required("Reason for change is required")
});

const stepTwoValidationSchema = Yup.object().shape({
    acceptance_letter_file: Yup.mixed().required("Letter is required"),
    acceptance_letter: Yup.object().shape({
        letter_type: Yup.string()
            .oneOf(['ACCEPTANCE'], 'Only "ACCEPTANCE" type is allowed')
            .required('Letter type is required'),
            company_contact_name:Yup.string(),
        company_name: Yup.string().required("Company name is required"),
        addressee: Yup.string().required('Addressee title is required'),
        company_contact_email: Yup.string().email("Invalid email"),
      
        company_address: Yup.object().shape({
            building_number: Yup.string(),
            building_name: Yup.string(),
            street: Yup.string().required("Street is required"),
            area: Yup.string(),
            city: Yup.string().required("City is required"),
            state_or_province_id: Yup.string().required("State is required"),
        })
    })
});



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


const StepTwo = ({ isSubmitting, next, toggleNewPlacementReq }) => {
    const handlePlacementChoice = (choice) => {
        next({ request_placement: choice }); 
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
                        disabled={isSubmitting} 
                    >
                        Submit an Acceptance Letter
                        
                    </button>
                    <button
                        onClick={() => handlePlacementChoice(true)}
                        className="continueClass"
                        disabled={isSubmitting} 
                    >
                        {isSubmitting ? <PulseLoader size={10} color="white" /> : "Request to be Posted"}
                    </button>
                </div>
            </div>
        </div>
    );
};


const StepThree = ({ next, prev, statesOfNigeria, toggleNewPlacementReq, initialValues, addressOptions }) => { 
    const combinedInitialValues = {
        ...initialValues,
        acceptance_letter_file: null,
       acceptance_letter:{
        letter_type: '',
        company_name: '',
        addressee: '', 
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
       }
    };

    const handleSubmit = (values, { setSubmitting }) => {
        const finalValues = {
            ...initialValues,  
            ...values,         
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
                                    <label htmlFor="acceptance_letter.company_name">Company's Name <p>*</p></label>
                                    <Field type="text" name="acceptance_letter.company_name" placeholder="Enter the name of the company " />
                                    <ErrorMessage className="error" name="acceptance_letter.company_name" component="div" />
                                </div>

                                <div className="formInput">
                                    <label htmlFor="acceptance_letter.addressee">
                                        Signatory Position <p>*</p>
                                    </label>

                                    <Field as="select" name="acceptance_letter.addressee" className="form-select">
                                        <option value="">Select Title/Position</option>
                                        {addressOptions.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Field>

                                    <ErrorMessage className="error" name="acceptance_letter.addressee" component="div" />
                                </div>

                                <div className="formInput">
                                    <label htmlFor="acceptance_letter.company_contact_name">Company Contact Name </label>
                                    <Field type="text" name="acceptance_letter.company_contact_name" placeholder="e.g John Doe" />
                                    <ErrorMessage className="error" name="acceptance_letter.company_contact_name" component="div" />
                                </div>


                                <div className="formInput">
                                    <label htmlFor="acceptance_letter.company_contact_email">Company Email</label>
                                    <Field type="text" name="acceptance_letter.company_contact_email" placeholder="Enter the company’s email" />
                                    <ErrorMessage className="error" name="acceptance_letter.company_contact_email" component="div" />
                                </div>

                                <div className="formInput">
                                    <label htmlFor="acceptance_letter.company_contact_phone">Company Phone Number</label>
                                    <Field type="tel" name="acceptance_letter.company_contact_phone" placeholder="e.g 08012345689" />
                                    <ErrorMessage className="error" name="acceptance_letter.company_contact_phone" component="div" />
                                </div>

                                <div className="formInput">
                                    <label htmlFor="acceptance_letter.letter_type">Letter Type <p>*</p></label>
                                    <Field as="select" name="acceptance_letter.letter_type">
                                        <option value="">Select Letter Type</option>
                                        <option value="UNDERTAKING" disabled >UNDERTAKING</option>
                                        <option value="ACCEPTANCE">ACCEPTANCE LETTER</option>
                                    </Field>
                                    <ErrorMessage className="error" name="acceptance_letter.letter_type" component="div" />
                                </div>

                                <div className="formInput letter">
                                    <label htmlFor="acceptance_letter_file">Letter <p>*</p></label>
                                    <input
                                        id="acceptance_letter_file"
                                        name="acceptance_letter_file"
                                        type="file"
                                        accept=".pdf, image/*"
                                        onChange={(event) => {
                                            setFieldValue("acceptance_letter_file", event.currentTarget.files[0]);

                                        }}
                                    />
                                    <ErrorMessage className="error side" name="acceptance_letter_file" component="div" />
                                </div>
                            </div>
                            <div className="companyDetails acceptance">
                                <div className="company">Company Address</div>
                                <div className="formInput buildNo">
                                    <label htmlFor="acceptance_letter.company_address_building_number"></label>
                                    <Field type="text" name="acceptance_letter.company_address_building_number" placeholder="Building No : No 24" className="buildNo" />
                                    <ErrorMessage className="error" name="acceptance_letter.company_address_building_number" component="div" />
                                </div>

                                <div className="formInput">
                                    <label htmlFor="acceptance_letter.company_address_building_name"></label>
                                    <Field type="text" name="acceptance_letter.company_address_building_name" placeholder="Building Name. e.g CBC Towers" />
                                    <ErrorMessage className="error" name="acceptance_letter.company_address_building_name" component="div" />
                                </div>
                                <div className="formInput">
                                    <label htmlFor="acceptance_letter.company_address.street"></label>
                                    <Field type="text" name="acceptance_letter.company_address.street" placeholder="Street, e.g UI Road" />
                                    <ErrorMessage className="error" name="acceptance_letter.company_address.street" component="div" />
                                </div>
                                <div className="formInput">
                                    <label htmlFor="acceptance_letter.company_address.area"></label>
                                    <Field type="text" name="acceptance_letter.company_address.area" placeholder="Area, e.g. Ojoo" />
                                    <ErrorMessage className="error" name="acceptance_letter.company_address.area" component="div" />
                                </div>
                                <div className="stateofCompany">
                                    <div className="formInput">
                                        <label htmlFor="acceptance_letter.company_address.city"></label>
                                        <Field type="text" name="acceptance_letter.company_address.city" placeholder="City, e.g Ibadan *" />
                                        <ErrorMessage className="error" name="acceptance_letter.company_address.city" component="div" />
                                    </div>
                                    <div className="formInput">
                                        <label htmlFor="acceptance_letter.company_address.state_or_province_id"></label>

                                        <Field as="select" name="acceptance_letter.company_address.state_or_province_id" className="selector">
                                            <option value="" label="Select a state or province" /> {/* Optional default option */}
                                            {statesOfNigeria.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </Field>

                                        <ErrorMessage className="error" name="acceptance_letter.company_address.state_or_province_id" component="div" />
                                    </div>
                                </div>
                            </div>




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
