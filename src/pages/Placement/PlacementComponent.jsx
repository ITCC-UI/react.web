import React, { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import Empty from "/images/empty_dashboard.png";
import PlacementTable from "./PlacementReqTable";
import axiosInstance from "../../../API Instances/AxiosIntances";


const PlacementComponent = ({ toggleNewRequest, refreshPlacementTable }) => {
  const [programmeId, setProgrammeId] = useState(null);
  const [placement, setLetterRequests] = useState([]);
  const [placementLetter, setPlacementRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noProgrammeId, setNoProgrammeId] = useState(false); // State for no Programme ID

  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        
        setProgrammeId(id);
        
        fetchIntroductionLetterRequests(id);
        fetchPlacementRequests(id);
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
      const response = await axiosInstance.get(`trainings/registrations/${id}/placement-requests-view/`);
      setLetterRequests(response.data);
      
      setIsLoading(false);
    } catch (error) {
      
      setIsLoading(false);
    }
  };

  const fetchPlacementRequests = async (id) => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements`);
      setPlacementRequests(response.data);
      
      setIsLoading(false);
    } catch (error) {
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammeId();
  }, []);


  return (
    <>
      <div className="container">
        <div className="topHead place">
          {/* Conditionally render the New Request button only if programmeId exists */}
          {programmeId && (
            <button className="newReq" onClick={toggleNewRequest}>
              + New Request
            </button>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="loader">
          <PulseLoader size={15} color={"#123abc"} />
        </div>
      )
       : noProgrammeId ? (
        <div className="noProgrammeId register_above">
          <p>You are not eligible to request a placement letter at this time. <br/>
        <br/>  You need to make a registration before proceeding</p>
        </div>
      )
       : placement.length === 0 ? (
        <div className="image">
          <img src={Empty} alt="Empty" />
        </div>
      ) : (
        <PlacementTable letterRequests={placement} refreshPlacementTable={refreshPlacementTable}/>
      )}
   
    </>
  );
};

export default PlacementComponent;
