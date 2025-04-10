import React, { useState, useRef, useEffect } from 'react';
import './TrainingDocumentSubmission.scss';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi';
import axiosInstance from '../../../API Instances/AxiosIntances';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence, motion } from 'framer-motion';
import * as Yup from 'yup';
import { PulseLoader } from 'react-spinners';

// toast.configure();

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
    const fileInputRef = useRef();
    const lastDocRef = useRef();

    const toggleExpand = () => setExpanded(!expanded);

    useEffect(() => {
        if (lastDocRef.current) {
            lastDocRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [documents]);

    const handleDelete = async (docId) => {
        try {
            await axiosInstance.delete(`/trainings/registrations/documents/${docId}/`);
            setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
            toast.success("Document deleted successfully");
        } catch (error) {
            toast.error("Failed to delete document");
            console.error("Delete failed", error);
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
                toast.success("Document updated successfully");
            } else {
                formData.append('student_training', registrationId);
                res = await axiosInstance.post(`/trainings/registrations/${registrationId}/documents/`, formData);
                toast.success("Document uploaded successfully");
            }
            setDocuments((prev) => {
                if (editId) {
                    return prev.map((d) => (d.id === editId ? res.data : d));
                } else {
                    return [...prev, res.data];
                }
            });
        } catch (error) {
            const msg = error?.message || "Failed to upload document";
            toast.error(msg);
            console.error("Validation/Upload error:", error);
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

    return (
        <div className="training-doc-section">
            <div className="header" onClick={toggleExpand}>
                <h3>{docTypeName}</h3>
                <button className="toggle-button">{expanded ? <FiChevronUp /> : <FiChevronDown />}</button>
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
                                        <a href={doc.document} target="_blank" rel="noopener noreferrer" className="action-btn" title="View"><FiEye /></a>
                                        <button onClick={() => handleEdit(doc.id)} className="action-btn" title="Edit"><FiEdit /></button>
                                        <button onClick={() => handleDelete(doc.id)} className="action-btn" title="Delete"><FiTrash2 /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No documents uploaded yet.</p>
                        )}
                     {uploading? (  <button className="add-btn btn-primary" disabled={uploading}>
                            <PulseLoader size={12} color='#ffffff' />
                        </button>):  (  <button className="add-btn" onClick={() => fileInputRef.current.click()} disabled={uploading}>
                        {<FiPlus/>}    Upload
                        </button>)}
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
    );
};

export default TrainingDocumentSubmissionComponent;
