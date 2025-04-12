import {useEffect, useState} from "react";
import axiosInstance from "../../../API Instances/AxiosIntances.jsx";
// import FormSubmissionComponent from "./FormSubmissionComponent.jsx";
import TrainingDocumentSubmissionComponent from "./TrainingDocumentSubmissionComponent.jsx";
import "./FormSubmission.scss"

const TrainingDocumentTable = ({triggerRefresh}) => {

    const [registrationId, setRegistrationId] = useState(null);
    const [trainingDocuments, setTrainingDocuments] = useState([]);

    const resolveFileType = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("presentation")) return ".pptx, .ppt, .key, .odp";
        if (lowerName.includes("report")) return ".pdf";
        return ".pdf";
    };

   

    useEffect(() => {
        const fetchRegistrationId = async () => {
            try {
                const response = await axiosInstance.get("trainings/registrations/");
                if (response.data?.length > 0) {
                    setRegistrationId(response.data[response.data.length - 1].id); // Use the latest registration Id
                }
            } catch (error) { /* empty */ }
        };

        fetchRegistrationId().then(() => {});
    }, []);

    useEffect(() => {
        const fetchTrainingDocuments = async () => {
            if (!registrationId) return;

            try {
                const response = await axiosInstance.get(`trainings/registrations/${registrationId}/documents/by-types/`);

                setTrainingDocuments(response.data);
            } catch (error) { 
                console.error("Error Fecthing training docs", error.response)
             }

        }
        fetchTrainingDocuments().then(() => {});
    }, [registrationId]);

    return (
        <section className='shift placement_table'>
            <div className='mainBody'>
                <div className='containerCourse'>
                    {trainingDocuments.map((docType) => (
                        <TrainingDocumentSubmissionComponent
                            key={docType.id}
                            registrationId={registrationId}
                            docTypeId={docType.id}
                            docTypeName={docType.name}
                            docTypeDescription={docType.description}
                            docTypeDocuments={docType.documents}
                            fileType={resolveFileType(docType.name)}
                            // Pass the documents context for upload button state
                        />
                    ))}
                </div>
            </div>
            <div className="register_above mobile">
                Scroll horizontally to see more
            </div>
        </section>
    )

};

export default TrainingDocumentTable;