import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
// import "./reporting-form.scss"
import axiosInstance from "../../../API Instances/AxiosIntances";
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage";
import FullScreenSuccessMessage from "../Placement/Successful/Successful";
import PostTrainingTable from "./PostTrainigTable";

const TrainingDocuments = () => {
  
  const [id, setProgrammeId] = useState(null);
  const [placements, setPlacementRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [noProgrammeId, setNoProgrammeId] = useState(false);
  const [successMessage, setJobReportStatus] = useState("")
  const [showSuccessStatus, setJobReportSuccess] = useState(false)
  const [failureMessage, setFailureMessage] = useState("")
  const [showFailureMessage, setShowJobReportingFailure] = useState(false)
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [trainingDuration, setDuration] =useState(0)
  const [endDate, setEndDate] =useState("Deadline not set")
  const [timeRemaining, setTimeRemaining] = useState("Deadline not set");
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
        const id = response.data[0].id;
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



  // Fetch Registration ID
const fetchRegistrationType = async () =>{
  try{
    const response = await axiosInstance.get(`/trainings/registrations/${id}`);
    const duration=(response.data.training?.type?.duration)
    setDuration(duration)

    const now = new Date();
    const timeDifference = duration - now;

    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

      const formattedTimeLeft = `${days} days, ${hours} hours, and ${minutes} minutes left`;
      

      setCountDown(formattedTimeLeft);
    } else {
      
      
    }


  }
  catch (error){

  }
}

useEffect (()=>{
  if (id){
    fetchRegistrationType()
  }
}, [id])


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
    const response = await axiosInstance.get(`trainings/registrations/${id}/documents/schedule/`);
    const endDate = new Date(response.data.end_date);
    
    // Format the end date as before
    const formattedDate = endDate.toLocaleString('en-US', {
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



  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Training Documents Submission</title>
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

            Training Report and Presentation Submission
          </div>
        </div>
        <div className="error deadline">Submission Deadline: {endDate} </div>
        <div className="error deadline">Time Remaining: {timeRemaining} </div>
        {isLoading ? (
          <div className="loader">

            <PulseLoader size={15} color={"#123abc"} />
          </div>
        ) : noProgrammeId ?
        

         (
          <div className="noProgrammeId register_above">
            <p> You presently don't have an active placement </p>
          </div>


        ) :  ( <PostTrainingTable triggerRefresh={triggerRefresh} 
        />
      ) }

      </main>
    </div>
  );
}

export default TrainingDocuments;