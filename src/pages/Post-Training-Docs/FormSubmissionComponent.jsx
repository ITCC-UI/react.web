import React, { useState } from 'react';
import { FiPaperclip } from 'react-icons/fi';
import { TailSpin } from 'react-loader-spinner';
import './FormSubmission.scss';
import axiosInstance from '../../../API Instances/AxiosIntances';

const FormSubmissionComponent = ({ title, submission }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const handleFileUpload = async (file) => {
        setIsUploading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSelectedFile(file);
        setIsUploading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedFile) {
            console.log('Submitting file:', selectedFile.name);
            // submission(selectedFile);
        }
    };


    const submitFile =async ()=>{
        try{
            const submission= await axiosInstance.post('trainings/registrations/1/job-reporting/', selectedFile, {
                headers: {
                    'Content-Type': 'application/pdf',
                },
            })
            // console.log("Submitting file:", selectedFile.name);
        }

        catch(error){
            console.log("Error submitting file:", error);
       
    }
}
    return (
        <form className="form-submission-report" onSubmit={handleSubmit}>
            <div className="file-input-container">
                <label>{title}</label>
                <div className="file-input-wrapper">
                    <input
                        type="text"
                        readOnly
                        value={selectedFile ? selectedFile.name : ''}
                        className="file-name-display"
                        placeholder="No file selected"
                    />
                    <label className="file-input-label">
                        <FiPaperclip className="paperclip-icon" />
                        <input
                            type="file"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                            className="hidden-file-input"
                        />
                    </label>
                </div>
                {isUploading && (
                    <div className="uploading-icon">
                        <TailSpin height={20} width={30} visible={true} radius={2} color='blue' />
                    </div>
                )}
            </div>

            {selectedFile && (
                <div className="buttons-container flex-it">
                    <button type="submit" className="submit-button" onClick={()=> submitFile()}>Submit</button>
                    <button type="button" className="change-file-button" onClick={() => setSelectedFile(null)}>Clear Selection</button>
                </div>
            )}
        </form>
    );
};

export default FormSubmissionComponent;
