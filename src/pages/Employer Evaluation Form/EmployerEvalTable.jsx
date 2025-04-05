"use client"

import { useState, useEffect } from "react"
import "../../../components/Table/table.scss"
import "./jobReportTable.scss"
import axiosInstance from "../../../API Instances/AxiosIntances"
import { Search } from "lucide-react"
import Filter from "/images/Filter.png"
import { DownloadModal, EditModal, DeleteModal } from "./ModalBoxes/Modals"
import FormDetailsModal from "./ModalBoxes/FormDetailsModal"
import { ref } from "yup"
import FullScreenSuccessMessage from "../Placement/Successful/Successful"
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage"
import Delete from "/images/Delete.png"
import Edit from "/images/Edit.png"
import Download from "/images/Download.png"
import QuestionnaireModal from "./ModalBoxes/QuestionnaireModal"

const EmployerEvalTable = ({ triggerRefresh, setTriggerRefresh }) => {
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
  const [isDeleting, setIsDeleting] = useState(false)
  const [placementID, setEmployerEvaluationID] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [, setFailureMessage] = useState(null)
  const [, setThisPlacementID] = useState(null)
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false)
  const [evaluationId, setEvaluationId] = useState(null);
  const [placementId, setPlacementId] = useState(null);

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
        console.log("Placement ID:", placements[0].id)
        setThisPlacementID(placements[0].id)

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

  const handleAction = (action, request) => {
    ("Action:", action, "Request:", request)
    // //("PalcementID:", request.id)
    setEmployerEvaluationID(request.employer_evaluation.id)
    console.log("Evaluation ID:", request.employer_evaluation.id)
    // //("Job Reporting ID:", request.job_reporting?.id)
    setSelectedRequest(request)
    setJobReportID(request.job_reporting?.id)
    setActiveModal(action)
  }

  const closeModal = () => {
    setActiveModal(null)
    setShowDetailsModal(false)
  }

  const handleRowClick = (request) => {
    setSelectedRequest(request)
    setEmployerEvaluationID(request.id)
    setJobReportID(request.job_reporting?.id)
    setShowDetailsModal(true)
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/placements/${placementID}/job-reporting/form/document/`,
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



  const handleSave = async (formData) => {
    try {
      if (!registrationId) {
        // console.error("No registration ID found")
        return
      }

      // const placementId = selectedRequest.id
      setPlacementId(selectedRequest.id)


      //("This is the palcement", placementId)
      // Create form data for file upload if needed
      const apiFormData = new FormData()
      apiFormData.append("date_of_completion", formData?.date_of_completion || " ")
      // apiFormData.append("form", formData?.form)

      if (formData.formFile) {
        apiFormData.append("form", formData.formFile)
      }
      // //("Seleced", selectedRequest)

      // Check if job reporting already exists
      if (selectedRequest.job_reporting && Object.keys(selectedRequest.job_reporting).length > 0) {
        // Update existing job report with PATCH
        await axiosInstance.put(`/trainings/registrations/placements/evaluation/${evaluationId}/`, apiFormData, {
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
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
        setShowQuestionnaireModal(true)
        // setTriggerRefresh(prev => !prev)
      }
    } catch (error) {
      setJobReportError(error.response.data.detail)
      setShowJobReportingFailure(true)
      console.log("Error Submitting Form  :", error)
      // setTriggerRefresh(prev => !prev)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      if (!registrationId) {
        // console.error("No registration ID found")
        return
      }

      // Get the job reporting ID from the selected request
      const employerEvalID = selectedRequest.employer_evaluation?.id
    

      // if (!jobReportingID) {
      //   console.error("No job reporting ID found")
      //   return
      // }

      // Delete the job report
      await axiosInstance.delete(`/trainings/registrations/job-reporting/${employerEvalID}/`)

      // Refresh the data
      closeModal()
      setIsDeleting(false)
      ref.current = true
      setJobReportStatus("Form Deleted Successfully")
      setTitle("Deleted!")
      setJobReportSuccess(true)
    } catch (error) {
      closeModal()
      setIsDeleting(false)
      if (error.response.status !== 500) {
        // console.error("Error deleting job report:", error)
        setJobReportError(error.response.data.detail)
        setShowJobReportingFailure(true)

      }
      else {
        // console.error("Error deleting job report:", error)
        setJobReportError("There was an error deleting your Job reporting form")
        setShowJobReportingFailure(true)
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

  const getEvaluationId = async () => {
    try {
      const placements = await axiosInstance.get(`/trainings/registrations/${registrationId}/placements/`)
      // console.log("This are the ", placements.data)
      const placementId = placements.data[0].id
      console.log("Placement ID here:", placementId)
      // setPlacementId(selectedRequest.id)
      console.log("Placement jkbyiovtc ID:", placementId)

      //("This is the palcement", placementId)
      // Create form data for file upload if needed
      const response = await axiosInstance.get(`/trainings/registrations/placements/${placementId}/evaluation/`)
      setEvaluationId(response.data.id)
      console.log("Evaluation ID:", response.data)

    } catch (error) {


      console.log("Error getting Form  :", error)
      // setTriggerRefresh(prev => !prev)
    }
  }


  useEffect(() => {
    getEvaluationId();
  }, []);



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
                  {console.log(request.employer_evaluation.id)}
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

      {showQuestionnaireModal && (
        <QuestionnaireModal
          placementId={placementID}
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

