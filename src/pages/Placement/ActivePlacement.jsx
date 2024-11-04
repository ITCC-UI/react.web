import React from "react";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import Empty from "/images/empty_dashboard.png";
import PlacementTable from "./PlacementTable";
import axiosInstance from "../../../API Instances/AxiosIntances";


const ActivePlacement=({showNewRequest, toggleNewRequest, triggerRefresh})=> {
    
    const [id, setProgrammeId] = useState(null);
    const [placement, setLetterRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


  
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
       
  
       
        const id = registrations[0].id;
       
        const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/placements`)
        const requests = requestsResponse.data;
       
        setLetterRequests(requests)
   
  
        
      } catch (error) {
      
      }
    };

    useEffect(() => {
      fetchPlacementLetter();
    }, []);
    
    return(
    <>
    <div className="container">
            <div className="topHead place">
          {id && (
            <button className="newReq null off" onClick={toggleNewRequest} disabled >
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

            
              <PlacementTable triggerRefresh={triggerRefresh}/>)
          :
           ( <div className="image">
              <img src={Empty} alt="Empty" />
            </div>
          ) }
      
  </>)
  }

  export default ActivePlacement;