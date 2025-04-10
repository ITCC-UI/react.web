import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
import "./introTable.scss";
import classNames from 'classnames';
import axiosInstance from '../../../API Instances/AxiosIntances';
import MoreDetails from '../../../components/View More/MoreDetailsPlacementChange';
import { Search } from 'lucide-react';
import Filter from "/images/Filter.png";

const PlacementChangeReq = ({ letterRequests: initialLetterRequests, refreshData }) => {
  const [letterRequests, setLetterRequests] = useState(initialLetterRequests || []);
  const [loadingDownloads, setLoadingDownloads] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchPlacementChangeReq = async () => {
    try {
      const registrationResponse = await axiosInstance.get("trainings/registrations/");
      
      // Safely get the first registration ID
      if (registrationResponse.data.length === 0) {
        setLetterRequests([]);
        return;
      }
      
      const registrationId = registrationResponse.data[registrationResponse.data.length - 1].id;
      
      const requestsResponse = await axiosInstance.get(`/trainings/registrations/${registrationId}/change-of-placements/`);
      const requests = requestsResponse.data;
      
      const processedRequests = requests.map(request => ({
        ...request,
        statusClass: getStatusClass(request.approval_status),
      }));

      setLetterRequests(processedRequests);
      
    } catch (error) {
      
      setLetterRequests([]);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'APPROVED':
        return 'approved';
      case 'REJECTED':
        return 'rejected';
      case 'SUBMITTED':
        return 'submitted'
      default:
        return 'submitted';
    }
  };

  useEffect(() => {
    // If no initial letter requests were passed, fetch them
    if (!initialLetterRequests || initialLetterRequests.length === 0) {
      fetchPlacementChangeReq();
    }
  }, [initialLetterRequests, refreshData]);

  const handleViewClick = (request) => {
    setSelectedRequest(request);
  };

  const handleDownloadClick = async (id) => {
    setLoadingDownloads(prevState => ({ ...prevState, [id]: true }));
    try {
      const response = await axiosInstance.get(`/trainings/introduction-letter-requests/${id}/document/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `introduction_letter.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up the link
    } catch (error) {
      
    } finally {
      setLoadingDownloads(prevState => ({ ...prevState, [id]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
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
            <img src={Filter} alt="Filter" className='image-filter' />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pyro"
            >
              <option value="default" disabled hidden>Select a status</option>
              <option value="all"> All </option>
              <option value="approved">Approved</option>
              <option value="submitted">Submitted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        {filteredRequests.length === 0 ? (
          <div className="no-requests">No placement change requests found</div>
        ) : (
          <div className="containerCourse">
            <table>
              <thead>
                <tr>
                  <th>Current Company</th>
                  <th>Submission Date</th>
                  <th>Approval Date</th>
                  <th>Status</th>
                  <th>New Placement</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request, index) => {
                  const statusClasses = classNames({
                    status: true,
                    approved: request.approval_status === 'APPROVED',
                    rejected: request.approval_status === 'REJECTED',
                    submitted: request.approval_status === "SUBMITTED",
                  });
                  return (
                    <tr key={index}>
                      <td>{request.initial_company_name}</td>
                      <td>{formatDate(request.date_created)}</td>
                      <td>{formatDate(request.date_of_approval)}</td>
                      <td>
                        <div className={statusClasses}>
                          {request.approval_status}
                      
                        </div>
                      </td>
                      <td>{request.new_company_name}</td>
                      <td className='down'>
                        <button onClick={() => handleViewClick(request)}>View More</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {selectedRequest && (
              <MoreDetails
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
              />
            )}
          </div>
        )}
      </div>
      <div className="register_above mobile">
        Scroll horizontally to see more
      </div>
    </section>
  );
};

export default PlacementChangeReq;