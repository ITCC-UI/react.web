import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
import "./jobReportTable.scss";
import classNames from 'classnames';
import axiosInstance from '../../../API Instances/AxiosIntances';
import { Search } from 'lucide-react';
import Filter from "/images/Filter.png"

const JobReportingTable = ({refreshPlacementTable}) => {
  const [letterRequests, setLetterRequests] = useState([]);
const [company, setCompanyName] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

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
      const companyName= requests[0].attached_company_branch.company.name
      setCompanyName(companyName)
      
  
      if (!requests || requests.length === 0) {
        
        setLetterRequests([]); // Ensure state is cleared if no data exists
        return;
      }
  
      const placementID = requests[0].id;
  
      // Fetch job report data
      const jobReportSubmission = await axiosInstance.get(`/trainings/registrations/${id}/job-reporting/`);
      const jobReports = jobReportSubmission.data;
  
      if (jobReports && typeof jobReports === "object") {
        // Process data as an object
        
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
  }, [refreshPlacementTable]);
  
  


  const getStatusClass = (status) => {
    switch(status) {
      case 'APPROVED':
        return 'approved';
      case 'REJECTED':
        return 'rejected';
      case 'SUBMITTED':
      default:
        return 'submitted';
    }
  };



  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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
                onChange={(e) => setFilter(e.target.value)}
                className="pyro"
              >
                
                {/* <option value="all" disabled>Filter</option> */}
                <option value="default" disabled selected hidden>
      Select a status
      
    </option>

                <option value="all"> All </option>
                <option value="approved">Approved</option>
                <option value="submitted">Submitted</option>
                <option value="rejected">Rejected</option>
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
            <tbody>
              {filteredRequests.map((request, index) => {
                const statusClasses = classNames({
                  'status': true,
                  'approved': request.statusClass === 'approved',
                  'rejected': request.statusClass === 'rejected',
                  'submitted': request.statusClass === 'submitted',
                });
                const downloadIconClasses = classNames({
                  'downloadIcon': true,
                  'inactive': request.statusClass !== 'approved',
                });
                return (
                  <tr key={index}>
                    <td>{company}</td>
                    <td>{request.company_supervisor}</td>
                    
                   
                   <td>{request.supervisor_phone}</td>
                    
                   <td>{request.date_reported}</td>
                    
                  
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* {selectedRequest && (
            <MoreDetails
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
            />
          )} */}
        </div>
      </div>
      <div className="register_above mobile">
        Scroll horizontally to see more
      </div>
    </section>
  );
};

export default JobReportingTable;