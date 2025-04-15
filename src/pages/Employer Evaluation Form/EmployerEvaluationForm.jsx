import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./reporting-form.scss"
import axiosInstance from "../../../API Instances/AxiosIntances";
import CloseIcon from '/images/closeButton.png'
import * as Yup from "yup";
import Empty from "/images/empty_dashboard.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PulseLoader, BeatLoader } from "react-spinners";
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage";
import FullScreenSuccessMessage from "../Placement/Successful/Successful2";
import EmployerEvalTable from "./EmployerEvalTable";

const EmployerEvaluationForm = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [id, setProgrammeId] = useState(null);
  const [placements, setPlacementRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSCAFDownloading, setSCAFIsDownloading] = useState(false);
  const [noProgrammeId, setNoProgrammeId] = useState(false);
  const [evaluables, setEvaluable] = useState([]);
  const [placementList, setPlacementList] = useState([])
  const [companyName, setCompanyName] = useState(["Job Reporting Form"])
  const [addressOptions, setAdressOptions] = useState([])
  const [successMessage, setJobReportStatus] = useState("")
  const [title, setTitle] = useState("")
  const [showSuccessStatus, setJobReportSuccess] = useState(false)
  const [failureMessage, setFailureMessage] = useState("")
  const [showFailureMessage, setShowJobReportingFailure] = useState(false)
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [trainingDuration, setDuration] =useState(0)
  const [placementID, setPlacementID] = useState(null)
  const [requestFromChild, setRequestFromChild] = useState(null)
  const [evaluationForm, setEvaluationForm] = useState(null)
  const [endDate, setEndDate] =useState("Deadline not set")
    const [timeRemaining, setTimeRemaining] = useState("Deadline not set");
    const [startDate, setStartDate] = useState ("Submission not yet begin")
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowSubmitForm(false)
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);
  })


  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[response.data.length - 1].id;
        setProgrammeId(id);
        setIsLoading(false)
      } else {

      }
    } catch (error) {
      setNoProgrammeId(true);
      setIsLoading(false)


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
  
  
  const fetchSchedule = async () => {
    try {
      const response = await axiosInstance.get(`trainings/registrations/${id}/placements/evaluation/schedule/`);
      const endDate = new Date(response.data.end_date);
      const startDate = new Date(response.data.start_date);
      console.log("THe data",response.data)
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
      setStartDate(formattedStartDate)
      setPlacementRequests(response.data);
      setEndDate(formattedDate);
      setTimeRemaining(timeRemaining); 
      
      
    } catch (error) {
    
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchSchedule();
    }
  }, [id]);
  

  // Fetch Registration ID
const fetchRegistrationType = async () =>{
  try{
    const response = await axiosInstance.get(`/trainings/registrations/${id}`);
    const duration=(response.data.training.type.duration)
    setDuration(duration)
    

  }
  catch (error){

  }
}

useEffect (()=>{
  if (id){
    fetchRegistrationType()
  }
}, [id])

  const handlePlacementId = (placementId) => {
    
    setPlacementID(placementId);
    setRequestFromChild(placementId);
  }



  const fetchEvaluable = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements/employer-evaluations/evaluable/`);
      setEvaluable(response.data);
      setIsLoading(false);
      
      setPlacementID(response.data[0].id)
      
    } catch (error) {
      setIsLoading(false);

    }
  };

  useEffect(() => {
    if (id) {
      fetchEvaluable();
    }
  }, [id]);


  const fetchEvaluationForm = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements/last/evaluation/status/`)
      
      setEvaluationForm(response.data)

    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching evaluation form:", error);
      
    }
  }

  useEffect(() => {
    if (id) {
    fetchEvaluationForm()
    }
  }, [id])


  const downloadSCAFFormIT_8 = async () => {
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/${id}/placements/evaluation/itf-form8/document/`,
        {
          responseType: 'blob',
        }
      );
  
   
      const contentType = response.headers['content-type'];
      if (contentType.includes('application/json')) {
        const errorBlob = response.data;
  
      
        const errorText = await errorBlob.text();
        const errorJson = JSON.parse(errorText);
  
        
  
        setFailureMessage(errorJson.detail || "Failed to download SCAF Form.");
        setShowJobReportingFailure(true);
        return; // Stop the download from proceeding
      }
  
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'itf-8.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  
    
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      
  
      
      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorBlob = error.response.data;
          const errorText = await errorBlob.text();
          const errorJson = JSON.parse(errorText);
  
          setFailureMessage(errorJson.detail || "An error occurred while downloading the file.");
        } catch (parseError) {
       
          setFailureMessage("An unknown error occurred while downloading.");
        }
      } else {
        setFailureMessage(
          error.response?.data?.detail || "There was an error downloading your Job Reporting Form."
        );
      }
  
      setShowJobReportingFailure(true);
    }
  };
  

  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Employer Evaluation Form</title>
      </Helmet>

      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement"}
        init={1}
        activeL={"active-accordion"}
        formClass={"forms"}
      />

      <FullScreenSuccessMessage
        isOpen={showSuccessStatus}
        title={title}
        message={successMessage}
        onClose={() => setJobReportSuccess(false)}
      />

      <FullScreenFailureMessage
        message={failureMessage}
        isOpen={showFailureMessage}
        onClose={() => setShowJobReportingFailure(false)}
      />

      <main className="introLetter">
        <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} active={"activeBar"} />
        <div className="header-main">
          <div className="placement-head">
            Employer Evaluation Form
          </div>

          {evaluationForm && trainingDuration===24 && (
            <button className="btn-primary scafdownload" onClick={async () => {
              setIsDownloading(true);
              await downloadSCAFFormIT_8();
              setIsDownloading(false);
            }}>
              {isDownloading ? (
                <PulseLoader size ={8} color={"#fff"}  />
             ) : (
                "Download IT Form-8"
              )}
            </button>
          )}
        </div>
        <div className="error deadline">Start Date: {startDate} </div>
        <div className="error deadline">Submission Deadline: {endDate} </div>
        <div className="error deadline">Time Remaining: {timeRemaining} </div>
        
       
        {isLoading ? (
          <div className="loader">
            <PulseLoader size={15} color={"#123abc"} />
          </div>
        ) : noProgrammeId ? (
          <div className="noProgrammeId register_above">
            <p> You presently don't have an active placement </p>
          </div>
        ) : evaluables.length === 0 ? (
        <>  <div className="image">
            <img src={Empty} alt="Empty" />

        
          </div>
              <div className="noProgrammeId register_above">
              You need to submit your Job Reporting Form before you can fill the Employer Evaluation Form.
            </div></>
        ) : (
          <EmployerEvalTable 
            triggerRefresh={triggerRefresh} 
            setTriggerRefresh={setTriggerRefresh}
            requestID={handlePlacementId} 
          />
        )}
      </main>
    </div>
  );
}

export default EmployerEvaluationForm;