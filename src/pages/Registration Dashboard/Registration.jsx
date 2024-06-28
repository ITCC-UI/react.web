import "./registration_dash.scss";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import { useState, useEffect } from "react";
import DisplayedComponent from "../../../components/Confirmation Form/ConfamForm";
import DepartmentTrainingCourses from "../../../components/Table/Table";
import axios from "axios";

const RegistrationDash = ({ dashboardClass, placementClass, disableCover, disableReg, onClose, onButtonClick, authToken }) => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [trainingCourses, setTrainingCourses] = useState([]);

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
        const response = await axios.get(
          "https://theegsd.pythonanywhere.com/api/v1/trainings/department/trainings/registrations/",
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        );
        const courses = response.data;

        // Process courses data if needed (e.g., set 'active' class based on status)
        const processedCourses = courses.map(course => ({
          ...course,
          activeClass: course.registration_status === "ACTIVE" ? "active" : "inactive"
        }));

        setTrainingCourses(processedCourses);
      } catch (error) {
        console.error("Error fetching training courses:", error);
      }
    };

    fetchTrainingCourses();
  }, [authToken]);

  return (
    <div className="route-Dash">
      {isDisplayed && <DisplayedComponent onClose={handleClose} />}
      <SideBar dashboardClass="dashy" placementClass="placement" disableCover="disable_props dash_navig" />
      <main>
        <TopNav disableReg="registration disable" />
        <DepartmentTrainingCourses checked={handleDisplay} courses={trainingCourses} />
      </main>
    </div>
  );
};

export default RegistrationDash;
