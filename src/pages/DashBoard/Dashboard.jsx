import React, { useState,useEffect } from "react";
import "./dashboard.scss"
import TopNav from "../../../components/Header/Header";
import Empty from "/images/empty_dashboard.png"
import SideBar from "../../../components/Sidebar/Sidebar";
import MyForm from "../../../components/Form/FormData";

const Dashboard = () => {
const[isVisible, setIsVisible]= useState(false)

useEffect(() => {
    // On component mount, you can ensure visibility is set to hidden
    setIsVisible(false);
  }, []);
const toggleVisibility =()=>{
    setIsVisible((prev)=> !prev)
}


    return ( 
        <div className="route-Dash">
         
            <SideBar className="disable_props dash_navigation"/>
            <div className="overlay">

            </div>
<main>
   <TopNav toggleVisibility={toggleVisibility}/>

<img src={Empty} alt="Empty dashbaord" className="empty_dash"/>
 
</main>

<MyForm isVisible={isVisible}  onClose={toggleVisibility}/>
        </div>
     );
}
 
export default Dashboard;