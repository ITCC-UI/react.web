import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
import classNames from 'classnames';
import axiosInstance from '../../../API Instances/AxiosIntances';
import { Search } from 'lucide-react';
import Filter from "/images/Filter.png"
import FormSubmissionComponent from './FormSubmissionComponent';
  

const PostTrainingTable = ({triggerRefresh}) => {
  const [letterRequests, setLetterRequests] = useState([]);

  const fetchJobReports = async () => {
    try {
      // Fetch registration data
      const registrationResponse = await axiosInstance.get("trainings/registrations/");
      const registrations = registrationResponse.data;
  
      if (!registrations || registrations.length === 0) {
        
        setLetterRequests([]); // Ensure state is cleared if no data exists
        return;
      }
  
      const id = registrations[0].id;
  
      // Fetch placement data for the first registration
      const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/placements/`);
      const requests = requestsResponse.data;

      
  
      if (!requests || requests.length === 0) {
        
        setLetterRequests([]); // Ensure state is cleared if no data exists
        return;
      }
  
      const placementID = requests[0].id;
  
      // Fetch job report data
      const jobReportSubmission = await axiosInstance.get(`/trainings/registrations/${id}/job-reporting/`);
      const jobReports = jobReportSubmission.data;
  
      if (jobReports && typeof jobReports === "object") {
      
        
        const processedRequests = Object.keys(jobReports).map(key => ({
          id: key,
          ...jobReports[key]
          // statusClass: getStatusClass(jobReports[key].approval_status),
        }));
  
        setLetterRequests(processedRequests); // Populate state with processed data
      } else if (Array.isArray(jobReports)) {
        // If data is an array, handle as before
        const processedRequests = jobReports.map(request => ({
          ...request
          // statusClass: getStatusClass(request.approval_status),
        }));
  
        setLetterRequests(processedRequests);
      } else {
        
        setLetterRequests([]);
      }
    } catch (error) {
      
    }
  };
  
  // Call the function in useEffect
  useEffect(() => {
    fetchJobReports();
  }, [triggerRefresh]);
  



  return (
    <section className='shift placement_table'>
      <div className="mainBody">
        <div className="containerCourse">
               
       <FormSubmissionComponent title={"Work Report"} />
       <FormSubmissionComponent title={"Presentation Slide"} />
        </div>
      </div>
      <div className="register_above mobile">
        Scroll horizontally to see more
      </div>
    </section>
  );
};

export default PostTrainingTable;