import React, { useEffect, useState } from 'react';
import './MoreDetails.scss'; // Import relevant styles

const MoreDetails = ({ request, onClose }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Activate the sliding animation after the component mounts
    setIsActive(true);
  }, []);

  const handleClose = () => {
    // Deactivate the sliding animation before closing
    setIsActive(false);
    setTimeout(onClose, 300); // Match the duration of the CSS transition
  };

  return (
    <>
      <div className={`more-details-modal ${isActive ? 'active' : ''}`}>
        <div className="more-details-content">
          <h2>More Details</h2>
          <p><strong>Company Name:</strong> {request.company_name}</p>
          <p><strong>Addressed To:</strong> {request.address_to}</p>
          <p><strong>State:</strong> {request.company_address.state_or_province}</p>
          <p><strong>Status:</strong> {request.approval_status}</p>
          <p><strong>Date Created:</strong> {new Date(request.date_created).toLocaleString()}</p>
          {/* Add more fields as needed */}
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
      <div className="modal-overlay" onClick={handleClose}></div>
    </>
  );
};

export default MoreDetails;
