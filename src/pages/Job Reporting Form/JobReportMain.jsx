import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./reporting-form.scss"
import DownloadIcon from "/images/Download-white.png"
import axiosInstance from "../../../API Instances/AxiosIntances";
import CloseIcon from '/images/closeButton.png'
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const JobReportingForm = () => {
const [showSubmitForm, setShowSubmitForm]=useState(false)
const [id, setProgrammeId] = useState(null);
const[placements, setPlacementRequests]=useState([])
const [placementID, setPlacementId]= useState(null)
useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowSubmitForm(false)
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);
})

const toggleNewSubmission=()=>{
    setShowSubmitForm((prev)=>!prev);
}

const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        setProgrammeId(id);
      } else {
        
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchProgrammeId();  
  }, []);




// Fetch the placement id
  const fetchPlacement = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements`);
      setPlacementRequests(response.data[0].id);
      // console.log("THe Placment",placements)
      // console.log("The id",id)
      // setPlacementId(response.data[0].id)
      // console.log(placementID)
      
    } catch (error) {
      // console.log(error)
      
    }
  };

  useEffect(() => {
    fetchPlacement();
  }, []);

  const downloadReportForm = async()=>{
    try{
        const request = await axiosInstance.get(`/trainings/registrations/placements/${placements}/job-reporting/form/document/`);
        
    }
    catch (error){
    //  console.error(error)   
    //  console.log("the error", error.response)
    }
  }

// Job reporting form submission
  const submitJobReportingForm = async (values, { setSubmitting }) => {
    try {
  
      const response = await axiosInstance.post(`/trainings/registrations/${id}/acceptance-letters`, values, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAcceptanceSubmissionStatus("success");
      setAcceptanceSuccessMessage("Your Job Reporting Form has been submitted successfully!");
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


  const validationSchema = Yup.object().shape({
    supervisor_name: Yup.string().required("A message is required"),    
    supervisor_number: Yup.string().required("Supervisor's phone number is required"),
    date_of_resumption: Yup.string().required("date of resumption is required")
    
  });


    return ( 
        <div className="introductionLetter">
            <Helmet>
                ITCC - Job Reporting Form
            </Helmet>

            <SideBar
            dashboardClass={"dashy"}
            placementClass={"placement"}
            init={1}
            activeL={"active-accordion"}
            
            />

            

{showSubmitForm && (
              <div className="newRequestComponent">
              <div className="newRequestHeader ">
                <div className="introductionLetter">Job Reporting Form</div>
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


            
            <main className="introLetter">
<TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} active={"activeBar"}/>
<div className="header-main">
<div className="placement-head">
          Job Reporting Form
        </div>

        <div className="form-nest">
         {placements.length!==0?   <button className="form-download null" onClick={null}>
<img src={DownloadIcon} alt="download" />Download Form
            </button>:    <button className="form-download" onClick={()=>downloadReportForm()}>
<img src={DownloadIcon} alt="download" />Download Form
            </button>}
            {/* <button className="form-upload" onClick={()=>toggleNewSubmission()}> */}
            <button className="form-upload null" onClick={(null)}>
Submit Form
            </button>
        </div>
</div>

            </main>
        </div>
     );
}
 
export default JobReportingForm;