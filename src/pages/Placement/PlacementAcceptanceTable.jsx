import React, { useState, useEffect, useRef } from 'react';
import "../../../components/Table/table.scss";
import "./introTable.scss";
import classNames from 'classnames';
import axiosInstance from '../../../API Instances/AxiosIntances';
import MoreDetails from '../../../components/View More/MoreDetailsAcceptance';
import { Search } from 'lucide-react';
import Filter from "/images/Filter.png";
import { Link } from 'react-router-dom';

const PlacementAcceptanceTable = () => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [letterType, checkLetterType] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const fetchPlacementLetter = async () => {
    try {
      const registrationResponse = await axiosInstance.get("trainings/registrations/");
      const registrations = registrationResponse.data;

      if (registrations.length === 0) return;

      const id = registrations[0].id;
      const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/acceptance-letters`);
      const requests = requestsResponse.data;

      const processedRequests = requests.map(request => ({
        ...request,
        statusClass: getStatusClass(request.approval_status),
      }));

      const processedRequestsLetter = requests.map(request => ({
        ...request,
        statusClass: getStatusClass(request.letter_type),
      }));

      setLetterRequests(processedRequests);
      checkLetterType(processedRequestsLetter);
    } catch (error) {
      
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'approved';
      case 'SUBMITTED':
        return 'submitted';
      case 'UNDERTAKING':
        return 'undertaking';
      case 'ACCEPTANCE':
        return 'acceptance';
      case 'DISCONTINED':
      default:
        return 'rejected';
    }
  };

  useEffect(() => {
    fetchPlacementLetter();
  }, []);

  const handleViewClick = (request) => {
    setSelectedRequest(request);
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

  const toggleDropdown = (index) => {
    setOpenDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="shift placement_table">
      <div className="mainBody">
      <div className="search-bar">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={15}
              />
              <input
                type="text"
                placeholder="Search Here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter">
              <img src={Filter} alt="Filter" className="image-filter" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pyro"
              >
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
                <th>Contact Name</th>
                <th>Type of Letter</th>
                <th>Date of Submission</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => {
                const statusClasses = classNames({
                  status: true,
                  approved: request.statusClass === 'approved',
                  rejected: request.statusClass === 'rejected',
                  submitted: request.statusClass === 'submitted',
                });

                const letterClasses = classNames({
                  status: true,
                  undertaking: request.letter_type === 'UNDERTAKING',
                  acceptance: request.letter_type === 'ACCEPTANCE',
                });

                return (
                  <tr key={index}>
                    <td>{request.company_name}</td>
                    <td>{request.company_contact_name || "--------"}</td>
                    <td>
                      <div className={letterClasses}>{request.letter_type}</div>
                    </td>
                    <td>{formatDate(request.date_created)}</td>
                    <td>
                      <div className={statusClasses}>{request.approval_status}</div>
                    </td>

                    <td className="down">
                      <button onClick={() => toggleDropdown(index)}>Actions</button>

                      {openDropdownIndex === index && (
                        <div className="this">
                          <div
                            className="that"
                            onClick={() => handleViewClick(request)}
                          >
                            View Request
                          </div>

                          <Link to={request.letter} target="_blank" className='that'>
                            View Letter
                          </Link>
                        </div>
                      )}
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

      <div className="register_above mobile">Scroll horizontally to see more</div>
    </section>
  );
};

export default PlacementAcceptanceTable;
