import React, { useState, useEffect } from "react";
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./placement.scss";
import Empty from "/images/empty_dashboard.png";
import CloseIcon from "/images/closeButton.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GridLoader, PulseLoader } from "react-spinners";
import axiosInstance from "../../../API Instances/AxiosIntances";
import { Helmet } from "react-helmet";
import IntroductionLetterTable from "./IntroductionLetterTable";
import FullScreenSuccessMessage from "../Placement/Successful/Successful";
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage";


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
  const [endDate, setEndDate] =useState("Deadline not set")
 const [timeRemaining, setTimeRemaining] = useState("Deadline not set");
 const [startDate, setStartDate] = useState ("Submission not yet begin")
    

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

  const getTimeRemaining = (endDateString) => {
    if (!endDateString) {
      
      return "No deadline set";
    }
    
    const endDate = new Date(endDateString);
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const timeDifference = endDate - currentDate;
    
    // If the deadline has passed
    if (timeDifference <= 0) {
      return "Deadline has passed";
    }
    
    // Calculate days, hours, minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format as "12 days, 4 hours, and 30 minutes"
    return `${days} days, ${hours} hours, and ${minutes} minutes`;
  };

  // fecth schedule
  const fetchSchedule = async () => {
    try {
      const response = await axiosInstance.get(`trainings/registrations/${programmeId}/introduction-letter-requests/schedule/`);
      const endDate = new Date(response.data.end_date);
      const startDate = new Date(response.data.start_date)
      // Format the end date as before
      const formattedDate = endDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      const formattedStartDate = startDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
  
      
      // Get the formatted time remaining
      const timeRemaining = getTimeRemaining(response.data.end_date);
  
      
      // You can set both to state
      // setPlacementRequests(response.data);
      setStartDate(formattedStartDate)
      setEndDate(formattedDate);
      setTimeRemaining(timeRemaining); 
  
      
    } catch (error) {
        /* empty */
    }
  };
  
  useEffect(() => {
    if (programmeId) {
      fetchSchedule();
    }
  }, [programmeId]);







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
      building_number: Yup.string().max(7, "Building number too long"),
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
        <title>ITCC - Introduction Letter</title>
      </Helmet>

      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement"} 
        init={0}
        activeI={"activen"}
        formClass={"forms"}
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
                        <Field type="text" name="company_address.building_number" placeholder="Building No : No 24"
                         className="buildNo"  
                         onKeyPress={(e) => {
    if (e.target.value.length >= 8) {
      e.preventDefault();
    }
  }} />
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

<FullScreenSuccessMessage
        isOpen={showSuccessStatus}
        message={successMessage}
        onClose={()=>setShowIntroSuccess(false)}
        />

        <FullScreenFailureMessage
        message={failureMessage}
        isOpen={showFailureMessage}
        onClose={()=>setShowIntroFailure(false)}
        />

        
      <main className="introLetter">
        <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} />
        <div className="container">
          <div className="topHead">
            <div className="heading">INTRODUCTION LETTERS</div>
            
              {programmeId  && timeRemaining!="Deadline has passed" &&  (
        <button className="newReq" onClick={toggleNewRequest}>
          + New Request
        </button>
      )}
      
          </div>
        </div>
        <div className="error deadline">Start Date: {startDate} </div>
        <div className="error deadline">Submission Deadline: {endDate} </div>
        <div className="error deadline">Time Remaining: {timeRemaining} </div>
     


        {isLoading ? (
          <div className="loader">
            <GridLoader size={15} color={"#123abc"} />
          </div>
        ) : noProgrammeId ? (
          <div className="noProgrammeId register_above">
            <p>You are not registered for a Programme. <br/> You are not eligible to request an introduction letter at this time. <br/>  <br/>
            Proceed to the registration page to register for you industrial training.</p>
          </div>

          
        ) : letterRequests.length === 0 ? (
          <div className="image">
            <img src={Empty} alt="Empty" />
          </div>
        ) : (

          <IntroductionLetterTable triggerRefresh={triggerRefresh} />
        )}
        
      
        
      </main>
    </div>
  );
};

export default IntroductionLetter;