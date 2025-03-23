import React, { useState } from 'react';
import { Button } from '@mui/material';
import { X, ArrowLeft, Paperclip, AlertCircle } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./Modals.scss";
import { PulseLoader } from 'react-spinners';

// Download Modal
const DownloadModal = ({ onClose, onDownload, request }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Download Report</h2>
      <p>Are you sure you want to download this report?</p>
      <div className="modal-actions">
        <Button onClick={() => onDownload(request)}>Download</Button>
        <Button onClick={onClose} className="btn-secondary">Cancel</Button>
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
    formFile: null
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
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
            <Form>
              <h2 className="company-name">{values.companyName}</h2>
              
              <div className="form-group">
                <label htmlFor="supervisorName">Supervisor's Name *</label>
                <Field 
                  type="text" 
                  id="supervisorName" 
                  name="supervisorName" 
                  placeholder="eg Engr Opadare"
                  className={errors.supervisorName && touched.supervisorName ? "error-input" : ""}
                />
                <ErrorMessage name="supervisorName" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="supervisorTitle">Supervisor's Title *</label>
                <Field 
                  type="text" 
                  id="supervisorTitle" 
                  name="supervisorTitle" 
                  placeholder="eg Manager"
                  className={errors.supervisorTitle && touched.supervisorTitle ? "error-input" : ""}
                />
                <ErrorMessage name="supervisorTitle" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="supervisorPhone">Supervisor's Phone Number *</label>
                <Field 
                  type="text" 
                  id="supervisorPhone" 
                  name="supervisorPhone" 
                  placeholder="eg 08066641912"
                  className={errors.supervisorPhone && touched.supervisorPhone ? "error-input" : ""}
                />
                <ErrorMessage name="supervisorPhone" component="div" className="error-message" />
              </div>
              
              <div className="form-group">
                <label htmlFor="dateResumed">Date Resumed For Training *</label>
                <Field 
                  type="date" 
                  id="dateResumed" 
                  name="dateResumed" 
                  placeholder="dd/mm/yy"
                  // className={errors.dateResumed && touched.dateResumed ? "error-input" : ""}
                />
                <ErrorMessage name="dateResumed" component="div" className="error-message" />
              </div>
              
              
              
              <div className="form-group">
                <label htmlFor="residential_address">Residential Address *</label>
                <Field 
                  type="text" 
                  id="residential_address" 
                  name="residential_address" 
                  placeholder="Enter your address"
                  className={errors.residential_address && touched.residential_address ? "error-input" : ""}
                />
                <ErrorMessage name="residential_address" component="div" className="error-message" />
              </div>
              
         
              
              <div className="form-group">
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
                  {fileError && <div className="error-message">{fileError}</div>}
                </div>
              </div>
              
              <div className="form-actions">
                <Button 
                  type="submit" 
                  variant="contained" 
                  className="next-button"
                  disabled={isSubmitting}
                >
                {isSubmitting ? <PulseLoader size={15} color='white' /> : 'Save'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Delete Modal
const DeleteModal = ({ onClose, onConfirm, request, isSubmitting }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this report from {request.attached_company_name}?</p>
      <div className="modal-actions">
        <Button onClick={() => onConfirm(request.id)} className="btn-danger">
          {isSubmitting ? <PulseLoader size={15} color="white" /> : "Delete"}
          </Button>
        <Button onClick={onClose} className="btn-secondary">Cancel</Button>
      </div>
    </div>
  </div>
);

export { DownloadModal, EditModal, DeleteModal };
