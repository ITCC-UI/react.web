// RegistrationDash.jsx
import "./registration_dash.scss";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import { useState, useEffect } from "react";
import DisplayedComponent from "../../../components/Confirmation Form/ConfamForm";
import DepartmentTrainingCourses from "../../../components/Table/Table";
import axiosInstance from "../../../API Instances/AxiosIntances";
import { Helmet } from "react-helmet";

const RegistrationDash = ({ dashboardClass, placementClass, disableCover, disableReg, onClose, onButtonClick, authToken }) => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [trainingCourses, setTrainingCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleRegister = (course) => {
     // Log the selected course data
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
        const response = await axiosInstance.get("trainings/department/trainings/registrations/",
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        );
        const courses = response.data;

        setTrainingCourses(courses);
      } catch (error) {
        
      }
    };

    fetchTrainingCourses();
  }, [authToken]);

  return (
    <div className="introductionLetter">
      <Helmet>
        <title> ITCC - Course Registration</title>
      </Helmet>
      {isDisplayed && <DisplayedComponent onClose={handleClose} selectedCourse={selectedCourse} />}
    
      <div className="route-Dash">
        <SideBar dashboardClass="dashy" placementClass={"placement"} disableCover="dash_navig" activeR={"activen"} init={0} 
        formClass={"forms"}/>


        <main className="introLetter">
          <TopNav disableReg="registration" setVisible={"show"} regVisible={"hide"} />
          <DepartmentTrainingCourses checked={handleDisplay} courses={trainingCourses} onRegister={handleRegister} />
        </main>
      </div>
    </div>
  );
};

export default RegistrationDash;
