import React, { useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
import axiosInstance from '../../../API Instances/AxiosIntances';
import FormSubmissionComponent from './FormSubmissionComponent';


const PostTrainingTable = ({ triggerRefresh }) => {
    const [iD, setProgramID] = useState(null);
    const [report, setReport] = useState(null);
    const [presentation, setPresentation] = useState(null);
    const [showFailureMessage, setShowFailureMessage] = useState(false);
    const [failureMessage, setFailureMessage] = useState(""); // ✅ Stores error messages

    // Function to handle errors from the child component
    const handleErrorMessage = (error) => {
        console.error("Received error from child:", error);
        setFailureMessage(error);
        setShowFailureMessage(true);
    };

    useEffect(() => {
        const fetchProgrammeId = async () => {
            try {
                const response = await axiosInstance.get("trainings/registrations/");
                if (response.data?.length > 0) {
                    setProgramID(response.data[0].id);
                } else {
                    console.warn("No data found in response");
                }
            } catch (error) {
                console.error("Error fetching program ID:", error);
            }
        };
        fetchProgrammeId();
    }, []);

    useEffect(() => {
        const fetchTrainingTypes = async () => {
            if (!iD) return;
            try {
                const response = await axiosInstance.get(`trainings/registrations/${iD}/documents/by-types`);
                setReport(response.data[0]?.id || null);
                setPresentation(response.data[1]?.id || null);
            } catch (error) {
                console.error("Error fetching training types:", error);
            }
        };
        fetchTrainingTypes();
    }, [iD]);

    return (
        <section className='shift placement_table'>
            <div className="mainBody">
                <div className="containerCourse">
                    <FormSubmissionComponent 
                        title={"Work Report"} 
                        documentType={report} 
                        onError={handleErrorMessage} // ✅ Pass error handler
                        fileType={".pdf, .docx, .doc"}
                    />
                    <FormSubmissionComponent 
                        title={"Presentation Slide"} 
                        documentType={presentation} 
                        onError={handleErrorMessage} // ✅ Pass error handler
                        fileType={".pptx, .ppt, .pdf"}
                    />
                </div>
            </div>
            <div className="register_above mobile">
                Scroll horizontally to see more
            </div>

          
        </section>
    );
};

export default PostTrainingTable;
