import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./logs.scss"
import axiosInstance from "../../../API Instances/AxiosIntances";
import attachment from "/images/fileAttachment.png"
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PulseLoader, BeatLoader } from "react-spinners";
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage";
import FullScreenSuccessMessage from "../Placement/Successful/Successful";

const DailyLogs = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [id, setProgrammeId] = useState(null);
  const [placements, setPlacementRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [noProgrammeId, setNoProgrammeId] = useState(false); 
  const [jobReports, setjobReports] = useState([]);
  const [placementList, setPlacementList] = useState([]);
  const [companyName, setCompanyName] = useState(["Job Reporting Form"]);
  const [addressOptions, setAdressOptions] = useState([]);
  const [successMessage, setJobReportStatus] = useState("");
  const [showSuccessStatus, setJobReportSuccess] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const [showFailureMessage, setShowJobReportingFailure] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const toggleNewSubmission = () => {
    setShowSubmitForm((prev) => !prev);
  };

  const submitDailyLogs = async (values, { setSubmitting }) => {
    const formData = new FormData();
    values.form.forEach((file) => formData.append('form', file));
    try {
      const response = await axiosInstance.post(`/trainings/registrations/placements/${placements}/job-reporting/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setJobReportStatus("Your Job Reporting Form has been submitted successfully!");
      setJobReportSuccess(true);
      setTriggerRefresh((prev) => !prev);
    } catch (error) {
      const errorMessage = error.response?.status === 400 
        ? error.response.data.detail
        : "There was an error submitting your Job reporting form";
      setFailureMessage(errorMessage);
      setShowJobReportingFailure(true);
      setTriggerRefresh((prev) => !prev);
    } finally {
      setSubmitting(false);
      toggleNewSubmission();
    }
  };

  const validationSchema = Yup.object().shape({
    form: Yup.array()
      .of(
        Yup.mixed()
          .required("A file is required")
          .test("fileFormat", "Unsupported file format", (value) => {
            if (!value) return false;
            return ["application/pdf", "image/jpeg", "image/png"].includes(value.type);
          })
          .test("fileSize", "File size is too large", (value) => {
            if (!value) return false;
            return value.size <= 2 * 1024 * 1024; // 2 MB
          })
      )
      .min(1, "At least one file is required")
  });

  return (
    <div className="introductionLetter">
      <Helmet>ITCC - Daily Logs</Helmet>
      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement"}
        init={1}
        activeL={"active-accordion"}
      />
      <FullScreenSuccessMessage
        isOpen={showSuccessStatus}
        message={successMessage}
        onClose={() => setJobReportSuccess(false)}
      />
      <FullScreenFailureMessage
        message={failureMessage}
        isOpen={showFailureMessage}
        onClose={() => setShowJobReportingFailure(false)}
      />
      <main className="introLetter">
        <TopNav
          disableReg={"registration"}
          setVisible={"show"}
          regVisible={"hide"}
          active={"activeBar"}
        />
        <div className="header-main">
          <div className="placement-head">Daily and Weekly Logs</div>

            <div className="requestContent">
            <Formik
  initialValues={{ form: [] }}
  validationSchema={validationSchema}
  onSubmit={submitDailyLogs}
>
  {({ isSubmitting, setFieldValue, values }) => (
    <Form encType="multipart/form-data">
      
        <div className="formInput">
          <label htmlFor="form" className="scannedLog weekly letter">Upload your weekly scanned logs <img src={attachment} alt="file" /> </label>
          <input
            id="form"
            className="hidden"
            name="form"
            type="file"
            accept=".pdf, .jpeg, .png"
            multiple
            onChange={(event) => {
              const files = Array.from(event.currentTarget.files);
              setFieldValue("form", [...values.form, ...files]);
            }}
          />
          <ErrorMessage className="error" name="form" component="div" />
        </div>
        <div className="uploaded-files">
          {values.form.map((file, index) => (
            <div key={index} className="file-preview">
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() =>
                  setFieldValue(
                    "form",
                    values.form.filter((_, i) => i !== index)
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {/* Conditionally display the submit button */}
        {values.form.length > 0 && (
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <PulseLoader size={10} /> : "Submit"}
          </button>
        )}
      
    </Form>
  )}
</Formik>

            </div>
          
        </div>
      </main>
    </div>
  );
};

export default DailyLogs;
