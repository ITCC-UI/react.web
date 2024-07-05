import "./sidebar.scss"
import Logo from "/images/UI_logo.png"
import Dashy from "/images/Vector.png"
import Document from "/images/document.png"
import Logout from "/images/Logout.png"
import AccordionS from "../Accordion/Accordion"
import { Link } from "react-router-dom"
const SideBar = ({disableCover, dashboardClass, placementClass, init}) => {


  return (
    <div className="dash_navigation width">
      <div className="sidebarContainer">

        <div className="sidebarBlue">
          <div className="sidebarOverlay"></div>
          <div className="sidebarOrange">
          </div>

          <div className="sideNavContainer">
            <div className="logo_placement">
              <div className="logo">
                <img src={Logo} alt="ITCC Logo" />
              </div>
            </div>
            <div className ={disableCover} >
           <Link to="/dashboard">
          
              <div className={dashboardClass} id="dashboard">
                <img src={Dashy} alt="Dashboard" />
               Dashboard
              </div>
              
              </Link>
            <Link to="/placement">
            <div className={placementClass}>
                <img src={Document} alt="docs" /> Placement
              </div></Link>

              {/* Accordion Goes here */}
<AccordionS initialOpenSection={init}/>


              {/* Accordion Ends here */}
            </div>

            <div className="logout_button">
              Logout <img src={Logout} alt="Logout" />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default SideBar;