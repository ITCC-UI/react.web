"use client"

import { useState, useEffect } from "react"
import "../../../components/Table/table.scss"
import "./jobReportTable.scss"
import axiosInstance from "../../../API Instances/AxiosIntances"
import { Search } from "lucide-react"
import Filter from "/images/Filter.png"
import { Button } from "@mui/material"
import { DownloadModal, EditModal, DeleteModal } from "./ModalBoxes/Modals"

const JobReportingTable = ({ triggerRefresh, setTriggerRefresh }) => {
  const [letterRequests, setLetterRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [activeModal, setActiveModal] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [registrationId, setRegistrationId] = useState(null)

  useEffect(() => {
    const fetchJobReports = async () => {
      try {
        // Get registration ID
        const registrationResponse = await axiosInstance.get("trainings/registrations/")
        const registrations = registrationResponse.data

        if (!registrations || registrations.length === 0) {
          setLetterRequests([])
          return
        }

        const regId = registrations[0].id
        setRegistrationId(regId)
        // console.log("Registration ID:", regId)

        // Get placements
        const placementsResponse = await axiosInstance.get(`/trainings/registrations/${regId}/placements/`)
        const placements = placementsResponse.data

        if (!placements || placements.length === 0) {
          setLetterRequests([])
          return
        }

        console.log("Placements:", placements)

        // Get reportable job reports
        const jobReportSubmission = await axiosInstance.get(
          `/trainings/registrations/${regId}/placements/job-reporting/reportable/`,
        )
        const jobReports = jobReportSubmission.data
        console.log("Job Reports:", jobReports)

        console.log("Job Report ID:", jobReports[0].id)

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
        console.error("Error fetching data:", error)
      }
    }

    fetchJobReports()
  }, [triggerRefresh])

  const handleAction = (action, request) => {
    console.log("Action:", action, "Request:", request)
    console.log("Job Reporting ID:", request.job_reporting?.id)
    setSelectedRequest(request)
    setActiveModal(action)
  }

  const closeModal = () => setActiveModal(null)

  const handleDownload = (request) => {
    // Implement download functionality
    console.log("Downloading report for:", request)
    closeModal()
  }

  const handleSave = async (formData, requestId) => {
    try {
      if (!registrationId) {
        console.error("No registration ID found")
        return
      }

      const placementId = selectedRequest.id

      console.log("This is the palcement", placementId)
      // Create form data for file upload if needed
      const apiFormData = new FormData()
      apiFormData.append("company_supervisor", formData?.supervisorName || " ")
      apiFormData.append("supervisor_title", formData?.supervisorTitle || "")
      apiFormData.append("supervisor_phone", formData?.supervisorPhone || " ")
      apiFormData.append("date_reported", formData?.dateResumed || " ")
      apiFormData.append("residential_address", formData?.residential_address || " ")
      apiFormData.append("company_address", formData?.company_address || " ")
      apiFormData.append("company_email", formData?.company_email || " ")
      apiFormData.append("forrm", formData?.form)

      if (formData.formFile) {
        apiFormData.append("report_file", formData.formFile)
      }
      console.log("Seleced", selectedRequest)

      // Check if job reporting already exists
      if (selectedRequest.job_reporting && Object.keys(selectedRequest.job_reporting).length > 0) {
        // Update existing job report with PATCH
        await axiosInstance.post(`/trainings/registrations/placements/${placementId}/job-reporting/`, apiFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      } else {
        // Create new job report with POST
        await axiosInstance.post(`/trainings/registrations/placements/${placementId}/job-reporting/`, apiFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      }

      // Refresh the data
      setTriggerRefresh((prev) => !prev)
      closeModal()
    } catch (error) {
      console.error("Error updating job report:", error)
    }
  }

  const handleDelete = async (requestId) => {
    try {
      if (!registrationId) {
        console.error("No registration ID found")
        return
      }

      // Get the job reporting ID from the selected request
      const jobReportingID = selectedRequest.job_reporting?.id

      if (!jobReportingID) {
        console.error("No job reporting ID found")
        return
      }

      // Delete the job report
      await axiosInstance.delete(`/trainings/registrations/job-reporting/${jobReportingID}/`)

      // Refresh the data
      setTriggerRefresh((prev) => !prev)
      closeModal()
    } catch (error) {
      console.error("Error deleting job report:", error)
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
                <tr key={index}>
                  <td>{request.attached_company_name}</td>
                  <td>
                    {request.job_reporting?.supervisor_title || ""}{" "}
                    {request.job_reporting?.company_supervisor || "----------"}
                  </td>
                  <td>{request.job_reporting?.supervisor_phone || "----------"}</td>
                  <td>{request.job_reporting?.date_reported || "----------"}</td>
                  <td>
                    <Button onClick={() => handleAction("download", request)}>Download</Button>
                    <Button onClick={() => handleAction("edit", request)}>Edit</Button>
                    <Button onClick={() => handleAction("delete", request)} className="delete-button">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {activeModal === "download" && (
        <DownloadModal request={selectedRequest} onClose={closeModal} onDownload={handleDownload} />
      )}

      {activeModal === "edit" && <EditModal request={selectedRequest} onClose={closeModal} onSave={handleSave} />}

      {activeModal === "delete" && (
        <DeleteModal request={selectedRequest} onClose={closeModal} onConfirm={handleDelete} />
      )}

      <div className="register_above mobile">Scroll horizontally to see more</div>
    </section>
  )
}

export default JobReportingTable

