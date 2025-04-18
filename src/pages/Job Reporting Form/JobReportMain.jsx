import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./reporting-form.scss"
import axiosInstance from "../../../API Instances/AxiosIntances";
import CloseIcon from '/images/closeButton.png'
import * as Yup from "yup";
import Empty from "/images/empty_dashboard.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PulseLoader, BeatLoader } from "react-spinners";
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage";
import FullScreenSuccessMessage from "../Placement/Successful/Successful";
import JobReportingTable from "./JobReportTable";

const JobReportingForm = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [id, setProgrammeId] = useState(null);
  const [placements, setPlacementRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSCAFDownloading, setSCAFIsDownloading] = useState(false);
  const [noProgrammeId, setNoProgrammeId] = useState(false);
  const [jobReports, setjobReports] = useState([]);
  const [placementList, setPlacementList] = useState([])
  const [companyName, setCompanyName] = useState(["Job Reporting Form"])
  const [addressOptions, setAdressOptions] = useState([])
  const [successMessage, setJobReportStatus] = useState("")
  const [title, setTitle] = useState("")
  const [showSuccessStatus, setJobReportSuccess] = useState(false)
  const [failureMessage, setFailureMessage] = useState("")
  const [showFailureMessage, setShowJobReportingFailure] = useState(false)
  const [triggerRefresh, setTriggerRefresh] = useState(false);
    const [endDate, setEndDate] =useState("Deadline not set")
    const [timeRemaining, setTimeRemaining] = useState("Deadline not set");
    const [duration, setDuration] = useState("")
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowSubmitForm(false)
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);
  })

  const toggleNewSubmission = () => {
    setShowSubmitForm((prev) => !prev);
  }

  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[response.data.length - 1].id;
        setProgrammeId(id);
        setIsLoading(false)
    
      } else {

      }
    } catch (error) {
      setNoProgrammeId(true);
      


    }
  };

  useEffect(() => {
    fetchProgrammeId();
  }, []);

  const getTimeRemaining = (endDateString) => {
    if (!endDateString) {
      
      return "No deadline set";
    }
    
    const endDate = new Date(endDateString);
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const timeDifference = endDate - currentDate;
    
    // If the deadline has passed
    if (timeDifference <= 0) {
      return "Deadline has passed";
    }
    
    // Calculate days, hours, minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    
    // Format as "12 days, 4 hours, and 30 minutes"
    return `${days} days, ${hours} hours, and ${minutes} minutes`;
  };

  // fecth schedule
  const fetchSchedule = async () => {
    try {
      const response = await axiosInstance.get(`trainings/registrations/${id}/job-reporting/schedule/`);
      const endDate = new Date(response.data.end_date);
      // Format the end date as before
      const formattedDate = endDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
  
      
      // Get the formatted time remaining
      const timeRemaining = getTimeRemaining(response.data.end_date);
  
      
      // You can set both to state
      setPlacementRequests(response.data);
      setEndDate(formattedDate);
      setTimeRemaining(timeRemaining); 
  
      
    } catch (error) {
    
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchSchedule();
    }
  }, [id]);



  // Fetch Registration ID
const fetchRegistrationType = async () =>{
  try{
    const response = await axiosInstance.get(`/trainings/registrations/${id}`);
    const duration=(response.data.training.type.duration)
    setDuration(duration)

  }
  catch (error){

  }
}

