import React from "react";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import Empty from "/images/empty_dashboard.png";
import PlacementAcceptanceTable from "./PlacementAcceptanceTable";
import axiosInstance from "../../../API Instances/AxiosIntances";
const PlacementAcceptance=({showNewAcceptanceRequest, toggleNewAcceptanceRequest, refreshAcceptanceTable})=> {
    
    const [id, setProgrammeId] = useState(null);
    const [Placement, setLetterRequests] = useState([]);
    const [PlacementLetter, setPlacementRequests]= useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [submissionStatus, setSubmissionStatus] = useState(""); // "success" or "failure"
    const [noProgrammeId, setNoProgrammeId] = useState(false); // State for no Programme ID

  
    const fetchProgrammeId = async () => {
      try {
        const response = await axiosInstance.get("trainings/registrations/");
        if (response.data.length > 0) {
          const id = response.data[0].id;
          setProgrammeId(id);
          
          fetchIntroductionLetterRequests(id);

        } else {
          setNoProgrammeId(true); // Set state when no Programme ID is found
          setIsLoading(false);
        }
      } catch (error) {
        
        setIsLoading(false);
      }
    };
  
    const fetchIntroductionLetterRequests = async (id) => {
      try {
        
        const response = await axiosInstance.get(`trainings/registrations/${id}/acceptance-letters`);
        setLetterRequests(response.data);
        setIsLoading(false);
      } catch (error) {
        
        setIsLoading(false);
      }
    };

    
    useEffect(() => {
      fetchProgrammeId();
    }, []);

  
  
    
    return(<>
    <div className="container">
            <div className="topHead place">
              
             {id && (<button className="newReq" onClick={toggleNewAcceptanceRequest}>
                + New Submission
              </button>)}
            </div>
          </div>
          {isLoading ? (
            <div className="loader">
              <PulseLoader size={15} color={"#123abc"} />
            </div>
          ) : 
          noProgrammeId ? (
            <div className="noProgrammeId register_above">
              <p>You are not eligible to request a placement letter at this time. <br/>
            <br/>  You need to make a registration before proceeding</p>
            </div>
          )
          :
          Placement.length === 0 ? (
            <div className="image">
              <img src={Empty} alt="Empty" />
            </div>
          ) : (
            <PlacementAcceptanceTable letterRequests={Placement} refreshAcceptanceTable={refreshAcceptanceTable}/>
          )}
          {submissionStatus === "success" && (
            <div className="submissionStatus success">
              Form submitted successfully! Reload the page.
            </div>
          )}
          {submissionStatus === "failure" && (
            <div className="submissionStatus failure">
              Error submitting form. Please try again.
            </div>
          )}
  </>)
  }

  export default PlacementAcceptance;