import React from "react";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import Empty from "/images/empty_dashboard.png";
import PlacementChangeReq from "./PlacementChangeReq";
import axiosInstance from "../../../API Instances/AxiosIntances";

const PlacementChange = ({ showPlacementReq, togglePlacementChangeRequest }) => {
  const [programmeId, setProgrammeId] = useState(null);
  const [placementID, setPlacementId] = useState(null);
  const [placement, setLetterRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [noProgrammeId, setNoProgrammeId] = useState(false);
  const [placements, setPlacementLetter] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const registrationResponse = await axiosInstance.get("trainings/registrations/");
        if (registrationResponse.data.length > 0) {
          const id = registrationResponse.data[0].id;
          setProgrammeId(id);
          const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/placements`);
          const requests = requestsResponse.data;
          if (requests.length > 0) {
            const placementId = requests[0].id;
            setPlacementId(placementId);
            setPlacementLetter(requests);
            fetchChangeOfPlacementRequests(placementId);
          } else {
            setNoProgrammeId(true);
          }
        } else {
          setNoProgrammeId(true);
        }
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchChangeOfPlacementRequests = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${programmeId}/change-of-placements/`);
      setLetterRequests(response.data);
      
     
    } catch (error) {
      
    }
  };


  return (
    <>
      <div className="container">
        <div className="topHead place">
          {noProgrammeId || placements.length === 0 ? (
            <button className="newReq disable" onClick={togglePlacementChangeRequest} disabled={true}>
              + New Request
            </button>
          ) : (
            <button className="newReq" onClick={togglePlacementChangeRequest}>
              + New Request
            </button>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="loader">
          <PulseLoader size={15} color={"#123abc"} />
        </div>
      ) : noProgrammeId ? (
        <div className="noProgrammeId register_above">
          <p>
            You are not eligible to request for a change of placement at this time. <br />
            <br /> You need to make a registration before proceeding
          </p>
        </div>
      ) : placement.length === 0 ? (
        <div className="image">
          <img src={Empty} alt="Empty" />
        </div>
      ) : (
        <PlacementChangeReq letterRequests={placement} />
      )}
 
    </>
  );
};

export default PlacementChange;