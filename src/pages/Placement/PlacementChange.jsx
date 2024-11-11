import React from "react";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import Empty from "/images/empty_dashboard.png";
import PlacementChangeReq from "./PlacementChangeReq";
import axiosInstance from "../../../API Instances/AxiosIntances";

const PlacementChange = ({ showPlacementReq, togglePlacementChangeRequest }) => {
  const [id, setProgrammeId] = useState(null);
  const [placementID, setPlacementId]= useState(null)
  const [placement, setLetterRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [noProgrammeId, setNoProgrammeId] = useState(false); // State for no Programme ID
  const [placements, setPlacementLetter]= useState([])

  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        setProgrammeId(id);
        fetchChangeOfPlacementRequests(id);
        // fetchPlacementRequests(id);
      } else {
        setNoProgrammeId(true); // Set state when no Programme ID is found
        setIsLoading(false);
      }
    } catch (error) {
      
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProgrammeId();
  }, []);
  
  const fetchPlacementLetterID = async () => {
    try {
      const registrationResponse = await axiosInstance.get("trainings/registrations/");
      const registrations = registrationResponse.data;
      const id = registrations[0]?.id; // Using optional chaining in case registrations is empty
      if (id) {
        const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/placements`);
        const requests = requestsResponse.data;
        const placementId = requests[0]?.id;
        setPlacementId(placementId);
        setPlacementLetter(requests);
        
      } else {
        
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    if (id) fetchPlacementLetterID();
  }, [id]);


  const fetchChangeOfPlacementRequests = async (placementID) => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/change-of-placements-view/${placementID}`);
      // const response = await axiosInstance.get(`/trainings/registrations/${id}/introduction-letter-requests`);
      setLetterRequests(response.data);
      console.log("requests fetched", setLetterRequests)
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
    }
  };



  const handleSubmit = async (values, { setSubmitting }) => {
    if (!placementID) { // Check for placementID instead of id
      return;
    }
  
    try {
      
      const response = await axiosInstance.post(`/trainings/change-of-placement/registrations/${placementID}/`, values);
      setSubmissionStatus("success");
      setTimeout(() => {
        setSubmissionStatus("");
        window.location.reload();
      }, 500);
    } catch (error) {
      setSubmissionStatus("failure");
      setTimeout(() => {
        setSubmissionStatus("");
      }, 500);
    } finally {
      setSubmitting(false);
      togglePlacementChangeRequest();
    }
  };
  

  return (
    <>
      <div className="container">
        <div className="topHead place">
      {  noProgrammeId || placements.length===0 ? ( <button className="newReq disable" onClick={togglePlacementChangeRequest} disabled={true}>
            + New Request
          </button>): ( <button className="newReq" onClick={togglePlacementChangeRequest}>
            + New Request
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
          <p>You are not eligible to request for a change of placement at this time. <br/>
        <br/>  You need to make a registration before proceeding</p>
        </div>
      ) : placement.length === 0 ? (
        <div className="image">
          <img src={Empty} alt="Empty" />
        </div>
      ) : (
        <PlacementChangeReq letterRequests={placement} />
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
    </>
  );
};

export default PlacementChange;