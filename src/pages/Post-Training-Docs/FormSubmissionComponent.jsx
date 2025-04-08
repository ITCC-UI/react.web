import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FiPaperclip } from 'react-icons/fi';
import { TailSpin } from 'react-loader-spinner';
import axiosInstance from '../../../API Instances/AxiosIntances';
import './FormSubmission.scss';
import { PulseLoader } from 'react-spinners';
import FullScreenFailureMessage from '../Placement/Failed/FullScreenFailureMessage';
import FullScreenSuccessMessage from '../Placement/Successful/Successful';

const FormSubmissionComponent = ({ title, fileType, documentType, fileName, updateAPI }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [iD, setProgramID] = useState(null);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const [hasExistingFile, setHasExistingFile] = useState(false); // ✅ Tracks existing file

  const fileInputRef = useRef(null);

  // Validation schema
  const FormSchema = Yup.object().shape({
    document: Yup.mixed()
      .required('A file is required')
      .test('fileType', 'Invalid file format', (value) => {
        if (!value) return false;
        return ['application/pdf', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
          'application/vnd.ms-powerpoint'].includes(value.type);
      }),
    comment: Yup.string(),
    document_type: Yup.string().required('Document type is required')
  });

  // Fetch program ID
  useEffect(() => {
    const fetchProgrammeId = async () => {
      try {
        const response = await axiosInstance.get("trainings/registrations/");
        if (response.data?.length > 0) {
          setProgramID(response.data[0].id);
        }
      } catch (error) {
       
      }
    };
    fetchProgrammeId();
  }, []);

  // Fetch existing training documents
  useEffect(() => {
    const fetchTrainingTypes = async () => {
      if (!iD) return;
      try {
        const response = await axiosInstance.get(`trainings/registrations/${iD}/documents/by-types`);
        const existingFile = response.data[0]?.documents|| "";
       
       if(existingFile!=0){
        const fileName = existingFile[0].document.split("/").pop();
     
        
        // Update state with fetched file name
        setHasExistingFile(true);
       
       }

       else{
      
       }
      }
      
      catch (error) {
      
      }
    };
    fetchTrainingTypes();
  }, [iD]);

  // Handle file upload
  const handleFileUpload = async (setFieldValue, file) => {
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFieldValue('document', file);
    setIsUploading(false);
  };

  // Handle form submission
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('document', values.document);
      formData.append('comment', values.comment);
      formData.append('document_type', values.document_type);

      const endpoint = hasExistingFile 
        ? updateAPI
        : `/trainings/registrations/${iD}/documents/`;
const response = hasExistingFile
  ? await axiosInstance.put(endpoint, formData, { //  Use PUT for updates
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  : await axiosInstance.post(endpoint, formData, { // Use POST for new uploads
      headers: { 'Content-Type': 'multipart/form-data' }
    });
setShowSuccessMessage(true);

    
      resetForm();
    } catch (error) {
     
      setFailureMessage(error.response?.data?.detail || "An error occurred");
      setShowFailureMessage(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize 
        initialValues={{
          document: null,
          comment: '',
          document_type: documentType
        }}
        validationSchema={FormSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors, touched, isSubmitting }) => (
          <Form className="form-submission-report">
            <div className="file-input-container">
              <label>{title}</label>
              <div className="file-input-wrapper">
              <input
    type="text"
    readOnly
    value={values.document ? values.document.name : fileName} // ✅ Use prop
    className="file-name-display"
    placeholder={fileName || "N/A"} // ✅ Use prop as fallback
/>

{!values.document ? ( 
                  <label className="file-input-label">
                    <FiPaperclip className="paperclip-icon" />
                    <input
                      type="file"
                      ref={fileInputRef} // ✅ Set reference
                      onChange={(e) => handleFileUpload(setFieldValue, e.target.files[0])}
                      className="hidden-file-input"
                      accept={fileType}
                    />
                  </label>
                ) : (      <label className="file-input-label visi-none">
                  <FiPaperclip className="paperclip-icon" />
                  <input
                    type="file"
                    ref={fileInputRef} // ✅ Set reference
                    onChange={(e) => handleFileUpload(setFieldValue, e.target.files[0])}
                    className="hidden-file-input"
                    accept={fileType}
                  />
                </label> )}
              </div>
              {errors.document && touched.document && (
                <div className="error-message">{errors.document}</div>
              )}
              {isUploading && (
                <div className="uploading-icon">
                  <TailSpin height={20} width={30} visible={true} radius={2} color='blue' />
                </div>
              )}
            </div>

            {values.document && (
              <div className="buttons-container flex-it">
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <PulseLoader size={10} color='white'/> : hasExistingFile ? 'Update' : 'Submit'}
                </button>

                <button
                  type="button"
                  className="change-file-button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}                 >
                  Change File
                </button>
              </div>
            )}
          </Form>
        )}
      </Formik>

      {/* Show error message modal */}
      <FullScreenFailureMessage
        message={failureMessage}
        isOpen={showFailureMessage}
        onClose={() => setShowFailureMessage(false)}
      />

      <FullScreenSuccessMessage
        message="Your File has been successfully Submitted!"
        isOpen={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
      />
    </>
  );
};

export default FormSubmissionComponent;
