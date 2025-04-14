import React, { useState, useRef, useEffect } from 'react';
import './TrainingDocumentSubmission.scss';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi';
import axiosInstance from '../../../API Instances/AxiosIntances';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence, motion } from 'framer-motion';
import * as Yup from 'yup';
import { PulseLoader } from 'react-spinners';
import FullScreenFailureMessage from '../Placement/Failed/FullScreenFailureMessage';
import FullScreenSuccessMessage from '../Placement/Successful/Successful2';
import { DeleteModal } from './Modals/Modals';
import { Tooltip } from 'react-tooltip';


const fileSchema = Yup.mixed()
    .required('A file is required')
    .test('fileType', 'Invalid file format', (value) => {
        if (!value) return false;
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-powerpoint',
            'application/vnd.oasis.opendocument.presentation',
            'application/vnd.apple.keynote'
        ];
        return allowedTypes.includes(value.type);
    });

const TrainingDocumentSubmissionComponent = ({ docTypeId, docTypeName, docTypeDescription, docTypeDocuments, fileType, registrationId }) => {
    const [expanded, setExpanded] = useState(false);
    const [documents, setDocuments] = useState(docTypeDocuments);
    const [uploading, setUploading] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false)
    const [submissionFailure, setSubmissionFailure] = useState(false)
    const [failureMessage, setFailureMessage] = useState("Error submitting file")
    const [successMessage, setSuccessMessage] = useState("")
    const [deleteModal, setDeleteModal] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);
    const [title, setTitle] = useState("")
    const [deleteState, setDeleteState] = useState(false)
    const fileInputRef = useRef();
    const lastDocRef = useRef();

    const toggleExpand = () => setExpanded(!expanded);

    useEffect(() => {
        if (lastDocRef.current) {
            lastDocRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [documents]);
    // Delete The Document
    const handleDelete = async (docId) => {
        setDeleteState(true)
        try {
            await axiosInstance.delete(`/trainings/registrations/documents/${docId}/`);
            setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
            setSubmissionSuccess(true)
            setSuccessMessage("Document deleted successfully")
            setTitle("File Deleted!")

        } catch (error) {
            setSuccessMessage(error.response?.data?.detail ? (error.response?.data.detail) : ("There was an error deleting your file"))
            setSubmissionFailure(true)
        }
    };

    const handleEdit = (docId) => {
        fileInputRef.current.click();
        fileInputRef.current.dataset.editId = docId;
    };

    const handleUpload = async (file, editId = null) => {
        setUploading(true);
        try {
            await fileSchema.validate(file);

            const formData = new FormData();
            formData.append('document', file);
            formData.append('comment', '');
            formData.append('document_type', docTypeId);

            let res;
            if (editId) {
                res = await axiosInstance.put(`/trainings/registrations/documents/${editId}/`, formData);
                setSubmissionSuccess(true)
                setSuccessMessage("Document submitted successfully!")
                setTitle("Document Submitted ")
            } else {
                formData.append('student_training', registrationId);
                res = await axiosInstance.post(`/trainings/registrations/${registrationId}/documents/`, formData);
                setSubmissionSuccess(true)
                setSuccessMessage("Document submitted successfully!")
                setTitle("Document Submitted ")
            }
            setDocuments((prev) => {
                if (editId) {
                    return prev.map((d) => (d.id === editId ? res.data : d));
                } else {
                    return [...prev, res.data];
                }
            });
        } catch (error) {
            setSubmissionFailure(true)
            setFailureMessage(error.response?.data?.detail ? (error.response.data.detail) : ("Failed to upload document"))
            
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const editId = fileInputRef.current.dataset.editId;
        handleUpload(file, editId || null);
        fileInputRef.current.value = '';
        fileInputRef.current.dataset.editId = '';
    };

    const openDeleteModal = (docId) => {
        setDocToDelete(docId);
        setDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDocToDelete(null);
        setDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (docToDelete) {
            await handleDelete(docToDelete);
            closeDeleteModal();
        }
    };

    const isUploadEnabled = documents.length === 0 || documents.some(doc => !doc.document);

    return (

        <>
            <FullScreenSuccessMessage
                title={title}
                isOpen={submissionSuccess}
                message={successMessage}
                onClose={() => setSubmissionSuccess(false)}
            />

            <FullScreenFailureMessage
                isOpen={submissionFailure}
                onClose={() => setSubmissionFailure(false)}
                message={failureMessage} />
            <DeleteModal
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                request={docToDelete ? { id: docToDelete } : null}
                isDeleting={deleteState}
            />


            <div className="training-doc-section">
                <div className="header" onClick={toggleExpand}>
                    <h3>{docTypeName}</h3>
                    <button className="toggle-button" data-tooltip-id="toggle-tooltip" data-tooltip-content={expanded ? "Collapse" : "Expand"}>
                        {expanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    <Tooltip id="toggle-tooltip" />
                </div>
                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.div
                            className="doc-list"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            {documents.length > 0 ? (
                                documents.map((doc, idx) => (
                                    <div
                                        key={doc.id}
                                        className="doc-card"
                                        ref={idx === documents.length - 1 ? lastDocRef : null}
                                    >
                                        <div className="key-value">
                                            <div className="key">Document</div>
                                            <div className="value">{doc.document?.split('/').pop()}</div>
                                        </div>
                                        <div className="key-value">
                                            <div className="key">Date Uploaded</div>
                                            <div className="value">{new Date(doc.date_created).toLocaleDateString()}</div>
                                        </div>
                                        <div className="key-value">
                                            <div className="key">Status</div>
                                            <div className="value">{doc.approval_status}</div>
                                        </div>
                                        <div className="actions-submit">
                                            <a href={doc.document} target="_blank" rel="noopener noreferrer" className="action-btn" title="View" data-tooltip-id="view-tooltip" data-tooltip-content="View Document">
                                                <FiEye />
                                            </a>
                                            <Tooltip id="view-tooltip" />
                                            <button onClick={() => handleEdit(doc.id)} className="action-btn" title="Edit" data-tooltip-id="edit-tooltip" data-tooltip-content="Edit Document">
                                                <FiEdit />
                                            </button>
                                            <Tooltip id="edit-tooltip" />
                                            <button onClick={() => openDeleteModal(doc.id)} className="action-btn" title="Delete" data-tooltip-id="delete-tooltip" data-tooltip-content="Delete Document">
                                                <FiTrash2 />
                                            </button>
                                            <Tooltip id="delete-tooltip" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No documents uploaded yet.</p>
                            )}
                            {uploading ? (<button className="add-btn btn-primary" disabled={uploading}>
                                <PulseLoader size={10} color='#ffffff' />
                            </button>) : (<button className="add-btn" onClick={() => fileInputRef.current.click()} disabled={!isUploadEnabled} data-tooltip-id="upload-tooltip" data-tooltip-content={isUploadEnabled ? "Upload a new document" : "All documents submitted"}>
                                {<FiPlus />}    Upload
                            </button>)}
                            <Tooltip id="upload-tooltip" />
                            <input
                                type="file"
                                className="hidden-input"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept={fileType}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </>
    );
};

export default TrainingDocumentSubmissionComponent;
