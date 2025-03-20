import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
// import "./reporting-form.scss"
import DownloadIcon from "/images/Download-white.png"
import axiosInstance from "../../../API Instances/AxiosIntances";
import CloseIcon from '/images/closeButton.png'
import * as Yup from "yup";
import Empty from "/images/empty_dashboard.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PulseLoader, BeatLoader } from "react-spinners";
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage";
import FullScreenSuccessMessage from "../Placement/Successful/Successful";
import PostTrainingTable from "./PostTrainigTable";

const TrainingDocuments = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [id, setProgrammeId] = useState(null);
  const [placements, setPlacementRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSCAFDownloading, setSCAFIsDownloading] = useState(false);
  const [noProgrammeId, setNoProgrammeId] = useState(false);
  const [jobReports, setjobReports] = useState([]);
  const [placementList, setPlacementList] = useState([])
  const [companyName, setCompanyName] = useState(["Job Reporting Form"])
  const [addressOptions, setAdressOptions] = useState([])
  const [successMessage, setJobReportStatus] = useState("")
  const [showSuccessStatus, setJobReportSuccess] = useState(false)
  const [failureMessage, setFailureMessage] = useState("")
  const [showFailureMessage, setShowJobReportingFailure] = useState(false)
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [trainingDuration, setDuration] =useState(0)
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
        const id = response.data[0].id;
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
      setPlacementRequests(response.data.id);
      setPlacementList(response)

      setCompanyName(response.data.attached_company_branch.company.name)
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
      const response = await axiosInstance.get(`/trainings/registrations/${id}/job-reporting/`);
      setjobReports(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

    }
  };



  useEffect(() => {
    if (placements) {
      fetchJobReports();
    }
  }, [placements]);


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
      const response = await axiosInstance.get(`/trainings/registrations/placements/${placements}/job-reporting/form/document/`, {
        responseType: 'blob' // Important: Specify the response type as 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report_form.pdf'); // Replace 'report_form.pdf' with the desired filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {

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
  const submitTrainingDocuments = async (values, { setSubmitting }) => {
    try {

      const response = await axiosInstance.post(`/trainings/registrations/placements/${placements}/job-reporting/`, values, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setJobReportStatus("Your Job Reporting Form has been submitted successfully!");
      setJobReportSuccess(true)
      setTriggerRefresh(prev => !prev)

    } catch (error) {

      if (error.response.status === 400) {
        setFailureMessage(error.response.data.detail)
        // setTriggerRefresh(prev => !prev)
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


  const  validationSchema = Yup.object().shape({
    employer_evaluation_score: Yup.string().required("Employer evaluation score is required"),
    ending_date: Yup.date().required("Ending date of training is required"),
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
        <title>ITCC - Training Documents Submission</title>
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
                  training_end: "",
                  employer_evaluation_score: "",
                  
                  
                  
                  
                }}
                validationSchema={validationSchema}
                onSubmit={submitTrainingDocuments}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form encType="multipart/form-data">
                    <div className="companyDetails">
                   
                     

                      <div className="formInput">
                        <label htmlFor="ending_date">Date of training end</label>
                        <Field type="date" name="ending_date" placeholder="" />
                        <ErrorMessage className="error" name="ending_date" component="div" />
                      </div>




                      <div className="formInput">
                        <label htmlFor="employer_evaluation_score">Employer Evaluation Score</label>
                        <Field type="text" name="employer_evaluation_score" placeholder="8" />
                        <ErrorMessage className="error" name="employer_evaluation_score" component="div" />
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

            Training Report and Presentation Submission
          </div>

        </div>
        {isLoading ? (
          <div className="loader">

            <PulseLoader size={15} color={"#123abc"} />
          </div>
        ) : noProgrammeId ?
        (

          <PostTrainingTable triggerRefresh={triggerRefresh} />
        ) : (
          <div className="noProgrammeId register_above">
            <p> You presently don't have an active placement </p>
          </div>


        ) }

      </main>
    </div>
  );
}

export default TrainingDocuments;