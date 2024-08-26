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
        console.log("This Programme ID:", id);
        fetchIntroductionLetterRequests(id);
        fetchPlacementRequests(id);
      } catch (error) {
        //console.error("Error fetching programme ID:", error);
        setIsLoading(false);
      }
    };
  
    const fetchIntroductionLetterRequests = async (id) => {
      try {
        // console.log("Fetching introduction letters for programme ID:", id);
        const response = await axiosInstance.get(`trainings/placements/registrations/${id}/`);
        setLetterRequests(response.data);
        setIsLoading(false);
      } catch (error) {
        //console.error("Error fetching introduction letter requests:", error);
        setIsLoading(false);
      }
    };
  
    const fetchPlacementRequests = async (id) => {
      try {
        // console.log("Fetching Placement letters for programme ID:", id);
        const response = await axiosInstance.get(`/trainings/placements/registrations/${id}/`);
        setPlacementRequests(response.data);
        console.log("This is it", response.data)
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching placment letter requests:", error);
        setIsLoading(false);
      }
    };
    useEffect(() => {
      fetchProgrammeId();
    }, []);
  
    // const handleSubmit = async (values, { setSubmitting }) => {
    //   if (!id) {
    //     //console.error("Programme ID not available");
    //     return;
    //   }
  
    //   try {
    //     //console.log(`Submitting form for programme ID: ${programmeId}`);
    //     const response = await axiosInstance.post(`/trainings/registrations/${programmeId}/introduction-letter-requests/`, values);
    //     //console.log("Form submitted successfully", response);
    //     setSubmissionStatus("success");
    //     setTimeout(() => {
    //       setSubmissionStatus("");
    //       window.location.reload(); // Auto refresh the page
    //     }, 500);
    //   } catch (error) {
    //     //console.error("Error submitting form", error);
    //     setSubmissionStatus("failure");
    //     setTimeout(() => {
    //       setSubmissionStatus("");
    //     }, 500);
    //   } finally {
    //     setSubmitting(false);
    //     toggleNewRequest();
    //   }
    // };
  
  
    
    return(<>
    <div className="container">
            <div className="topHead">
              <div className="heading">PLACEMENT</div>
          
            </div>
          </div>
          {isLoading ? (
            <div className="loader">
              <PulseLoader size={15} color={"#123abc"} />
            </div>
          ) : Placement.lngth === 0 ? (
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