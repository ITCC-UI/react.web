import "./sidebar.scss";
import Logo from "/images/UI_logo.png";
import Dashy from "/images/Vector.png";
import Document from "/images/document.png";
import Logout from "/images/Logout.png";
import AccordionS from "../Accordion/Accordion";
import { Link, useNavigate } from "react-router-dom";
import Form from "/images/form.svg"
import Cookies from "js-cookie";

const SideBar = ({ disableCover, dashboardClass, placementClass, init, activeI, activeR, formClass }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token'); 
    navigate('/login'); 
  };

  return (
    <div className="dash_navigation width">
      <div className="sidebarContainer">
        <div className="sidebarBlue">
          <div className="sidebarOverlay"></div>
          <div className="sidebarOrange"></div>
          <div className="sideNavContainer">
            <div className="logo_placement">
              <div className="logo">
                <img src={Logo} alt="ITCC Logo" />
              </div>
            </div>
            <div className={disableCover}>
              <Link to="/dashboard" className="null">
                <div className={dashboardClass} id="dashboard">
                  <img src={Dashy} alt="Dashboard" />
                  Dashboard
                </div>
              </Link>
              <Link to="/placement">
                <div className={placementClass}>
                                    <img src={Document} alt="docs" />
                  Placement
                </div>
              </Link>

              {/* <Link to="/form-and-manuals">  */}
              <Link to="#" className="null"> 
              {/* <div className={formClass}> */}
              <div className="forms">
                
                <img src={Form} alt="Forms and Manuals" />
                Forms and Manual
                
                </div></Link>
              
              {/* Accordion Goes here */}
              <AccordionS initialOpenSection={init} activeIntro={activeI} activeReg={activeR} activeDailyLog={activeR}/>
              {/* Accordion Ends here */}
            </div>
            <div className="logout_button" onClick={handleLogout}>
              Logout <img src={Logout} alt="Logout" tooltip="Logout"/>
              <div className="tip">
                Logout of this account
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
