import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./logs.scss"
import attachment from "/images/fileAttachment.png"
import DailyLogsComponent from "./DailyLogsComponent";
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"


const DailyLogs = () => {
  const [weekLogs, setWeekLogs] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
  });
  const [currentWeek, setCurrentWeek] = useState(0);

  // Array to store multiple weeks of logs
  const [weeksOfLogs, setWeeksOfLogs] = useState([{
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
  }]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleLogSave = (day, logEntry) => {
    // Update the current week's logs
    const updatedWeeks = [...weeksOfLogs];
    updatedWeeks[currentWeek] = {
      ...updatedWeeks[currentWeek],
      [day]: [...(updatedWeeks[currentWeek][day] || []), logEntry]
    };
    setWeeksOfLogs(updatedWeeks);
  };

  const handleNextWeek = () => {
    // Add a new week if we're at the last week
    if (currentWeek === weeksOfLogs.length - 1) {
      setWeeksOfLogs([...weeksOfLogs, {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
      }]);
    }
    setCurrentWeek(prev => prev + 1);
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => Math.max(0, prev - 1));
  };

  function formatDateWithOrdinal(date) {
    // Your existing formatDateWithOrdinal implementation
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function getOrdinalDay(day) {
      if (day > 3 && day < 21) return day + 'th';
      switch (day % 10) {
        case 1: return day + 'st';
        case 2: return day + 'nd';
        case 3: return day + 'rd';
        default: return day + 'th';
      }
    }

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${getOrdinalDay(day)} ${month} ${year}`;
  }





  const validationSchema = Yup.object().shape({
    form: Yup.array().of(Yup.mixed().required("File is required")).required("File is required"),
  });


  const submitDailyLogs = () => {

  }
  return (
    <div className="introductionLetter">
      <Helmet><title>ITCC - Daily Logs</title></Helmet>
      <SideBar
        dashboardClass={"dashy"}
        placementClass={"placement"}
        init={1}
        activeL={"active-accordion"}
      />
      <main className="introLetter">
        <TopNav
          disableReg={"registration"}
          setVisible={"show"}
          regVisible={"hide"}
          active={"activeBar"}
        />
        <div className="header-main">
          <div className="placement-head">
            Daily and Weekly Logs
            <div className="week-navigation">
                            <button onClick={handlePreviousWeek} disabled={currentWeek === 0}>
                                Previous Week
                            </button>
                            <span>Week {currentWeek + 1}</span>
                            <button onClick={handleNextWeek}>
                                Next Week
                            </button>
                        </div>
            <div className="header-main">
              {/* <div className="placement-head">Daily and Weely Logs</div> */}








            </div>
          </div>

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

        <div className="logs-container">
          {daysOfWeek.map(day => (
            <DailyLogsComponent
              key={day}
              day={day}
              calendar={formatDateWithOrdinal(new Date())}
              onLogSave={handleLogSave}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DailyLogs;