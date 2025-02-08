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
    const [reportFileName, setReportFileName] = useState("");
    const [presentationFileName, setPresentationFileName] = useState("");
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
              console.log(response.data);
  
              // Extract file names from the API response
              const reportUrl = response.data[0]?.documents[0]?.document || "";
              const presentationUrl = response.data[1]?.documents[0]?.document || "";
  
              setReport(response.data[0]?.id || null);
              setPresentation(response.data[1]?.id || null);
  
              setReportFileName(reportUrl.split("/").pop()); // Extract file name
              setPresentationFileName(presentationUrl.split("/").pop()); // Extract file name
  
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
    fileName={reportFileName} // ✅ Pass fetched file name
    onError={handleErrorMessage} 
    fileType={".pdf, .docx, .doc"} 
/>
<FormSubmissionComponent 
    title={"Presentation Slide"} 
    documentType={presentation} 
    fileName={presentationFileName} // ✅ Pass fetched file name
    onError={handleErrorMessage} 
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
