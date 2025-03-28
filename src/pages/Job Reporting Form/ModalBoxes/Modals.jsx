import React, { useState } from 'react';
// import { button } from '@mui/material';
import { X, ArrowLeft, Paperclip, AlertCircle } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./Modals.scss";
import { PulseLoader } from 'react-spinners';
import Caution from "/images/Vector (1).png"

// Download Modal
const DownloadModal = ({ onClose, onDownload, request, isDownloading }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Download Report</h2>
      <p>Are you sure you want to download this report?</p>
      <div className="modal-actions">
        <button onClick={() => onDownload(request)} disabled={isDownloading} className='download'>
          {isDownloading ? <PulseLoader size={10} color="white" /> : "Download"}
        </button>
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
);

// Edit Modal with Formik and Yup
const EditModal = ({ onClose, onSave, request }) => {
  // Define validation schema using Yup
  const validationSchema = Yup.object().shape({
    supervisorName: Yup.string()
      .required('Supervisor name is required'),
    supervisorTitle: Yup.string()
      .required('Supervisor title is required'),
    supervisorPhone: Yup.string()
      .required('Supervisor phone is required')
      .matches(/^[0-9+\s-]+$/, 'Invalid phone number format'),
    dateResumed: Yup.date()
      .required('Date is required'),
    mailingAddress: Yup.string()
      .email('Invalid email format'),
    residential_address: Yup.string()
      .required('Residential address required'),
    nextOfKin: Yup.string(),
    nextOfKinAddress: Yup.string(),
    nextOfKinPhone: Yup.string()
      .matches(/^[0-9+\s-]*$/, 'Invalid phone number format'),
    // formFile validation is handled separately
  });

  // Initial form values from request data
  const initialValues = {
    companyName: request?.attached_company_name || '',
    supervisorName: request?.job_reporting?.company_supervisor || '',
    supervisorTitle: request?.job_reporting?.supervisor_title || '',
    supervisorPhone: request?.job_reporting?.supervisor_phone || '',
    dateResumed: request?.job_reporting?.date_reported || '',
    mailingAddress: request?.job_reporting?.mailing_address || '',
    residential_address: request?.job_reporting?.residential_address || '',
    formFile: null // Initialize as null to represent the form itself, not a URL
  };

  // Handle file change separately since Formik doesn't handle file inputs well
  const [formFile, setFormFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFormFile(file);
      setFieldValue('formFile', file);
      setFileError('');
    }
  };

  // Handle form submission
  const handleSubmit = (values) => {
    console.log("Form values:", values);
    
    const formData = {
      ...values,
      formFile: formFile,
    };
  
    console.log("Final payload:", formData);
  
    onSave(formData, request.id);
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-form">
        <div className="modal-header">
          <button className="back-button" onClick={onClose}>
            <ArrowLeft size={20} />
          </button>
          <button className="close-button the-x" onClick={onClose}>
            <X size={20} color='white' />
          </button>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
            <Form encType='multipart/form-data'>
              <h2 className="company-name">{values.companyName}</h2>
              
           <div className="companyDetails">
           <div className="formInput">
                <label htmlFor="supervisorName">Supervisor's Name *</label>
                <Field 
                  type="text" 
                  id="supervisorName" 
                  name="supervisorName" 
                  placeholder="eg Engr Opadare"
                  className={errors.supervisorName && touched.supervisorName ? "error-input" : ""}
                />
                <ErrorMessage name="supervisorName" component="div" className="error" />
              </div>
              
              <div className="formInput">
                <label htmlFor="supervisorTitle">Supervisor's Title *</label>
                <Field 
                  type="text" 
                  id="supervisorTitle" 
                  name="supervisorTitle" 
                  placeholder="eg Manager"
                  className={errors.supervisorTitle && touched.supervisorTitle ? "error-input" : ""}
                />
                <ErrorMessage name="supervisorTitle" component="div" className="error" />
              </div>
              
              <div className="formInput">
                <label htmlFor="supervisorPhone">Supervisor's Phone Number *</label>
                <Field 
                  type="text" 
                  id="supervisorPhone" 
                  name="supervisorPhone" 
                  placeholder="eg 08066641912"
                  className={errors.supervisorPhone && touched.supervisorPhone ? "error-input" : ""}
                />
                <ErrorMessage name="supervisorPhone" component="div" className="error" />
              </div>
              
              <div className="formInput">
                <label htmlFor="dateResumed">Date Resumed For Training *</label>
                <Field 
                  type="date" 
                  id="dateResumed" 
                  name="dateResumed" 
                  placeholder="dd/mm/yy"
                  // className={errors.dateResumed && touched.dateResumed ? "error-input" : ""}
                />
                <ErrorMessage name="dateResumed" component="div" className="error" />
              </div>
           
              
              
              
              <div className="formInput">
                <label htmlFor="residential_address">Residential Address *</label>
                <Field 
                  type="text" 
                  id="residential_address" 
                  name="residential_address" 
                  placeholder="Enter your address"
                  className={errors.residential_address && touched.residential_address ? "error-input" : ""}
                />
                <ErrorMessage name="residential_address" component="div" className="error" />
              </div>
              
         
              
              <div className="formInput">
                <label>Upload your Form</label>
                <div className="file-upload">
                  <input 
                    type="file" 
                    id="formFile" 
                    name="formFile" 
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    className="file-input"
                  />
                  <div className={`file-upload-button ${fileError ? 'error-input' : ''}`}>
                    <Paperclip size={18} />
                    <span>{formFile ? formFile.name : "Upload your file"}</span>
                  
                  </div>
                  <div className="error">
                  {request.job_reporting.form ? "Kindly re-upload your form" : " "}
                  </div>
                  {fileError && <div className="error">{fileError}</div>}
                </div>
              </div>
              </div>
              <div className="form-actions">
                <button 
                  type="submit" 
                  variant="contained" 
                  className="next-button"
                  disabled={isSubmitting}
                >
                {isSubmitting ? <PulseLoader size={10} color='white' /> : 'Save'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Delete Modal
const DeleteModal = ({ onClose, onConfirm, request, isDeleting }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Confirm Deletion</h2>

      <div className="alert-icon">
        <AlertCircle size={90} color='red' />
        </div>
      <p>Are you sure you want to delete "{request.attached_company_name}” form? <br /> This action cannot be undone.</p>

      <div className="warnings">
        <img src={Caution} alt="" />
      <div className="warner">
      <h2> Warning</h2>

<p>By deleting this Form, you agree to lose access to it permanently!</p>
      </div>
      </div>
      <div className="modal-actions">
        <button onClick={() => onConfirm(request.id)} className="btn-danger" disabled={isDeleting}>
          {isDeleting ? <PulseLoader size={10} color="white" /> : "Delete"}
          </button>
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
);

export { DownloadModal, EditModal, DeleteModal };
