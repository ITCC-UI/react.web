import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
// import MobileSideBar from '../../../components/Sidebar/MobileSideBar';
import "./introTable.scss";
import classNames from 'classnames';
import axiosInstance from '../../../API Instances/AxiosIntances';
import MoreDetails from '../../../components/View More/MoreDetailsAcceptance';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import  Filter  from "/images/Filter.png"




const PlacementAcceptanceTable = () => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [letterType, checkLetterType] = useState([])
  const [loadingDownloads, setLoadingDownloads] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchPlacementLetter = async () => {
    try {
      const registrationResponse = await axiosInstance.get("trainings/registrations/");
      const registrations = registrationResponse.data;
      console.log("Fetched registrations:", registrations);

      if (registrations.length === 0) {
        console.log("No registrations found");
        return;
      }

      // Use the ID of the first registration
      const id = registrations[0].id;
      //console.log("Using Registration ID:", id);

      const requestsResponse = await axiosInstance.get(`/trainings/acceptance-letters/registrations/${id}`);
      const requests = requestsResponse.data;
      console.log("Fetched requests:", requests);


      const processedRequests = requests.map(request => ({
        ...request,
        statusClass: getStatusClass(request.approval_status),
      }));
      const processedRequestsLetter = requests.map(request => ({
        ...request,
        statusClass: getStatusClass(request.letter_type),
      }));
      setLetterRequests(processedRequests);
      checkLetterType(processedRequestsLetter)
    } catch (error) {
      //console.error("Error fetching introduction letter requests:", error);
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
    // console.log('Selected Request:', request);
    setSelectedRequest(request);
  };

  const handleDownloadClick = async (id) => {
    setLoadingDownloads(prevState => ({ ...prevState, [id]: true }));
    // try {
    //   const response = await axiosInstance.get(`/trainings/introduction-letter-requests/${id}/document/`, {
    //     responseType: 'blob',
    //   });
    //   const url = window.URL.createObjectURL(new Blob([response.data]));
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.setAttribute('download', `introduction_letter.pdf`);
    //   document.body.appendChild(link);
    //   link.click();
    // } catch (error) {
    //console.error("Error downloading document:", error);
    // } finally {
    //   setLoadingDownloads(prevState => ({ ...prevState, [id]: false }));
    // }
  };

  // Helper function to format date
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
                <th>Company Name</th>
                <th>Contact Name</th>
                <th>Type of Letter</th>
                <th>Date of Submission</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {
  filteredRequests.map((request, index) => {
    const statusClasses = classNames({
      'status': true,
      'approved': request.statusClass === 'approved',
      'rejected': request.statusClass === 'rejected',
      'submitted': request.statusClass === 'submitted'
    });

    
    const letterClasses = classNames({
      'status': true,
      'undertaken': request.letter_type==='UNDERTAKING',
      'undertaking': request.letter_type === 'UNDERTAKEN', // Assuming letter type directly from `request`
      'acceptance': request.letter_type === 'ACCEPTANCE'
      
    });

    return (
      <tr key={`${index}`}> {/* Use index or a stable unique identifier */}
        <td>{request.company_name}</td>
        <td>{request.company_contact_name}</td>
        <td>
          <div className={letterClasses}>
            {request.letter_type}
          </div>
        </td>
        <td>{formatDate(request.date_created)}</td>

        <td>
          <div className={statusClasses}>
            {request.approval_status}
          </div>
        </td>

        {/* <td className='down'>
          <button onClick={() => handleViewClick(request)}>View More</button>
        </td> */}

        <td className="down">
       <button>
       Actions 

       <div className="this">
        <div className="that" onClick={()=>handleViewClick(request)}>View Request</div>
        <div className="that"><Link to="#" target='_blank'>View Letter</Link></div>
       </div>
       </button>
        </td>
      </tr>
    );
  })
}

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

export default PlacementAcceptanceTable;
