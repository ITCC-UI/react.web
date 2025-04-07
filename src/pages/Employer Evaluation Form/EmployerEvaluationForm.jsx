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
    console.log("Received placement ID in parent:", placementId);
    setPlacementID(placementId);
    setRequestFromChild(placementId);
  }



  const fetchEvaluable = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements/employer-evaluations/evaluable/`);
      setEvaluable(response.data);
      setIsLoading(false);
      console.log("Placement List:", response.data)
      setPlacementID(response.data[0].id)
      console.log("Placement ID:", response.data[0].id)
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
      const response = await axiosInstance.get(`/trainings/registrations/placements/${placementID}/evaluation/`)
      console.log("Evaluation Form:", response.data)
      setEvaluationForm(response.data)
    } catch (error) {
      setIsLoading(false);
      console.error("Error Here:", error)
    }
  }

  useEffect(() => {
    if (placementID) {
    fetchEvaluationForm()
    }
  }, [placementID])


  const downloadSCAFFormIT_8 = async () => {
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/${id}/evaluation/itf-form8/document/`,
        {
          responseType: 'blob',
        }
      );
  
   
      const contentType = response.headers['content-type'];
      if (contentType.includes('application/json')) {
        const errorBlob = response.data;
  
      
        const errorText = await errorBlob.text();
        const errorJson = JSON.parse(errorText);
  
        // console.error('Download error:', errorJson);
  
        setFailureMessage(errorJson.detail || "Failed to download Job Reporting Form.");
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
      // console.error('Download error:', error);
  
      
      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorBlob = error.response.data;
          const errorText = await errorBlob.text();
          const errorJson = JSON.parse(errorText);
  // console.log(errorJson)
          setFailureMessage(errorJson.detail || "An error occurred while downloading the file.");
        } catch (parseError) {
          // console.error("Failed to parse error blob:", parseError);
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

          {evaluationForm && (
            <button className="btn-primary scafdownload" onClick={async () => {
              setIsDownloading(true);
              await downloadSCAFFormIT_8();
              setIsDownloading(false);
            }}>
              {isDownloading ? (
                <PulseLoader size={8} color={"#fff"}  />
             ) : (
                "Download ITF SCAF Form"
              )}
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="loader">
            <PulseLoader size={15} color={"#123abc"} />
          </div>
        ) : noProgrammeId ? (
          <div className="noProgrammeId register_above">
            <p> You presently don't have an active placement </p>
          </div>
        ) : evaluables.length === 0 ? (
          <div className="image">
            <img src={Empty} alt="Empty" />
          </div>
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