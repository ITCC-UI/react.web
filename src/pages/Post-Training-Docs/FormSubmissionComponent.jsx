import React, { useState } from 'react';
import { FiPaperclip } from 'react-icons/fi';
import './FormSubmission.scss';
import { Loader, LoaderPinwheel } from 'lucide-react';
import { CircleLoader, GridLoader } from 'react-spinners';
import { TailSpin } from 'react-loader-spinner';

const FormSubmissionComponent = ({file,submission, title}) => {
  const [workReport, setWorkReport] = useState("NA");
  const [presentationSlide, setPresentationSlide] = useState(null);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Work Report:', workReport);
    console.log('Presentation Slide:', presentationSlide);
  };

const [isUploading, setIsUploading] = useState(false);

const handleFileUpload = async (file, setFile) => {
    setIsUploading(true);
    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFile(file);
    setIsUploading(false);
};

return (
    <form className="form-submission-report">
        <div className="file-input-container">
            <label>{title}</label>
            <div className="file-input-wrapper">
                <input
                    type="text"
                    readOnly
                    value={workReport.name}
                    className="file-name-display"
                />
                <label className="file-input-label">
                    <FiPaperclip className="paperclip-icon" />
                    <input
                        type="file"
                        accept={file}
                        onChange={(e) => handleFileUpload(e.target.files[0], setWorkReport)}
                        // onChange={(e) => submission(e.target.files[0], setWorkReport)}
                        className="hidden-file-input"
                    />
                </label>
            </div>
            {isUploading && <div className="uploading-icon"><TailSpin height={20} width={20} visible={true} radius={2} wrapperStyle={{}} wrapperClass=''/> </div>}
        </div>
    </form>
);
};

export default FormSubmissionComponent;