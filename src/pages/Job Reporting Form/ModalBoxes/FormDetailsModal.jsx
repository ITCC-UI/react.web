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

 


   const downloadStudentFIle = () => {
      try {
        // Get the PDF URL from your backend
        const pdfUrl = request?.job_reporting?.form;

        // Open the PDF in a new tab
        window.open(pdfUrl, '_blank');
  
        
      } catch (error) {
        console.error('Error downloading PDF:', error);
      } finally {
        // setIsLoading(false);
      }
    };

  const formatApprovalDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = date.getDate();
    const daySuffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    const options = { month: 'long', year: 'numeric'};
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
            {/* <div className='details'>Company Name</div> */}
            <div className="cDetails">{(request.attached_company_branch.company.name)}</div>
            <div className="details">Submission Date: {request.job_reporting===null?"Not yet submitted": formatApprovalDate(request.job_reporting.date_created)} </div> 
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

{!request.attached_company_branch.branch_name? (<div className="compProfile">
  <div className="detailsHeading">
    Address
  </div>
  <div className="cDetails">
    {request.attached_company_name.address}
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

<hr/>
<br />

<div className="compProfile">
<div className="details"> Uploaded Document</div>   
   
{request.job_reporting?.form ? (<button onClick={()=>downloadStudentFIle()} className='btn-primary'>Download</button>):" "}
        </div>
          
        </div>
      </div>
      <div className="modal-overlay" onClick={handleClose}></div>
    </>
  );
};

export default MoreDetails;