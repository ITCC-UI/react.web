import React from "react";
import TopNav from "../../../components/Header/Header";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./placement.scss"
import Empty from "/images/empty_dashboard.png"
import { Helmet } from "react-helmet";
const Placement = () => {
    return ( 
<div className="placementDashboard">
    <Helmet>
        <title>
            ITCC - Placements
        </title>
    </Helmet>
<SideBar dashboardClass={" dashy"} placementClass={"placement active-accordion filterPlacement"} init={0}/>  {/*State management for the accordion where 0= first accordion */}
<main>
    <TopNav disableReg={"registration"} setVisible={"show"} regVisible={"hide"}/>

    <img src={Empty} alt="Empty" />
</main>
</div>

    );
}
 
export default Placement;