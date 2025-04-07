"use client"

import { useState, useEffect } from "react"
import "../../../components/Table/table.scss"
import "./jobReportTable.scss"
import axiosInstance from "../../../API Instances/AxiosIntances"
import { Search } from "lucide-react"
import Filter from "/images/Filter.png"
import { DownloadModal, EditModal, DeleteModal } from "./ModalBoxes/Modals"
import FormDetailsModal from "./ModalBoxes/FormDetailsModal"
import FullScreenSuccessMessage from "../Placement/Successful/Successful"
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage"
import Download from "/images/Download.png"
import Edit from "/images/Edit.png"
import QuestionnaireModal from "./ModalBoxes/QuestionnaireModal"

const EmployerEvalTable = ({ triggerRefresh, setTriggerRefresh, requestID }) => {
  const [letterRequests, setEvaluableForms] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [activeModal, setActiveModal] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [registrationId, setRegistrationId] = useState(null)
  const [, setJobReportID] = useState(null)
  const [successMessage, setJobReportStatus] = useState(null)
  const [title, setTitle] = useState(null)
  const [jobReportSuccess, setJobReportSuccess] = useState(false)
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
const [surveyResponseScore, setSurveyResponse] = useState(null)
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
        console.log("Registration ID:", regId)
        setRegistrationId(regId)
        // //("Registration ID:", regId)

        // Get placements
        const placementsResponse = await axiosInstance.get(`/trainings/registrations/${regId}/placements/`)
        const placements = placementsResponse.data

        if (!placements || placements.length === 0) {
          setEvaluableForms([])
          return
        }
        console.log("Placements:", placements)
        // console.log("Placement ID:", placements[0].id)
        // setThisPlacementID(placements[0].id)

        // Get Employer Evaluation Forms
        const employerEvaluableForms = await axiosInstance.get(
          `/trainings/registrations/${regId}/placements/employer-evaluations/evaluable/`,
        )
      
        const employerForms = employerEvaluableForms.data
        console.log("Evaluable Forms:", employerForms)
        // //("Job Reports:", jobReports)
        // setJobReportID(jobReports[0]?.id)
        // //("Job Report ID:", jobReports[0].id)

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
        console.log("Errssor:", error)
      }
    }

    fetchEvaluableFormTable()
  }, [triggerRefresh])

