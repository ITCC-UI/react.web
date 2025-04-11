"use client"

import { useState, useEffect } from "react"
import "../../../components/Table/table.scss"
import "./jobReportTable.scss"
import axiosInstance from "../../../API Instances/AxiosIntances"
import { Search } from "lucide-react"
import Filter from "/images/Filter.png"
import { DownloadModal, EditModal, DeleteModal } from "./ModalBoxes/Modals"
import FormDetailsModal from "./ModalBoxes/FormDetailsModal"
import FullScreenSuccessMessage2 from "../Placement/Successful/Successful2"
import FullScreenSuccessMessage from "../Placement/Successful/Successful"
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage"
import Download from "/images/Download.png"
import Edit from "/images/Edit.png"
import QuestionnaireModal from "./ModalBoxes/QuestionnaireModal"
import { Tooltip } from 'react-tooltip';
import Upload  from "/images/upload-to-cloud.png"

const EmployerEvalTable = ({ triggerRefresh, setTriggerRefresh, requestID }) => {
  const [letterRequests, setEvaluableForms] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [activeModal, setActiveModal] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [registrationId, setRegistrationId] = useState(null)
  const [successMessage, setJobReportStatus] = useState(null)
  const [title, setTitle] = useState(null)
  const [jobReportSuccess, setJobReportSuccess] = useState(false)
  const [jobReportSuccess2, setJobReportSuccess2] = useState(false)
  const [jobReportError, setJobReportError] = useState(null)
  const [showFailureMessage, setShowJobReportingFailure] = useState(false)
  const [isDeleting] = useState(false)
  const [evaluationID, setEmployerEvaluationID] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [, setFailureMessage] = useState(null)
  const [evaluationForm, setEvaluationForm] = useState(null)
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false)
  const [placementId, setPlacementId] = useState(null);
const [surveyResponseStatus, setSurveyResponse] = useState(null)
const [totalScore, setTotalScore] = useState(null)  

  useEffect(() => {
    const fetchEvaluableFormTable = async () => {
      try {
        // Get registration ID
        const registrationResponse = await axiosInstance.get("trainings/registrations/")
        const registrations = registrationResponse.data

        if (!registrations || registrations.length === 0) {
          setEvaluableForms([])
          return
        }
        const regId = registrations[0].id
        
        setRegistrationId(regId)
        

        // Get placements
        const placementsResponse = await axiosInstance.get(`/trainings/registrations/${regId}/placements/`)
        const placements = placementsResponse.data

        if (!placements || placements.length === 0) {
          setEvaluableForms([])
          return
        }
        

        // Get Employer Evaluation Forms
        const employerEvaluableForms = await axiosInstance.get(
          `/trainings/registrations/${regId}/placements/employer-evaluations/evaluable/`,
        )
      
        const employerForms = employerEvaluableForms.data



        if (employerForms && typeof employerForms === "object" && employerForms !== null) {
          const processedRequests = Object.keys(employerForms).map((key) => ({
            id: key,
            ...employerForms[key],
          }))

          setEvaluableForms(processedRequests)
        } else if (Array.isArray(employerForms)) {
          const processedRequests = employerForms.map((request) => ({
            ...request,
          }))

          setEvaluableForms(processedRequests)
        } else {
          setEvaluableForms([])
        }
      } catch (error) {
        
      }
    }

    fetchEvaluableFormTable()
  }, [triggerRefresh])

