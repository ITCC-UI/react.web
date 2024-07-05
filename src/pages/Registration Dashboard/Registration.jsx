// RegistrationDash.jsx
import "./registration_dash.scss";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import { useState, useEffect } from "react";
import DisplayedComponent from "../../../components/Confirmation Form/ConfamForm";
import DepartmentTrainingCourses from "../../../components/Table/Table";
import axiosInstance from "../../../API Instances/AxiosIntances";

const RegistrationDash = ({ dashboardClass, placementClass, disableCover, disableReg, onClose, onButtonClick, authToken }) => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [trainingCourses, setTrainingCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleRegister = (course) => {
    console.log('Selected Course:', course); // Log the selected course data
    setSelectedCourse(course);
    handleDisplay();
  }

  const handleDisplay = () => {
    setIsDisplayed(true);
  };

  const handleClose = () => {
    setIsDisplayed(false);
  };

  useEffect(() => {
    // Fetch training courses from the API
    const fetchTrainingCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get(
          "trainings/department/trainings/registrations/",
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        );
        const courses = response.data;

        // Process courses data if needed (e.g., set 'active' class based on status)
        // const processedCourses = courses.map(course => ({
        //   ...course,
        //   activeClass: course.registration_status === "ACTIVE" ? "active" : "inactive"
        // }));

        setTrainingCourses(courses);
      } catch (error) {
        console.error("Error fetching training courses:", error);
      }
    };

    fetchTrainingCourses();
  }, [authToken]);

  return (
    <div className="route-Dash">
      {isDisplayed && <DisplayedComponent onClose={handleClose} selectedCourse={selectedCourse}/>}
      <SideBar dashboardClass="dashy" placementClass="placement" disableCover="dash_navig" />
      <main>
        <TopNav disableReg="registration disable" />
        <DepartmentTrainingCourses checked={handleDisplay} courses={trainingCourses} onRegister={handleRegister} />
      </main>
    </div>
  );
};

export default RegistrationDash;
