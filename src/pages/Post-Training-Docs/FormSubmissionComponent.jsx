import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FiPaperclip } from 'react-icons/fi';
import { TailSpin } from 'react-loader-spinner';
import axiosInstance from '../../../API Instances/AxiosIntances';
import './FormSubmission.scss';
import { PulseLoader } from 'react-spinners';
import FullScreenFailureMessage from '../Placement/Failed/FullScreenFailureMessage';


const FormSubmissionComponent = ({ title, fileType, documentType }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [iD, setProgramID] = useState(null);
 const [showFailureMessage, setShowFailureMessage] = useState(false);
    const [failureMessage, setFailureMessage] = useState(""); // ✅ Stores error messages



  // Validation schema
const FormSchema = Yup.object().shape({
    document: Yup.mixed()
      .required('A file is required')
      .test('fileType', 'Invalid file format', (value) => {
        if (!value) return false;
        return value && ['application/pdf', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', 
            'application/vnd.ms-powerpoint'].includes(value.type);
      }),
    comment: Yup.string(),
    document_type: Yup.string()
      .required('Document type is required')
  });


  // Fetching the program ID
  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      console.log("API Response:", response.data);  // Debugging step
  
      if (response.data && response.data.length > 0) {
        const id = response.data[0].id;
        setProgramID(id);
        console.log("Program ID:", id);
      } else {
        console.warn("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching program ID:", error);
    }
  };
  

  useEffect(() => {
    fetchProgrammeId();
  }, []);


  const handleFileUpload = async (setFieldValue, file) => {
    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFieldValue('document', file);
    setIsUploading(false);
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
        console.log("Submitting values:", values);

        const formData = new FormData();
        formData.append('document', values.document);
        formData.append('comment', values.comment);
        formData.append('document_type', values.document_type); // ✅ Use Formik's values

        // Log FormData contents
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const response = await axiosInstance.post(
            `/trainings/registrations/${iD}/documents/`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        console.log("Submission successful:", response.data);
        resetForm();
    } catch (error) {
        console.error("Error submitting form:", error);
        setFailureMessage(error.response.data.detail); // ✅ Set error message
        setShowFailureMessage(true); // ✅ Show error message
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
                value={values.document ? values.document.name : ''}
                className="file-name-display"
                placeholder="No file selected"
              />
              <label className="file-input-label">
                <FiPaperclip className="paperclip-icon" />
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(setFieldValue, e.target.files[0])}
                  className="hidden-file-input"
                  accept={fileType}
                />
              </label>
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
    {isSubmitting ? <PulseLoader size={10} color='white'/>: 'Submit'}
</button>

              <button
                type="button"
                className="change-file-button"
                onClick={() => setFieldValue('document', null)}
              >
                Clear Selection
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
    </>
  );

  
};

export default FormSubmissionComponent;