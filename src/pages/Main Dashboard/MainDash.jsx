import React from "react";
import { Link } from "react-router-dom";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./mainDash.scss"
import DasboardComponents from "./Training Timeline/TrainingTL";
import Content from "../../../components/Content/Content";
import TVariant from "../../../components/TimelineShow/TimeVariationComp";
import Announcement from "../../../components/Announcement/Announcement";
import { Helmet } from "react-helmet";

const MainDashboard = () => {
    return ( <div className="mainDash route-Dash">
    <Helmet>
      <title>
        ITCC - Dashboard
      </title>
    </Helmet>
    <SideBar dashboardClass={"active-accordion dashy"} placementClass={"placement"} init={0}/>  {/*State management for the accordion where 0= first accordion */}
    <main>
    <TopNav disableReg="registration" setVisible="show" regVisible="show"/>

  <div className="dashboardComponent entireContainer">
  <div className="trainingLog">
    <div className="timelineNlog">
    <DasboardComponents header={"Training Timeline"} content={<Content/>}/>

    <DasboardComponents header={"Training Schedule"} schedule="thisSchedule" content={<TVariant/>} />
    </div>
   </div>
    <div className="rightSide">
    <DasboardComponents header={"Announcement"} schedule="announcement" content={<Announcement/>}/>
    <DasboardComponents header={"Recent Activities"} schedule="activities" content={<Announcement/>}/>
    </div>
  </div>
    </main>
    </div> );
}
 
export default MainDashboard;





// aeorck@gmail.com
// Godwin1245