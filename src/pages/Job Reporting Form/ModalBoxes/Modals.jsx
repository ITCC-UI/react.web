import React, { useState, useEffect } from 'react';
// import { button } from '@mui/material';
import { X, ArrowLeft, Paperclip, AlertCircle } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./Modals.scss";
import { PulseLoader } from 'react-spinners';
import Caution from "/images/Vector (1).png"
import axiosInstance from '../../../../API Instances/AxiosIntances';





// Download Modal
const DownloadModal = ({ onClose, onDownload, request, isDownloading }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Download Job Reporting Form</h2>
      <p>Are you sure you want to download this job reporting form?</p>
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
const EditModal = ({ onClose, onSave, request, isSubmitting }) => {

  
  const [addressOptions, setAdressOptions] = useState([])

  const type = "TITLE"
  const fetchAddressee = () => {
    axiosInstance.get(`/option-types/${type}/options`)
      .then(titles => {
        const addressee = titles.data.map(title => title.name)

        setAdressOptions(addressee)

      })

      .catch(error => {

        
        
      })
  }

  useEffect(() => {
    fetchAddressee()
  }, [])
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
    supervisor_email: Yup.string()
      .email('Invalid email format')
      .required('Supervisor email is required'),
  company_email: Yup.string()
      .email('Invalid email format')
      .required('Company email is required'),
    nextOfKinPhone: Yup.string()
      .matches(/^[0-9+\s-]*$/, 'Invalid phone number format'),
      formFile: Yup.mixed()
      .required('File is required')
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
    supervisor_email: request?.job_reporting?.supervisor_email || '',
    company_email: request?.job_reporting?.company_email || '',

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
          {({ errors, touched, setFieldValue, values, isSubmitting = { isSubmitting } }) => (
            <Form encType='multipart/form-data'>
              <h2 className="company-name">{values.companyName}</h2>

              <div className="companyDetails">
                <div className="formInput">
                  <label htmlFor="supervisorName">Supervisor's Name *</label>
                  <Field
                    type="text"
                    id="supervisorName"
                    name="supervisorName"
                    placeholder="e.g  John Doe"
                    className={errors.supervisorName && touched.supervisorName ? "error-input" : ""}
                  />
                  <ErrorMessage name="supervisorName" component="div" className="error" />
                </div>

                <div className="formInput">
                  <label htmlFor="supervisorTitle">Supervisor's Title *</label>


                  <Field as="select" name="supervisorTitle" className="supervisorTitle">
                    <option value="">Select Title/Position</option>
                    {addressOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="supervisorTitle" component="div" className="error" />
                </div>

                <div className="formInput">
                  <label htmlFor="supervisorPhone">Supervisor's Phone Number *</label>
                  <Field
                    type="text"
                    id="supervisorPhone"
                    name="supervisorPhone"
                    placeholder="eg 080xxxxxxxxx"
                    className={errors.supervisorPhone && touched.supervisorPhone ? "error-input" : ""}
                  />
                  <ErrorMessage name="supervisorPhone" component="div" className="error" />
                </div>

                <div className="formInput">
                  <label htmlFor="dateResumed">Date Reported For Training *</label>
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
                  <label htmlFor="supervisor_email">Supervisor's Email *</label>
                  <Field
                    type="text"
                    id="supervisor_email"
                    name="supervisor_email"
                    placeholder="mail@google.com"
                    className={errors.supervisor_email && touched.supervisor_email ? "error-input" : ""}
                  />
                  <ErrorMessage name="supervisor_email" component="div" className="error" />
                </div>


                <div className="formInput">
                  <label htmlFor="company_email">Company's Email *</label>
                  <Field
                    type="text"
                    id="company_email"
                    name="company_email"
                    placeholder="companymail@google.com"
                    className={errors.company_email && touched.company_email ? "error-input" : ""}
                  />
                  <ErrorMessage name="company_email" component="div" className="error" />
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
                      {request.job_reporting?.form ? "Kindly re-upload your form" : " "}
                    </div>
                    {fileError && <div className="error">{fileError}</div>}
                  </div>
                  <ErrorMessage name="formFile" component="div" className="error" />
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
