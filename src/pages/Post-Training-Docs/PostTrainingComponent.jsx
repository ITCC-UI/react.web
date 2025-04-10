import React, {useState, useEffect } from 'react';
import "../../../components/Table/table.scss";
import axiosInstance from '../../../API Instances/AxiosIntances';
import FormSubmissionComponent from './FormSubmissionComponent';


const PostTrainingTable = ({ triggerRefresh }) => {
    const [iD, setProgramID] = useState(null);
    const [report, setReport] = useState(null);
    const [presentation, setPresentation] = useState(null);
    const [reportFileName, setReportFileName] = useState("");
    const [presentationFileName, setPresentationFileName] = useState("");
    const [reportID, setReportID] = useState(null);
    const [patchReportID, setPatchReportID] = useState(null);
    const [presentationID, setPresnetationID] = useState(null);
    const [fileReportView, setReportFileNameViewer] = useState("");
    const [presentationFileView, setPresentationFileNameViewer] = useState("");
    const [trainingDocuments, setTrainingDocuments] = useState([]);

    // Function to handle errors from the child component
    const handleErrorMessage = (error) => {


    };

    useEffect(() => {
        const fetchProgrammeId = async () => {
            try {
                const response = await axiosInstance.get("trainings/registrations/");
                if (response.data?.length > 0) {
                    setProgramID(response.data[response.data.length -1].id);
                } else {

                }
            } catch (error) {

            }
        };
        fetchProgrammeId();
    }, []);

    useEffect(() => {
        const fetchTrainingTypes = async () => {
            if (!iD) return;
            try {
                const response = await axiosInstance.get(`trainings/registrations/${iD}/documents/by-types/`);


                // Extract file names from the API response
                const reportID = (response.data[0].id);
                const presentationID = (response.data[1].id);


                setReportID(reportID)
                setPresnetationID(presentationID)

                const patchReportID = (response.data[0].id);
                setPatchReportID(patchReportID)

                const patchPresentationID = (response.data[0].id)

                if (response.data[0]?.documents?.length > 0 || response.data[1].documents.length > 0) {
                    const reportUrl = response.data[0]?.documents[0].document ? ("Work_Report") : "";
                    const reportUrlView = response.data[0]?.documents[0]?.document
                    const presentationUrlView = response.data[1]?.documents[1]?.document
                    setReportFileNameViewer(reportUrlView)
        setPresentationFileNameViewer(presentationUrlView)
                    const presentationUrl = response.data[1]?.documents[0]?.document ? ("Presentation_Slide") : "";
                    setReportFileName(reportUrl); // Extract file name
                    setPresentationFileName(presentationUrl); // Extract file name
                }


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
                        fileName={reportFileName} // ✅ Pass fetched file name
                        onError={handleErrorMessage}
                        updateAPI={`trainings/registrations/documents/${patchReportID}/`}
                        fileType={".pdf, .docx, .doc"}
                        onClick={() => {
                            if (fileReportView) {
                                window.open(fileReportView, "_blank");
                            }
                        }}
                    />
                    <FormSubmissionComponent
                        title={"Presentation Slide"}
                        documentType={presentation}
                        fileName={presentationFileName} // ✅ Pass fetched file name
                        onError={handleErrorMessage}
                        updateAPI={`trainings/registrations/documents/${presentationID}/`}
                        fileType={".pptx, .ppt, .pdf"}
                        onClick={() => {
                            if (presentationFileView) {
                                window.open(presentationFileView, "_blank");
                            }
                        }}
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
