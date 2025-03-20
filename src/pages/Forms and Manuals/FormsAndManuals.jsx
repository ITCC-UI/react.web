import React, { useState, useEffect } from "react";
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./formsmanual.scss";
import * as Yup from "yup";
import axiosInstance from "../../../API Instances/AxiosIntances";
import { Helmet } from "react-helmet";
import ManForms from "./Forms";
import FullScreenFailureMessage from "../Placement/Failed/FullScreenFailureMessage";
import { set } from "react-hook-form";


const IntroductionLetter = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [programmeId, setProgrammeId] = useState(null);
  const [letterRequests, setLetterRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(""); 
  const [successMessage, setIntroductionSuccessMessage] = useState("");
  const [showSuccessStatus, setShowIntroSuccess] = useState(false);
  const [failureMessage, setFailureMessage] = useState("");
  const [showFailureMessage, setShowIntroFailure] = useState(false);
  const [noProgrammeId, setNoProgrammeId] = useState(false); 
  
  
  
  const [isDownloading, setIsDownloading] = useState(false); // New state for download loader


  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        setProgrammeId(id);
        fetchIntroductionLetterRequests(id);
      } else {
        setNoProgrammeId(true); 
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchIntroductionLetterRequests = async (id) => {
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${id}/introduction-letter-requests/`);
      setLetterRequests(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammeId();
  }, []);

  const fetchAddressee = () => {
    axiosInstance.get(`/option-types/${type}/options`)
      .then(titles => {
        const addressee = titles.data.map(title => title.name);
        setAdressOptions(addressee);
      })
      .catch(error => {
        titleIsLoading(false);
      });
  };

  const downloadITF = async () => {
    setIsDownloading(true); // Set loading state to true
    try {
      const response = await axiosInstance.get(`/trainings/registrations/${programmeId}/job-reporting/itf/document/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ITF_Form.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the ITF Form", error);
    } finally {
      setIsDownloading(false); // Set loading state to false
    }
  };


  const downloadJRF = async () => {
    setIsDownloading(true); // Set loading state to true
    try {
      const response = await axiosInstance.get(`/trainings/registrations/placements`);
      if (response.data.length > 0) {
        try {
      const response = await axiosInstance.get(`/trainings/registrations/placements/${placementID}/job-reporting/form/document/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Job Reporting Form.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the ITF Form", error);
    } finally {
      setIsDownloading(false); 

    }
      }
    } catch (error) {
      console.error("Error fetching placements", error);
     setShowIntroFailure(true);
     setFailureMessage(error.response.data.detail);
    }
    
  };

  return (
    <>
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Forms and Manuals</title>
      </Helmet>

      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement"} 
        init={0}
        activeI={0}
        formClass={"forms active-accordion filterPlacement"}
      />
             
      <main className="introLetter">
        <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} />
        <div className="container">
          <div className="topHead">
            <div className="heading">FORMS AND MANUALS</div>
          </div>
        </div>
        <div className="form-holder">
          <ManForms
            title={"ITF Form"}
            contents={"This ITF Form is to be returned to the ITF on completion by the respective institution under seal."}
            reveal={"Hi"}
            download={downloadITF}
          />
          <ManForms
            title={"Job Reporting Form"}
            contents={"It serves as an evidence that the student has begun their training and must be submitted within the first two weeks of their training"}
            reveal={"Hi"}
            download={downloadJRF}
          />
          <ManForms
            title={"Employer’s Evaluation Form"}
            contents={"The Employer's Evaluation Form assesses the student's performance and must be completed post-training"}
            download={() => downloadEmployerEvaluation()}
          />
        </div>
        <div className="enlong">
          <ManForms
            title={"SCAF Form"}
            contents={"The SCAF Form is to be completed and submitted to the nearest ITF office to your location of Internship."}
            download={() => downloadSCAF()}
          />
        </div>
      </main>
    </div>

    <FullScreenFailureMessage
      message={failureMessage}
      isOpen={showFailureMessage}
      onClose={() => setShowIntroFailure(false)}
      />
    </>
  );
};

export default IntroductionLetter;
