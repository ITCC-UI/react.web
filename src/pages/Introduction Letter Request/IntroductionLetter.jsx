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
import IntroductionLetterTable from "./IntroductionLetterTable";
import FormikComboboxInput from "./ComboBox";
import StatesComboBox from "./ComboBoxStates";

const IntroductionLetter = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [programmeId, setProgrammeId] = useState(null);
  const [letterRequests, setLetterRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState(""); // "success" or "failure"
  const [noProgrammeId, setNoProgrammeId] = useState(false); // State for no Programme ID
  const [loading, titleIsLoading] =useState(false)
  const [addressOptions, setAdressOptions]= useState([])
  const [statesOfNigeria, setNewState] =useState([])

  const toggleNewRequest = () => {
    setShowNewRequest(!showNewRequest);
  };

  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        setProgrammeId(id);
        fetchIntroductionLetterRequests(id);
      } else {
        setNoProgrammeId(true); // Set state when no Programme ID is found
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

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!programmeId) {
      console.error("Programme ID not available");
      return;
    }

    try {
      const response = await axiosInstance.post(`/trainings/registrations/${programmeId}/introduction-letter-requests/`, values);
      setSubmissionStatus("success");
      setTimeout(() => {
        setSubmissionStatus("");
        window.location.reload(); // Auto refresh the page
      }, 500);
    } catch (error) {
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

const type="ADDRESSEE"
const fetchAddressee =()=>{
  axiosInstance.get(`/option-types/${type}/options`)
  .then(titles =>{
    const addressee=titles.data.map(title=>title.name)
    // console.log(addressee)
    setAdressOptions(addressee)
    titleIsLoading(false)
  })

  .catch(error=>{
    console.log(error)
    titleIsLoading(false)
  })
}

const fetchStates =()=>{
  axiosInstance.get(`/states`)
  .then(states =>{
    const newStates=states.data.map(state=>state.name)
    // console.log(newStates)
    setNewState(newStates)
    // stateIsLoading(false)
  })

  .catch(error=>{
    console.log(error)
    
  })
}


useEffect(()=>{
  fetchAddressee()
}, [])

useEffect(()=>{
  fetchStates()
}, [])
  


  // const statesOfNigeria = [
  //   "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", 
  //   "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
  //   "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", 
  //   "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  //   "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", 
  //   "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory (FCT)"
  // ];
  

  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Introduction Letter</title>
      </Helmet>

      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement"} //active-accordion and filterPlacement class
        init={0}
        activeI={"activen"}
      />
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
                        <FormikComboboxInput
              name="address_to"
              options={addressOptions}
              placeholder="Title/Position to address letter to, e.g The Managing Director"
              className="combo"
            />
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
                          <StatesComboBox
              name="company_address.state_or_province"
              options={statesOfNigeria}
              placeholder="E.g. Oyo  "
              className="combo"
              
            />
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
            <div className="heading">INTRODUCTION LETTERS</div>
            {/* Conditionallrender the New Request button only if programmeId exists */}
              {programmeId  &&   (
        <button className="newReq" onClick={toggleNewRequest}>
          + New Request
        </button>
      )}
      
          </div>
        </div>
        {isLoading ? (
          <div className="loader">
            <GridLoader size={15} color={"#123abc"} />
          </div>
        ) : noProgrammeId ? (
          <div className="noProgrammeId register_above">
            <p>You are not registered for a Programme. <br/> You are not eligible to request an introduction letter at this time. <br/>  <br/>
            Proceed to the registration page to register for you industrial training.</p>
          </div>

          
        ) : letterRequests.length === 0 ? (
          <div className="image">
            <img src={Empty} alt="Empty" />
          </div>
        ) : (

          <IntroductionLetterTable letterRequests={letterRequests} />
        )}
        
        {/* {programmeId && letterRequests.length === 5 && (
        <div className="register_above p-2 bg-yellow-100 text-yellow-800 rounded">
         Request limit exceeded
        </div>
      )} */}
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
    </div>
  );
};

export default IntroductionLetter;
