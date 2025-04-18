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

  const downloadStudentFIle = () => {
    try {
      // Get the PDF URL from your backend
      const pdfUrl = request?.employer_evaluation?.form;
      // Open the PDF in a new tab
      window.open(pdfUrl, '_blank');

      
    } catch (error) {
      /* empty */
    } finally {
      // setIsLoading(false);
    }
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
            <div className='details'>Company Name</div>
            <div className="cDetails">{(request.attached_company_branch?.company.name)}</div>
           
           
          </div>
          <hr />
<br />          



<div className="compProfile">
  <div className="details">
    Company Information
    
   
  </div>
</div>

<div className="compProfile">
  <div className="detailsHeading">
    Name
  </div>
  <div className="cDetails">
    {request.attached_company_name}
  </div>
</div>

{request.attached_company_branch?.branch_name? (<div className="compProfile">
  <div className="detailsHeading">
    Address
  </div>
  <div className="cDetails">
    {request.attached_company_branch?.address?.city}
  </div>
</div>):" "}
<hr />
<br />

{request.job_reporting ? 
(<><div className="compProfile">
  <div className="details">
    Supervisor Information
  </div>
</div>
         <div className='compProfile'>
            <div className="details">Name</div>
            <div className="cDetails">{request.job_reporting.company_supervisor}</div>
          </div>


          <div className='compProfile'>
            <div className="details">Phone Number</div>
            <div className="cDetails">{request.job_reporting.supervisor_phone}</div>
          </div>
       
{request.job_reporting.supervisor_email?
 (<div className="compProfile">
  <div className="details"> Email</div>
  <div className="cDetails"> {request.job_reporting.supervisor_email}</div>
</div>):" "}</>)
: " "}

      
          <div className='compProfile'>
            <div className="details">Uploaded Document</div>
            {request.employer_evaluation?.form ? (<button onClick={()=>downloadStudentFIle()} className='btn-primary'>Download</button>):" "} 
          </div>
      

          
        </div>
      </div>
      <div className="modal-overlay" onClick={handleClose}></div>
    </>
  );
};

export default MoreDetails;