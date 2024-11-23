import React, { useEffect, useState } from 'react';
import './ChangeMoreDetails.scss';
import { X } from 'lucide-react';
import { Formik, Form } from 'formik';
import * as Yup from "yup"
import ChangePlacementForm from './NewForm';

const MoreDetails = ({ request, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const[changeActive, setChange] =useState(false)
  const [letterChoice, setLetterChoice] = useState(false)

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
      case 'INACTIVE':
        return 'status rejected';
      case 'SUBMITTED':
      default:
        return 'status submitted';
    }
  };



  return (
    <>
    <div className="modal-overlay" onClick={handleClose}></div>
      <div className={`more-details-modal designed ${isActive ? 'active' : ''}`}>
        <div onClick={handleClose} className='closeView'>
          <X size={24} />
        </div>
        <div className="more-details-content">
          <h2 className='approval change'>Current Placement</h2>
          {/* <div className="placementHeader">Current Placement</div> */}
          <div className="compProfile">
            <div className='details'>Company Name</div>
            <div className="cDetails">{(request.company_name !==null? "Pending Approval": request.company_name )}</div>
          </div>



      




          <div className='compProfile'>
            <div className="details"> Status</div>
            <div className={getStatusClass(request.approval_status)}>{request.approval_status}</div>
          </div>

          <div className="compProfile">
            <div className="details">Approver's comment</div>
            <div className="cDetails">{getApprovalNote(request.approval_note)}</div>
          </div>

          {request.date_of_approval && (
            <div className="compProfile">
              <div className="details"> Date of Approval</div>
              <div className="cDetails">{formatApprovalDate(request.date_of_approval)}</div>
            </div>
          )}
          
        </div>


        {/* <button className='changePlacement' onClick={handleChange}> Change Placement</button> */}
      </div>
      

    {changeActive  &&(
      <ChangePlacementForm/>
    )

    }
    </>
  );
};

export default MoreDetails;