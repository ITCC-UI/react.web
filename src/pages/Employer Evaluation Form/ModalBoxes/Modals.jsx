import React, { useState } from 'react';
import { X, ArrowLeft, Paperclip, AlertCircle } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./Modals.scss";
import { PulseLoader } from 'react-spinners';
import Caution from "/images/Vector (1).png";

// Modified Download Modal with conditional date input
const DownloadModal = ({ onClose, onDownload, onSave, request, isDownloading }) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
  // Define validation schema using Yup
  const validationSchema = Yup.object().shape({
    date_of_completion: Yup.date()
      .required('Date is required')
      .typeError('Please enter a valid date'),
  });

  // Initial form values
  const initialValues = {
    date_of_completion: '',
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    // Call the onSave prop with the date_of_completion
    onSave({ date_of_completion: values.date_of_completion }, request.id);
    // setSubmitting(false);
  };

  // Check if employer_evaluation exists and has a date_of_completion
  const hasDateOfCompletion = request.employer_evaluation?.date_of_completion;

  return (
    <div className="modal-overlay">
      {!hasDateOfCompletion && !isFormSubmitted ? (
        // Show date input form when employer_evaluation is false
        <div className="modal-overlay">
          <div className="modal-form">
          <div className="modal-header">
          
            <button className="close-button the-x" onClick={onClose}>
              <X size={20} color='white' />
            </button>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <h2>Provide Date of Completion</h2>
                <p>Please enter the date of completion before downloading the form.</p>
                
               <div className="companyDetails">
               <div className="formInput">
                  <label htmlFor="date_of_completion">Date of Completion *</label>
                  <Field 
                    type="date" 
                    id="date_of_completion" 
                    name="date_of_completion" 
                    placeholder="mm/dd/yy"
                  />
                  <ErrorMessage name="date_of_completion" component="div" className="error" />
                </div>
               </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="next-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <PulseLoader size={10} color='white' /> : 'Save Date & Download Form'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        </div>
      ) : (
        // Show standard download modal when employer_evaluation exists or form was submitted
        <div className="modal-content">
          <h2>Download Employer Evaluation Form</h2>
          <p>Are you sure you want to download this employer evaluation form?</p>
          <div className="modal-actions">
            <button onClick={() => onDownload(request)} disabled={isDownloading} className='download'>
              {isDownloading ? <PulseLoader size={10} color="white" /> : "Download"}
            </button>
            <button onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Modal with Formik and Yup - Restored date field but made it disabled
const EditModal = ({ onClose, onSave, request }) => {
  // Define validation schema using Yup
  const validationSchema = Yup.object().shape({
    date_of_completion: Yup.date()
      .required('Date is required')
      .typeError('Please enter a valid date'),
    
  });

  // Initial form values from request data
  const initialValues = {
    date_of_completion: request.employer_evaluation?.date_of_completion || '',
    
  };

  // Handle form submission
  const handleSubmit = (values) => {
    
    const formData = {
      ...values,
      
    };
  
    
  
    onSave(formData,request.id);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-form">
        <div className="modal-header">
          <button className="back-button" onClick={onClose}>
            <ArrowLeft size={20} />
          </button>
          <h2>Edit Date of completion</h2>
          <button className="close-button the-x" onClick={onClose}>
            <X size={20} color='white' />
          </button>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form encType='multipart/form-data'>
              <h2 className="company-name">{values.companyName}</h2>
              
              <div className="companyDetails">
                {/* Always show the date field but disabled */}
                <div className="formInput">
                  <label htmlFor="date_of_completion">Date of Completion</label>
                  <Field 
                    type="date" 
                    id="date_of_completion" 
                    name="date_of_completion" 
                    placeholder="dd/mm/yy"
                    disabled={false}
                    
                  />
                  {/* <small className="input-helper-text">Date cannot be modified</small> */}
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


// Upload Modal

const UploadModal = ({ onClose, onSave, request }) => {
  // Define validation schema using Yup
  const validationSchema = Yup.object().shape({
    // We don't need to validate date_of_completion since it's disabled
    formFile : Yup.mixed()
      .required('File is required')
      .test('fileSize', 'File size is too large', (value) => {
        return value && value.size <= 5 * 1024 * 1024; // 5MB limit
      })
      .test('fileType', 'Unsupported file format', (value) => {
        return value && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
      }),
  });

  // Initial form values from request data
  const initialValues = {
    date_of_completion: request.employer_evaluation?.date_of_completion || '',
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
    
    const formData = {
      ...values,
      formFile: formFile,
    };
  
    
  
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
          {({ setFieldValue, values, isSubmitting }) => (
            <Form encType='multipart/form-data'>
              <h2 className="company-name">{values.companyName}</h2>
              
              <div className="companyDetails">
                {/* Always show the date field but disabled */}
                <div className="formInput">
                  <label htmlFor="date_of_completion">Date of Completion</label>
                  <Field 
                    type="date" 
                    id="date_of_completion" 
                    name="date_of_completion" 
                    placeholder="dd/mm/yy"
                    disabled={true}
                    className="disable"
                  />
                  {/* <small className="input-helper-text">Date cannot be modified</small> */}
                </div>
                
                {request.employer_evaluation && (
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
                        {request.employer_evaluation?.form ? "Kindly re-upload your form" : " "}
                      </div>
                      {fileError && <div className="error">{fileError}</div>}
                      <ErrorMessage name="formFile" component="div" className="error" />
                    </div>
                  </div>
                )}
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

// Delete Modal - unchanged
const DeleteModal = ({ onClose, onConfirm, request, isDeleting }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Confirm Deletion</h2>

      <div className="alert-icon">
        <AlertCircle size={90} color='red' />
      </div>
      <p>Are you sure you want to delete "{request.attached_company_name}" form? <br /> This action cannot be undone.</p>

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

export { DownloadModal, EditModal, DeleteModal, UploadModal };