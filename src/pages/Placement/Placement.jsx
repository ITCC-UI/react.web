import React, { useState, useEffect } from "react";
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./placement.scss";
import Empty from "/images/empty_dashboard.png";
import CloseIcon from "/images/closeButton.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GridLoader, PulseLoader } from "react-spinners";
import axiosInstance from "../../../API Instances/AxiosIntances";
import { Helmet } from "react-helmet";
import IntroductionLetterTable from "./PlacementReqTable";
import PlacementDisplay from "./PlacementRequest";
import PlacementComponent from "./PlacementComponent"
import ActivePlacement from "./ActivePlacement";



const Placement = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [id, setProgrammeId] = useState(null);
  const [Placement, setLetterRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(""); // "success" or "failure"

  const toggleNewRequest = () => {
    setShowNewRequest(!showNewRequest);
  };


  const handleSubmit = async (values, { setSubmitting }) => {


    try {
      console.log(`Submitting form for programme ID: ${id}`);
      const response = await axiosInstance.post(`/trainings/placement-requests/registrations/${id}/`, values);
      console.log("Form submitted successfully", response);
      setSubmissionStatus("success");
      setTimeout(() => {
        setSubmissionStatus("");
        window.location.reload(); // Auto refresh the page
      }, 500);
    } catch (error) {
      //console.error("Error submitting form", error);
      setSubmissionStatus("failure");
      setTimeout(() => {
        setSubmissionStatus("");
      }, 500);
    } finally {
      setSubmitting(false);
      toggleNewRequest();
    }
  }; 
  
  const [activeDisplay, setActiveDisplay] = useState("placement");
  const handleButtonClick = (component) => {
    setActiveDisplay(component)
  };


  
  const validationSchema = Yup.object().shape({
    request_message: Yup.string().required("A message is required")
  });


  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Placement Letter</title>
      </Helmet>

      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement active-accordion filterPlacement"} //active-accordion and filterPlacement class
        init={0}
        activeI={0} //activen
      />
      {/* 
   

      {/* <ComponentB/> */}
      {showNewRequest && (
        <div className="newRequestComponent">
          <div className="newRequestHeader">
            <div className="introductionLetter">Request for Placement</div>
            <button className="closeButton" onClick={toggleNewRequest}>
              <img src={CloseIcon} alt="Close" />
            </button>
            <div className="requestContent">
              <Formik
                initialValues={{

                  request_message: "",

                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>

                    <div className="companyDetails">



                      <div className="formInput">
                        <label htmlFor="request_message"></label>
                        <Field type="text" name="request_message" placeholder="Type your message to support your request" />
                        <ErrorMessage className="error" name="request_message" component="div" />
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
        <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} />
        <div className="navButtons">
          <div className={activeDisplay === "placement" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placement")}> Placement</div>
          <div className={activeDisplay==="placementRequest" ? "shift_button active": "shift_button"} onClick={() => handleButtonClick("placementRequest")}> Placement Requests</div>
        </div>

        {activeDisplay === "placementRequest" && <PlacementComponent showNewRequest={showNewRequest} toggleNewRequest={toggleNewRequest} />}
        {activeDisplay === "placement" && <ActivePlacement />}


      </main>
    </div>
  );
};




const ComponentB = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [programmeId, setProgrammeId] = useState(null);
  const [Placement, setLetterRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(""); // "success" or "failure"

  const toggleNewRequest = () => {
    setShowNewRequest(!showNewRequest);
  };

  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      const id = response.data[0].id;
      setProgrammeId(id);
      //console.log("Programme ID:", id);
      fetchIntroductionLetterRequests(id);
    } catch (error) {
      //console.error("Error fetching programme ID:", error);
      setIsLoading(false);
    }
  };

  const fetchIntroductionLetterRequests = async (id) => {
    try {
      //console.log("Fetching introduction letters for programme ID:", id);
      const response = await axiosInstance.get(`/trainings/registrations/${id}/introduction-letter-requests/`);
      setLetterRequests(response.data);
      setIsLoading(false);
    } catch (error) {
      //console.error("Error fetching introduction letter requests:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammeId();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!programmeId) {
      //console.error("Programme ID not available");
      return;
    }

    try {
      //console.log(`Submitting form for programme ID: ${programmeId}`);
      const response = await axiosInstance.post(`/trainings/registrations/${programmeId}/introduction-letter-requests/`, values);
      //console.log("Form submitted successfully", response);
      setSubmissionStatus("success");
      setTimeout(() => {
        setSubmissionStatus("");
        window.location.reload(); // Auto refresh the page
      }, 500);
    } catch (error) {
      //console.error("Error submitting form", error);
      setSubmissionStatus("failure");
      setTimeout(() => {
        setSubmissionStatus("");
      }, 500);
    } finally {
      setSubmitting(false);
      toggleNewRequest();
    }
  };

  const validationSchema = Yup.object().shape({
    company_address: Yup.object().shape({
      building_number: Yup.string(),
      street: Yup.string().required("Street is required"),
      area: Yup.string(),
      city: Yup.string().required("City is required"),
      state_or_province: Yup.string().required("State or province is required"),
    }),
    company_name: Yup.string().required("Company name is required"),
    address_to: Yup.string().required("Addressee is required"),
  });

  return (<>
    {showNewRequest && (
      <div className="newRequestComponent">
        <div className="newRequestHeader">
          <div className="introductionLetter">Request for Introduction Letter</div>
          <button className="closeButton" onClick={toggleNewRequest}>
            <img src={CloseIcon} alt="Close" />
          </button>
          <div className="requestContent">
            <Formik
              initialValues={{
                company_address: {
                  building_number: "",
                  building_name: "",
                  street: "",
                  area: "",
                  city: "",
                  state_or_province: "",
                  country: "",
                  postal_code: "",
                },
                request_message: "",
                company_name: "",
                address_to: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="companyAddressedTo">
                    <div className="formInput">
                      <label htmlFor="company_name">Company Name</label>
                      <Field type="text" name="company_name" placeholder="Enter the name of the company, e.g Firstbank Plc" />
                      <ErrorMessage className="error" name="company_name" component="div" />
                    </div>
                    <div className="formInput">
                      <label htmlFor="address_to">Address To</label>
                      <Field type="text" name="address_to" placeholder="Title/Position to address letter to, e.g The Managing Director" />
                      <ErrorMessage className="error" name="address_to" component="div" />
                    </div>
                  </div>
                  <div className="companyDetails">
                    <div className="company">Company Address</div>
                    <div className="formInput buildNo">
                      <label htmlFor="company_address.building_number"></label>
                      <Field type="text" name="company_address.building_number" placeholder="Building No : No 24" className="buildNo" />
                      <ErrorMessage className="error" name="company_address.building_number" component="div" />
                    </div>
                    <div className="formInput">
                      <label htmlFor="company_address.street"></label>
                      <Field type="text" name="company_address.street" placeholder="Street, e.g UI Road" />
                      <ErrorMessage className="error" name="company_address.street" component="div" />
                    </div>
                    <div className="formInput">
                      <label htmlFor="company_address.area"></label>
                      <Field type="text" name="company_address.area" placeholder="Area, e.g. Ojoo" />
                      <ErrorMessage className="error" name="company_address.area" component="div" />
                    </div>
                    <div className="stateofCompany">
                      <div className="formInput">
                        <label htmlFor="company_address.city"></label>
                        <Field type="text" name="company_address.city" placeholder="City, e.g Ibadan *" />
                        <ErrorMessage className="error" name="company_address.city" component="div" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="company_address.state_or_province"></label>
                        <Field type="text" name="company_address.state_or_province" placeholder="State, e.g Oyo" />
                        <ErrorMessage className="error" name="company_address.state_or_province" component="div" />
                      </div>
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
      <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} />
      <div className="container">
        <div className="topHead">
          <div className="heading">PLACEMENT</div>
          <button className="newReq" onClick={toggleNewRequest}>
            + New Request
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="loader">
          <PulseLoader size={15} color={"#123abc"} />
        </div>
      ) : Placement.length === 0 ? (
        <div className="image">
          <img src={Empty} alt="Empty" />
        </div>
      ) : (
        <IntroductionLetterTable letterRequests={Placement} />
      )}
      {submissionStatus === "success" && (
        <div className="submissionStatus success">
          Form submitted successfully! Reload the page.
        </div>
      )}
      {submissionStatus === "failure" && (
        <div className="submissionStatus failure">
          Error submitting form. Please try again.
        </div>
      )}


    </main>
  </>)
}



export default Placement;