import React, { useState, useEffect } from "react";
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./formsmanual.scss"
import CloseIcon from "/images/closeButton.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GridLoader, PulseLoader } from "react-spinners";
import axiosInstance from "../../../API Instances/AxiosIntances";
import { Helmet } from "react-helmet";
import ManForms from "./Forms";
import { RemoveCircleSharp } from "@mui/icons-material";


const IntroductionLetter = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [programmeId, setProgrammeId] = useState(null);
  const [letterRequests, setLetterRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(""); 
  const [successMessage, setIntroductionSuccessMessage]= useState("")
  const [showSuccessStatus, setShowIntroSuccess] =useState(false)

  const [failureMessage, setFailureMessage]=useState("")
const [showFailureMessage, setShowIntroFailure]=useState(false)
  const [noProgrammeId, setNoProgrammeId] = useState(false); 
  const [loading, titleIsLoading] =useState(false)
  const [addressOptions, setAdressOptions]= useState([])
  const [statesOfNigeria, setNewState] =useState([])

  const toggleNewRequest = () => {
    setShowNewRequest(!showNewRequest);
  };

  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        setProgrammeId(id);
        fetchIntroductionLetterRequests(id);
      } else {
        setNoProgrammeId(true); 
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchIntroductionLetterRequests = async (id) => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/introduction-letter-requests/`);
      setLetterRequests(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammeId();
  }, []);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const handleSubmit = async (values, { setSubmitting }) => {
    if (!programmeId) {
      
      return;
    }

    try {
      const response = await axiosInstance.post(`/trainings/registrations/${programmeId}/introduction-letter-requests/`, values);
      setSubmissionStatus("success");
      setIntroductionSuccessMessage("Introduction Letter submitted successfully")
setShowIntroSuccess(true)
setTriggerRefresh(prev => !prev)
    
    } catch (error) {
      setSubmissionStatus("failure");
      setTriggerRefresh(prev => !prev)
      setFailureMessage(error.response.data.detail)
      setShowIntroFailure(true)
     
    } finally {
      setSubmitting(false);
      toggleNewRequest();
    }
  };

  const validationSchema = Yup.object().shape({
    company_address: Yup.object().shape({
      building_number: Yup.string(),
building_name: Yup.string(),
      street: Yup.string().required("Street is required"),
      area: Yup.string(),
      city: Yup.string().required("City is required"),
      state_or_province_id: Yup.string()
      .required("State or province is required"),
    }),
    company_name: Yup.string().required("Company name is required"),
    address_to: Yup.string().required("Addressee is required"),
  });

const type="ADDRESSEE"
const fetchAddressee =()=>{
  axiosInstance.get(`/option-types/${type}/options`)
  .then(titles =>{
    const addressee=titles.data.map(title=>title.name)
    
    setAdressOptions(addressee)
    
  })

  .catch(error=>{
    
    titleIsLoading(false)
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
  


  

  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Forms and Manuals</title>
      </Helmet>

      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement"} 
        init={0}
        activeI={0}
        formClass={"forms active-accordion filterPlacement"}
      />
      {showNewRequest && (
        <div className="newRequestComponent">
          <div className="newRequestHeader">
            <div className="introductionLetter">Request for Introduction Letter</div>
            <button className="closeButton" onClick={toggleNewRequest}>
              <img src={CloseIcon} alt="Close" />
            </button>
            <div className="requestContent">
              <Formik
                initialValues={{
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
                  request_message: "",
                  company_name: "",
                  address_to: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="companyAddressedTo warp_contents">
                      <div className="formInput">
                        <label htmlFor="company_name">Company Name</label>
                        <Field type="text" name="company_name" placeholder="Enter the name of the company, e.g Firstbank Plc" />
                        <ErrorMessage className="error" name="company_name" component="div" />
                      </div>
                      <div className="formInput">
  <label htmlFor="address_to">
    Addresse To 
  </label>

  <Field as="select" name="address_to" className="form-select">
    <option value="">Select Title/Position</option>
    {addressOptions.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </Field>

  <ErrorMessage className="error" name="address_to" component="div" />
</div>

                    </div>
                    <div className="companyDetails">
                      <div className="company">Company Address</div>
                      <div className="formInput buildNo">
                        <label htmlFor="company_address.building_number"></label>
                        <Field type="text" name="company_address.building_number" placeholder="Building No : No 24" className="buildNo" />
                        <ErrorMessage className="error" name="company_address.building_number" component="div" />
                      </div>


<div className="formInput">
                        <label htmlFor="company_address.building_name"></label>
                        <Field type="text" name="company_address.building_name" placeholder="Building name. e.g CBC Towers" />
                        <ErrorMessage className="error" name="company_address.building_name" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="company_address.street"></label>
                        <Field type="text" name="company_address.street" placeholder="Street, e.g UI Road" />
                        <ErrorMessage className="error" name="company_address.street" component="div" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="company_address.area"></label>
                        <Field type="text" name="company_address.area" placeholder="Area, e.g. Ojoo" />
                        <ErrorMessage className="error" name="company_address.area" component="div" />
                      </div>
                      <div className="stateofCompany">
                        <div className="formInput">
                          <label htmlFor="company_address.city"></label>
                          <Field type="text" name="company_address.city" placeholder="City, e.g Ibadan *" />
                          <ErrorMessage className="error" name="company_address.city" component="div" />
                        </div>
                        <div className="formInput">
  <label htmlFor="company_address.state_or_province_id"></label>

  <Field as="select" name="company_address.state_or_province_id" className="selector">
  <option value="" label="Select a state or province" /> 
    {statesOfNigeria.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ))}
  </Field>
  
  <ErrorMessage className="error" name="company_address.state_or_province_id" component="div" />
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



    

        
      <main className="introLetter">
        <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} />
        <div className="container">
          <div className="topHead">
            <div className="heading">FORMS AND MANUALS</div>
            
              {programmeId  &&   (
        <button className="newReq" onClick={toggleNewRequest}>
          + New Request
        </button>
      )}
      
          </div>
        </div>
   <div className="form-holder">
   <ManForms
     title={"SIWES Manual"}
     contents={"The SIWES Manual provides key guidelines and expectation for students and supervisors during industrial training."}
     reveal={"Hi"}
     download={"downloadthis"}
     />
        
      <ManForms title={"Job Reporting Form"}
      contents={"It serves as an evidence that the student has begun their training and must be submitted within the first two weeks of their training"}
      reveal={"Hi"}
      download={"Download"}
      />
        
        <ManForms 
        title={"Employer’s Evaluation Form"}
        contents={"The Employer's Evaluation Form assesses the student's performance and must be completed post-training"}
       download={"Downlooad"} 
        />
   </div>
   <div className="enlong">
   <ManForms
        title={"ITF Form"}
        contents={"This ITF Form is to be returned to the ITF on completion by the respective institution under seal."}
        />

        <ManForms
        title={"SCAF Form"}
        contents={"The SCAF Form is to be completed and submitted to the nearest ITF office to your location of Internship."}
        />
   </div>
      </main>
    </div>
  );
};

export default IntroductionLetter;