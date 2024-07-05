import React, { useState, useEffect } from "react";
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./placement.scss";
import Empty from "/images/empty_dashboard.png";
import CloseIcon from "/images/closeButton.png"; // Make sure you have an appropriate close icon
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const IntroductionLetter = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [programmeId, setProgrammeId] = useState(null);

  const toggleNewRequest = () => {
    setShowNewRequest(!showNewRequest);
  };

  useEffect(() => {
    // Fetch the programme ID
    const fetchProgrammeId = async () => {
      try {
        const response = await axios.get(
          "https://theegsd.pythonanywhere.com/api/v1/student/programmes/"
        );
        const programmeId = response.data[0]?.id; // Assuming you need the first programme ID
        setProgrammeId(programmeId);
      } catch (error) {
        console.error("Error fetching programme ID", error);
      }
    };

    fetchProgrammeId();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!programmeId) {
      console.error("Programme ID not available");
      return;
    }

    const endpoint = `/api/v1/trainings/registrations/${programmeId}/introduction-letter-requests/`;

    try {
      const response = await axios.post(endpoint, values);
      console.log("Form submitted successfully", response);
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setSubmitting(false);
      toggleNewRequest(); // Close the form after submission
    }
  };

  const validationSchema = Yup.object().shape({
    reason: Yup.string().required("Reason is required"),
    date: Yup.date().required("Date is required"),
  });

  return (
    <div className="introductionLetter">
      <SideBar
        dashboardClass={"dashy"}
        placementClass={"active-accordion placement filterPlacement"}
        init={0}
        activer={"activen"}
      />
      {showNewRequest && (
        <div className="newRequestComponent">
          <div className="newRequestHeader">
            <div className="introductionLetter">Request for Introduction Letter</div>
            <button className="closeButton" onClick={toggleNewRequest}>
              <img src={CloseIcon} alt="Close" />
            </button>
          </div>
          <div className="requestContent">
            <Formik
              initialValues={{ reason: "", date: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div>
                    <label htmlFor="reason">Reason</label>
                    <Field type="text" name="reason" />
                    <ErrorMessage name="reason" component="div" />
                  </div>
                  <div>
                    <label htmlFor="date">Date</label>
                    <Field type="date" name="date" />
                    <ErrorMessage name="date" component="div" />
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      <main>
        <TopNav disableReg={"registration disable"} />
        <div className="container">
          <div className="topHead">
            <div className="heading">INTRODUCTION LETTERS</div>
            <button className="newReq" onClick={toggleNewRequest}>
              + New Request
            </button>
          </div>
          <div className="image">
            <img src={Empty} alt="" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntroductionLetter;
