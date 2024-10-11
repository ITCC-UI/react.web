import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
import "./introTable.scss";
import classNames from 'classnames';
import IconDownload from "/images/Download.png";
import axiosInstance from '../../../API Instances/AxiosIntances';
import MoreDetails from './MoreDetailsPlacement';
import { Search } from 'lucide-react';
import Filter from "/images/Filter.png"

const PlacementRequest = () => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchIntroductionLetterRequests = async () => {
    try {
      const registrationResponse = await axiosInstance.get("trainings/registrations/");
      const registrations = registrationResponse.data;

      if (registrations.length === 0) {
        return;
      }

      const id = registrations[0].id;

      const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/placement-requests-view`);
      const requests = requestsResponse.data;
      
      const processedRequests = requests.map(request => ({
        ...request,
        statusClass: getStatusClass(request.approval_status),
      }));

      setLetterRequests(processedRequests);
    } catch (error) {
      console.error("Error fetching introduction letter requests:", error);
    }
  };

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

  useEffect(() => {
    fetchIntroductionLetterRequests();
  }, []);

  const handleViewClick = (request) => {
    console.log('Selected Request:', request);
    setSelectedRequest(request);
  };

  const handleDownloadClick = async (id) => {
    setLoadingDownloads(prevState => ({ ...prevState, [id]: true }));
    try {
      const response = await axiosInstance.get(`/trainings/placement-requests/${id}/document/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `placement.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading document:", error);
    } finally {
      setLoadingDownloads(prevState => ({ ...prevState, [id]: false }));
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
        <div className="containerCourse">
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
          <table>
            <thead>
              <tr>
                <th>Date of Request</th>
                <th>Date of Approval</th>
                <th>Status</th>
                <th>Approved Company</th>
                <th>Action</th>
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
                    <td>{formatDate(request.date_created)}</td>
                    <td>{(formatDate(request.date_of_approval)==="Invalid Date"?"-----":formatDate(request.date_of_approval))}</td>
                    <td>
                      <div className={statusClasses}>
                        {request.approval_status}
                      </div>
                    </td>
                    <td>{(request.approved_company_name ===null? "-----": request.approved_company_name )}</td>
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
      </div>
      <div className="register_above mobile">
        Scroll horizontally to see more
      </div>
    </section>
  );
};

export default PlacementRequest;