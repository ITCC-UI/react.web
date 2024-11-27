import React, { useState, useEffect } from "react";
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./placement.scss";
import CloseIcon from "/images/closeButton.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GridLoader, PulseLoader } from "react-spinners";
import axiosInstance from "../../../API Instances/AxiosIntances";
import { Helmet } from "react-helmet";
import PlacementComponent from "./PlacementComponent"
import ActivePlacement from "./ActivePlacement";
import PlacementAcceptance from "./PlacementAcceptance";
import PlacementChange from "./PlacementChange";
import FullScreenSuccessMessage from "./Successful/Successful";
import FullScreenFailureMessage from "./Failed/FullScreenFailureMessage";
import MultiStepForm from "../../../components/View More/NewForm";



const Placement = () => {
  const [acceptanceSuccessMessage, setAcceptanceSuccessMessage] = useState("");
  const [acceptanceFailureMessage, setAcceptanceFailureMessage] = useState("")
  const [showAcceptanceSuccessful, setShowAcceptanceSuccessful] = useState(false);
  const [showAcceptanceFailure, setShowAcceptanceFailure] = useState(false);

  const [placementSuccessMessage, setPlacementSuccessMessage] = useState("");
  const [showPlacementSuccessful, setShowPlacementSuccessful] = useState(false);
  const [triggerRefresh, setTriggerRefresh] =useState(false)
  const [refreshAcceptanceTable, setTriggerRefreshAcceptance] =useState(false)
  
  const [showPlacementFailure, setShowPlacementFailure] = useState(false);
  const [placementFailureMessage, setPlacementFailureMessage] =useState("")

  const [changeOfPlacementSuccessMessage, setPlacementChangeSuccessMessage] = useState("");
  const [showChangeOfPlacementSuccessful, setShowChangeOfPlacementSuccessful] = useState(false);
  const [showChangeOfPlacementFailure, setShowChangeOfPlacementFailure] = useState(false);
const [ refreshData, setRefreshData]= useState(false)

  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showNewAcceptanceRequest, setShowNewAcceptanceRequest] = useState(false);
  const [changeOfPlacementRequest, setNewChangeRequest] = useState(false)
  const [id, setProgrammeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addressOptions, setAdressOptions]= useState([])
  const [statesOfNigeria, setNewState] =useState([])
  const [closeModal, setClose]=useState(false)


  const [isFormOpen, setIsFormOpen] = useState(true);


  const toggleNewRequest = () => {
    setShowNewRequest((prev)=>!prev);
  };

  const triggerRefreshPlacementChange = () => {
    setRefreshData(prev => !prev);  // Toggle the state to trigger a re-fetch
  };

  const toggleNewPlacementReq = () => {
    setNewChangeRequest((prev) => !prev);
  };



  const toggleAcceptanceRequest = () => {
    setShowNewAcceptanceRequest(!showNewAcceptanceRequest);

  }
  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        setProgrammeId(id);
  
      } else {
        
        setIsLoading(false);
      }
    } catch (error) {
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammeId();  
  }, []);

  

  const handleAcceptanceRequest = async (values, { setSubmitting }) => {
    try {
  
      const response = await axiosInstance.post(`/trainings/registrations/${id}/acceptance-letters`, values, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAcceptanceSubmissionStatus("success");
      setAcceptanceSuccessMessage("Your Acceptance Letter has been submitted successfully!");
      setShowAcceptanceSuccessful(true);
      setTriggerRefreshAcceptance(prev=> !prev)
      setTimeout(() => {
        setAcceptanceSubmissionStatus("");
        setShowAcceptanceSuccessful(false);
        window.location.reload();
      }, 1000);
    } catch (error) {
      
      if(error.response.status===400){
        setAcceptanceFailureMessage(error.response.data.detail)
      }
      else{
        setAcceptanceFailureMessage("Unable to submit acceptance letter, please try again")
      }
      setShowAcceptanceFailure(true)
      setTimeout(() => {
        setShowAcceptanceFailure(true);
      }, 2000);
    } finally {
      setSubmitting(false);
      toggleAcceptanceRequest();
    }
  };


  const type="ADDRESSEE"
const fetchAddressee =()=>{
  axiosInstance.get(`/option-types/${type}/options`)
  .then(titles =>{
    const addressee=titles.data.map(title=>title.name)
    
    setAdressOptions(addressee)
    
  })

  .catch(error=>{
    
    
  })
}

const fetchStates = async ()=>{
  try{
    const states= await axiosInstance.get("/states")
    
    
    setNewState(states.data)

  }

  catch{
    
  }
}


useEffect(()=>{
  fetchAddressee()
}, [])

useEffect(()=>{
  fetchStates()
}, [])





  const handlePlacementRequestsSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.post(`/trainings/registrations/${id}/placement-requests/`, values);
      setPlacementSuccessMessage("Your Placement Request has been submitted successfully!");
      setShowPlacementSuccessful(true);
      setTriggerRefresh(prev=> !prev)
      
    } catch (error) {
      setTriggerRefresh(prev=> !prev)
      setShowPlacementFailure(true)
      setPlacementFailureMessage(error.response.data.detail)
      
      
      setTimeout(() => {
        setShowAcceptanceFailure(false)
      }, 5000);
    } finally {
      setSubmitting(false);
      toggleNewRequest();
    }
  };
  

  
  const [activeDisplay, setActiveDisplay] = useState("placement");
  const handleButtonClick = (component) => {
    setActiveDisplay(component)
  };



  const validationSchema = Yup.object().shape({
    request_message: Yup.string().required("A message is required")
    
  });

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formatAddress = (addressObj) => {
    const { building_number, street, area, city, state_or_province } = addressObj;
    return `${building_number || ''} ${street}, ${area ? area + ', ' : ''}${city}, ${state_or_province}`.trim();
  };


  const acceptanceLetterSchema = Yup.object().shape({
    letter_type: Yup.string()
      .oneOf(['UNDERTAKING', 'ACCEPTANCE'], 'Invalid letter type')
      .required('Letter type is required'),
    company_name: Yup.string()
      .required('Company name is required'),
      company_address_building_number: Yup.string().required("Building number is required"),
      company_address_building_name: Yup.string(),
      company_address_street: Yup.string().required("Street is required"),
      company_address_area: Yup.string(),
      company_address_city: Yup.string().required("City is required"),
      company_address_state_or_province: Yup.string().required("Company's State is required"),
      


    company_contact_name: Yup.string(),
      addressee:Yup.string().required("Signatory Position is required"),
    company_contact_email: Yup.string()
      .email('Invalid email'),
      
      company_contact_phone: Yup.string()
      .matches(phoneRegExp, "Company's phone number is not valid").min(11, "Phone number must be more than 10"),

      letter: Yup.mixed()
      .required('A file is required')
      .test('fileFormat', 'Unsupported file format', (value) => {
        if (!value) return false;
        return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
      })
      .test('fileSize', 'File size is too large', (value) => {
        if (!value) return false;
        return value.size <= 1 * 1024 * 1024; 
      })
  });

  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Placement Letter</title>
      </Helmet>

      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement active-accordion filterPlacement"} 
        init={0}
        activeI={0} 
        formClass={"forms"}
      />
      {/* 
   

      {/* <ComponentB/> */}
      {showNewRequest && (
        <div className="newRequestComponent">
          <div className="newRequestHeader ">
            <div className="introductionLetter">Request for Placement</div>
            <button className="closeButton" onClick={toggleNewRequest} >
              <img src={CloseIcon} alt="Close" />
            </button>
            <div className="requestContent">
              <Formik
                initialValues={{

                  request_message: "",
                  

                }}
                validationSchema={validationSchema}
                onSubmit={handlePlacementRequestsSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="placement_form">

                    <div className="companyDetails">



                      <div className="formInput">
                        <label htmlFor="request_message"></label>
                        <Field as="textarea" name="request_message" className="placement_letter" placeholder="Type your message to support your request with State and City (location) of choice" />
                        <ErrorMessage className="error" name="request_message" component="div" />
                      </div>

                    </div>
                    <button type="submit" className="submitting submit_placement_request">
                      {isSubmitting ? <PulseLoader size={10} color="white" /> : "Submit"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}



      {changeOfPlacementRequest && (

isFormOpen && <MultiStepForm toggleNewRequest={toggleNewPlacementReq} onFormSubmit={triggerRefreshPlacementChange}/>
      )}


{showNewAcceptanceRequest && (
        <div className="newRequestComponent">
          <div className="newRequestHeader">
            <div className="introductionLetter">Submission of Acceptance Letter</div>
            <button className="closeButton" onClick={toggleAcceptanceRequest}>
              <img src={CloseIcon} alt="Close" />
            </button>
            <div className="requestContent">
              <Formik
                initialValues={{
                  letter_type: '',
                  letter: null,
                  company_name: '',
                  company_address_building_number: "",
                  company_address_building_name: "",
                  company_address_street: "",
                  company_address_area: "",
                  company_address_city: "",
                  company_address_state_or_province: "",
                  company_address_country: "",
                  company_address_postal_code: "",
                  company_contact_name: '',
                  company_contact_email: '',
                  company_contact_phone: '',
                  addressee: ''
                }}
                validationSchema={acceptanceLetterSchema} 
                onSubmit={handleAcceptanceRequest}  
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form encType="multipart/form-data">
                    <div className="companyAddressedTo warp_contents">
                      <div className="formInput">
                        <label htmlFor="company_name">Company's Name <p>*</p></label>
                        <Field type="text" name="company_name" placeholder="Enter the name of the company " />
                        <ErrorMessage className="error" name="company_name" component="div" />
                      </div>

                      <div className="formInput">
  <label htmlFor="addressee">
    Signatory Position <p>*</p>
  </label>

  <Field as="select" name="addressee" className="form-select">
    <option value="">Select Title/Position</option>
    {addressOptions.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </Field>

  <ErrorMessage className="error" name="addressee" component="div" />
</div>

                      <div className="formInput">
                        <label htmlFor="company_contact_name">Company Contact Name </label>
                        <Field type="text" name="company_contact_name" placeholder="e.g John Doe" />
                        <ErrorMessage className="error" name="company_contact_name" component="div" />
                      </div>
                    

                      <div className="formInput">
                        <label htmlFor="company_contact_email">Company Email</label>
                        <Field type="text" name="company_contact_email" placeholder="Enter the company’s email" />
                        <ErrorMessage className="error" name="company_contact_email" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="company_contact_phone">Company Phone Number</label>
                        <Field type="tel" name="company_contact_phone" placeholder="e.g 08012345689" />
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

                      <div className="formInput letter">
            <label htmlFor="letter">Letter <p>*</p></label>
            <input
              id="letter"
              name="letter"
              type="file"
              accept=".pdf, image/*"
              onChange={(event) => {
                setFieldValue("letter", event.currentTarget.files[0]);
                
              }}
            />
            <ErrorMessage className="error side" name="letter" component="div" />
          </div>
                    </div>
 <div className="companyDetails acceptance">
                      <div className="company">Company Address</div>
                      <div className="formInput buildNo">
                        <label htmlFor="company_address_building_number"></label>
                        <Field type="text" name="company_address_building_number" placeholder="Building No : No 24" className="buildNo" />
                        <ErrorMessage className="error" name="company_address_building_number" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="company_address_building_name"></label>
                        <Field type="text" name="company_address_building_name" placeholder="Building Name. e.g CBC Towers" />
                        <ErrorMessage className="error" name="company_address_building_name" component="div" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="company_address_street"></label>
                        <Field type="text" name="company_address_street" placeholder="Street, e.g UI Road" />
                        <ErrorMessage className="error" name="company_address_street" component="div" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="company_address.area"></label>
                        <Field type="text" name="company_address_area" placeholder="Area, e.g. Ojoo" />
                        <ErrorMessage className="error" name="company_address_area" component="div" />
                      </div>
                      <div className="stateofCompany">
                        <div className="formInput">
                          <label htmlFor="company_address_city"></label>
                          <Field type="text" name="company_address_city" placeholder="City, e.g Ibadan *" />
                          <ErrorMessage className="error" name="company_address_city" component="div" />
                        </div>
                        <div className="formInput">
  <label htmlFor="company_address_state_or_province"></label>

  <Field as="select" name="company_address_state_or_province" className="selector">
  <option value="" label="Select a state or province" /> {/* Optional default option */}
    {statesOfNigeria.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ))}
  </Field>
  
  <ErrorMessage className="error" name="company_address_state_or_province" component="div" />
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
        </div>
      )}

      <FullScreenSuccessMessage
        isOpen={showAcceptanceSuccessful}
        message={acceptanceSuccessMessage}
        onClose={() => setShowAcceptanceSuccessful(false)}
      />

<FullScreenFailureMessage
        isOpen={showAcceptanceFailure}
        message={acceptanceFailureMessage}
        onClose={() => setShowAcceptanceFailure(false)}
      />


      <FullScreenSuccessMessage
        isOpen={showPlacementSuccessful}
        message={placementSuccessMessage}
        onClose={() => setShowPlacementSuccessful(false)}
      />

<FullScreenFailureMessage
        isOpen={showPlacementFailure}
        message={placementFailureMessage}
        onClose={() => setShowPlacementFailure(false)}
      />



      <FullScreenSuccessMessage
  isOpen={showChangeOfPlacementSuccessful}
  message={changeOfPlacementSuccessMessage}
  onClose={() => setShowChangeOfPlacementSuccessful(false)}
/>

<FullScreenFailureMessage
        isOpen={showChangeOfPlacementFailure}
        message="Failed to submit change of placement request. Please try again."
        onClose={() => setShowChangeOfPlacementFailure(false)}
      />

      <main className="introLetter">
        <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} active={"activeBar"}/>

        <div className="placement-head">
          Placement
        </div>
        <div className="navButtons">
          <div className={activeDisplay === "placement" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placement")}>Placement</div>
          <div className={activeDisplay === "placementRequest" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placementRequest")}> Placement Requests</div>
          <div className={activeDisplay === "placementAcceptance" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placementAcceptance")}> Acceptance Letter</div>
          <div className={activeDisplay === "placementChange" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placementChange")}>Change Placement Request</div>
        </div>

        {activeDisplay === "placementRequest" && <PlacementComponent showNewRequest={showNewRequest} toggleNewRequest={toggleNewRequest} />}
        {activeDisplay === "placement" && <ActivePlacement toggleNewRequest={toggleNewPlacementReq} triggerRefresh={triggerRefresh}/>}
        {activeDisplay === "placementAcceptance" && <PlacementAcceptance showNewAcceptanceRequest={showNewAcceptanceRequest} toggleNewAcceptanceRequest={toggleAcceptanceRequest} refreshAcceptanceTable={refreshAcceptanceTable}/>}
        {activeDisplay === "placementChange" && <PlacementChange showPlacementReq={showNewRequest} togglePlacementChangeRequest={toggleNewPlacementReq} refreshData={refreshData}/>}


      </main>
    </div>
  );
};


export default Placement;