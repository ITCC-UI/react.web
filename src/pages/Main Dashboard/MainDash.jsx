import React from "react";
import { Link } from "react-router-dom";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./mainDash.scss"
import DasboardComponents from "./Training Timeline/TrainingTL";
import Content from "../../../components/Content/Content";

const MainDashboard = () => {
    return ( <div className="mainDash route-Dash">
    
    <SideBar dashboardClass={"active dashy"} placementClass={"placement"}/>
    <main>
    <TopNav disableReg={"registration disable"}/>

  <div className="dashboardComponent entireContainer">
  <div className="trainingLog">
    <div className="timelineNlog">
    <DasboardComponents header={"Training Timeline"} content={<Content/>}/>

    <DasboardComponents header={"Training Schedule"} schedule="thisSchedule" />
    </div>
   </div>
    <div className="rightSide">
    <DasboardComponents header={"Announcement"} />
    <DasboardComponents header={"Recent Activities"} />
    </div>
  </div>
    </main>
    </div> );
}
 
export default MainDashboard;