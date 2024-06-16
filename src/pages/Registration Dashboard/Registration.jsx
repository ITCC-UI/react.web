import Construction from "/images/WEBSITE_UNDER_CONSTRUCTION.jpg"
import "./registration_dash.scss"
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import DepartmentTrainingCourses from "../../../components/Table/Table";
const RegistrationDash = () => {

    return ( 
        <div className="route-Dash">
            <SideBar />
            <main>
                <TopNav />

                {/* <div className="construction">
        
        <img src={Construction} alt="Construction" className="construction"/>
            </div> */}

            <DepartmentTrainingCourses />
            </main>
       
        </div>
     );
}
 
export default RegistrationDash;