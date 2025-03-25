import React, { useEffect, useState } from 'react';
// import './MoreDetails.scss';
import { X } from 'lucide-react';
const MoreDetails = ({ request, onClose }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
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
      case 'ACTIVE':
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
          <h2 className='approval'>Form Details</h2>
          <div className="compProfile">
            <div className="cDetails"><b>Form for: {(request.attached_company_branch.company.name)} </b></div>
            <div className="details"> {request.job_reporting ? (`Submitted on: ${formatApprovalDate(request.job_reporting?.date_created)}`) :("")}</div>
          </div>
{/* {console.log(formatApprovalDate(request.job_reporting.date_created))} */}
          <div className='compProfile'>
            <div className="details">Company Supervisor</div>
            <div className="cDetails">{request.company_supervisor}</div>
          </div>

          <div className='compProfile'>
            <div className="details">Start Date</div>
            <div className="cDetails">{request.start_date === null ? "Not yet started" : formatApprovalDate(request.start_date)}</div>
          </div>

          <div className='compProfile'>
            <div className="details">End Date</div>
            <div className="cDetails">{request.end_date === null ? "-----" : formatApprovalDate(request.end_date)}</div>
          </div>

          <div className='compProfile'>
            <div className="details">Status</div>
            <div className={getStatusClass(request.status)}>{request.status}</div>
          </div>
        </div>
      </div>
      <div className="modal-overlay" onClick={handleClose}></div>
    </>
  );
};

export default MoreDetails;