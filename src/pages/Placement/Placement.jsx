import React, { useState, useEffect } from "react";
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./placement.scss";
import CloseIcon from "/images/closeButton.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GridLoader, PulseLoader } from "react-spinners";
import axiosInstance from "../../../API Instances/AxiosIntances";
import { Helmet } from "react-helmet";
// import IntroductionLetterTable from "./PlacementReqTable";
// import PlacementDisplay from "./PlacementRequest";
import PlacementComponent from "./PlacementComponent"
import ActivePlacement from "./ActivePlacement";
import PlacementAcceptance from "./PlacementAcceptance";
import PlacementChange from "./PlacementChange";
import FullScreenSuccessMessage from "./Successful/Successful";



const Placement = () => {
  const [file, setFile] = useState(null);
  const [acceptanceSubmissionStatus, setAcceptanceSubmissionStatus] = useState("");
  const [acceptanceSuccessMessage, setAcceptanceSuccessMessage] = useState("");
  const [showAcceptanceSuccessful, setShowAcceptanceSuccessful] = useState(false);

  const [placementSubmissionStatus, setPlacementSubmissionStatus] = useState("");
  const [placementSuccessMessage, setPlacementSuccessMessage] = useState("");
  const [showPlacementSuccessful, setShowPlacementSuccessful] = useState(false);

  const [changeOfPlacement, setChangeofPlacement] = useState("");
  const [changeOfPlacementSuccessMessage, setPlacementChangeSuccessMessage] = useState("");
  const [showChangeOfPlacementSuccessful, setShowChangeOfPlacementSuccessful] = useState(false);

  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showNewAcceptanceRequest, setShowNewAcceptanceRequest] = useState(false);
  const [changeOfPlacementRequest, setNewChangeRequest] = useState(false)
  const [id, setProgrammeId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleNewRequest = () => {
    setShowNewRequest(!showNewRequest);
  };

  const toggleNewPlacementReq=()=>{
    setNewChangeRequest (!changeOfPlacementRequest)
  }

  const toggleAcceptanceRequest = () => {
    setShowNewAcceptanceRequest(!showNewAcceptanceRequest);

  }
  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      if (response.data.length > 0) {
        const id = response.data[0].id;
        setProgrammeId(id);
        console.log("This Programme ID:", id);
        // fetchIntroductionLetterRequests(id);
        // fetchPlacementRequests(id);
      } else {
        // setNoProgrammeId(true); // Set state when no Programme ID is found
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching programme ID:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammeId();  // Fetch the ID when the component mounts
  }, []);

  

  const handleAcceptanceRequest = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      const formattedAddress = formatAddress(values.company_address);
      // Append all form fields to formData
      Object.keys(values).forEach(key => {
        if (key === 'letter') {
          formData.append(key, file);
        } else if (key === 'company_address') {
          formData.append(key, formattedAddress);
        } else {
          formData.append(key, values[key]);
        }
      });
  
      const response = await axiosInstance.post(`/trainings/acceptance-letters/registrations/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAcceptanceSubmissionStatus("success");
      setAcceptanceSuccessMessage("Your Acceptance Letter has been submitted successfully!");
      setShowAcceptanceSuccessful(true);
      setTimeout(() => {
        setAcceptanceSubmissionStatus("");
        setShowAcceptanceSuccessful(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting acceptance form", error);
      setAcceptanceSubmissionStatus("failure");
      setTimeout(() => {
        setAcceptanceSubmissionStatus("");
      }, 500);
    } finally {
      setSubmitting(false);
      toggleAcceptanceRequest();
    }
  };



  const handlePlacementRequestsSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.post(`/trainings/placement-requests/registrations/${id}/`, values);
      setPlacementSubmissionStatus("success");
      setPlacementSuccessMessage("Your Placement Request has been submitted successfully!");
      setShowPlacementSuccessful(true);
      setTimeout(() => {
        setShowPlacementSuccessful(false);
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.error("Error submitting placement request form", error);
      setPlacementSubmissionStatus("failure");
      setTimeout(() => {
        setPlacementSubmissionStatus("");
      }, 500);
    } finally {
      setSubmitting(false);
      toggleNewRequest();
    }
  };

  const handleChangeOfPlacementRequest = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      const formattedAddress = formatAddress(values.company_address);
      Object.keys(values).forEach(key => {
        if (key === 'letter') {
          formData.append(key, file);
        } else if (key === 'company_address') {
          formData.append(key, formattedAddress);
        } else {
          formData.append(key, values[key]);
        }
      });
  
      const response = await axiosInstance.post(`/trainings/change-of-placement/registrations/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setChangeofPlacement("success");
      setPlacementChangeSuccessMessage("Your change of placement has been submitted successfully!");
      setShowPlacementChangeSuccessful(true);
      setTimeout(() => {
        setChangeofPlacement("");
        setShowPlacementChangeSuccessful(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting change of placement request", error);
      setChangeofPlacement("failure");
      setTimeout(() => {
        setChangeofPlacement("");
      }, 500);
    } finally {
      setSubmitting(false);
      toggleChangeOfPlacementRequest();
    }
  };
  

  // Component display
  const [activeDisplay, setActiveDisplay] = useState("placement");
  const handleButtonClick = (component) => {
    setActiveDisplay(component)
  };



  const validationSchema = Yup.object().shape({
    request_message: Yup.string().required("A message is required")
    // sometthin: Yup.string().required
  });

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const formatAddress = (addressObj) => {
    const { building_number, street, area, city, state_or_province } = addressObj;
    return `${building_number || ''} ${street}, ${area ? area + ', ' : ''}${city}, ${state_or_province}`.trim();
  };


  const changeOfPlacementSchema = Yup.object().shape({
    // letter_type: Yup.string()
    //   .oneOf(['UNDERTAKEN', 'ACCEPTANCE_LETTER'], 'Invalid letter type')
    //   .required('Letter type is required'),
    company_name: Yup.string()
      .required('Company name is required'),
      company_address: Yup.object().shape({
        building_number: Yup.string(),
        street: Yup.string().required("Street is required"),
        area: Yup.string(),
        city: Yup.string().required("City is required"),
        state_or_province: Yup.string().required("State or province is required"),
      }),
    company_contact_name: Yup.string()
      .required('Company contact name is required'),
    company_contact_email: Yup.string()
      .email('Invalid email')
      .required('Company contact email is required'),
      company_contact_phone: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Company contact phone is required').min(11, "Phone number must be more than 10"),

      letter: Yup.mixed()
      .required('A file is required')
      .test('fileFormat', 'Unsupported file format', (value) => {
        if (!value) return false;
        return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
      })
      .test('fileSize', 'File size is too large', (value) => {
        if (!value) return false;
        return value.size <= 1 * 1024 * 1024; // 1MB limit
      })
  });



  const acceptanceLetterSchema = Yup.object().shape({
    letter_type: Yup.string()
      .oneOf(['UNDERTAKEN', 'ACCEPTANCE_LETTER'], 'Invalid letter type')
      .required('Letter type is required'),
    company_name: Yup.string()
      .required('Company name is required'),
      company_address: Yup.object().shape({
        building_number: Yup.string(),
        street: Yup.string().required("Street is required"),
        area: Yup.string(),
        city: Yup.string().required("City is required"),
        state_or_province: Yup.string().required("State or province is required"),
      }),
    company_contact_name: Yup.string()
      .required('Company contact name is required'),
    company_contact_email: Yup.string()
      .email('Invalid email')
      .required('Company contact email is required'),
      company_contact_phone: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Company contact phone is required').min(11, "Phone number must be more than 10"),

      letter: Yup.mixed()
      .required('A file is required')
      .test('fileFormat', 'Unsupported file format', (value) => {
        if (!value) return false;
        return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
      })
      .test('fileSize', 'File size is too large', (value) => {
        if (!value) return false;
        return value.size <= 1 * 1024 * 1024; // 1MB limit
      })
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
          <div className="newRequestHeader ">
            <div className="introductionLetter">Request for Placement</div>
            <button className="closeButton" onClick={toggleNewRequest} >
              <img src={CloseIcon} alt="Close" />
            </button>
            <div className="requestContent">
              <Formik
                initialValues={{

                  request_message: "",
                  

                }}
                validationSchema={validationSchema}
                onSubmit={handlePlacementRequestsSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="placement_form">

                    <div className="companyDetails">



                      <div className="formInput">
                        <label htmlFor="request_message"></label>
                        <Field as="textarea" name="request_message" className="placement_letter" placeholder="Type your message to support your request" />
                        <ErrorMessage className="error" name="request_message" component="div" />
                      </div>

                    </div>
                    <button type="submit" className="submitting submit_placement_request">
                      {isSubmitting ? <PulseLoader size={10} color="white" /> : "Submit"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}



      {changeOfPlacementRequest && (
        <div className="newRequestComponent">
          <div className="newRequestHeader">
            <div className="introductionLetter">Change of Placement Letter</div>
            <button className="closeButton" onClick={toggleNewPlacementReq}>
              <img src={CloseIcon} alt="Close" />
            </button>
            <div className="requestContent">
              <Formik
                initialValues={{
                  // letter_type: '',
                  letter: null,
                  company_name: '',
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
                  company_contact_name: '',
                  company_contact_email: '',
                  company_contact_phone: '',
                }}
                validationSchema={acceptanceLetterSchema} // Ensure this is correct
                onSubmit={handleChangeOfPlacementRequest}  // Correctly pass the onSubmit function
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form encType="multipart/form-data">
                    <div className="companyAddressedTo warp_contents">
                      <div className="formInput">
                        <label htmlFor="company_name">Company's Name</label>
                        <Field type="text" name="company_name" placeholder="Enter the name of the company " />
                        <ErrorMessage className="error" name="company_name" component="div" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="company_contact_name">Company's Contact Name</label>
                        <Field type="text" name="company_contact_name" placeholder="e.g Engr O.A Opadare" />
                        <ErrorMessage className="error" name="company_contact_name" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="company_contact_email">Company Email</label>
                        <Field type="text" name="company_contact_email" placeholder="Enter the company’s email" />
                        <ErrorMessage className="error" name="company_contact_email" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="company_contact_phone">Company Contact Phone</label>
                        <Field type="tel" name="company_contact_phone" placeholder="e.g 08066641912" />
                        <ErrorMessage className="error" name="company_contact_phone" component="div" />
                      </div>

                      {/* <div className="formInput">
                        <label htmlFor="letter_type">Letter Type</label>
                        <Field as="select" name="letter_type">
                          <option value="">Select Letter Type</option>
                          <option value="UNDERTAKEN">UNDERTAKEN</option>
                          <option value="ACCEPTANCE_LETTER">ACCEPTANCE LETTER</option>
                        </Field>
                        <ErrorMessage className="error" name="letter_type" component="div" />
                      </div> */}

                      <div className="formInput move-left">
            <label htmlFor="letter">Letter</label>
            <input
              id="letter"
              name="letter"
              type="file"
              onChange={(event) => {
                setFieldValue("letter", event.currentTarget.files[0]);
                // setFile(event.currentTarget.files[0]);
              }}
            />
            <ErrorMessage className="error" name="letter" component="div" />
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



                    <div className="companyDetails">
                      {/* <div className="formInput">
                  <label htmlFor="letter_type">
                  
              Type</label>
                  <Field as="select" name="letter_type">
                    <option value="">Select Letter Type</option>
                    <option value="UNDERTAKEN">UNDERTAKEN</option>
                    <option value="ACCEPTANCE_LETTER">ACCEPTANCE LETTER</option>
                  </Field>
                  <ErrorMessage className="error" name="letter_type" component="div" />
                </div> */}
                      {/* Add other fields here */}



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


{showNewAcceptanceRequest && (
        <div className="newRequestComponent">
          <div className="newRequestHeader">
            <div className="introductionLetter">Submission of Acceptance Letter</div>
            <button className="closeButton" onClick={toggleAcceptanceRequest}>
              <img src={CloseIcon} alt="Close" />
            </button>
            <div className="requestContent">
              <Formik
                initialValues={{
                  letter_type: '',
                  letter: null,
                  company_name: '',
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
                  company_contact_name: '',
                  company_contact_email: '',
                  company_contact_phone: '',
                }}
                validationSchema={acceptanceLetterSchema} // Ensure this is correct
                onSubmit={handleAcceptanceRequest}  // Correctly pass the onSubmit function
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form encType="multipart/form-data">
                    <div className="companyAddressedTo warp_contents">
                      <div className="formInput">
                        <label htmlFor="company_name">Company's Name</label>
                        <Field type="text" name="company_name" placeholder="Enter the name of the company " />
                        <ErrorMessage className="error" name="company_name" component="div" />
                      </div>
                      <div className="formInput">
                        <label htmlFor="company_contact_name">Company's Contact Name</label>
                        <Field type="text" name="company_contact_name" placeholder="e.g Engr O.A Opadare" />
                        <ErrorMessage className="error" name="company_contact_name" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="company_contact_email">Company Email</label>
                        <Field type="text" name="company_contact_email" placeholder="Enter the company’s email" />
                        <ErrorMessage className="error" name="company_contact_email" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="company_contact_phone">Company Contact Phone</label>
                        <Field type="tel" name="company_contact_phone" placeholder="e.g 08066641912" />
                        <ErrorMessage className="error" name="company_contact_phone" component="div" />
                      </div>

                      <div className="formInput">
                        <label htmlFor="letter_type">Letter Type</label>
                        <Field as="select" name="letter_type">
                          <option value="">Select Letter Type</option>
                          <option value="UNDERTAKING  ">UNDERTAKING</option>
                          <option value="ACCEPTANCE">ACCEPTANCE LETTER</option>
                        </Field>
                        <ErrorMessage className="error" name="letter_type" component="div" />
                      </div>

                      <div className="formInput">
            <label htmlFor="letter">Letter</label>
            <input
              id="letter"
              name="letter"
              type="file"
              accept="pdf"
              onChange={(event) => {
                setFieldValue("letter", event.currentTarget.files[0]);
                // setFile(event.currentTarget.files[0]);
              }}
            />
            <ErrorMessage className="error" name="letter" component="div" />
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



                    <div className="companyDetails">
                      {/* <div className="formInput">
                  <label htmlFor="letter_type">
                  
              Type</label>
                  <Field as="select" name="letter_type">
                    <option value="">Select Letter Type</option>
                    <option value="UNDERTAKEN">UNDERTAKEN</option>
                    <option value="ACCEPTANCE_LETTER">ACCEPTANCE LETTER</option>
                  </Field>
                  <ErrorMessage className="error" name="letter_type" component="div" />
                </div> */}
                      {/* Add other fields here */}



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
        isOpen={showAcceptanceSuccessful}
        message={acceptanceSuccessMessage}
        onClose={() => setShowAcceptanceSuccessful(false)}
      />
      <FullScreenSuccessMessage
        isOpen={showPlacementSuccessful}
        message={placementSuccessMessage}
        onClose={() => setShowPlacementSuccessful(false)}
      />
      <FullScreenSuccessMessage
  isOpen={showChangeOfPlacementSuccessful}
  message={changeOfPlacementSuccessMessage}
  onClose={() => setShowChangeOfPlacementSuccessful(false)}
/>


      <main className="introLetter">
        <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"} />

        <div className="placement-head">
          Placement
        </div>
        <div className="navButtons">
          <div className={activeDisplay === "placement" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placement")}> Placement</div>
          <div className={activeDisplay === "placementRequest" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placementRequest")}> Placement Requests</div>
          <div className={activeDisplay === "placementAcceptance" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placementAcceptance")}> Acceptance Letter</div>
          <div className={activeDisplay === "placementChange" ? "shift_button active" : "shift_button"} onClick={() => handleButtonClick("placementChange")}> Request for Change of Placement</div>
        </div>

        {activeDisplay === "placementRequest" && <PlacementComponent showNewRequest={showNewRequest} toggleNewRequest={toggleNewRequest} />}
        {activeDisplay === "placement" && <ActivePlacement />}
        {activeDisplay === "placementAcceptance" && <PlacementAcceptance showNewAcceptanceRequest={showNewAcceptanceRequest} toggleNewAcceptanceRequest={toggleAcceptanceRequest} />}
        {activeDisplay === "placementChange" && <PlacementChange showPlacementReq={showNewRequest} togglePlacementChangeRequest={toggleNewPlacementReq} />}


      </main>
    </div>
  );
};



export default Placement;