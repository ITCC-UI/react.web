import React from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import TopNav from "../../../components/Header/Header";
import "./placement.scss"

const Placement = () => {
    return(
        <div className="placement route-Dash">
            <SideBar dashboardClass={"active dashy"} placementClass={"placement"}/>
            <main>
            <TopNav disableReg={"registration disable"}/>

            <div className="placementComponent entireContainer">
                <div className="title">
                    <h4 >PLACEMENT</h4>
                </div>
                <div className="placementHeaderList">
                    <p>Placement List</p>
                    <p>Placement Request</p>
                    <p>Acceptance Letter</p>
                    <p>Request for Change of Placement</p>
                </div>
                <div className="submit-btn">
                    <button>
                    + New submission
                    </button>
                </div>
                <hr style={{margin: "10px 10px", borderColor: "#aaa"}}/>
                <div className="searchbar">
                    <input type="search" placeholder="Search here"/>
                        <div className="choose">
                            <div>Display</div>
                            <div className="select">
                                <select>
                                    <option selected>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                            </div>
                            <div>Row</div>
                        </div>
                    <div>Filter</div>
                </div>
            </div>
            </main>           
        </div>
    )
}

export default Placement;