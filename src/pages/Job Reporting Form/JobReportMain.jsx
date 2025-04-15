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
import FullScreenSuccessMessage from "../Placement/Successful/Successful";
import JobReportingTable from "./JobReportTable";

const JobReportingForm = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [id, setProgrammeId] = useState(null);
  const [placements, setPlacementRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSCAFDownloading, setSCAFIsDownloading] = useState(false);
  const [noProgrammeId, setNoProgrammeId] = useState(false);
  const [jobReports, setjobReports] = useState([]);
  const [placementList, setPlacementList] = useState([])
  const [companyName, setCompanyName] = useState(["Job Reporting Form"])
  const [addressOptions, setAdressOptions] = useState([])
  const [successMessage, setJobReportStatus] = useState("")
  const [title, setTitle] = useState("")
  const [showSuccessStatus, setJobReportSuccess] = useState(false)
  const [failureMessage, setFailureMessage] = useState("")
  const [showFailureMessage, setShowJobReportingFailure] = useState(false)
  const [triggerRefresh, setTriggerRefresh] = useState(false);
    const [endDate, setEndDate] =useState("Deadline not set")
    const [timeRemaining, setTimeRemaining] = useState("Deadline not set");
    const [startDate, setStartDate] = useState ("Submission not yet begin")
    const [duration, setDuration] = useState("")
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowSubmitForm(false)
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);
  })

  const toggleNewSubmission = () => {
    setShowSubmitForm((prev) => !prev);
  }

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
      const response = await axiosInstance.get(`trainings/registrations/${id}/job-reporting/schedule/`);
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

  // Fetch the placement id
  const fetchPlacement = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements/current`);
      setPlacementRequests(response.data?.id);
      setPlacementList(response)

      setCompanyName(response.data?.attached_company_branch?.company.name)
      setIsLoading(false)

    } catch (error) {

      setNoProgrammeId(true);



    }
  };

  useEffect(() => {
    if (id) {
      fetchPlacement();
    }
  }, [id]);


  const fetchJobReports = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements/job-reporting/reportable/`);
      setjobReports(response.data);
      
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      

    }
  };



  useEffect(() => {
    if (id) {
      fetchJobReports();
    }
  }, [id]);
 


  const downloadSCAFForm = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/job-reporting/itf/document/`, {
        responseType: 'blob' // Important: Specify the response type as 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SCAF-FORM.pdf'); // Replace 'report_form.pdf' with the desired filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {

    }
  };



  // SCAF FORM DOwnload
  const handleSCAFDownload = async () => {
    setSCAFIsDownloading(true);

    try {
      // Your download logic here
      await downloadSCAFForm();
    } catch (error) {
      // Handle errors

    } finally {
      setSCAFIsDownloading(false);
    }
  };


  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Job Reporting Form</title>
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
            Job Reporting Form
          </div>
         {jobReports[0]?.job_reporting && duration===24 ? (<button className="btn-primary" onClick={()=>{handleSCAFDownload()}}>Download SCAF Form</button>) : ""}
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


        ) : jobReports.length === 0 ? (
          <div className="image">
            
            <img src={Empty} alt="Empty" />
          </div>
        ) : (

          <JobReportingTable triggerRefresh={triggerRefresh} />
        )}

      </main>
    </div>
  );
}

export default JobReportingForm;