const startSurvey = async (placementId) => {
  try {
    const response = await axiosInstance.patch(`trainings/registrations/placements/${placementId}/employer-evaluation-surveys/start/`)
    console.log("Survey started successfully:", response.data)
    setShowQuestionnaireModal(true)
  } catch (error) {
    console.error("Error starting survey:", error)
    setFailureMessage(error.response.data.detail)
  }
}


  const handleAction = (action, request) => {
    ("Action:", action, "Request:", request)
    // //("PalcementID:", request.id)
    // var placementId = request.employer_evaluation?.id
    var placementId = request?.id

    requestID(placementId)
    setEmployerEvaluationID(request.employer_evaluation?.id)
    console.log("Placmet ID:", request.id)
    console.log("Employer Evaluation ID:", request.employer_evaluation?.id)
    setEvaluationForm(request.employer_evaluation)
    // //("Job Reporting ID:", request.job_reporting?.id)
    setSelectedRequest(request)
    setActiveModal(action)
    setPlacementId(request.id)
    startSurvey(request.id)

  }

  const checkSurvey = async () => {
    try {
      const surveyReponse = await axiosInstance.get(`trainings/registrations/placements/${placementId}/employer-evaluation-surveys/summary/`)
      console.log("Survey response:", surveyReponse.data.total_score)
      setSurveyResponse(surveyReponse.data.total_score)
    }catch (error) {
      console.error("Unable to fetch survey response", error)
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
      // console.log("This are the ", placements.data)
      const placementId = placements?.data[0].id
      console.log("Placement ID here:", placementId)
      // setPlacementId(selectedRequest.id)
      console.log("Placement jkbyiovtc ID:", placementId)
      

      //("This is the palcement", placementId)
      // Create form data for file upload if needed
      const response = await axiosInstance.get(`/trainings/registrations/placements/${placementId}/evaluation/`)
      // setEvaluationId(response.data.id)
      console.log("Evaluation ID:", response.data)

    } catch (error) {


      console.error("Error getting Form  :", error)
      // setTriggerRefresh(prev => !prev)
    }
  }


  useEffect(() => {
    getEvaluationId();
  }, []);


  function handleRowClick(request) {
    setSelectedRequest(request.id)
    // setEmployerEvaluationID(request.id)
    console.log("Evaluation ID for row:", request.employer_evaluation.id)
    // setJobReportID(request.job_reporting?.id)
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
        // console.error("Download error:", errorJson)

        setFailureMessage(errorJson.detail || "Failed to download Job Reporting Form.")
        setShowJobReportingFailure(true)

        return
      }

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `Job_Report_.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)

      //("Download successful for:", request)
    } catch (error) {
      if (error.response.request.status != 500) {
        // console.error("Error downloading this  file:", error)
        setJobReportError(error.response.data.detail)
        setShowJobReportingFailure(true)
      }
      else {
        // console.error("Error on that downloading file:", error)
        setJobReportError("There was an error downloading your Job reporting form")
        setShowJobReportingFailure(true)
      }
    } finally {
      setIsDownloading(false)
      closeModal()
    }
  }

  // setPlacementId(selectedRequest.id)?

  const handleSave = async (formData) => {
    try {
      if (!registrationId) {
        // console.error("No registration ID found")
        return
      }

      // const placementId = selectedRequest.id
      // setPlacementId(selectedRequest.id)
      console.log("Placementsss ID:", selectedRequest)
      

      //("This is the palcement", placementId)
      // Create form data for file upload if needed
      const apiFormData = new FormData()
      apiFormData.append("date_of_completion", formData?.date_of_completion || " ")
      // apiFormData.append("form", formData?.form)

      if (formData.formFile) {
        apiFormData.append("form", formData.formFile)
      }
      
console.log("Selected Request:", selectedRequest)
      // Check if job reporting already exists
      if (evaluationForm) {
        // Update existing job report with PATCH
        await axiosInstance.put(`/trainings/registrations/placements/evaluation/${evaluationID}/`, apiFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        //("Updated job report")
        setJobReportStatus("Form Updated")
        setTitle("Your form has been successfully updated")
        setJobReportSuccess(true)
        closeModal()
        setShowQuestionnaireModal(true)
      } else {
        // Create new EMployer evaluation with POST
        await axiosInstance.post(`/trainings/registrations/placements/${placementId}/evaluation/`, apiFormData, {})
        setJobReportStatus("Form Submitted")
        setTitle("Your form has been successfully submitted")
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
        setShowQuestionnaireModal(true)
        console.error("Error Submitting Form  :", error)
      }
      else{
        setJobReportError(error.response.data.detail)
        setShowJobReportingFailure(true)
        closeModal()
        console.error("Error Submitting Form  w/0 500:", error)
      }
      // setShowJobReportingFailure(true)
      // console.error("Error Submitting Form  :", error)
      // closeModal()
      // setTriggerRefresh(prev => !prev)
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
    <section className="shift">
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
                {/* <th>Supervisor's Name</th>
                <th>Supervisor's Phone Number</th> */}
                <th>Date of Completion</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={index} onClick={() => handleRowClick(request)} className="cursor-pointer hover:bg-gray-100">
                  <td>{request.attached_company_name}</td>
                  {/* <td>
                    {request.job_reporting?.supervisor_title || ""}{" "}
                    {request.job_reporting?.company_supervisor || "----------"}
                  </td>
                  <td>{request.job_reporting?.supervisor_phone || "----------"}</td> */}
                  <td>{request.employer_evaluation?.date_of_completion || "----------"}</td>
                  {/* {console.log(request.employer_evaluation.id)} */}
                  <td onClick={(e) => e.stopPropagation()} className="action-buttons">

                    <img src={Download} alt="Download" onClick={() => handleAction("download", request)} />

                    <img src={Edit} alt="Edit" onClick={() => handleAction("edit", request)} />

                    {/* <img src={Delete} alt="Delete" onClick={() => handleAction("delete", request)} className="delete-button" /> */}
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

      {showQuestionnaireModal && surveyResponseScore===0 && (
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

