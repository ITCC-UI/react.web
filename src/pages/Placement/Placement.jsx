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
                <h4 className="title">PLACEMENT</h4>
                <div>
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
                <div className="mainView">
                    <table>
                        <thead>
                            <tr>
                                <td><input placeholder="Search here"/></td>
                                <td>
                                    <div>Display</div>
                                    <div>
                                        <select>
                                            <option>Choose</option>
                                        </select>
                                    </div>
                                    <div>Row</div>
                                </td>
                                <td>Filter</td>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
                {/* <hr style={{display:"flex", borderColor: "yellow"}}/> */}
            </div>
            </main>           
        </div>
    )
}

export default Placement;