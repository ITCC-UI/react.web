import "./registration_dash.scss"
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import { useState } from "react";
import DisplayedComponent from "../../../components/Confirmation Form/ConfamForm";
import DepartmentTrainingCourses from "../../../components/Table/Table";
const RegistrationDash = ({dashboardClass, placementClass, disableCover, disableReg, onClose, onButtonClick}) => {
   

    
  const [isDisplayed, setIsDisplayed] = useState(false);

  const handleDisplay = () => {
    setIsDisplayed(true);
  };

  const handleClose = () => {
    setIsDisplayed(false);
  };
    return ( 
        <div className="route-Dash">
               {isDisplayed && <DisplayedComponent onClose={handleClose}/>}
            <SideBar dashboardClass="dashy" placementClass="placement" disableCover="disable_props dash_navig"/>
            <main>
                <TopNav disableReg="registration disable" />

                {/* <div className="construction">
        
        <img src={Construction} alt="Construction" className="construction"/>
            </div> */}

            <DepartmentTrainingCourses checked={handleDisplay}/>
            </main>
       
        </div>
     );
}
 
export default RegistrationDash;