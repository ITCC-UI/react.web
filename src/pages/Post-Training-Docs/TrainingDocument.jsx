import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
// import "./reporting-form.scss"
import DownloadIcon from "/images/Download-white.png"
import axiosInstance from "../../../API Instances/AxiosIntances";
import CloseIcon from '/images/closeButton.png'
import * as Yup from "yup";
import Empty from "/images/empty_dashboard.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PulseLoader, BeatLoader } from "react-spinners";
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage";
import FullScreenSuccessMessage from "../Placement/Successful/Successful";
import PostTrainingTable from "./PostTrainigTable";

const TrainingDocuments = () => {
  
  const [id, setProgrammeId] = useState(null);
  const [placements, setPlacementRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSCAFDownloading, setSCAFIsDownloading] = useState(false);
  const [noProgrammeId, setNoProgrammeId] = useState(false);
  const [jobReports, setjobReports] = useState([]);
  const [placementList, setPlacementList] = useState([])
  const [addressOptions, setAdressOptions] = useState([])
  const [successMessage, setJobReportStatus] = useState("")
  const [showSuccessStatus, setJobReportSuccess] = useState(false)
  const [failureMessage, setFailureMessage] = useState("")
  const [showFailureMessage, setShowJobReportingFailure] = useState(false)
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [trainingDuration, setDuration] =useState(0)
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
        const id = response.data[0].id;
        setProgrammeId(id);
      console.log("Programmessssssssssss ID:", id);
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
    const duration=(response.data.training.type.duration)
    console.log("Duration", duration)
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
//   const fetchPlacement = async () => {
//     try {
//       const response = await axiosInstance.get(`/trainings/registrations/${id}/placements/current`);
//       setPlacementRequests(response.data.id);
//       console.log("Placementssss ID:", response.data.id );
//       setPlacementList(response)
//       setIsLoading(false)

//     } catch (error) {
// console.error("Error fetching placement data:", error);
//       setNoProgrammeId(true);
//       console.error("Error fetching placement data:", error);



//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchPlacement();
//     }
//   }, [id]);


 



  // SCAF FORM DOwnload

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;





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