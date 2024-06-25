import "./dummysidebar.scss"
import Logo from "/images/UI_logo.png"
const DummySideBar = ({disableCover, dashboardClass, placementClass}) => {


  return (
    <div className="dash_navigation width dummy">
      <div className="sidebarContainer dummyContainer">

        <div className="sidebarBlue dummyBlue">
          <div className="sidebarOverlay"></div>
          <div className="sidebarOrange">
          </div>

          <div className="sideNavContainer dummySideBar">
            <div className="logo_placement">
              <div className="logo">
                <img src={Logo} alt="ITCC Logo" />
              </div>
            </div>

          </div>


        </div>
      </div>
    </div>
  );
}

export default DummySideBar;