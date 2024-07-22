import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
import "./introTable.scss";
import classNames from 'classnames';
import IconDownload from "/images/Download.png";
import axiosInstance from '../../../API Instances/AxiosIntances';
import { PulseLoader } from 'react-spinners';

const IntroductionLetterTable = () => {
  const [letterRequests, setLetterRequests] = useState([]);
  const [loadingDownloads, setLoadingDownloads] = useState({});

  const fetchIntroductionLetterRequests = async () => {
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
      console.log("Using Registration ID:", id);

      const requestsResponse = await axiosInstance.get(`/trainings/registrations/${id}/introduction-letter-requests/`);
      const requests = requestsResponse.data;
      console.log("Fetched requests:", requests);
      
      const processedRequests = requests.map(request => ({
        ...request,
        statusClass: request.approval_status === "APPROVED" ? "active" : "inactive",
      }));

      setLetterRequests(processedRequests);
    } catch (error) {
      console.error("Error fetching introduction letter requests:", error);
    }
  };

  useEffect(() => {
    fetchIntroductionLetterRequests();
  }, []);

  const handleViewClick = (request) => {
    console.log('Selected Request:', request);
    // Implement view functionality here
  };

  const handleDownloadClick = async (id) => {
    setLoadingDownloads(prevState => ({ ...prevState, [id]: true }));
    try {
      const response = await axiosInstance.get(`/api/v1/trainings/introduction-letter-requests/${id}/document/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `introduction_letter_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading document:", error);
    } finally {
      setLoadingDownloads(prevState => ({ ...prevState, [id]: false }));
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className='shift'>
      <div className="mainBody">
        <div className="containerCourse">
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Addressed To</th>
                <th>State</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {letterRequests.map((request, index) => {
                const statusClasses = classNames({
                  'status': true,
                  'active': request.statusClass === 'active',
                  'inactive': request.statusClass !== 'active'
                });
                const downloadIconClasses = classNames({
                  'downloadIcon': true,
                  'inactive': request.statusClass !== 'active',
                });
                return (
                  <tr key={index}>
                    <td>{request.company_name}</td>
                    <td>{request.address_to}</td>
                    <td>{request.company_address.state_or_province}</td>
                    <td>
                      <div className={statusClasses}>
                        {request.approval_status}
                      </div>
                    </td>
                    <td>{formatDate(request.date_created)}</td>
                    <td className='down'>
                      <button onClick={() => handleViewClick(request)}>View More</button>
                      {loadingDownloads[request.id] ? (
                        <PulseLoader size={10} />
                      ) : (
                        <img 
                          src={IconDownload} 
                          alt="download" 
                          className={downloadIconClasses}
                          onClick={() => request.statusClass === 'active' && handleDownloadClick(request.id)} 
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default IntroductionLetterTable;
