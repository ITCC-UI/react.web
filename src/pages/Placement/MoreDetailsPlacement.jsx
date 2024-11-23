import React, { useEffect, useState } from 'react';

import { X } from 'lucide-react';
const MoreDetails = ({ request, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [loadingDownloads, setLoadingDownloads] = useState({});

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
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
    } catch (error) {
      
    } finally {
      setLoadingDownloads(prevState => ({ ...prevState, [id]: false }));
    }
  };


  const getApprovalNote = (note) => {
    return !note ? "N/A" : note;
  };

  const formatApprovalDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = date.getDate();
    const daySuffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    const options = { month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return `${day}${daySuffix} ${formattedDate.replace(',', '')}`;
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'APPROVED':
        return 'status approved';
      case 'REJECTED':
        return 'status rejected';
      case 'SUBMITTED':
      default:
        return 'status submitted';
    }
  };



  return (
    <>
    
      <div className={`more-details-modal ${isActive ? 'active' : ''}`}>
        <div onClick={handleClose} className='closeView'>
          <X size={24} />
        </div>
        <div className="more-details-content">
          <h2 className='approval'>More Details</h2>
          <div className="compProfile">
            <div className='details'>Approved Company</div>
            <div className="cDetails">{(request.approved_company_name ===null? "Placement not yet assigned": request.approved_company_name )}</div>
          </div>



          <div className='compProfile'>
            <div className="details">Date of Request</div>
            <div className="cDetails">{formatApprovalDate(request.date_created)}</div>
          </div>


          <div className='compProfile'>
            <div className="details">Date of Approval</div>
            <div className="cDetails">{request.date_of_approval===null? "Pending Approval ": formatApprovalDate(request.date_of_approval)}</div>
          </div>

          <div className='compProfile'>
            <div className="details">Approval Status</div>
            <div className={getStatusClass(request.approval_status)}>{request.approval_status}</div>
          </div>

          <div className="compProfile">
            <div className="details">Approver's comment</div>
            <div className="cDetails">{getApprovalNote(request.approval_note)}</div>
          </div>

          {/* {request.date_of_approval && (
            <div className="compProfile">
              <div className="details">Approval Date</div>
              <div className="cDetails">{formatApprovalDate(request.date_of_approval)}</div>
            </div>
          )} */}

          
        </div>
      </div>
      <div className="modal-overlay" onClick={handleClose}></div>
    </>
  );
};

export default MoreDetails;