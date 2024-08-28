import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
// import MobileSideBar from '../../../components/Sidebar/MobileSideBar';
import "./introTable.scss";
import classNames from 'classnames';
import IconDownload from "/images/Download.png";
import axiosInstance from '../../../API Instances/AxiosIntances';
import { RingLoader } from 'react-spinners';
import MoreDetails from '../../../components/View More/MoreDetails';




const PlacementAcceptanceTable = () => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchPlacementLetter = async () => {
    try {
      const registrationResponse = await axiosInstance.get("trainings/registrations/");
      const registrations = registrationResponse.data;
      console.log("Fetched registrations:", registrations);

      if (registrations.length === 0) {
        //console.log("No registrations found");
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

      setLetterRequests(processedRequests);
    } catch (error) {
      //console.error("Error fetching introduction letter requests:", error);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'ACTIVE':
        return 'approved';
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

  return (
    <section className='shift placement_table'>
      
      <div className="mainBody">
        <div className="containerCourse">
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Company Supervisor</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {letterRequests.map((request, index) => {
                const statusClasses = classNames({
                  'status': true,
                  'approved': request.statusClass === 'approved',
                  'rejected': request.statusClass === 'rejected',
                 
                });
                const downloadIconClasses = classNames({
                  'downloadIcon': true,
                  'inactive': request.statusClass !== 'approved',
                });
                return (
                  <tr key={index}>
                    <td>{request.company_name}</td>
                    <td>{request.company_supervisor}</td>
                    <td>{formatDate(request.date_created)}</td>
                    <td>{formatDate(request.date_created)}</td>
                    
                    <td>
                      <div className={statusClasses}>
                        {request.approval_status}
                      </div>
                    </td>
                    <td> {loadingDownloads[request.id] ? (
                        <RingLoader size={20} color='blue' />
                      ) : (
                        <img 
                          src={IconDownload} 
                          alt="download" 
                          className={downloadIconClasses}
                          onClick={() => request.statusClass === 'approved' && handleDownloadClick(request.id)} 
                        />
                      )}</td>
                
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

export default PlacementAcceptanceTable;
