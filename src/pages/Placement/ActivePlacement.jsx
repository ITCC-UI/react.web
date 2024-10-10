import React from "react";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import Empty from "/images/empty_dashboard.png";
import PlacementTable from "./PlacementTable";
import axiosInstance from "../../../API Instances/AxiosIntances";


const ActivePlacement=({showNewRequest, toggleNewRequest})=> {
    
    const [id, setProgrammeId] = useState(null);
    const [placement, setLetterRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submissionStatus, setSubmissionStatus] = useState(""); // "success" or "failure"

  
    const fetchProgrammeId = async () => {
      try {
        const response = await axiosInstance.get("trainings/registrations/");
        const id = response.data[0].id;
        setProgrammeId(id);
        setIsLoading(false);
      } catch (error) {
        
        setIsLoading(false);

      }
    };

    useEffect(() => {
      fetchProgrammeId();
    }, []);
  
   
    const fetchPlacementLetter = async () => {
      try {
        const registrationResponse = await axiosInstance.get("trainings/registrations/");
        const registrations = registrationResponse.data;
        console.log("Fetched registrations:", registrations);
  
        // Use the ID of the first registration
        const id = registrations[0].id;
        console.log("Using Registration ID:", id);
        const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/placements`)
        const requests = requestsResponse.data;
        console.log("Fetched requests:", requests);
        setLetterRequests(requests)
   
  
        
      } catch (error) {
        console.error("Error fetching introduction letter requests:", error);
      }
    };

    useEffect(() => {
      fetchPlacementLetter();
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
            
          ) : placement.length !== 0 ? (

            
              <PlacementTable />)
          :
           ( <div className="image">
              <img src={Empty} alt="Empty" />
            </div>
          ) }
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