const startSurvey = async (placementId) => {
  try {
    const response = await axiosInstance.patch(`trainings/registrations/placements/${placementId}/employer-evaluation-surveys/start/`)
    
    
  } catch (error) {
  }
}


  const handleAction = (action, request) => {
    ("Action:", action, "Request:", request)
 
    var placementId = request?.id

    requestID(placementId)
    setEmployerEvaluationID(request.employer_evaluation?.id)

    setEvaluationForm(request.employer_evaluation)
    
    setSelectedRequest(request)
    setActiveModal(action)
    setPlacementId(request.id)
    startSurvey(request.id)

  }

  const checkSurvey = async () => {
    try {
      const placementResponse = await axiosInstance.get(`/trainings/registrations/placements/${placementId}/`)
      setSurveyResponse(placementResponse?.data?.employer_evaluation_survey_status)
      
    }catch (error) {
      
    }
  }

  useEffect(() => {
    if (placementId) {
      checkSurvey()
    }
  }, [placementId])

  const closeModal = () => {
    setActiveModal(null)
    setShowDetailsModal(false)
  }


  const getEvaluationId = async () => {
    try {
      const placements = await axiosInstance.get(`/trainings/registrations/${registrationId}/placements/`)
      
      const placementId = placements?.data[0].id
      
      const placementResponse = await axiosInstance.get(`/trainings/registrations/placements/${placementId}/`)
    
    } catch (error) {

    }
  }


  useEffect(() => {
    if(registrationId){
      getEvaluationId()
    } 
  }, [registrationId]);


  function handleRowClick(request) {
    setSelectedRequest(request)
 
 
    setShowDetailsModal(true)
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/placements/evaluation/${evaluationID}/form/document/`,
        { responseType: "blob" },
      )

      const contentType = response.headers["content-type"]
      if (contentType.includes("application/json")) {
        const errorText = await response.data.text()
        const errorJson = JSON.parse(errorText)
        

        setFailureMessage(errorJson.detail || "Failed to download Job Reporting Form.")
        setShowJobReportingFailure(true)

        return
      }

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `Employer_Evaluaton_Form.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      
    } catch (error) {
      if (error.response.request.status != 500) {
        setJobReportError("There was an error downloading your Employer Evaluation form")
        setShowJobReportingFailure(true)
      }
      else {
        
        setJobReportError("There was an error downloading your Employer Evaluation form")
        setShowJobReportingFailure(true)
      }
    } finally {
      setIsDownloading(false)
      closeModal()
    }
  }

  // setPlacementId(selectedRequest.id)?


const fetchEvaluationScore = async () => {
  try {
    const response = await axiosInstance.get(`/trainings/registrations/placements/${placementId}/employer-evaluation-surveys/summary/`)
    setTotalScore(response.data.total_score)
  }
  catch (error) {
    
  }
}

