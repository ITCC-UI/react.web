import React, { useEffect, useState } from 'react';
import './MoreDetails.scss';
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
      case 'ACCEPTANCE':
        return 'status acceptance';
      case 'UNDERTAKEN':
        return 'status undertaking';
      case 'SUBMITTED':
        return 'status submitted';
      case 'null':
        default:
        return 'status ';
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
            <div className='details'>Company Name</div>
            <div className="cDetails">{(request.company_name ===null? "Placement not yet assigned": request.company_name )}</div>
          </div>

          <div className="compProfile">
            <div className="details"> Company Address</div>
            <div className="cDetails">{request.company_address.street} {request.company_address.state_or_province_name}, {request.company_address.city}, {request.company_address.state_or_province.country}</div>
          </div>


<div className="compProfile">
  <div className="details"> Contact Email</div>
  <div className="cDetails">
    {request.company_contact_email===""?"Not provided": request.company_contact_email}
  </div>
</div>

<div className="compProfile">
  <div className="details"> Contact Phone Number</div>
  <div className="cDetails">
    {request.company_contact_phone===""?"Not provided": requestAnimationFrame.company_contact_phone}
  </div>
</div>

<div className="compProfile">
  <div className="details">Type of Letter</div>
  <div className={getStatusClass(request.letter_type)}>
    {request.letter_type}
  </div>
</div>

          <div className='compProfile'>
            <div className="details">Date of Submission</div>
            <div className="cDetails">{formatApprovalDate(request.date_created)}</div>
          </div>



          <div className='compProfile'>
            <div className="details">Status</div>
            <div className={getStatusClass(request.approval_status)}>{request.approval_status}</div>
          </div>

          <div className="compProfile">
            <div className="details">Approver's comment</div>
            <div className="cDetails">{getApprovalNote(request.approval_note)}</div>
          </div>

          {request.date_of_approval && (
            <div className="compProfile">
              <div className="details">Approval Date</div>
              <div className="cDetails">{formatApprovalDate(request.date_of_approval)}</div>
            </div>
          )}
          
        </div>

      </div>
      <div className="modal-overlay" onClick={handleClose}></div>
    </>
  );
};

export default MoreDetails;