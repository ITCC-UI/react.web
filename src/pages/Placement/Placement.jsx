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
// import IntroductionLetterTable from "./PlacementReqTable";
// import PlacementDisplay from "./PlacementRequest";
import PlacementComponent from "./PlacementComponent"
import ActivePlacement from "./ActivePlacement";
import PlacementAcceptance from "./PlacementAcceptance";
import PlacementChange from "./PlacementChange";
import FullScreenSuccessMessage from "./Successful/Successful";



const Placement = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showNewAcceptanceRequest, setShowNewAcceptanceRequest] = useState(false);
  const [id, setProgrammeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(""); // "success" or "failure"
  const [showSuccessful, setShowSuccessful] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const toggleNewRequest = () => {
    setShowNewRequest(!showNewRequest);
  };

  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        setProgrammeId(id);
        console.log("This Programme ID:", id);
        // fetchIntroductionLetterRequests(id);
        // fetchPlacementRequests(id);
      } else {
        // setNoProgrammeId(true); // Set state when no Programme ID is found
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching programme ID:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammeId();  // Fetch the ID when the component mounts
  }, []);

  const toggleAcceptanceRequest =()=>{
    setShowNewAcceptanceRequest(!showNewAcceptanceRequest);
    
  }


  const handleAcceptanceRequest = async (values, { setSubmitting }) => {
    try {
      console.log(`Submitting form for programme ID: ${id}`);
      const response = await axiosInstance.post(`/trainings/acceptance-letters/registrations/${id}/`, values);
      console.log("Form submitted successfully", response);
      setSubmissionStatus("success");
      setTimeout(() => {
        setSubmissionStatus("");
        setShowSuccessful(false);
        window.location.reload(); // Auto refresh the page
      }, 2000);
    } catch (error) {
      console.error("Error submitting form", error); // Log the error
      console.log("Error details:", {
        message: error.message,
        response: error.response ? error.response.data : "No response",
        stack: error.stack,
      });
      setSubmissionStatus("failure");
      setTimeout(() => {
        setSubmissionStatus("");
      }, 500);
    } finally {
      setSubmitting(false);
      toggleNewRequest();
    }
  };
  
  

  const handlePlacementRequestsSubmit = async (values, { setSubmitting }) => {

    try {
      console.log(`Submitting form for programme ID: ${id}`);
      const response = await axiosInstance.post(`/trainings/placement-requests/registrations/${id}/`, values);
      console.log("Form submitted successfully", response);
      setSubmissionStatus("success");
      setSuccessMessage("Your form has been submitted successfully!");
      setShowSuccessful(true);
      setTimeout(() => {
        setShowSuccessful(false);
        window.location.reload(); // Auto refresh the page
      }, 5000); // Show success message for 3 seconds
    } catch (error) {
      console.error("Error submitting form", error);
      setSubmissionStatus("failure");
      setTimeout(() => {
        setSubmissionStatus("");
      }, 500);
    } finally {
      setSubmitting(false);
      toggleNewRequest();
    }
  }; 

  // Component display
  const [activeDisplay, setActiveDisplay] = useState("placement");
  const handleButtonClick = (component) => {
    setActiveDisplay(component)
  };


  
  const validationSchema = Yup.object().shape({
    request_message: Yup.string().required("A message is required")
  });

  const acceptanceLetterSchema = Yup.object().shape({
    letter_type: Yup.string()
      .oneOf(['UNDERTAKEN'], 'Invalid letter type')
      .required('Letter type is required'),
    letter: Yup.string()
      .required('Letter content is required'),
    company_name: Yup.string()
      .required('Company name is required'),
    company_address: Yup.string()
      .required('Company address is required'),
    company_contact_name: Yup.string()
      .required('Company contact name is required'),
    company_contact_email: Yup.string()
      .email('Invalid email')
      .required('Company contact email is required'),
    company_contact_phone: Yup.string()
      .required('Company contact phone is required'),
  });
  

  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Placement Letter</title>
      </Helmet>

      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement active-accordion filterPlacement"} //active-accordion and filterPlacement class
        init={0}
        activeI={0} //activen
      />
      {/* 
   

      {/* <ComponentB/> */}
      {showNewRequest && (
        <div className="newRequestComponent">
          <div className="newRequestHeader ">
            <div className="introductionLetter">Request for Placement</div>
            <button className="closeButton" onClick={toggleNewRequest}>
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
                        <Field as="textarea" name="request_message" className="placement_letter" placeholder="Type your message to support your request" />
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

      {/*  */}

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
                letter: '',
                company_name: '',
                company_address: '',
                company_contact_name: '',
                company_contact_email: '',
                company_contact_phone: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleAcceptanceRequest}
            >
                {({ isSubmitting }) => (
                   <Form>
                   <div className="companyDetails">
                     <div className="formInput">
                       <label htmlFor="letter_type">Letter Type</label>
                       <Field as="select" name="letter_type">
                         <option value="">Select Letter Type</option>
                         <option value="UNDERTAKEN">UNDERTAKEN</option>
                         <option value="ACCEPTANCE_LETTER">ACCEPTANCE LETTER</option>
                       </Field>
                       <ErrorMessage className="error" name="letter_type" component="div" />
                     </div>
 
                     {/* ... other form fields remain the same ... */}
 
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
        isOpen={showSuccessful}
        message={successMessage}
        onClose={() => setShowSuccessful(false)}
      />

      <main className="introLetter">
        <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} />

        <div className="placement-head">
        Placement
        </div>
        <div className="navButtons">
          <div className={activeDisplay === "placement" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placement")}> Placement</div>
          <div className={activeDisplay==="placementRequest" ? "shift_button active": "shift_button"} onClick={() => handleButtonClick("placementRequest")}> Placement Requests</div>
          <div className={activeDisplay === "placementAcceptance" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placementAcceptance")}> Acceptance Letter</div>
          <div className={activeDisplay === "placementChange" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placementChange")}> Request for Change of Placement</div>
        </div>

        {activeDisplay === "placementRequest" && <PlacementComponent showNewRequest={showNewRequest} toggleNewRequest={toggleNewRequest} />}
        {activeDisplay === "placement" && <ActivePlacement />}
        {activeDisplay === "placementAcceptance" && <PlacementAcceptance showNewAcceptanceRequest={showNewAcceptanceRequest} toggleNewAcceptanceRequest={toggleAcceptanceRequest} />}
        {activeDisplay === "placementChange" && <PlacementChange showNewRequest={showNewRequest} toggleNewRequest={toggleNewRequest} />}


      </main>
    </div>
  );
};



export default Placement;