useEffect(() => {
  if (placementId) {
    fetchEvaluationScore()}}, [placementId])




  const handleSave = async (formData) => {
    try {
      if (!registrationId) {
        
        return
      }
      
      

      
      // Create form data for file upload if needed
      const apiFormData = new FormData()
      apiFormData.append("date_of_completion", formData?.date_of_completion || " ")
      apiFormData.append("overall_score", totalScore)
      

      if (formData.formFile) {
        apiFormData.append("form", formData.formFile)
      }
      
      // Check if job reporting already exists
      if (formData.formFile&&evaluationForm) {
        // Update existing job report with PATCH
        await axiosInstance.put(`/trainings/registrations/placements/evaluation/${evaluationID}/`, apiFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        //("Updated job report")
        setJobReportStatus("Form Updated")
        setTitle("Your form has been successfully updated")
        surveyResponseStatus!=="SUBMITTED"?(setJobReportSuccess2(true)):(setJobReportSuccess(true))
        // setJobReportSuccess(true)
        closeModal()
        setShowQuestionnaireModal(true)
      } else {
        // Create new EMployer evaluation with POST
        await axiosInstance.post(`/trainings/registrations/placements/${placementId}/evaluation/`, apiFormData, {})
        setJobReportStatus(" ")
        setTitle("Date of Completion has been filled successfully")
        setJobReportSuccess(true)
        closeModal()
        
        // setTriggerRefresh(prev => !prev)
      }
    } catch (error) {
      // setJobReportError(error.response.data.detail)
      if (error.response.status == 500) {
        setJobReportError("There was an error submitting your form")
        setShowJobReportingFailure(true)
        closeModal()
        
      }
      else{
        setJobReportError(error.response.data.detail)
        setShowJobReportingFailure(true)
        closeModal()
        
      }
    
    
    }
  }

  const handleDateSave = async (formData) => {
    try {
      if (!registrationId) {
        
        return
      }
      
      // Create form data for file upload if needed
      const apiFormData = new FormData()
      apiFormData.append("date_of_completion", formData?.date_of_completion || " ")
           
        // Create new EMployer evaluation with POST
        await axiosInstance.post(`/trainings/registrations/placements/${placementId}/evaluation/`, apiFormData, {})
        setJobReportStatus(" ")
        setTitle("Date of Completion has been filled successfully")
        setJobReportSuccess(true)
        closeModal()
        
        // setTriggerRefresh(prev => !prev)

        useEffect(()=>{
          if(evaluationID){
            handleDownload()
          }
        },[evaluationID])
      
    } catch (error) {
      // setJobReportError(error.response.data.detail)
      if (error.response.status == 500) {
        setJobReportError("There was an error submitting your form")
        setShowJobReportingFailure(true)
        closeModal()
        
      }
      else{
        setJobReportError(error.response.data.detail)
        setShowJobReportingFailure(true)
        closeModal()
        
      }
    
    
    }
  }

  // Filter and search functionality
  const filteredRequests = letterRequests.filter((request) => {
    const matchesSearch =
      request.attached_company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.job_reporting?.company_supervisor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.job_reporting?.supervisor_phone?.includes(searchTerm)

    if (filter === "all") return matchesSearch
    return matchesSearch && request.status?.toLowerCase() === filter.toLowerCase()
  })



  return (
    <section className="shift placement_table">
      <FullScreenSuccessMessage2
        isOpen={jobReportSuccess2}
        title={title}
        message={successMessage}
        onClose={() => setJobReportSuccess2(false)}
      />

<FullScreenSuccessMessage
        isOpen={jobReportSuccess}
        title={title}
        message={successMessage}
        onClose={() => setJobReportSuccess(false)}
      />
      <FullScreenFailureMessage
        message={jobReportError}
        isOpen={showFailureMessage}
        onClose={() => setShowJobReportingFailure(false)}
      />
      <div className="mainBody">
        <div className="search-bar">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search Here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter">
            <img src={Filter || "/placeholder.svg"} alt="Filter" className="image-filter" />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="pyro">
              <option value="default" disabled hidden>
                Select a status
              </option>
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="submitted">Submitted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="containerCourse">
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                
             
                <th>Date of Completion</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={index} onClick={() => handleRowClick(request)} className="cursor-pointer hover:bg-gray-100">
                  <td>{request.attached_company_name}</td>
               <td>{request.employer_evaluation?.date_of_completion || "----------"}</td>
               



<td onClick={(e) => e.stopPropagation()} className="action-buttons">
     <img 
      src={Download} 
      alt="Download" 
      onClick={() => handleAction("download", request)}
      data-tooltip-id="download-tooltip"
      data-tooltip-content="Download Employer Evaluation Form"
      
    />
   

  {request.employer_evaluation?.date_of_completion ? (
    <img 
      src={Upload} 
      alt="Edit" 
      onClick={() => handleAction("edit", request)}
      data-tooltip-id="edit-completed-tooltip"
      data-tooltip-content="Upload Employer Evaluation Form"
    />
  ) : (
    <img 
      src={Upload} 
      alt="Edit" 
      onClick={() =>null}
      data-tooltip-id="edit-completed-tooltip"
      className="disable"
      disabled={true}
      data-tooltip-content="Upload Employer Evaluation Form"
    />
  )}
  
  {/* Add tooltip components */}
  <Tooltip id="download-tooltip" place="top" effect="solid" />
  <Tooltip id="download-disabled-tooltip" place="top" effect="solid" />
  <Tooltip id="edit-completed-tooltip" place="top" effect="solid" />
  <Tooltip id="edit-tooltip" place="top" effect="solid" />
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeModal === "download" && (
        <DownloadModal
          request={selectedRequest}
          onClose={closeModal}
          onDownload={handleDownload}
          isDownloading={isDownloading}
          onSave={handleDateSave}
          isSubmitting={isDownloading}
        />
      )}

      {activeModal === "edit" && <EditModal request={selectedRequest} onClose={closeModal} onSave={handleSave} />}

      {activeModal === "delete" && (
        <DeleteModal request={selectedRequest} onClose={closeModal} onConfirm={handleDelete} isDeleting={isDeleting} />
      )}

      {showDetailsModal && (
        <FormDetailsModal
          request={selectedRequest}
          onClose={closeModal}
          onDownload={handleDownload}
          onEdit={(request) => handleAction("edit", request)}
          onDelete={(request) => handleAction("delete", request)}
        />
      )}

      {showQuestionnaireModal && surveyResponseStatus!=="SUBMITTED" && (
        <QuestionnaireModal
          placementId={placementId}
          onClose={() => setShowQuestionnaireModal(false)}
          onComplete={() => {
            setShowQuestionnaireModal(false);
            setTriggerRefresh(prev => !prev);
            
          }}
        />
      )}

      <div className="register_above mobile">Scroll horizontally to see more</div>
    </section>
  )
}

export default EmployerEvalTable;

