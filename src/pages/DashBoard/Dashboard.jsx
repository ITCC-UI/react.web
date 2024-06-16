import React from "react";
import "./dashboard.scss"
import TopNav from "../../../components/Header/Header";
import Empty from "/images/empty_dashboard.png"
import SideBar from "../../../components/Sidebar/Sidebar";

const Dashboard = () => {
    return ( 
        <div className="route-Dash">
         
            <SideBar />
            <div className="overlay">

            </div>
<main>
   <TopNav/>

<img src={Empty} alt="Empty dashbaord" className="empty_dash"/>
    
</main>
        </div>
     );
}
 
export default Dashboard;