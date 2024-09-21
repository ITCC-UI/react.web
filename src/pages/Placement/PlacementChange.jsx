import React from "react";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import Empty from "/images/empty_dashboard.png";
import PlacementChangeReq from "./PlacementChangeReq";
import axiosInstance from "../../../API Instances/AxiosIntances";

const PlacementChange = ({ showPlacementReq, togglePlacementChangeRequest }) => {
  const [id, setProgrammeId] = useState(null);
  const [Placement, setLetterRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [noProgrammeId, setNoProgrammeId] = useState(false); // State for no Programme ID

  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        setProgrammeId(id);
        console.log("This Programme ID:", id);
        fetchChangeOfPlacementRequests(id);
        // fetchPlacementRequests(id);
      } else {
        setNoProgrammeId(true); // Set state when no Programme ID is found
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching programme ID:", error);
      setIsLoading(false);
    }
  };

  const fetchChangeOfPlacementRequests = async (id) => {
    try {
      const response = await axiosInstance.get(`trainings/change-of-placements/registrations/${id}/`);
      setLetterRequests(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching change of placement requests:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammeId();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!id) {
      console.error("Programme ID not available");
      return;
    }

    try {
      const response = await axiosInstance.post(`/trainings/change-of-placement/registrations/${id}/`, values);
      setSubmissionStatus("success");
      setTimeout(() => {
        setSubmissionStatus("");
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error submitting form", error);
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
          <button className="newReq" onClick={togglePlacementChangeRequest}>
            + New Request
          </button>
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
      ) : Placement.length === 0 ? (
        <div className="image">
          <img src={Empty} alt="Empty" />
        </div>
      ) : (
        <PlacementChangeReq letterRequests={Placement} />
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