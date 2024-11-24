import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
import "./jobReportTable.scss";
import classNames from 'classnames';
import axiosInstance from '../../../API Instances/AxiosIntances';
import { Search } from 'lucide-react';
import Filter from "/images/Filter.png"

const JobReportingTable = ({refreshPlacementTable}) => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [data, setJobData] =useState({})
  const [companyName, setCompanyName] = useState('')

  const fetchJobReports = async () => {
    try {
      // Fetch registration data
      const registrationResponse = await axiosInstance.get("trainings/registrations/");
      const registrations = registrationResponse.data;
  
      if (!registrations || registrations.length === 0) {
        console.log("No registrations found");
        setLetterRequests([]); // Ensure state is cleared if no data exists
        return;
      }
  
      const id = registrations[0].id;
  
      // Fetch placement data for the first registration
      const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/placements/`);
      const requests = requestsResponse.data;
      setCompanyName(requests[0].attached_company_branch.company.name)
  
      if (!requests || requests.length === 0) {
        console.log("No placement data found");
        setLetterRequests([]); // Ensure state is cleared if no data exists
        return;
      }
  
      const placementID = requests[0].id;
  
      // Fetch job report data
      const jobReportSubmission = await axiosInstance.get(`/trainings/registrations/placements/${placementID}/job-reporting/`);
      const jobReports = jobReportSubmission.data;
     
  
      if (jobReports && typeof jobReports === "object") {
        // Process data as an object
        
        setJobData(jobReports)
        console.log("The data",data)
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
        console.error("Unexpected job report format");
        setLetterRequests([]);
      }
    } catch (error) {
      console.log("Error fetching job reports:", error);
    }
  };
  
  // Call the function in useEffect
  useEffect(() => {
    fetchJobReports();
  }, [refreshPlacementTable]);
  
  

  const filteredRequests = letterRequests.filter((request) => {
    const matchesSearch = Object.values(request).some(
      (value) => 
        value && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = 
      filter === 'all' || 
      request.approval_status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <section className='shift placement_table'>
      <div className="mainBody">
      <div className="search-bar">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search Here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                
              />
             
            </div>
            <div className='filter'>
            <img src={Filter} alt="Hey" className='image-filter' />
              <select
                value={filter}
                // onChange={(e) => setFilter(e.target.value)}
                onChange={() => setFilter(null)}
                className="pyro"
              >
                
                
                <option value="default" disabled selected hidden null>
      Select a status
      
    </option>

                <option value="all"> All </option>
                <option value="approved " disabled>Approved</option>
                <option value="submitted" disabled>Submitted</option>
                <option value="rejected" disabled>Rejected</option>
              </select>
            </div>
          </div>
        <div className="containerCourse">
         
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Supervisor's Name</th>
                <th>Supervisor's Phone Number</th>
                <th>Date</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
          {} <tbody>


            <tr>
              <td>{companyName}</td>
              <td>{data.company_supervisor}</td>
              <td>{data.supervisor_phone}</td>
              <td>{data.date_reported}</td>
            </tr>
  

                 
            </tbody>
          </table>
         
        </div>
      </div>
      <div className="register_above mobile">
        Scroll horizontally to see more
      </div>
    </section>
  );
};

export default JobReportingTable;