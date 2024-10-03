import React from "react";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import Empty from "/images/empty_dashboard.png";
import PlacementTable from "./PlacementTable";
import axiosInstance from "../../../API Instances/AxiosIntances";


const ActivePlacement=({showNewRequest, toggleNewRequest})=> {
    
    const [id, setProgrammeId] = useState(null);
    const [Placement, setLetterRequests] = useState([]);
    const [PlacementLetter, setPlacementRequests]= useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [submissionStatus, setSubmissionStatus] = useState(""); // "success" or "failure"
  

  
    const fetchProgrammeId = async () => {
      try {
        const response = await axiosInstance.get("trainings/registrations/");
        const id = response.data[0].id;
        setProgrammeId(id);
        console.log(Placement)
        // console.log("This Programme ID:", id);
        // fetchIntroductionLetterRequests(id);
        // fetchPlacementRequests(id);
        setIsLoading(false);
      } catch (error) {
        // console.error("Error fetching programme ID:", error);
        setIsLoading(false);

      }
    };

    useEffect(() => {
      fetchProgrammeId();
    }, []);
  
   
  
    
    return(
    <>
    <div className="container">
            <div className="topHead place">
               {/* Conditionally render the New Request button only if programmeId exists */}
          {id && (
            <button className="newReq" onClick={toggleNewRequest}>
             + Change Placement
            </button>
          )}
          
            </div>
          </div>
          {isLoading ? (
            <div className="loader">
              <PulseLoader size={15} color={"#123abc"} />
            </div>
            
          ) : Placement.length !== 0 ? (
            <div className="image">
              <img src={Empty} alt="Empty" />
            </div>
          ) : (
            <PlacementTable letterRequests={Placement} />
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

  export default ActivePlacement;