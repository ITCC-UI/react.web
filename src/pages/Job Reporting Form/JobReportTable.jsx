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
const JobReportingTable = ({ triggerRefresh }) => {

  const [letterRequests, setLetterRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [activeModal, setActiveModal] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [registrationId, setRegistrationId] = useState(null)
  const [jobReportID, setJobReportID] = useState(null)
  const [successMessage, setJobReportStatus] = useState(null)
  const [title, setTitle] = useState(null)
  const [jobReportSuccess, setJobReportSuccess] = useState(false)
  const [jobReportError, setJobReportError] = useState(null)
  const [showFailureMessage, setShowJobReportingFailure] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [placementID, setPlacementID] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [, setFailureMessage] = useState(null)

  useEffect(() => {
    const fetchJobReports = async () => {
      try {
        
        const registrationResponse = await axiosInstance.get("trainings/registrations/")
        const registrations = registrationResponse.data

        if (!registrations || registrations.length === 0) {
          setLetterRequests([])
          return
        }

        const regId = registrations[0].id
        setRegistrationId(regId)
        

        
        const placementsResponse = await axiosInstance.get(`/trainings/registrations/${regId}/placements/`)
        const placements = placementsResponse.data

        if (!placements || placements.length === 0) {
          setLetterRequests([])
          return
        }

        

        
        const jobReportSubmission = await axiosInstance.get(
          `/trainings/registrations/${regId}/placements/job-reporting/reportable/`,
        )
        const jobReports = jobReportSubmission.data
        

        if (jobReports && typeof jobReports === "object") {
          const processedRequests = Object.keys(jobReports).map((key) => ({
            id: key,
            placement_id: jobReports[key].placement_id,
            ...jobReports[key],
          }))

          setLetterRequests(processedRequests)
        } else if (Array.isArray(jobReports)) {
          const processedRequests = jobReports.map((request) => ({
            ...request,
          }))

          setLetterRequests(processedRequests)
        } else {
          setLetterRequests([])
        }
      } catch (error) {

      }
    }

    fetchJobReports()
  }, [triggerRefresh])

  const handleAction = (action, request) => {
    
    
    setPlacementID(request.id)
    
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
    setPlacementID(request.id)
    setJobReportID(request.job_reporting?.id)
    setShowDetailsModal(true)
  }


  const handleDownload = async (_request) => {
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

      
    } catch (error) {
      if (error.response.request.status != 500) {
        
        setJobReportError(error.response.data.detail)
        setShowJobReportingFailure(true)
      }
      else {
        
        setJobReportError("There was an error downloading your Job reporting form")
        setShowJobReportingFailure(true)
      }
    } finally {
      setIsDownloading(false)
      closeModal()
    }
  }

  const handleSave = async (formData, _requestId) => {
    try {
      if (!registrationId) {
        
        return
      }

      const placementId = selectedRequest.id

      
      
      const apiFormData = new FormData()
      apiFormData.append("company_supervisor", formData?.supervisorName || " ")
      apiFormData.append("supervisor_title", formData?.supervisorTitle || "")
      apiFormData.append("supervisor_phone", formData?.supervisorPhone || " ")
      apiFormData.append("date_reported", formData?.dateResumed || " ")
      apiFormData.append("residential_address", formData?.residential_address || " ")
      apiFormData.append("supervisor_email", formData?.supervisor_email || " ")
      

      if (formData.formFile) {
        apiFormData.append("form", formData.formFile)
      }
      

      
      if (selectedRequest.job_reporting && Object.keys(selectedRequest.job_reporting).length > 0) {
        
        await axiosInstance.put(`/trainings/registrations/job-reporting/${jobReportID}/`, apiFormData, {
          
          
          
        })
        
        setJobReportStatus("Form Updated")
        setTitle("Your form has been successfully updated")
        setJobReportSuccess(true)
        closeModal()
      } else {
        
        await axiosInstance.post(`/trainings/registrations/placements/${placementId}/job-reporting/`, apiFormData, {})
        setJobReportStatus("Form Submitted")
        setTitle("Your form has been successfully submitted")
        setJobReportSuccess(true)
        setIsSubmitting(false)
        closeModal()
        
      }
    } catch (error) {
      setJobReportError(error.response.data.detail)
      setShowJobReportingFailure(true)
      setIsSubmitting(false)
      closeModal()
      
    }
  }

  const handleDelete = async (_requestId) => {
    setIsDeleting(true)
    try {
      if (!registrationId) {
        
        return
      }

      
      const jobReportingID = selectedRequest.job_reporting?.id

      
      
      
      

      
      await axiosInstance.delete(`/trainings/registrations/job-reporting/${jobReportingID}/`)

      
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
        
        setJobReportError(error.response.data.detail)
        setShowJobReportingFailure(true)

      }
      else {
        
        setJobReportError("There was an error deleting your Job reporting form")
        setShowJobReportingFailure(true)
      }
    }
  }


 
  
  
  const filteredRequests = letterRequests.filter((request) => {
    const matchesSearch =
      request.attached_company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.job_reporting?.company_supervisor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.job_reporting?.supervisor_phone?.includes(searchTerm)

    if (filter === "all") return matchesSearch
    return matchesSearch && request.status?.toLowerCase() === filter.toLowerCase()
  })

  return (
    <section className=" placement_table">
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
                <th>Supervisor's Name</th>
                <th>Supervisor's Phone Number</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={index} onClick={() => handleRowClick(request)} className="cursor-pointer hover:bg-gray-100">
                  <td>{request.attached_company_name}</td>
                  <td>
                    {request.job_reporting?.supervisor_title || ""}{" "}
                    {request.job_reporting?.company_supervisor || "----------"}
                  </td>
                  <td>{request.job_reporting?.supervisor_phone || "----------"}</td>
                  <td>{request.job_reporting?.date_reported || "----------"}</td>
                  <td onClick={(e) => e.stopPropagation()} className="action-buttons">

                  
                 <img src={Download} alt="Download" onClick={() => handleAction("download", request)} />
               

                    <img src={Edit} alt="Edit" onClick={() => handleAction("edit", request)} />

                    {request.job_reporting ?
                     (<img src={Delete} alt="Delete" onClick={() => handleAction("delete", request)} className="delete-button" />) :
                      (<img src={Delete} alt="Delete" disabled onClick={() => null} className="delete-button disable" />)}
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

      {activeModal === "edit" && <EditModal request={selectedRequest} onClose={closeModal} onSave={handleSave} isSubmitting={isSubmitting} />}

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

      <div className="register_above mobile">Scroll horizontally to see more</div>
    </section>
  )
}

export default JobReportingTable

