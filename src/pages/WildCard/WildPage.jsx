import Construction from "/images/soon.png"
import "./construction.scss"
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
const ErrorPage = () => {
    return ( <div className="route-Dash">
        <SideBar dashboardClass="dashy" placementClass="placement"/>
        <main>
        <TopNav  disableReg="registration" setVisible="show" regVisible="hide"/>
        <img src={Construction} alt="under contruction" className="conimg" />
        </main>


   </div> );
}
 
export default ErrorPage;