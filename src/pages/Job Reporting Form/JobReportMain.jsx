import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./reporting-form.scss"
import DownloadIcon from "/images/Download-white.png"
import axiosInstance from "../../../API Instances/AxiosIntances";
import CloseIcon from '/images/closeButton.png'
import * as Yup from "yup";
import Empty from "/images/empty_dashboard.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { PulseLoader, BeatLoader } from "react-spinners";



const JobReportingForm = () => {
const [showSubmitForm, setShowSubmitForm]=useState(true)
const [id, setProgrammeId] = useState(null);
const[placements, setPlacementRequests]=useState([])
const [isLoading, setIsLoading] = useState(false);
const [isDownloading, setIsDownloading] = useState(false);
const [noProgrammeId, setNoProgrammeId] = useState(false); 
const [letterRequests, setLetterRequests] = useState([]);
const [placementList, setPlacementList] =useState([])
const [companyName, setCompanyName] =useState(["Job Reporting Form"])
const [addressOptions, setAdressOptions]= useState([])

useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowSubmitForm(false)
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);
})

const toggleNewSubmission=()=>{
    setShowSubmitForm((prev)=>!prev);
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
      console.log(noProgrammeId)
    }
  };

  useEffect(() => {
    fetchProgrammeId();  
  }, []);



// Fetch the placement id
  const fetchPlacement = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/placements/`);
      setPlacementRequests(response.data[0].id);
      // console.log("THe Placment",placements)
      setPlacementList(response.data)
      console.log("The pacement",placementList)
      setCompanyName(response.data[0].attached_company_branch.company.name)
      setIsLoading(false)
      
    } catch (error) {
      // console.log(error)
      setNoProgrammeId(true); 
      console.log("the error",error)
      
    }
  };

  useEffect(() => {
    if (id) {
      fetchPlacement();
    }
  }, [id]);


  const fetchJobReports = async () => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/placements/${placements}/job-reporting/`);
      setLetterRequests(response.data);
      
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("There's and error", error)
    }
  };



  useEffect(() => {
    if (placements) {
      fetchJobReports();
    }
  }, [placements]);
  const [triggerRefresh, setTriggerRefresh] = useState(false);

const type="ADDRESSEE"
  const fetchAddressee =()=>{
    axiosInstance.get(`/option-types/${type}/options`)
    .then(titles =>{
      const addressee=titles.data.map(title=>title.name)
      
      setAdressOptions(addressee)
      
    })
  
    .catch(error=>{
      
      
    })
  }

  useEffect(()=>{
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
        console.error(error);
    }
};

const handleDownload = async () => {
  setIsDownloading(true);

  try {
    // Your download logic here
    await downloadReportForm();
  } catch (error) {
    // Handle errors
    console.error(error);
  } finally {
    setIsDownloading(false);
  }
};
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// Job reporting form submission
  const submitJobReportingForm = async (values, { setSubmitting }) => {
    try {
  
      const response = await axiosInstance.post(`/trainings/registrations/${id}/acceptance-letters`, values, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAcceptanceSubmissionStatus("success");
      setAcceptanceSuccessMessage("Your Job Reporting Form has been submitted successfully!");
      setShowAcceptanceSuccessful(true);
      setTriggerRefreshAcceptance(prev=> !prev)
      setTimeout(() => {
        setAcceptanceSubmissionStatus("");
        setShowAcceptanceSuccessful(false);
        window.location.reload();
      }, 1000);
    } catch (error) {
      
      if(error.response.status===400){
        setAcceptanceFailureMessage(error.response.data.detail)
      }
      else{
        setAcceptanceFailureMessage("Unable to submit acceptance letter, please try again")
      }
      setShowAcceptanceFailure(true)
      setTimeout(() => {
        setShowAcceptanceFailure(true);
      }, 2000);
    } finally {
      setSubmitting(false);
      toggleAcceptanceRequest();
    }
  };


  const validationSchema = Yup.object().shape({
    company_supervisor: Yup.string().required("Supervisor's name is required"),    
    date_reported: Yup.date().required("Date of resumption to duty is required"),
    supervisor_phone: Yup.string().matches(phoneRegExp, "Supervisor's phone number is not valid").min(11, "Phone number must be more than 10"),
    placement: Yup.string().required(),
    supervisor_title: Yup.string().required("Supervisor's title is required"),
    mailing_address: Yup.string().required("Mailing address is required"),
    residential_address:Yup.string().required("Residential area is required"),
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
                ITCC - Job Reporting Form
            </Helmet>

            <SideBar
            dashboardClass={"dashy"}
            placementClass={"placement"}
            init={1}
            activeL={"active-accordion"}
            
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
                 placement: {placements},
                 supervisor_title: "",
                 residential_address: "",
                 mailing_address: ""
                }}
                validationSchema={validationSchema}
                onSubmit={null}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="companyDetails">
                      <div className="formInput">
                        <label htmlFor="company_supervisor">Supervisor's Name</label>
                        <Field type="text" name="company_supervisor" placeholder="Enter your company supervisor's name" />
                        <ErrorMessage className="error" name="company_supervisor" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="supervisor_title">Supervisor Title</label>
                        <Field as="select" name="spervisor_title" className="form-select">
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
                        <Field type="text" name="supervisor_phone" placeholder="Enter your company supervisor's phone number" />
                        <ErrorMessage className="error" name="supervisor_phone" component="div" />
                      </div>
      

                      <div className="formInput">
                        <label htmlFor="date_reported">Date reported for training</label>
                        <Field type="date" name="date_reported" placeholder="Enter your company supervisor's name" />
                        <ErrorMessage className="error" name="date_reported" component="div" />
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


                      <div className="formInput">
                        <label htmlFor="mailing_address">Mailing Address</label>
                        <Field type="text" name="mailing_address" placeholder="Enter your company supervisor's name" />
                        <ErrorMessage className="error" name="mailing_address" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="residential_address">Residential Address</label>
                        <Field type="text" name="residential_address" placeholder="Enter your residential address during training" />
                        <ErrorMessage className="error" name="residential_address" component="div" />
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


            
            <main className="introLetter">
<TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} active={"activeBar"}/>
<div className="header-main">
<div className="placement-head">
          Job Reporting Form
        </div>

        <div className="form-nest">
         {placementList.length===0?   <button className="form-download null" onClick={null}>
<img src={DownloadIcon} alt="download" />Download Form
            </button>:    <button
      className={`form-download ${isDownloading? "fixed-width null": ""}`}
      disabled={isLoading}
      onClick={handleDownload}
    >
      {isDownloading ? (
        <BeatLoader size={10} color="#36d7b7" />
      ) : (
        <>
          <img src={DownloadIcon} alt="download" /> Download Form
        </>
      )}
    </button>}
            <button className="form-upload" onClick={()=>toggleNewSubmission()}>
           
Submit Form
            </button>
        </div>
</div>
{isLoading ? (
          <div className="loader">
        
            <PulseLoader size={15} color={"#123abc"} />
          </div>
        ) : noProgrammeId ? (
          <div className="noProgrammeId register_above">
            <p> You presently don't have an active placement </p>
          </div>

          
        ) : letterRequests.length === 0 ? (
          <div className="image">
            <img src={Empty} alt="Empty" />
          </div>
        ) : (

          <JobReportTable triggerRefresh={triggerRefresh} />
        )}

            </main>
        </div>
     );
}
 
export default JobReportingForm;