useEffect (()=>{
  if (id){
    fetchRegistrationType()
  }
}, [id])

  // Fetch the placement id
  const fetchPlacement = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements/current`);
      setPlacementRequests(response.data?.id);
      setPlacementList(response)

      setCompanyName(response.data?.attached_company_branch?.company.name)
      setIsLoading(false)

    } catch (error) {

      setNoProgrammeId(true);



    }
  };

  useEffect(() => {
    if (id) {
      fetchPlacement();
    }
  }, [id]);


  const fetchJobReports = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements/job-reporting/reportable/`);
      setjobReports(response.data);
      
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      

    }
  };



  useEffect(() => {
    if (id) {
      fetchJobReports();
    }
  }, [id]);


  const type = "TITLE"
  const fetchAddressee = () => {
    axiosInstance.get(`/option-types/${type}/options`)
      .then(titles => {
        const addressee = titles.data.map(title => title.name)

        setAdressOptions(addressee)

      })

      .catch(error => {


      })
  }

  useEffect(() => {
    fetchAddressee()
  }, [])
  const downloadReportForm = async () => {
    try {
      const response = await axiosInstance.get(
        `/trainings/registrations/placements/${placements}/job-reporting/form/document/`,
        {
          responseType: 'blob',
        }
      );
  
   
      const contentType = response.headers['content-type'];
      if (contentType.includes('application/json')) {
        const errorBlob = response.data;
  
      
        const errorText = await errorBlob.text();
        const errorJson = JSON.parse(errorText);
  
        
  
        setFailureMessage(errorJson.detail || "Failed to download Job Reporting Form.");
        setShowJobReportingFailure(true);
        return; // Stop the download from proceeding
      }
  
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report_form.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  
      setJobReportStatus("Your Job Reporting Form download will start shortly!");

      setTitle("Form Downloaded Successfully");
      setJobReportSuccess(true);
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      
  
      
      if (error.response && error.response.data instanceof Blob) {
        try {
          const errorBlob = error.response.data;
          const errorText = await errorBlob.text();
          const errorJson = JSON.parse(errorText);
  
          setFailureMessage(errorJson.detail || "An error occurred while downloading the file.");
        } catch (parseError) {
          
          setFailureMessage("An unknown error occurred while downloading.");
        }
      } else {
        setFailureMessage(
          error.response?.data?.detail || "There was an error downloading your Job Reporting Form."
        );
      }
  
      setShowJobReportingFailure(true);
    }
  };
  


  const downloadSCAFForm = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/job-reporting/itf/document/`, {
        responseType: 'blob' // Important: Specify the response type as 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SCAF-FORM.pdf'); // Replace 'report_form.pdf' with the desired filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {

    }
  };

  const handleJobReportDownload = async () => {
    setIsDownloading(true);

    try {
      // Your download logic here
      await downloadReportForm();
    } catch (error) {
      // Handle errors

    } finally {
      setIsDownloading(false);
    }
  };


  // SCAF FORM DOwnload
  const handleSCAFDownload = async () => {
    setSCAFIsDownloading(true);

    try {
      // Your download logic here
      await downloadSCAFForm();
    } catch (error) {
      // Handle errors

    } finally {
      setSCAFIsDownloading(false);
    }
  };
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  // Job reporting form submission
  const submitJobReportingForm = async (values, { setSubmitting }) => {
    try {

      const response = await axiosInstance.post(`/trainings/registrations/placements/${placements}/job-reporting/`, values, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setJobReportStatus("Your Job Reporting Form has been submitted successfully!");
      setTitle("Form Submitted Successfully");
      setJobReportSuccess(true)
      setTriggerRefresh(prev => !prev)

    } catch (error) {

      if (error.response.status === 400) {
        setFailureMessage(error.response.data.detail)
        setShowJobReportingFailure(true)

      }
      else {
        setFailureMessage("There was an error submitting your Job reporting form")
        // setTriggerRefresh(prev => !prev)
        setShowJobReportingFailure(true)

      }

    } finally {
      setSubmitting(false);
      toggleNewSubmission();
    }
  };


  const validationSchema = Yup.object().shape({
    company_supervisor: Yup.string().required("Supervisor's name is required"),
    date_reported: Yup.date().required("Date of resumption to duty is required"),
    supervisor_phone: Yup.string()
      .required("Phone number is required")
      .matches(phoneRegExp, "Invalid phone number")
      .test('no-spaces', 'Phone number should not contain spaces',
        (value) => value && !value.includes(' '))
      .length(11, "Phone number must be exactly 11 digits"),
    supervisor_title: Yup.string().required("Supervisor's title is required"),
    mailing_address: Yup.string().required("Mailing address is required"),
    residential_address: Yup.string().required("Residential area is required"),
    form: Yup.mixed()
      .required('A file is required')
      .test('fileFormat', 'Unsupported file format', (value) => {
        if (!value) return false;
        return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
      })
      .test('fileSize', 'File size is too large', (value) => {
        if (!value) return false;
        return value.size <= 1 * 1024 * 1024;
      })
  });


  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Job Reporting Form</title>
      </Helmet>

      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement"}
        init={1}
        activeL={"active-accordion"}
        formClass={"forms"}

      />



      {showSubmitForm && (
        <div className="newRequestComponent">
          <div className="newRequestHeader ">
            <div className="introductionLetter">{companyName}</div>
            <button className="closeButton" onClick={toggleNewSubmission} >
              <img src={CloseIcon} alt="Close" />
            </button>
            <div className="requestContent">
              <Formik
                initialValues={{
                  form: null,
                  company_supervisor: "",
                  date_reported: "",
                  supervisor_phone: "",
                  supervisor_title: "",
                  residential_address: "",
                  mailing_address: ""
                }}
                validationSchema={validationSchema}
                onSubmit={submitJobReportingForm}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form encType="multipart/form-data">
                    <div className="companyDetails">
                      <div className="formInput">
                        <label htmlFor="company_supervisor">Supervisor's Name</label>
                        <Field type="text" name="company_supervisor" placeholder="Enter your company supervisor's name" />
                        <ErrorMessage className="error" name="company_supervisor" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="supervisor_title">Supervisor Title</label>
                        <Field as="select" name="supervisor_title" className="form-select">
                          <option value="">Select Title/Position</option>
                          {addressOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage className="error" name="supervisor_title" component="div" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="supervisor_phone">Supervisor's Phone Number</label>
                        <Field
                          type="text"
                          name="supervisor_phone"
                          placeholder="e.g 08012345689"
                          onKeyPress={(e) => {
                            if (e.key === ' ') {
                              e.preventDefault();
                            }
                          }}
                        />
                        <ErrorMessage className="error" name="supervisor_phone" component="div" />
                      </div>


                      <div className="formInput">
                        <label htmlFor="date_reported">Date reported for training</label>
                        <Field type="date" name="date_reported" placeholder="Enter your company supervisor's name" />
                        <ErrorMessage className="error" name="date_reported" component="div" />
                      </div>




                      <div className="formInput">
                        <label htmlFor="mailing_address">Mailing Address</label>
                        <Field type="email" name="mailing_address" placeholder="mailingaddrress@mail.com" />
                        <ErrorMessage className="error" name="mailing_address" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="residential_address">Residential Address</label>
                        <Field type="text" name="residential_address" placeholder="Enter your residential address during training" />
                        <ErrorMessage className="error" name="residential_address" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="form">Upload your form</label>
                        <input
                          id="letter"
                          name="form"
                          type="file"
                          accept=".pdf, image/*"
                          onChange={(event) => {
                            setFieldValue("form", event.currentTarget.files[0]);

                          }}
                        />
                        <ErrorMessage className="error" name="form" component="div" />
                      </div>
                    </div>

                    <button type="submit" className="submitting">
                      {isSubmitting ? <PulseLoader size={10} color="white" /> : "Submit"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      <FullScreenSuccessMessage
        isOpen={showSuccessStatus}
        title={title}
        message={successMessage}
        onClose={() => setJobReportSuccess(false)}
      />

      <FullScreenFailureMessage
        message={failureMessage}
        isOpen={showFailureMessage}
        onClose={() => setShowJobReportingFailure(false)}
      />

    
      <main className="introLetter">
        
        <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} active={"activeBar"} />
        <div className="header-main">
          <div className="placement-head">
            Job Reporting Form
          </div>
         {jobReports[0]?.job_reporting && duration===24 ? (<button className="btn-primary" onClick={()=>{handleSCAFDownload()}}>Download SCAF Form</button>) : ""}
        </div>
        <div className="error deadline">Submission Deadline: {endDate} </div>
        <div className="error deadline">Time Remaining: {timeRemaining} </div>
        {isLoading ? (
          <div className="loader">

            <PulseLoader size={15} color={"#123abc"} />
          </div>
        ) : noProgrammeId ? (
          <div className="noProgrammeId register_above">
            <p> You presently don't have an active placement </p>
          </div>


        ) : jobReports.length === 0 ? (
          <div className="image">
            
            <img src={Empty} alt="Empty" />
          </div>
        ) : (

          <JobReportingTable triggerRefresh={triggerRefresh} />
        )}

      </main>
    </div>
  );
}

export default JobReportingForm;