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

const IntroductionLetter = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [programmeId, setProgrammeId] = useState(null);
  const [letterRequests, setLetterRequests] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  const toggleNewRequest = () => {
    setShowNewRequest(!showNewRequest);
  };

  const fetchProgrammeId = async () => {
    try {
      const response = await axiosInstance.get("trainings/registrations/");
      const id = response.data[0].id;
      setProgrammeId(id);
      console.log("Programme ID:", id);
      fetchIntroductionLetterRequests(id);
    } catch (error) {
      console.error("Error fetching programme ID:", error);
      setIsLoading(false);
    }
  };

  const fetchIntroductionLetterRequests = async (id) => {
    try {
      console.log("Fetching introduction letters for programme ID:", id);
      const response = await axiosInstance.get(`/trainings/registrations/${id}/introduction-letter-requests/`);
      setLetterRequests(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching introduction letter requests:", error);
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
      console.log(`Submitting form for programme ID: ${programmeId}`);
      const response = await axiosInstance.post(`/trainings/registrations/${programmeId}/introduction-letter-requests/`, values);
      console.log("Form submitted successfully", response);
      fetchIntroductionLetterRequests(programmeId);
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setSubmitting(false);
      toggleNewRequest();
    }
  };

  const validationSchema = Yup.object().shape({
    company_address: Yup.object().shape({
      building_number: Yup.string().required("Building number is required"),
      street: Yup.string().required("Street is required"),
      area: Yup.string().required("Area is required"),
      city: Yup.string().required("City is required"),
      state_or_province: Yup.string().required("State or province is required"),
    }),
    company_name: Yup.string().required("Company name is required"),
    address_to: Yup.string().required("Address to is required"),
  });

  // if (isLoading) {
  //   return <GridLoader size={15} color={"#123abc"} />;
  // }

  return (
    <div className="introductionLetter">
      <Helmet>
        <title>ITCC - Introduction Letter</title>
      </Helmet>
      <SideBar
        dashboardClass={"dashy"}
        placementClass={"active-accordion placement filterPlacement"}
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
            <div className="heading">INTRODUCTION LETTERS</div>
            <button className="newReq" onClick={toggleNewRequest}>
              + New Request
            </button>
          </div>
        </div>
        {letterRequests.length === 0 ? (
          <div className="image">
            <img src={Empty} alt="Empty" />
          </div>
        ) : (
          <IntroductionLetterTable letterRequests={letterRequests} />
        )}
      </main>
    </div>
  );
};

export default IntroductionLetter;
